// QC helper — render slide HTML -> screenshot (desktop + mobile) untuk verifikasi.
// BUKAN deliverable: output PNG hanya untuk cek visual, boleh dihapus.
// Usage: node render.js <slide.html> [outDir]
// Butuh puppeteer (npm i puppeteer di root project bila belum ada).
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";

const __dir = path.dirname(fileURLToPath(import.meta.url));
const html = process.argv[2];
if (!html) { console.error("Usage: node render.js <slide.html> [outDir]"); process.exit(1); }
const outDir = process.argv[3] || path.join(__dir, "..", ".preview");
const fs = await import("fs");
fs.mkdirSync(outDir, { recursive: true });
const base = path.basename(html, ".html");
const url = "file://" + path.resolve(html);

const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
async function shot(name, w, h, full = false) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 2 });
  await p.goto(url, { waitUntil: "networkidle0" });
  await p.evaluate(async () => { if (document.fonts) await document.fonts.ready; });
  await new Promise((r) => setTimeout(r, 2800)); // tunggu animasi selesai
  const out = path.join(outDir, `${base}.${name}.png`);
  await p.screenshot({ path: out, fullPage: full });
  console.log("QC:", path.relative(process.cwd(), out));
}
await shot("desktop", 1280, 720, false);
await shot("mobile", 390, 844, true);
await b.close();
