import XLSX from 'xlsx';
import fs from 'fs';

try {
  const filePath = "C:\\Antigravity\\Web Denemeler\\Pennylane\\pennylane-urunler.xlsx";
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

  const tree = [];
  let currentCategory = null;
  let currentSubcategory = null;

  // First pass: clean up empty rows and find emptyCount for each row
  const parsedRows = [];
  for (let i = 2; i < rawData.length; i++) {
    const row = rawData[i];
    if (row.length === 0) continue;

    // Count empty elements at the beginning of the array
    let emptyCount = 0;
    while (emptyCount < row.length && row[emptyCount] === "") {
      emptyCount++;
    }

    if (emptyCount >= row.length) continue; // empty row

    parsedRows.push({
      emptyCount,
      value: row[emptyCount],
      sku: row[row.length - 2] ? row[row.length - 2].toString().trim() : "",
      price: row[row.length - 1] !== undefined ? row[row.length - 1] : 0,
      rowIndex: i
    });
  }

  // Second pass: construct tree using look-ahead
  parsedRows.forEach((row, idx) => {
    const nextRow = idx + 1 < parsedRows.length ? parsedRows[idx + 1] : null;

    if (row.emptyCount === 1) {
      // Category
      currentCategory = {
        name: row.value,
        sku: row.sku,
        items: [], // direct items (if no subcategories)
        subcategories: []
      };
      tree.push(currentCategory);
      currentSubcategory = null;
    } 
    else if (row.emptyCount === 2) {
      // Look ahead: if next row has emptyCount === 3, this is a subcategory header
      const isSubcatHeader = nextRow && nextRow.emptyCount === 3;

      if (!currentCategory) {
        currentCategory = { name: "General", sku: "", items: [], subcategories: [] };
        tree.push(currentCategory);
      }

      if (isSubcatHeader) {
        currentSubcategory = {
          name: row.value,
          sku: row.sku,
          items: []
        };
        currentCategory.subcategories.push(currentSubcategory);
      } else {
        // It's a product directly under the category
        currentCategory.items.push({
          name: row.value,
          sku: row.sku,
          price: row.price
        });
        currentSubcategory = null;
      }
    } 
    else if (row.emptyCount === 3) {
      // Product under current subcategory
      if (!currentCategory) {
        currentCategory = { name: "General", sku: "", items: [], subcategories: [] };
        tree.push(currentCategory);
      }
      if (!currentSubcategory) {
        currentSubcategory = { name: "General Items", sku: "", items: [] };
        currentCategory.subcategories.push(currentSubcategory);
      }
      currentSubcategory.items.push({
        name: row.value,
        sku: row.sku,
        price: row.price
      });
    }
  });

  // Save parsed tree JSON
  fs.writeFileSync('./scratch_parsed_menu.json', JSON.stringify(tree, null, 2), 'utf8');

  console.log("=== PARSED EXCEL MENU SUMMARY (WITH LOOK-AHEAD) ===");
  console.log(`Total Categories: ${tree.length}`);
  
  let totalSubcats = 0;
  let totalItems = 0;
  
  tree.forEach(cat => {
    let catItems = cat.items.length;
    cat.subcategories.forEach(sub => {
      catItems += sub.items.length;
      totalItems += sub.items.length;
    });
    totalItems += cat.items.length;
    totalSubcats += cat.subcategories.length;
    
    console.log(`- Category: "${cat.name}" | Direct Items: ${cat.items.length} | Subcategories: ${cat.subcategories.length} | Total Items in Cat: ${catItems}`);
    
    if (cat.items.length > 0) {
      console.log(`  * Direct Items:`);
      cat.items.slice(0, 3).forEach(item => {
        console.log(`    - "${item.name}" (SKU: ${item.sku}, Price: ${item.price} TL)`);
      });
      if (cat.items.length > 3) console.log(`    ...and ${cat.items.length - 3} more direct items`);
    }
    
    cat.subcategories.forEach(sub => {
      console.log(`  * Subcategory: "${sub.name}" | Items: ${sub.items.length}`);
      sub.items.slice(0, 2).forEach(item => {
        console.log(`    - "${item.name}" (SKU: ${item.sku}, Price: ${item.price} TL)`);
      });
    });
  });
  
  console.log(`\nGrand Totals:`);
  console.log(`- Total Categories: ${tree.length}`);
  console.log(`- Total Subcategories: ${totalSubcats}`);
  console.log(`- Total Products: ${totalItems}`);

} catch (err) {
  console.error("Error during tree parsing:", err);
}
