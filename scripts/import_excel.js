import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const EXCEL_PATH    = path.join(__dirname, '..', 'pennylane-urunler.xlsx');
const JSON_PATH     = path.join(__dirname, '..', 'src', 'utils', 'mockData.json');
const DEFAULT_IMAGE = '/assets/img/1776219428839-pennylane-default.png';

// Subcategories inside Spirits that will be PROMOTED to top-level categories
const PROMOTE_TO_CATEGORY = new Set([]);

function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ─── Parse Excel into a flat row list ──────────────────────────────────────────
function parseRows(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheet    = workbook.Sheets[workbook.SheetNames[0]];
  const rawData  = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  const rows = [];
  for (let i = 2; i < rawData.length; i++) {
    const row = rawData[i];
    if (!row || row.length === 0) continue;
    let indent = 0;
    while (indent < row.length && row[indent] === '') indent++;
    if (indent >= row.length) continue;
    rows.push({
      indent,
      value: row[indent].toString().trim(),
      sku:   (row[row.length - 2] ?? '').toString().trim(),
      price: (row[row.length - 1] !== undefined && row[row.length - 1] !== '') ? row[row.length - 1] : 0,
    });
  }
  return rows;
}

// ─── Build tree (max 3 useful levels: cat / subcat / item or subcat→subsubcat→item)
// Strategy: each node only keeps direct children at the NEXT indent level.
// Items are always leaf nodes. Headers are detected by "next sibling or child is deeper".
function buildTree(rows) {
  // We'll work with a stack approach
  // Each entry: { indent, name, sku, items: [], children: [] }
  const root = { indent: 0, name: '__root__', sku: '', items: [], children: [] };
  const stack = [root]; // stack[0] = root

  for (let i = 0; i < rows.length; i++) {
    const row  = rows[i];
    const next = rows[i + 1];

    // Pop stack until top is parent level
    while (stack.length > 1 && stack[stack.length - 1].indent >= row.indent) {
      stack.pop();
    }

    const parent = stack[stack.length - 1];
    const isHeader = next && next.indent > row.indent; // has children

    if (isHeader) {
      const node = { indent: row.indent, name: row.value, sku: row.sku, items: [], children: [] };
      parent.children.push(node);
      stack.push(node);
    } else {
      // Leaf = item
      parent.items.push({ name: row.value, sku: row.sku, price: row.price });
    }
  }

  return root.children; // top-level categories
}

// ─── Flatten a node's items + all descendant items, tagging with categoryPath ─
function collectItems(node, currentPath = []) {
  const result = [];

  // Direct items of this node
  for (const item of node.items) {
    const dbItem = {
      id:          item.sku,
      name:        { tr: item.name.toUpperCase(), en: item.name.toUpperCase() },
      price:       item.price ? item.price.toString() : '0',
      passive:     false,
      allergens:   [],
      image_url:   DEFAULT_IMAGE,
      description: { tr: '', en: '' },
      categoryPath: currentPath
    };
    result.push(dbItem);
  }

  // Recurse into children
  for (const child of node.children) {
    const childId = toSlug(child.name);
    result.push(...collectItems(child, [...currentPath, childId]));
  }

  return result;
}

// ─── Recursive Subcategory Builder ──────────────────────────────────────
function buildSubcategoriesRecursive(children) {
  const dbSubcats = [];
  const seenSubIds = new Set();

  for (const child of children) {
    const subId = toSlug(child.name);
    const subUpper = child.name.toUpperCase();

    if (!seenSubIds.has(subId)) {
      seenSubIds.add(subId);
      const subcatObj = { id: subId, title: { tr: subUpper, en: subUpper } };
      
      if (child.children.length > 0) {
        subcatObj.subcategories = buildSubcategoriesRecursive(child.children);
      }
      dbSubcats.push(subcatObj);
    }
  }

  return dbSubcats.length > 0 ? dbSubcats : undefined;
}

// ─── Convert a tree node into a DB category object ────────────────────────────
function nodeToDbCategory(node) {
  const nameUpper = node.name.toUpperCase();
  const catId     = toSlug(node.name);

  const dbCategory = {
    id:    catId,
    items: [],
    title: { tr: nameUpper, en: nameUpper },
  };

  if (node.children.length > 0) {
    dbCategory.subcategories = buildSubcategoriesRecursive(node.children);
  }

  dbCategory.items = collectItems(node, []);

  return dbCategory;
}

// ─── Main builder ──────────────────────────────────────────────────────────────
function buildDbCategories(tree) {
  const dbCategories = [];

  for (const catNode of tree) {
    const catName = catNode.name;

    // Count all items in tree
    const countAll = (n) => n.items.length + n.children.reduce((a, c) => a + countAll(c), 0);
    const total = countAll(catNode);

    if (total === 0 && catNode.children.length === 0) {
      console.log(`⏭  Skipping empty: "${catName}"`);
      continue;
    }

    // Split children: promoted vs remaining
    const promotedChildren  = catNode.children.filter(c => PROMOTE_TO_CATEGORY.has(c.name));
    const remainingChildren = catNode.children.filter(c => !PROMOTE_TO_CATEGORY.has(c.name));

    // Build main category (without promoted children)
    const mainNode = { ...catNode, children: remainingChildren };
    const dbCat    = nodeToDbCategory(mainNode);

    console.log(
      `✅  "${catName.toUpperCase()}"  →  ${dbCat.items.length} ürün` +
      (dbCat.subcategories ? `  |  ${dbCat.subcategories.length} alt kategori` : '')
    );
    dbCategories.push(dbCat);

    // Build each promoted child as its own top-level category
    for (const promoted of promotedChildren) {
      const dbPromoted = nodeToDbCategory(promoted);
      console.log(
        `  🔼 PROMOTED: "${promoted.name.toUpperCase()}"  →  ${dbPromoted.items.length} ürün` +
        (dbPromoted.subcategories ? `  |  ${dbPromoted.subcategories.length} alt kategori` : '')
      );
      dbCategories.push(dbPromoted);
    }
  }

  return dbCategories;
}

// ─── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 Pennylane Menu Import başlatılıyor...\n');

  console.log(`📖 Excel okunuyor: ${EXCEL_PATH}`);
  const rows = parseRows(EXCEL_PATH);
  const tree = buildTree(rows);
  console.log(`   → ${tree.length} ana kategori bulundu\n`);

  console.log(`📂 Mevcut veri okunuyor: ${JSON_PATH}`);
  const existingData = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

  console.log(`\n🔧 Yeni menü kategorileri oluşturuluyor...\n`);
  const newCategories = buildDbCategories(tree);

  existingData.menu = { ...existingData.menu, categories: newCategories };

  console.log(`\n💾 mockData.json güncelleniyor...`);
  fs.writeFileSync(JSON_PATH, JSON.stringify(existingData, null, 2), 'utf8');

  const totalImported = newCategories.reduce((a, c) => a + c.items.length, 0);
  console.log(`\n🎉 Import tamamlandı!`);
  console.log(`   ✔ ${newCategories.length} kategori`);
  console.log(`   ✔ ${totalImported} ürün`);
  console.log(`   ✔ Whisky ayrı kategori`);
  console.log(`   ✔ Tekrar eden alt kategoriler temizlendi`);
}

main().catch(console.error);
