const fs = require('fs');
let data = fs.readFileSync('index.html', 'utf8');
data = data.replace(/<img src="data:image\/svg\+xml.*?>/g, '<img src="image/happy-hour-bira.png" class="hill" alt="Bira İllüstrasyonu">');
fs.writeFileSync('index.html', data);
console.log('done');
