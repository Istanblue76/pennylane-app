import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

try {
  const filePath = "C:\\Antigravity\\Web Denemeler\\Pennylane\\pennylane-urunler.xlsx";
  console.log("File exists check:", fs.existsSync(filePath));
  
  const workbook = XLSX.readFile(filePath);
  const sheetNames = workbook.SheetNames;
  console.log("Sheet Names in workbook:", sheetNames);
  
  const sheet = workbook.Sheets[sheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
  console.log(`Total rows read from ${sheetNames[0]}: ${rows.length}`);

  const categories = {};
  let totalItems = 0;
  let minPrice = Infinity;
  let maxPrice = -Infinity;
  const noPrice = [];
  const noDescription = [];

  rows.forEach((row, idx) => {
    // Let's inspect the keys of the first row to know what column headers look like
    if (idx === 0) {
      console.log("Column Headers (First row keys):", Object.keys(row));
    }

    // Try to map fields flexibly in case keys are slightly different
    const cat = row["KATEGORİ"] || row["Kategori"] || row["CATEGORY"] || "Belirtilmemiş";
    const name = row["URUN ADI"] || row["Ürün Adı"] || row["Urun Adi"] || row["NAME"] || row["Name"];
    const desc = row["AÇIKLAMA"] || row["Açıklama"] || row["DESCRIPTION"] || row["Description"];
    const priceStr = row["FİYAT"] || row["Fiyat"] || row["PRICE"] || row["Price"] || "0";
    
    if (!name) return; // skip empty rows

    totalItems++;
    if (!categories[cat]) {
      categories[cat] = [];
    }
    
    // Parse price
    let price = parseFloat(priceStr.toString().replace(/\s*(?:TL|TRY|t)\s*/gi, '').replace(',', '.').trim());

    categories[cat].push({ name, desc, price });

    if (isNaN(price)) {
      noPrice.push(name);
    } else {
      if (price < minPrice) minPrice = price;
      if (price > maxPrice) maxPrice = price;
    }

    if (!desc) {
      noDescription.push(name);
    }
  });

  console.log("\n=== EXCEL ANALYSIS SUMMARY ===");
  console.log(`Total Products: ${totalItems}`);
  console.log(`Number of Categories: ${Object.keys(categories).length}`);
  if (totalItems > 0) {
    console.log(`Price Range: ${minPrice} TL - ${maxPrice} TL`);
  }
  
  console.log("\nCategories and Product Counts:");
  Object.keys(categories).forEach(cat => {
    console.log(`- ${cat} (${categories[cat].length} products)`);
    // Print first 3 products
    categories[cat].slice(0, 3).forEach(item => {
      console.log(`  * "${item.name}" - ₺${item.price} | Desc: ${item.desc ? item.desc.slice(0, 60) + "..." : "Açıklama yok"}`);
    });
    if (categories[cat].length > 3) {
      console.log(`  ...and ${categories[cat].length - 3} more products`);
    }
  });

  if (noPrice.length > 0) {
    console.log(`\nProducts with invalid/no price (${noPrice.length}):`, noPrice.slice(0, 10));
  }

} catch (err) {
  console.error("Error analyzing file:", err);
}
