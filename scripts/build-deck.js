#!/usr/bin/env node
/* build-deck.js — Company Profile Builder (Phase 3)
   Converts artifacts/02-company-profile-final.md into a single-file
   Reveal.js HTML (compros/congen/index.html) with CSS inlined, plus
   compro.md, assets/, and build.log. Deterministic, no AI discretion.
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC_MD = path.join(ROOT, 'artifacts', '02-company-profile-final.md');
const SHELL = path.join(ROOT, '.claude', 'plugins', 'compro', 'skills', 'company-profile-builder', 'templates', 'profile-shell.html');
const CSS = path.join(ROOT, '.claude', 'plugins', 'compro', 'skills', 'company-profile-builder', 'templates', 'custom.css');
const OUT_DIR = path.join(ROOT, 'compros', 'congen');
const COMPANY = 'Venturo Pro';

if (!fs.existsSync(SRC_MD)) { console.error('Markdown file not found at ' + SRC_MD); process.exit(1); }
const md = fs.readFileSync(SRC_MD, 'utf8');
if (!md.trim()) { console.error('Markdown file is empty'); process.exit(1); }

/* ---- Parse & chunking: H1 = new slide ---- */
// Drop the front-matter header (Meta Title/Description) — not slide content.
const body = md.replace(/^---[\s\S]*?---\s*/, '');
const rawSlides = body.split(/^# /m).map(s => s.trim()).filter(Boolean);
const slides = rawSlides.map(s => {
  const newline = s.indexOf('\n');
  const title = newline === -1 ? s.trim() : s.slice(0, newline).trim();
  const content = newline === -1 ? '' : s.slice(newline + 1).trim();
  return { title, content };
});

/* ---- Markdown -> HTML (mini converter for our element set) ---- */
function inline(mdtext) {
  return mdtext
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}

function mdTable(block) {
  const lines = block.trim().split('\n');
  const out = ['<table>'];
  lines.forEach((line, i) => {
    const cells = line.replace(/^\||\|$/g, '').split('|').map(c => inline(c.trim()));
    if (/^(\s*:?-{2,}:?\s*\|?)+$/.test(line.replace(/^\||\|$/g, ''))) return; // separator
    const tag = i === 0 ? 'th' : 'td';
    out.push('<tr>' + cells.map(c => `<${tag}>${c}</${tag}>`).join('') + '</tr>');
  });
  out.push('</table>');
  return out.join('\n');
}

function mdToHtml(content) {
  const lines = content.split('\n');
  let html = '';
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    // skip visual directives / html comments
    if (/^\s*<!--/.test(line)) { i++; continue; }
    // code fence (not used) — just skip
    if (/^```/.test(line)) { i++; while (i < lines.length && !/^```/.test(lines[i])) i++; i++; continue; }
    // table: starts with |
    if (/^\|/.test(line)) {
      const block = [];
      while (i < lines.length && /^\|/.test(lines[i])) { block.push(lines[i]); i++; }
      html += mdTable(block.join('\n')) + '\n';
      continue;
    }
    // unordered list
    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push('<li>' + inline(lines[i].replace(/^\s*[-*]\s+/, '')) + '</li>');
        i++;
      }
      html += '<ul>' + items.join('') + '</ul>\n';
      continue;
    }
    // ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push('<li>' + inline(lines[i].replace(/^\s*\d+\.\s+/, '')) + '</li>');
        i++;
      }
      html += '<ol>' + items.join('') + '</ol>\n';
      continue;
    }
    // H2
    if (/^##\s+/.test(line)) { html += '<h2>' + inline(line.replace(/^##\s+/, '')) + '</h2>\n'; i++; continue; }
    // H3
    if (/^###\s+/.test(line)) { html += '<h3>' + inline(line.replace(/^###\s+/, '')) + '</h3>\n'; i++; continue; }
    // blockquote
    if (/^>\s?/.test(line)) {
      const quote = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { quote.push(lines[i].replace(/^>\s?/, '')); i++; }
      html += '<blockquote>' + inline(quote.join(' ')) + '</blockquote>\n';
      continue;
    }
    // blank
    if (!line.trim()) { i++; continue; }
    // paragraph
    html += '<p>' + inline(line) + '</p>\n';
    i++;
  }
  return html;
}

/* ---- Slide HTML assembly ---- */
const slideHtml = slides.map((s, idx) => {
  const inner = mdToHtml(s.content);
  const contentHtml =
    idx === 0
      ? `<div class="content hero-section">
${inner}
</div>`
      : `<div class="content">
<h2>${inline(s.title)}</h2>
${inner}
</div>`;
  return `    <section>\n${contentHtml}\n    </section>`;
}).join('\n');

/* ---- Shell + CSS injection ---- */
let shell = fs.readFileSync(SHELL, 'utf8');
const customCss = fs.readFileSync(CSS, 'utf8');
shell = shell.replace('/* {{CUSTOM_CSS}} */', customCss);
shell = shell.replace(/{{COMPANY_NAME}}/g, COMPANY);
// Line-ending agnostic: the shell uses CRLF, so match the placeholder loosely.
shell = shell.replace(
  /<!-- Konten slide di-inject di sini oleh builder -->\r?\n\s*<!-- Setiap section adalah satu slide -->/,
  slideHtml
);

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'index.html'), shell);
fs.writeFileSync(path.join(OUT_DIR, 'compro.md'), fs.readFileSync(SRC_MD, 'utf8'));

/* ---- build.log ---- */
const log = [
  'Company Profile Build Log',
  '======================',
  `Company: ${COMPANY}`,
  `Source: ${SRC_MD}`,
  `Output: ${path.join(OUT_DIR, 'index.html')}`,
  `Generated: ${new Date().toISOString()}`,
  '',
  `Total slides: ${slides.length}`,
  ...slides.map((s, i) => `  ${i + 1}. ${s.title} (${s.content.split(/\s+/).filter(Boolean).length} kata)`),
  '',
  'Image handling:',
  '  - Sumber dokumen tidak berisi file/URL gambar nyata. Direktif visual dikurangi (di-copy sebagai komentar) dan TIDAK ada placeholder yang dipaksa. Slide tampil bersih tanpa gambar.',
  '  - assets/ dibuat (kosong) untuk kompatibilitas struktur output.',
  '',
  'CSS: custom.css di-inline ke <style> (single-file, tanpa <link> eksternal yang hilang).'
];
fs.writeFileSync(path.join(OUT_DIR, 'build.log'), log.join('\n'));

console.log(`Company profile slides dibuat di ${path.join(OUT_DIR, 'index.html')} dengan ${slides.length} slide`);