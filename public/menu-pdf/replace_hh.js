const fs = require('fs');

// --- 1. UPDATE index.html ---
let indexPath = 'C:\\Antigravity\\App Denemeler\\Menu to PDF v4\\index.html';
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// The original HTML chunk
const oldHtmlChunk = `<div class="hht">HAFTAİÇİ</div><div class="hhc">
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> 14:00 - 17:00</div>
<div class="hhl">
<div class="hhi"><div class="hhin">CARLSBERG 50 CL FIÇI</div><div class="hhpx"><span data-c="HAPPY HOUR" data-n="CARLSBERG 50 CL" data-p="210">₺ 210</span></div></div>
<div class="hhi"><div class="hhin">TUBORG 50 CL FIÇI</div><div class="hhpx"><span data-c="HAPPY HOUR" data-n="TUBORG 50 CL" data-p="200">₺ 200</span></div></div>
<div class="hhi"><div class="hhin">PATATES KIZARTMASI</div><div class="hhpx"><span data-c="HAPPY HOUR" data-n="PATATES KIZARTMASI" data-p="210">₺ 210</span></div></div>
<div class="hhi"><div class="hhin">ÇITIR TAVUK BURGER</div><div class="hhpx"><span data-c="HAPPY HOUR" data-n="ÇITIR TAVUK BURGER" data-p="320">₺ 320</span></div></div></div>`;

// The new HTML chunk
const newHtmlChunk = `<div class="hht" id="hh_title">HAFTAİÇİ</div><div class="hhc">
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> <span id="hh_time">14:00 - 17:00</span></div>
<div class="hhl">
<div class="hhi"><div class="hhin" id="hh_n1">CARLSBERG 50 CL FIÇI</div><div class="hhpx"><span id="hh_p1">₺ 210</span></div></div>
<div class="hhi"><div class="hhin" id="hh_n2">TUBORG 50 CL FIÇI</div><div class="hhpx"><span id="hh_p2">₺ 200</span></div></div>
<div class="hhi"><div class="hhin" id="hh_n3">PATATES KIZARTMASI</div><div class="hhpx"><span id="hh_p3">₺ 210</span></div></div>
<div class="hhi"><div class="hhin" id="hh_n4">ÇITIR TAVUK BURGER</div><div class="hhpx"><span id="hh_p4">₺ 320</span></div></div></div>`;

if (indexHtml.includes('<div class="hht">HAFTAİÇİ</div>')) {
    indexHtml = indexHtml.replace(oldHtmlChunk, newHtmlChunk);
}

// Add the JS logic in index.html
const indexJsLogic = `
            // 4. HAPPY HOUR GÜNCELLEMESİ
            if(savedData.happyHour) {
                const hh = savedData.happyHour;
                if(document.getElementById('hh_title')) document.getElementById('hh_title').innerHTML = hh.title;
                if(document.getElementById('hh_time')) document.getElementById('hh_time').innerHTML = hh.time;
                
                if(document.getElementById('hh_n1')) document.getElementById('hh_n1').innerHTML = hh.item1Name;
                if(document.getElementById('hh_p1')) document.getElementById('hh_p1').innerHTML = "₺ " + hh.item1Price;
                
                if(document.getElementById('hh_n2')) document.getElementById('hh_n2').innerHTML = hh.item2Name;
                if(document.getElementById('hh_p2')) document.getElementById('hh_p2').innerHTML = "₺ " + hh.item2Price;
                
                if(document.getElementById('hh_n3')) document.getElementById('hh_n3').innerHTML = hh.item3Name;
                if(document.getElementById('hh_p3')) document.getElementById('hh_p3').innerHTML = "₺ " + hh.item3Price;
                
                if(document.getElementById('hh_n4')) document.getElementById('hh_n4').innerHTML = hh.item4Name;
                if(document.getElementById('hh_p4')) document.getElementById('hh_p4').innerHTML = "₺ " + hh.item4Price;
            }
`;

if (!indexHtml.includes('HAPPY HOUR GÜNCELLEMESİ')) {
    indexHtml = indexHtml.replace('// 3. ALT BİLGİ YAZISI GÜNCELLEMESİ', indexJsLogic + '\n            // 3. ALT BİLGİ YAZISI GÜNCELLEMESİ');
}

fs.writeFileSync(indexPath, indexHtml, 'utf8');


// --- 2. UPDATE admin.html ---
let adminPath = 'C:\\Antigravity\\App Denemeler\\Menu to PDF v4\\admin.html';
let adminHtml = fs.readFileSync(adminPath, 'utf8');

// HTML Injection Spot
const htmlInjectHtml = `
        <!-- HAPPY HOUR YÖNETİMİ BÖLÜMÜ -->
        <div class="bg-white p-6 rounded-xl shadow-md border-t-4 border-[#ed6d6b] lg:col-span-2">
            <h2 class="text-xl font-bold mb-4 border-b pb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#ed6d6b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                4. Happy Hour Yönetimi
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pt-2">
                <div>
                    <label class="block text-sm font-bold text-gray-800 mb-1">Başlık (Örn: HAFTAİÇİ)</label>
                    <input type="text" id="hhTitle" class="w-full p-3 border border-gray-300 rounded font-bold text-gray-700 bg-gray-50 focus:outline-none focus:border-[#ed6d6b]" oninput="updateHappyHour('title', event.target.value)">
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-800 mb-1">Saat Dilimi (Örn: 14:00 - 17:00)</label>
                    <input type="text" id="hhTime" class="w-full p-3 border border-gray-300 rounded font-bold text-gray-700 bg-gray-50 focus:outline-none focus:border-[#ed6d6b]" oninput="updateHappyHour('time', event.target.value)">
                </div>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <!-- ITEM 1 -->
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label class="block text-xs font-bold text-[#ed6d6b] uppercase tracking-wider mb-2">Ürün 1</label>
                    <input type="text" id="hhItem1Name" class="w-full p-2 border border-gray-300 rounded mb-3 text-sm focus:border-[#ed6d6b] font-semibold text-gray-700" placeholder="İsim" oninput="updateHappyHour('item1Name', event.target.value)">
                    <label class="block text-xs font-bold text-gray-600 mb-1">Fiyat (₺)</label>
                    <input type="number" id="hhItem1Price" class="w-full p-2 border border-gray-300 rounded text-sm focus:border-[#ed6d6b]" oninput="updateHappyHour('item1Price', event.target.value)">
                </div>
                <!-- ITEM 2 -->
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label class="block text-xs font-bold text-[#ed6d6b] uppercase tracking-wider mb-2">Ürün 2</label>
                    <input type="text" id="hhItem2Name" class="w-full p-2 border border-gray-300 rounded mb-3 text-sm focus:border-[#ed6d6b] font-semibold text-gray-700" placeholder="İsim" oninput="updateHappyHour('item2Name', event.target.value)">
                    <label class="block text-xs font-bold text-gray-600 mb-1">Fiyat (₺)</label>
                    <input type="number" id="hhItem2Price" class="w-full p-2 border border-gray-300 rounded text-sm focus:border-[#ed6d6b]" oninput="updateHappyHour('item2Price', event.target.value)">
                </div>
                <!-- ITEM 3 -->
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label class="block text-xs font-bold text-[#ed6d6b] uppercase tracking-wider mb-2">Ürün 3</label>
                    <input type="text" id="hhItem3Name" class="w-full p-2 border border-gray-300 rounded mb-3 text-sm focus:border-[#ed6d6b] font-semibold text-gray-700" placeholder="İsim" oninput="updateHappyHour('item3Name', event.target.value)">
                    <label class="block text-xs font-bold text-gray-600 mb-1">Fiyat (₺)</label>
                    <input type="number" id="hhItem3Price" class="w-full p-2 border border-gray-300 rounded text-sm focus:border-[#ed6d6b]" oninput="updateHappyHour('item3Price', event.target.value)">
                </div>
                <!-- ITEM 4 -->
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label class="block text-xs font-bold text-[#ed6d6b] uppercase tracking-wider mb-2">Ürün 4</label>
                    <input type="text" id="hhItem4Name" class="w-full p-2 border border-gray-300 rounded mb-3 text-sm focus:border-[#ed6d6b] font-semibold text-gray-700" placeholder="İsim" oninput="updateHappyHour('item4Name', event.target.value)">
                    <label class="block text-xs font-bold text-gray-600 mb-1">Fiyat (₺)</label>
                    <input type="number" id="hhItem4Price" class="w-full p-2 border border-gray-300 rounded text-sm focus:border-[#ed6d6b]" oninput="updateHappyHour('item4Price', event.target.value)">
                </div>
            </div>
        </div>
`;

if (!adminHtml.includes('4. Happy Hour Yönetimi')) {
    adminHtml = adminHtml.replace(/<\/div>\s*<!-- SCRIPT KISMI -->/, '\\n' + htmlInjectHtml + '\\n    </div>\\n    <!-- SCRIPT KISMI -->');
}

// JS Injection Spot - initialization logic
const jsInitReplaceRegex = /if \(savedData\) \{/;
if (!adminHtml.includes('appData.happyHour = ')) {
    adminHtml = adminHtml.replace(jsInitReplaceRegex, `
        const defaultHH = {
            title: "HAFTAİÇİ",
            time: "14:00 - 17:00",
            item1Name: "CARLSBERG 50 CL FIÇI", item1Price: 210,
            item2Name: "TUBORG 50 CL FIÇI", item2Price: 200,
            item3Name: "PATATES KIZARTMASI", item3Price: 210,
            item4Name: "ÇITIR TAVUK BURGER", item4Price: 320
        };
        appData.happyHour = defaultHH;
        if (savedData) {
            if (savedData.happyHour) {
                appData.happyHour = savedData.happyHour;
            }
`);
}

const jsFunctions = `
        function updateHappyHour(key, value) {
            if(!appData.happyHour) appData.happyHour = {};
            appData.happyHour[key] = value;
        }

        // Sayfa açıldığında textarea ve happy hour bilgilerine aktar
        document.addEventListener('DOMContentLoaded', () => {
            const footerInput = document.getElementById('footerTextInput');
            if (footerInput) {
                footerInput.value = (appData.footerText || "").replace(/<br\\s*\\/?>/gi, '\\n');
            }

            if(document.getElementById('hhTitle') && appData.happyHour) {
                document.getElementById('hhTitle').value = appData.happyHour.title;
                document.getElementById('hhTime').value = appData.happyHour.time;
                document.getElementById('hhItem1Name').value = appData.happyHour.item1Name;
                document.getElementById('hhItem1Price').value = appData.happyHour.item1Price;
                document.getElementById('hhItem2Name').value = appData.happyHour.item2Name;
                document.getElementById('hhItem2Price').value = appData.happyHour.item2Price;
                document.getElementById('hhItem3Name').value = appData.happyHour.item3Name;
                document.getElementById('hhItem3Price').value = appData.happyHour.item3Price;
                document.getElementById('hhItem4Name').value = appData.happyHour.item4Name;
                document.getElementById('hhItem4Price').value = appData.happyHour.item4Price;
            }
        });
`;

if (!adminHtml.includes('function updateHappyHour')) {
    // replace original addEventListener injected for footer, with the merged one
    const footerEventListener = `        // Sayfa açıldığında textarea'ya mevcut yazıyı aktar
        document.addEventListener('DOMContentLoaded', () => {
            const footerInput = document.getElementById('footerTextInput');
            if (footerInput) {
                footerInput.value = (appData.footerText || "").replace(/<br\\s*\\/?>/gi, '\\n');
            }
        });`;
    if(adminHtml.includes(footerEventListener)) {
         adminHtml = adminHtml.replace(footerEventListener, jsFunctions);
    } else {
         adminHtml = adminHtml.replace('// Sayfa açıldığında arayüzü oluştur', jsFunctions + '\\n        // Sayfa açıldığında arayüzü oluştur');
    }
}

fs.writeFileSync(adminPath, adminHtml, 'utf8');
console.log("Admin and Index for Happy Hour updated successfully.");
