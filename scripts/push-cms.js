import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Production Supabase Credentials (vfqwjxwmguojbavcgaqx)
const supabaseUrl = "https://vfqwjxwmguojbavcgaqx.supabase.co";
const supabaseKey = "sb_publishable_4bmIXcMuXcG5HEZsVS2FFw_b4TGGYde";

const supabase = createClient(supabaseUrl, supabaseKey);
const DATA_PATH = path.join(__dirname, '../src/utils/mockData.json');

async function push() {
  console.log('🔄 Yerel mockData.json verileri canlı Supabase veritabanına yükleniyor...');
  
  if (!fs.existsSync(DATA_PATH)) {
    console.error('❌ Yerel mockData.json dosyası bulunamadı!');
    process.exit(1);
  }

  const localData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

  const { data, error } = await supabase
    .from('pennylane_cms')
    .upsert({ id: 'main', content: localData })
    .select();

  if (error) {
    console.error('❌ Veriler canlıya yüklenemedi:', error.message);
    process.exit(1);
  }

  console.log('✅ Yerel veriler, görseller ve ayarlar başarıyla canlı Supabase veritabanına (pennylane_cms) yüklendi!');
}

push().catch(console.error);
