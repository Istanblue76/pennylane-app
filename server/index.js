import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_PATH = path.join(__dirname, '../src/utils/mockData.json');

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// ─── Serve static assets ───────────────────────────────────────────────────────
app.use('/assets', express.static(path.join(__dirname, '../public/assets')));
// Serve the menu-pdf tool
app.use('/menu-pdf', express.static(path.join(__dirname, '../public/menu-pdf')));

// ─── Local upload directory (fallback when Cloudinary not configured) ──────────
const uploadDir = path.join(__dirname, '../public/assets/img');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ─── Cloudinary Setup ──────────────────────────────────────────────────────────
const useCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('✅ Cloudinary yapılandırıldı.');
} else {
  console.log('ℹ️  Cloudinary env değişkenleri bulunamadı — yerel depolama kullanılacak.');
}

// ─── Multer: memory for Cloudinary, disk for local ───────────────────────────
const storage = useCloudinary
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => cb(null, uploadDir),
      filename:    (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-')),
    });
const upload = multer({ storage });

// ─── MongoDB Setup ────────────────────────────────────────────────────────────
let cmsCollection = null;
const MONGODB_URI = process.env.MONGODB_URI;

async function initMongoDB() {
  if (!MONGODB_URI) {
    console.log('ℹ️  MONGODB_URI bulunamadı — JSON dosyası kullanılacak.');
    return;
  }
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db('pennylane');
    cmsCollection = db.collection('cms');

    // Seed MongoDB with mockData.json if empty
    const count = await cmsCollection.countDocuments();
    if (count === 0 && fs.existsSync(DATA_PATH)) {
      const seedData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
      await cmsCollection.insertOne({ _id: 'main', ...seedData });
      console.log('✅ MongoDB başlangıç verisi mockData.json\'dan yüklendi.');
    }
    console.log('✅ MongoDB bağlantısı başarılı.');
  } catch (err) {
    console.error('❌ MongoDB bağlantı hatası:', err.message);
    cmsCollection = null;
  }
}

// ─── Helper: read CMS data ────────────────────────────────────────────────────
async function readCMSData() {
  if (cmsCollection) {
    const doc = await cmsCollection.findOne({ _id: 'main' });
    if (doc) {
      const { _id, ...data } = doc;
      return data;
    }
  }
  // Fallback: JSON file
  if (!fs.existsSync(DATA_PATH)) return {};
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
}

// ─── Helper: write CMS data ───────────────────────────────────────────────────
async function writeCMSData(newData) {
  if (cmsCollection) {
    const { _id, ...safeData } = newData;
    await cmsCollection.replaceOne({ _id: 'main' }, { _id: 'main', ...safeData }, { upsert: true });
    return;
  }
  // Fallback: JSON file
  fs.writeFileSync(DATA_PATH, JSON.stringify(newData, null, 2), 'utf8');
}

// ─── API ROUTES ───────────────────────────────────────────────────────────────

// GET CMS data
app.get('/api/cms/home', async (req, res) => {
  try {
    const data = await readCMSData();
    res.json({ status: 'success', data });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Veri okunamadı', detail: err.message });
  }
});

// UPDATE CMS data
app.post('/api/cms/update', async (req, res) => {
  try {
    await writeCMSData(req.body);
    res.json({ status: 'success', message: 'İçerik güncellendi' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Veri kaydedilemedi', detail: err.message });
  }
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'antigravity123';
  if (username === adminUser && password === adminPass) {
    res.json({ status: 'success', token: 'pennylane-auth-token' });
  } else {
    res.status(401).json({ status: 'error', message: 'Hatalı kullanıcı adı veya şifre' });
  }
});

// Upload Image
app.post('/api/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: 'error', message: 'Dosya yüklenemedi' });
  }

  if (useCloudinary) {
    try {
      // Upload buffer to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'pennylane', resource_type: 'image', use_filename: true, unique_filename: true },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(req.file.buffer);
      });
      return res.json({ status: 'success', url: result.secure_url });
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      return res.status(500).json({ status: 'error', message: 'Cloudinary yükleme hatası', detail: err.message });
    }
  }

  // Local fallback
  const imageUrl = `/assets/img/${req.file.filename}`;
  res.json({ status: 'success', url: imageUrl });
});

// ─── Production: Serve built React app ───────────────────────────────────────
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/assets') && !req.path.startsWith('/menu-pdf')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

// ─── Start ────────────────────────────────────────────────────────────────────
initMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Pennylane server port ${PORT}'de çalışıyor.`);
    console.log(`   Depolama: ${useCloudinary ? 'Cloudinary ☁️' : 'Yerel disk 💾'}`);
    console.log(`   Veritabanı: ${cmsCollection ? 'MongoDB Atlas 🍃' : 'JSON dosyası 📄'}`);
  });
});
