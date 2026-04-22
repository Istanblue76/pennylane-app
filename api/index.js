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

const DATA_PATH = path.join(process.cwd(), 'src/utils/mockData.json');

// Supabase
const supabase = (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) 
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY) 
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
  const { subject, content, image } = req.body;
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  const data = await readCMSData();
  let subs = data.newsletter_subscriptions || [];
  if (supabase) {
    const { data: db } = await supabase.from('pennylane_newsletter').select('email');
    if (db) subs = [...new Set([...subs, ...db.map(s => s.email)])];
  }

  const html = `
    <div style="background:#000;color:#fff;padding:40px;text-align:center;font-family:serif;">
      <div style="max-width:600px;margin:auto;border:1px solid #c5a059;border-radius:20px;padding:20px;">
        <img src="https://pennylane-hazel.vercel.app/assets/img/pennylane_logo_white.png" height="30" style="filter:invert(1)" />
        ${image ? `<img src="${image}" style="width:100%;margin-top:20px;border-radius:10px;" />` : ''}
        <h1 style="color:#c5a059;margin-top:30px;">${subject}</h1>
        <p style="color:#ccc;line-height:1.6;">${content}</p>
      </div>
    </div>
  `;

  await resend.emails.send({
    from: 'Pennylane <onboarding@resend.dev>',
    to: subs,
    subject,
    html
  });

  res.json({ status: 'success' });
});

export default app;
