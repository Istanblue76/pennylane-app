import fs from 'fs';
import path from 'path';

const mockDataPath = 'C:\\Antigravity\\Web Denemeler\\Pennylane v3\\src\\utils\\mockData.json';
const extractedPath = 'C:\\Antigravity\\Web Denemeler\\Pennylane v3\\src\\utils\\extracted_menu.json';

try {
    const mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));
    const extractedMenu = JSON.parse(fs.readFileSync(extractedPath, 'utf8'));

    // Convert flat extracted menu to bilingual format
    const restoredCategories = extractedMenu.categories.map(cat => ({
        id: cat.id,
        title: { 
            tr: cat.title, 
            en: "" 
        },
        items: cat.items.map(item => ({
            id: item.id || `item-${Math.random().toString(36).substr(2, 9)}`,
            name: { 
                tr: item.name || "", 
                en: "" 
            },
            price: item.price ? item.price.replace(' TL', '') : "0",
            description: { 
                tr: item.description || "", 
                en: "" 
            },
            image_url: item.image_url || "",
            allergens: [],
            passive: false
        }))
    }));

    // Update the menu portion of mockData
    mockData.menu = {
        categories: restoredCategories
    };

    fs.writeFileSync(mockDataPath, JSON.stringify(mockData, null, 2), 'utf8');
    console.log("RESTORE SUCCESS: Menu categories restored from extracted_menu.json");
} catch (err) {
    console.error("RESTORE FAILED:", err);
    process.exit(1);
}
