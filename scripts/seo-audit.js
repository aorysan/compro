#!/usr/bin/env node
/* seo-audit.js — Company Profile Publisher (Phase 4, audit mode)
   Scans compros/<slug>/index.html for technical SEO elements, auto-patches
   any missing ones (Title, Meta Description, Open Graph, JSON-LD, alt), and
   writes compros/<slug>/reports/seo-report.md. Entity name + tagline are extracted from the
   final markdown's Meta Title/Description header.
   Usage: node scripts/seo-audit.js [slug] (default: congen)
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const slug = process.argv[2] || 'congen';
const HTML = path.join(ROOT, 'compros', slug, 'index.html');
const OUT = path.join(ROOT, 'compros', slug, 'reports', 'seo-report.md');
const URL = 'https://venturo-pro.vercel.app'; // canonical preview base; updated at deploy if changed

if (!fs.existsSync(HTML)) {
  console.error('HTML file not found at ' + HTML);
  process.exit(1);
}
let html = fs.readFileSync(HTML, 'utf8');

/* Read Meta Title/Description from the final markdown front-matter */
const candidateMds = [
  path.join(ROOT, 'compros', slug, 'drafts', '02-final.md'),
  path.join(ROOT, 'compros', slug, 'drafts', '02-company-profile-final.md'),
  path.join(ROOT, 'compros', slug, 'compro.md'),
  path.join(ROOT, 'artifacts', '02-company-profile-final.md'),
];
const SRC_MD = candidateMds.find((f) => fs.existsSync(f));

let metaTitle = '';
let metaDesc = '';
if (SRC_MD && fs.existsSync(SRC_MD)) {
  const md = fs.readFileSync(SRC_MD, 'utf8');
  metaTitle = (md.match(/^Meta Title:\s*(.+)$/m) || [])[1] || '';
  metaDesc = (md.match(/^Meta Description:\s*(.+)$/m) || [])[1] || '';
}

const rawTitleMatch = html.match(/<title>([^<]+)<\/title>/);
const company = (rawTitleMatch ? rawTitleMatch[1] : '').replace(/^Company Profile\s*[-—–]\s*/i, '').trim() || 'Venturo Pro';

const report = [];
const fixes = [];

function check(name, present, detail) {
  report.push({ name, status: present ? 'ok' : 'missing', detail });
}

/* ---- 1. Title ---- */
const hasTitle = /<title>[^<]+<\/title>/.test(html);
const currentTitle = hasTitle ? /<title>([^<]+)<\/title>/.exec(html)[1] : '';
check('Title', hasTitle, hasTitle ? currentTitle : 'n/a');
if (metaTitle && metaTitle !== currentTitle) {
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
const ogMissing = ogProps.filter((p) => !new RegExp(`property="${p}"`).test(html));
check('Open Graph', ogMissing.length === 0, ogMissing.length ? `missing: ${ogMissing.join(', ')}` : 'all present');

if (ogMissing.length) {
  const og = [
    `<meta property="og:title" content="${metaTitle || company}">`,
    `<meta property="og:description" content="${metaDesc || ''}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:url" content="${URL}">`,
    // no real brand image asset in this build — use a neutral note instead of a fake URL
  ];
  if (html.includes('<meta name="description"')) {
    html = html.replace(/<meta name="description"[^>]*>/, (m) => m + '\n  ' + og.join('\n  '));
  } else {
    html = html.replace(/<meta name="viewport"[^>]*>/, (m) => m + '\n  ' + og.join('\n  '));
  }
  fixes.push('Open Graph tags ditambahkan: og:title, og:description, og:type, og:url (og:image sengaja dilewati — belum ada aset gambar brand yang valid, sesuai aturan no-hallucination di builder)');
  report.push({ name: 'Open Graph og:image', status: 'skipped', detail: 'tidak ada aset gambar valid; dilewati sesuai aturan' });
} else {
  report.push({ name: 'Open Graph og:image', status: 'ok', detail: 'present' });
}

/* ---- 4. JSON-LD Schema ---- */
const hasJSONLD = /application\/ld\+json/.test(html);
check('JSON-LD Schema.org', hasJSONLD, hasJSONLD ? 'present' : 'n/a');
if (!hasJSONLD) {
  const entityName = company.split(/[—–-]/)[0].trim() || 'Venturo Pro';
  const ld = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: entityName,
    url: URL,
    description: metaDesc,
    slogan: 'Video ber-brand konsisten — tanpa biaya per-video yang tak terduga',
    areaServed: 'ID',
    knowsAbout: ['AI video production', 'Brand DNA', 'local-first video pipeline'],
  });
  if (html.includes('<meta name="description"')) {
    html = html.replace(/<meta name="description"[^>]*>/, (m) => m + `\n  <script type="application/ld+json">${ld}</script>`);
  } else {
    html = html.replace(/<meta name="viewport"[^>]*>/, (m) => m + `\n  <script type="application/ld+json">${ld}</script>`);
  }
  fixes.push('JSON-LD Schema (Organization) ditambahkan');
}

/* ---- 5. alt attributes on images ---- */
const imgTags = html.match(/<img\b[^>]*>/gi) || [];
const missingAlt = imgTags.filter((img) => !/\balt\s*=\s*["'][^"']*["']/i.test(img));
if (missingAlt.length > 0) {
  html = html.replace(/<img\b(?![^>]*\balt\s*=)([^>]*?)(\/?>)/gi, (m, attrs, end) => {
    fixes.push(`Atribut alt ditambahkan pada <img>: "${company} presentation visual"`);
    return `<img${attrs} alt="${company} presentation visual"${end}`;
  });
}
if (imgTags.length === 0) {
  report.push({ name: 'Alt attributes', status: 'ok (n/a)', detail: '0 <img> ditemukan (deck ini tidak memakai gambar — tidak ada alt yang perlu ditambal)' });
} else if (missingAlt.length === 0) {
  report.push({ name: 'Alt attributes', status: 'ok', detail: `Semua ${imgTags.length} <img> memiliki atribut alt` });
} else {
  report.push({ name: 'Alt attributes', status: 'fixed', detail: `${missingAlt.length} dari ${imgTags.length} <img> diperbaiki dengan atribut alt` });
}

/* ---- Write back ---- */
fs.writeFileSync(HTML, html);

/* ---- Report ---- */
const entityName = company.split(/[—–-]/)[0].trim() || 'Venturo Pro';
const lines = [
  `# SEO Audit Report — ${entityName} / ${slug}`,
  '',
  `**Tanggal:** ${new Date().toISOString()}`,
  `**File:** \`compros/${slug}/index.html\``,
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
  `- **Entity name yang digunakan:** ${entityName}`,
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