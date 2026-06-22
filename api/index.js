import express from 'express';
import { Resend } from 'resend';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

const DATA_PATH = path.resolve(__dirname, '../src/utils/mockData.json');

// Supabase
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = (process.env.SUPABASE_URL && supabaseKey) 
  ? createClient(process.env.SUPABASE_URL, supabaseKey) 
  : null;

async function readCMSData() {
  if (supabase) {
    const { data } = await supabase.from('pennylane_cms').select('content').eq('id', 'main').single();
    if (data && data.content) return data.content;
  }
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  } catch (e) {
    return {};
  }
}

async function writeCMSData(newData) {
  if (supabase) {
    await supabase.from('pennylane_cms').upsert({ id: 'main', content: newData });
  }
  // Local sync to keep mockData updated if possible
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(newData, null, 2));
  } catch (e) {}
}

app.get('/api/cms', async (req, res) => {
  const data = await readCMSData();
  res.json(data);
});

app.post('/api/newsletter/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).send('Email missing');
  
  if (supabase) {
    await supabase.from('pennylane_newsletter').upsert({ email });
  }
  
  const data = await readCMSData();
  if (!data.newsletter_subscriptions) data.newsletter_subscriptions = [];
  if (!data.newsletter_subscriptions.includes(email)) {
    data.newsletter_subscriptions.push(email);
    await writeCMSData(data);
  }
  res.json({ status: 'success' });
});

app.get('/api/newsletter/subscribers', async (req, res) => {
  const data = await readCMSData();
  let subs = data.newsletter_subscriptions || [];
  if (supabase) {
    const { data: db } = await supabase.from('pennylane_newsletter').select('email');
    if (db) subs = [...new Set([...subs, ...db.map(s => s.email)])];
  }
  res.json({ status: 'success', data: subs });
});

app.post('/api/newsletter/send-bulk', async (req, res) => {
  try {
    const { subject, content, image } = req.body;

    if (!subject || !content) {
      return res.status(400).json({ status: 'error', message: 'Başlık ve içerik gerekli' });
    }

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ status: 'error', message: 'RESEND_API_KEY eksik' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Aboneleri topla
    const data = await readCMSData();
    let subs = data.newsletter_subscriptions || [];
    if (supabase) {
      const { data: db } = await supabase.from('pennylane_newsletter').select('email');
      if (db) subs = [...new Set([...subs, ...db.map(s => s.email)])];
    }

    if (subs.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Hiç abone yok' });
    }

    const html = `
      <div style="background:#000;color:#fff;padding:40px;text-align:center;font-family:serif;">
        <div style="max-width:600px;margin:auto;border:1px solid #c5a059;border-radius:20px;padding:20px;">
          <img src="https://pennylane-hazel.vercel.app/assets/img/pennylane_logo_white.png" height="30" />
          ${image ? `<img src="${image}" style="width:100%;margin-top:20px;border-radius:10px;" />` : ''}
          <h1 style="color:#c5a059;margin-top:30px;">${subject}</h1>
          <p style="color:#ccc;line-height:1.6;">${content}</p>
        </div>
      </div>
    `;

    // Resend free tier: Her alıcıya ayrı ayrı gönder
    const results = [];
    for (const email of subs) {
      try {
        console.log(`Sending email to: ${email}`);
        const result = await resend.emails.send({
          from: 'Pennylane <onboarding@resend.dev>',
          to: [email],
          subject,
          html
        });
        console.log(`Result for ${email}:`, JSON.stringify(result));
        results.push({ email, id: result?.data?.id, error: result?.error });
      } catch (sendErr) {
        console.error(`Failed to send to ${email}:`, sendErr.message);
        results.push({ email, error: { message: sendErr.message } });
      }
    }

    const failed = results.filter(r => r.error);
    if (failed.length > 0) {
      return res.json({ 
        status: 'partial', 
        message: `${subs.length - failed.length}/${subs.length} mail gönderildi`,
        errors: failed
      });
    }

    res.json({ status: 'success', message: `${subs.length} mail başarıyla gönderildi` });

  } catch (err) {
    console.error('send-bulk error:', err);
    res.status(500).json({ status: 'error', message: err.message });
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

// Helper to normalize product names for cross-menu mapping
function normalizeName(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '');
}

// Akıllı ürün fiyat eşleştirme ve güncelleme API'si
app.post('/api/cms/update-prices', async (req, res) => {
  try {
    const newPrices = req.body; // Array of { UrunAdi: "...", Fiyat: 300, Birim: "..." }
    if (!Array.isArray(newPrices)) {
      return res.status(400).json({ status: 'error', message: 'Geçersiz veri formatı. Array bekleniyor.' });
    }

    const cmsData = await readCMSData();
    if (!cmsData || !cmsData.menu || !cmsData.menu.categories) {
      return res.status(500).json({ status: 'error', message: 'CMS menü verisi bulunamadı.' });
    }

    // Fiyatları haritala
    const priceMap = new Map();
    newPrices.forEach(item => {
      const norm = normalizeName(item.UrunAdi);
      if (norm) {
        priceMap.set(norm, item.Fiyat);
      }
    });

    let updatedCount = 0;
    
    // Özel eşleştirmeler
    const customMappings = {
      'briocheekmekuzeriavokadoluposeyumurta': 'briocheekmekavokadolu',
      'tazebaharatlipeynirliomlet': 'peynirliomlet',
      'eksimeyaekmekuzeripastramiposeyumurta': 'pastramiposeyumurta'
    };

    cmsData.menu.categories.forEach(cat => {
      cat.items.forEach(item => {
        const dName = item.name?.tr || item.name;
        const normDigital = normalizeName(dName);
        let matchedPrice = null;

        if (priceMap.has(normDigital)) {
          matchedPrice = priceMap.get(normDigital);
        } else if (customMappings[normDigital] && priceMap.has(customMappings[normDigital])) {
          matchedPrice = priceMap.get(customMappings[normDigital]);
        } else {
          for (const [key, val] of priceMap.entries()) {
            if (key.length > 3 && (normDigital.includes(key) || key.includes(normDigital))) {
              matchedPrice = val;
              break;
            }
          }
        }

        if (matchedPrice !== null && matchedPrice !== undefined) {
          item.price = matchedPrice.toString();
          updatedCount++;
        }
      });
    });

    await writeCMSData(cmsData);
    res.json({ 
      status: 'success', 
      message: `${updatedCount} ürünün fiyatı veritabanında güncellendi.`, 
      updatedCount 
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Fiyatlar güncellenemedi', detail: err.message });
  }
});

// Temporary migration endpoint to sync local mockData paths to live Supabase
app.get('/api/admin/migrate-db', async (req, res) => {
  if (!supabase) {
    return res.status(400).json({ status: 'error', message: 'Supabase client is not initialized.' });
  }
  try {
    const localData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    const { data: dbData, error } = await supabase
      .from('pennylane_cms')
      .upsert({ id: 'main', content: localData })
      .select();

    if (error) throw error;
    res.json({ status: 'success', message: 'Database successfully migrated to new folder paths!', dbData });
  } catch (err) {
    console.error('Migration endpoint error:', err);
    res.status(500).json({ status: 'error', message: err.message });
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

// Supabase Credentials (for direct browser uploads)
app.get('/api/supabase-credentials', (req, res) => {
  res.json({
    status: 'success',
    url: process.env.SUPABASE_URL || null,
    anonKey: process.env.SUPABASE_ANON_KEY || null
  });
});

// Upload Image
const useCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: 'error', message: 'Dosya yüklenemedi' });
  }

  // Get category/section folder from body (clean slug format)
  let categoryFolder = req.body.category ? req.body.category.toLowerCase().replace(/[^a-z0-9-]+/g, '-') : '';

  // If a category/section is sent, and it is NOT a general section, prefix it with 'menu/' to isolate menu assets
  if (categoryFolder) {
    const generalSections = ['hero', 'about', 'gallery', 'events', 'team', 'seo', 'menu_showcase'];
    if (!generalSections.includes(categoryFolder)) {
      categoryFolder = `menu/${categoryFolder}`;
    }
  }

  if (useCloudinary) {
    try {
      const folderName = categoryFolder ? `pennylane/${categoryFolder}` : 'pennylane';
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: folderName, resource_type: 'auto', use_filename: true, unique_filename: true },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(req.file.buffer);
      });
      return res.json({ status: 'success', url: result.secure_url });
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      return res.status(500).json({ status: 'error', message: 'Cloudinary yükleme hatası', detail: err.message });
    }
  } else if (supabase) {
    try {
      const categoryPath = categoryFolder ? `${categoryFolder}/` : '';
      const fileName = categoryPath + Date.now() + '-' + req.file.originalname.replace(/\s+/g, '-');
      
      // Ensure bucket exists (ignores error if already exists)
      await supabase.storage.createBucket('pennylane', { public: true }).catch(() => {});
      
      const { data, error } = await supabase.storage
        .from('pennylane')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage.from('pennylane').getPublicUrl(fileName);
      return res.json({ status: 'success', url: publicUrlData.publicUrl });
    } catch (err) {
      console.error('Supabase upload error:', err);
      return res.status(500).json({ status: 'error', message: 'Supabase yükleme hatası', detail: err.message });
    }
  }

  // Local fallback (will fail on Vercel but works locally)
  try {
    const uploadDir = categoryFolder 
      ? path.join(process.cwd(), 'public/assets/img', categoryFolder)
      : path.join(process.cwd(), 'public/assets/img');
      
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    
    const fileName = Date.now() + '-' + req.file.originalname.replace(/\s+/g, '-');
    const localPath = path.join(uploadDir, fileName);
    fs.writeFileSync(localPath, req.file.buffer);
    
    const publicUrl = categoryFolder
      ? `/assets/img/${categoryFolder}/${fileName}`
      : `/assets/img/${fileName}`;
      
    res.json({ status: 'success', url: publicUrl });
  } catch (err) {
    console.error('Local fallback write error:', err);
    res.status(500).json({ status: 'error', message: 'Sunucuya dosya yazılamadı (Salt-okunur sistem). Lütfen Supabase/Cloudinary kullanın.' });
  }
});

export default app;
