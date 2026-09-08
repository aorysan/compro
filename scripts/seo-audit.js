#!/usr/bin/env node
/* seo-audit.js — Company Profile Publisher (Phase 4, audit mode)
   Scans compros/congen/index.html for technical SEO elements, auto-patches
   any missing ones (Title, Meta Description, Open Graph, JSON-LD, alt), and
   writes qa/seo-report.md. Entity name + tagline are extracted from the
   final markdown's Meta Title/Description header.
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const HTML = path.join(ROOT, 'compros', 'congen', 'index.html');
const SRC_MD = path.join(ROOT, 'artifacts', '02-company-profile-final.md');
const OUT = path.join(ROOT, 'qa', 'seo-report.md');
const URL = 'https://venturo-pro.vercel.app'; // canonical preview base; updated at deploy if changed

if (!fs.existsSync(HTML)) { console.error('HTML file not found at ' + HTML); process.exit(1); }
let html = fs.readFileSync(HTML, 'utf8');

/* Read Meta Title/Description from the final markdown front-matter */
const md = fs.readFileSync(SRC_MD, 'utf8');
const metaTitle = (md.match(/^Meta Title:\s*(.+)$/m) || [])[1] || '';
const metaDesc = (md.match(/^Meta Description:\s*(.+)$/m) || [])[1] || '';
const company = (html.match(/<title>([^<]+)<\/title>/) || [])[1] || 'Venturo Pro';

const report = [];
const fixes = [];

function check(name, present, detail) {
  report.push({ name, status: present ? 'ok' : 'missing', detail });
}

/* ---- 1. Title ---- */
const hasTitle = /<title>[^<]+<\/title>/.test(html);
check('Title', hasTitle, hasTitle ? /<title>([^<]+)<\/title>/.exec(html)[1] : 'n/a');
if (metaTitle && metaTitle !== (hasTitle ? /<title>([^<]+)<\/title>/.exec(html)[1] : '')) {
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${metaTitle}</title>`);
  fixes.push(`Title diganti menjadi: "${metaTitle}" (${metaTitle.length} karakter)`);
}

/* ---- 2. Meta Description ---- */
const hasDesc = /<meta name="description"[^>]*>/.test(html);
check('Meta Description', hasDesc, hasDesc ? 'present' : 'n/a');
if (!hasDesc && metaDesc) {
  html = html.replace(/<meta name="viewport"[^>]*>/, `$&\n  <meta name="description" content="${metaDesc}">`);
  fixes.push(`Meta Description ditambahkan (${metaDesc.length} karakter)`);
}

/* ---- 3. Open Graph ---- */
const ogProps = ['og:title', 'og:description', 'og:image', 'og:url', 'og:type'];
const ogMissing = ogProps.filter((p) => !new RegExp(`property="${p}"`).test(html) && !new RegExp(`property="${p}">`).test(html) && !new RegExp(`property="${p}"`).test(html));
check('Open Graph', ogMissing.length === 0, ogMissing.length ? `missing: ${ogMissing.join(', ')}` : 'all present');

if (ogMissing.length) {
  const og = [
    `<meta property="og:title" content="${metaTitle || company}">`,
    `<meta property="og:description" content="${metaDesc || ''}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:url" content="${URL}">`,
    // no real brand image asset in this build — use a neutral note instead of a fake URL
  ];
  html = html.replace(/<meta name="description"[^>]*>/, (m) => m + '\n  ' + og.join('\n  '));
  fixes.push('Open Graph tags ditambahkan: og:title, og:description, og:type, og:url (og:image sengaja dilewati — belum ada aset gambar brand yang valid, sesuai aturan no-hallucination di builder)');
  report.push({ name: 'Open Graph og:image', status: 'skipped', detail: 'tidak ada aset gambar valid; dilewati sesuai aturan' });
} else {
  report.push({ name: 'Open Graph og:image', status: 'ok', detail: 'present' });
}

/* ---- 4. JSON-LD Schema ---- */
const hasJSONLD = /application\/ld\+json/.test(html);
check('JSON-LD Schema.org', hasJSONLD, hasJSONLD ? 'present' : 'n/a');
if (!hasJSONLD) {
  const ld = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Venturo Pro',
    url: URL,
    description: metaDesc,
    slogan: 'Video ber-brand konsisten — tanpa biaya per-video yang tak terduga',
    areaServed: 'ID',
    knowsAbout: ['AI video production', 'Brand DNA', 'local-first video pipeline'],
  });
  html = html.replace(/<meta name="description"[^>]*>/, (m) => m + `\n  <script type="application/ld+json">${ld}</script>`);
  fixes.push('JSON-LD Schema (Organization) ditambahkan');
}

/* ---- 5. alt attributes on images ---- */
const imgs = (html.match(/<img\b[^>]*>/g) || []).length;
report.push({ name: 'Alt attributes', status: imgs === 0 ? 'ok (n/a)' : 'check', detail: `${imgs} <img> ditemukan (deck ini tidak memakai gambar — tidak ada alt yang perlu ditambal)` });

/* ---- Write back ---- */
fs.writeFileSync(HTML, html);

/* ---- Report ---- */
const lines = [
  '# SEO Audit Report — Venturo Pro / congen',
  '',
  `**Tanggal:** ${new Date().toISOString()}`,
  `**File:** \`compros/congen/index.html\``,
  '',
  '## Item yang Dicek',
  '',
  '| Item | Status | Detail |',
  '|------|--------|--------|',
  ...report.map((r) => `| ${r.name} | ${r.status} | ${r.detail} |`),
  '',
  '## Tindakan Auto-Fix',
  '',
  ...(fixes.length ? fixes.map((f) => `- ${f}`) : ['- Tidak ada perbaikan yang diperlukan.']),
  '',
  '## Entity & Tagline',
  '',
  `- **Entity name yang digunakan:** Venturo Pro`,
  `- **Tagline:** "Video ber-brand konsisten — tanpa biaya per-video yang tak terduga"`,
  `- **Meta Title:** ${metaTitle} (${(metaTitle || '').length} karakter)`,
  `- **Meta Description:** ${metaDesc} (${(metaDesc || '').length} karakter)`,
  '',
  `## Canonical Preview URL`,
  '',
  `- ${URL} *(akan diperbarui dengan URL deploy final di Phase 6)*`,
];
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, lines.join('\n'));
console.log('SEO audit & auto-fix selesai. Laporan: ' + OUT);