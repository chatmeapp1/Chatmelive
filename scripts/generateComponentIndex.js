// === scripts/generateComponentIndex.js ===
// Jalankan manual dengan: npm run gen:components

const fs = require("fs");
const path = require("path");

// ✅ Arahkan ke lokasi yang benar (dalam folder src)
const COMPONENTS_DIR = path.join(__dirname, "../src/components");
const INDEX_FILE = path.join(COMPONENTS_DIR, "index.js");

// Ambil semua file JS di folder components, kecuali index.js & file diawali "_"
const files = fs
  .readdirSync(COMPONENTS_DIR)
  .filter(
    (file) =>
      file.endsWith(".js") &&
      file !== "index.js" &&
      !file.startsWith("_")
  );

// Jika tidak ada file, hentikan
if (files.length === 0) {
  console.log("⚠️ Tidak ada file komponen ditemukan di folder /components.");
  process.exit(0);
}

// Buat isi index.js
let output = "// === components/index.js (Auto-generated) ===\n";
output += "// ⚠️ File ini dibuat otomatis via `npm run gen:components`.\n";
output += "// Jangan ubah manual — edit file di folder /components saja.\n\n";

files.forEach((file) => {
  const name = path.basename(file, ".js");
  output += `export { default as ${name} } from "./${name}";\n`;
});

fs.writeFileSync(INDEX_FILE, output, "utf8");

console.log(`✅ Selesai! Berhasil generate ${files.length} komponen ke index.js`);