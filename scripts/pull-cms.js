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

async function pull() {
  console.log('🔄 Canlı Supabase veritabanından içerikler (ve görseller) çekiliyor...');
  
  const { data, error } = await supabase
    .from('pennylane_cms')
    .select('content')
    .eq('id', 'main')
    .single();

  if (error) {
    console.error('❌ Veriler çekilemedi:', error.message);
    process.exit(1);
  }

  if (data && data.content) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data.content, null, 2), 'utf8');
    console.log('✅ Canlıdaki tüm ürünler, görsel linkleri ve ayarlar başarıyla yerele (mockData.json) aktarıldı!');
  } else {
    console.error('❌ Canlı veritabanında "main" kaydı bulunamadı.');
  }
}

pull().catch(console.error);
