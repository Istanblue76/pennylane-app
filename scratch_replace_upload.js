import fs from 'fs';

const filePath = 'c:/Antigravity/Web Denemeler/Pennylane/src/pages/Admin/AdminPanel.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Find the index of the first occurrence of "file = await compressImage(rawFile);"
const searchStr = 'file = await compressImage(rawFile);';
const idx = content.indexOf(searchStr);

if (idx === -1) {
  console.log("ERROR: first compressImage call not found!");
  process.exit(1);
}

// Find the starting "if (isImage) {" before this occurrence
const startIdx = content.lastIndexOf('if (isImage) {', idx);
if (startIdx === -1) {
  console.log("ERROR: start of if (isImage) not found!");
  process.exit(1);
}

// Find the closing "}" of this if statement (it ends before "// Check if file is large")
const endStr = '// Check if file is large';
const endIdx = content.indexOf(endStr, idx);
if (endIdx === -1) {
  console.log("ERROR: end comment not found!");
  process.exit(1);
}

// Find the last "}" before the endStr
const lastBraceIdx = content.lastIndexOf('}', endIdx);
if (lastBraceIdx === -1 || lastBraceIdx < startIdx) {
  console.log("ERROR: closing brace not found!");
  process.exit(1);
}

const originalBlock = content.substring(startIdx, lastBraceIdx + 1);
console.log("Original block found:\n", originalBlock);

const replacement = `if (isImage) {
      try {
        file = await compressImage(rawFile);
      } catch (err) {
        console.error("Sıkıştırma sırasında hata oluştu:", err);
      }
    }`;

content = content.substring(0, startIdx) + replacement + content.substring(lastBraceIdx + 1);
fs.writeFileSync(filePath, content, 'utf8');
console.log("SUCCESS: Cleaned up the first alert block!");
