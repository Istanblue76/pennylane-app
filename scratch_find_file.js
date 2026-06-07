import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

function searchFile(dir, targetName) {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      let stat;
      try {
        stat = fs.statSync(fullPath);
      } catch (e) {
        continue;
      }
      if (stat.isDirectory()) {
        const found = searchFile(fullPath, targetName);
        if (found) return found;
      } else if (file.toLowerCase() === targetName.toLowerCase()) {
        return fullPath;
      }
    }
  } catch (err) {
    // Ignore permission errors
  }
  return null;
}

const targetFile = "Pennylane_Menu.xlsx";
console.log(`Searching for "${targetFile}" starting from C:\\Antigravity...`);
const foundPath = searchFile("C:\\Antigravity", targetFile);

if (foundPath) {
  console.log("FOUND AT:", foundPath);
  console.log("File exists check:", fs.existsSync(foundPath));
  try {
    const workbook = XLSX.readFile(foundPath);
    const sheetNames = workbook.SheetNames;
    console.log("Sheet Names:", sheetNames);
    sheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      console.log(`Sheet: ${sheetName} | Rows: ${data.length}`);
      if (data.length > 0) {
        console.log("Sample rows:");
        console.log(JSON.stringify(data.slice(0, 10), null, 2));
      }
    });
  } catch (err) {
    console.error("Error reading file:", err);
  }
} else {
  console.log("NOT FOUND ANYWHERE!");
}
