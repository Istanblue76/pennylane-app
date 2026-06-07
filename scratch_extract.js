import fs from 'fs';
import path from 'path';

const data = JSON.parse(fs.readFileSync('./src/utils/mockData.json', 'utf8'));
const categories = data.menu.categories;

console.log("TOTAL CATEGORIES:", categories.length);
categories.forEach(cat => {
  console.log(`\nCategory: ${cat.title.tr} (${cat.title.en})`);
  console.log("Subcategories:", cat.subcategories ? cat.subcategories.map(s => s.title.tr) : "none");
  console.log("Items count:", cat.items.length);
  // print first 3 items
  cat.items.slice(0, 3).forEach(item => {
    console.log(` - ${item.name.tr} / ${item.price} TL - ${item.description?.tr || ''}`);
  });
});
