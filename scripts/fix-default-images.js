import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, '../src/utils/mockData.json');

if (!fs.existsSync(DATA_PATH)) {
  console.error('❌ mockData.json bulunamadı!');
  process.exit(1);
}

let content = fs.readFileSync(DATA_PATH, 'utf8');

// 1776219428839-pennylane-default.png içeren tüm yolları ortak /assets/img/pennylane-default.png ile değiştirir
const regex = /"[^"]*1776219428839-pennylane-default\.png"/g;
const matchCount = (content.match(regex) || []).length;

if (matchCount === 0) {
  console.log('ℹ️ Güncellenecek eski varsayılan görsel yolu bulunamadı.');
} else {
  content = content.replace(regex, '"/assets/img/pennylane-default.png"');
  fs.writeFileSync(DATA_PATH, content, 'utf8');
  console.log(`✅ ${matchCount} adet varsayılan görsel yolu başarıyla '/assets/img/pennylane-default.png' olarak güncellendi.`);
}
