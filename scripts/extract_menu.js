const fs = require('fs');
const path = require('path');

const htmlPath = 'D:\\WEB PENNYLANE\\Restaurantly\\Restaurantly\\index.html';
const html = fs.readFileSync(htmlPath, 'utf8');

// Simple regex extraction for Pennylane Restaurantly template
// Category list extraction
const categoryMap = {
    'filter-breakfast': 'KAHVALTI',
    'filter-starter-sauces': 'BAŞLANGIÇ & SOSLAR',
    'filter-salad': 'SALATALAR',
    'filter-burger-sandwich': 'BURGER & SANDWİCH',
    'filter-main': 'ANA YEMEKLER',
    'filter-desserts': 'TATLILAR',
    'filter-beers': 'BİRALAR',
    'filter-cocktails': 'KOKTEYLLER',
    'filter-spirits': 'SPIRITS',
    'filter-wine-prosecco': 'ŞARAP & PROSECCO',
    'filter-coffee': 'KAHVE',
    'filter-iced-coffees': 'SOĞUK KAHVELER',
    'filter-coffee-beans': 'KAHVE ÇEKİRDEKLERİ',
    'filter-tea': 'ÇAY',
    'filter-soft-drinks': 'SOFT İÇECEKLER',
    'filter-mini-tuzlu': 'MİNİ TUZLU'
};

const items = [];
const itemRegex = /<div class="col-lg-6 menu-item (filter-[\w-]+)">[\s\S]*?<img src="([^"]+)"[\s\S]*?<div class="menu-content">[\s\S]*?<a [^>]+>([^<]+)<\/a>[\s\S]*?<\/div>[\s\S]*?<div class="menu-ingredients">([\s\S]*?)<\/div>/g;

let match;
while ((match = itemRegex.exec(html)) !== null) {
    const filterClass = match[1];
    const imageUrl = match[2];
    const title = match[3].trim().toUpperCase();
    const description = match[4].trim();
    
    items.push({
        id: Date.now() + Math.random(),
        title,
        description,
        price: "0", // Prices were missing in the template HTML
        image_url: imageUrl.replace('assets/', '/assets/'),
        category: filterClass
    });
}

// Convert to the Pennylane v3 structure
const menu = {
    categories: Object.entries(categoryMap).map(([id, title]) => ({
        id: id.replace('filter-', ''),
        title,
        items: items.filter(i => i.category === id).map(i => ({
            id: i.id.toString(),
            name: i.title,
            description: i.description,
            price: i.price,
            image_url: i.image_url,
            tags: []
        }))
    }))
};

fs.writeFileSync('C:\\Antigravity\\Web Denemeler\\Pennylane v3\\src\\utils\\extracted_menu.json', JSON.stringify(menu, null, 2));

console.log(`Extracted ${items.length} items across ${menu.categories.length} categories.`);
