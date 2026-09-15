const fs = require('fs');
const path = require('path');

// Dynamically locate project root
function detectProjectRoot() {
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--root=')) {
      return path.resolve(arg.split('=')[1]);
    }
  }
  if (process.env.COMPRO_PROJECT_ROOT) {
    return path.resolve(process.env.COMPRO_PROJECT_ROOT);
  }
  const fromDir = path.resolve(__dirname, '../../..');
  if (fs.existsSync(path.join(fromDir, 'compros'))) {
    return fromDir;
  }
  let cur = process.cwd();
  while (cur && cur !== path.dirname(cur)) {
    if (fs.existsSync(path.join(cur, 'compros'))) {
      return cur;
    }
    cur = path.dirname(cur);
  }
  return fromDir;
}

const ROOT = detectProjectRoot();
const slugArg = process.argv.slice(2).find(a => !a.startsWith('--'));
const slug = slugArg || 'congen5';
const CONGEN = path.join(ROOT, 'compros', slug);
const HTML_PATH = path.join(CONGEN, 'index.html');
const ASSETS_DIR = path.join(CONGEN, 'assets');
const REPORTS_DIR = path.join(CONGEN, 'reports');
const DRAFTS_DIR = path.join(CONGEN, 'drafts');

console.log(`=== TASK 7 VALIDATION SUITE FOR ${slug.toUpperCase()} ===\n`);
console.log(`Project Root: ${ROOT}`);
console.log(`Target Compro: ${CONGEN}\n`);

let allPassed = true;
function assert(name, condition, detail = '') {
  if (condition) {
    console.log(`[PASS] ${name}${detail ? ' (' + detail + ')' : ''}`);
  } else {
    console.error(`[FAIL] ${name}${detail ? ' (' + detail + ')' : ''}`);
    allPassed = false;
  }
}

// 1. Files & Directories
assert('index.html exists', fs.existsSync(HTML_PATH), fs.existsSync(HTML_PATH) ? `${fs.statSync(HTML_PATH).size} bytes` : 'not found');
assert('compro.md exists', fs.existsSync(path.join(CONGEN, 'compro.md')));
assert('assets directory exists', fs.existsSync(ASSETS_DIR));
assert('reports directory exists', fs.existsSync(REPORTS_DIR));
assert('reports/build.log exists', fs.existsSync(path.join(REPORTS_DIR, 'build.log')));

// 2. Drafts (if drafts directory is present)
if (fs.existsSync(DRAFTS_DIR)) {
  assert('02-final.md or 02-company-profile-final.md exists',
    fs.existsSync(path.join(DRAFTS_DIR, '02-final.md')) ||
    fs.existsSync(path.join(DRAFTS_DIR, '02-company-profile-final.md'))
  );
}

// 3. Clean root check (no artifacts/ or qa/ pollution)
const rootArtifacts = path.join(ROOT, 'artifacts');
const rootQa = path.join(ROOT, 'qa');
assert('root artifacts/ does not exist or empty', !fs.existsSync(rootArtifacts) || fs.readdirSync(rootArtifacts).length === 0);
assert('root qa/ does not exist or empty', !fs.existsSync(rootQa) || fs.readdirSync(rootQa).length === 0);

if (!fs.existsSync(HTML_PATH)) {
  console.error(`\n[FATAL] Cannot proceed with HTML assertions: ${HTML_PATH} does not exist.`);
  process.exit(1);
}

// 4. HTML Content & Canva Archetypes
const html = fs.readFileSync(HTML_PATH, 'utf8');

// Canvas 1920x1080 dimensions
assert('16:9 Presentation Dimensions (1920x1080)',
  html.includes('width: 1920') && html.includes('height: 1080')
);

// Typography & Google Fonts
assert('Google Fonts: Plus Jakarta Sans',
  html.includes('Plus+Jakarta+Sans') || html.includes('Plus Jakarta Sans')
);
assert('Google Fonts: Inter',
  html.includes('family=Inter') || html.includes('Inter')
);

// Archetype 1: Cover
assert('Cover Archetype: archetype-canva-cover and slide-1-hero asset',
  html.includes('archetype-canva-cover') &&
  (html.includes('slide-1-hero.jpg') || html.includes('slide-1-hero.svg') || html.includes('slide-1-hero'))
);

// Archetype 2: Welcome (badges 01, 02, 03)
assert('Welcome Archetype: archetype-canva-welcome with badges 01, 02, 03',
  html.includes('archetype-canva-welcome') &&
  html.includes('welcome-num') &&
  html.includes('01') &&
  html.includes('02') &&
  html.includes('03')
);

// Archetype 3: Services (2x2 grid)
assert('Services Archetype: archetype-canva-services 2x2 grid',
  html.includes('archetype-canva-services') &&
  (html.includes('services-grid-2x2') || html.includes('service-canva-card'))
);

// Archetype 4: Ecosystem (circular orbit SVG)
assert('Ecosystem Archetype: archetype-canva-ecosystem with circular orbit SVG',
  html.includes('archetype-canva-ecosystem') &&
  html.includes('ecosystem-orbit-svg')
);

// Archetype 5: Metrics (big numbers 44px / #007A87 / 20:1 / 90% / Rp10.000)
assert('Metrics Archetype: archetype-canva-metrics with big numbers',
  html.includes('archetype-canva-metrics') &&
  (html.includes('metric-big-number') || html.includes('44px') || html.includes('#007A87')) &&
  (html.includes('20:1') || html.includes('90%') || html.includes('Rp10.000'))
);

// Archetype 6: Comparison / Differentiator
assert('Comparison Archetype: archetype-canva-differentiator',
  html.includes('archetype-canva-differentiator')
);

// Archetype 7: Pricing (elevated card and Best Seller)
assert('Pricing Archetype: archetype-canva-pricing with elevated card and Best Seller',
  html.includes('archetype-canva-pricing') &&
  html.includes('pricing-card-elevated') &&
  html.includes('Best Seller')
);

// Archetype 8: Closing (without raw [...] placeholders)
assert('Closing Archetype: archetype-canva-closing without raw placeholders',
  html.includes('archetype-canva-closing') &&
  !html.includes('[Nomor WhatsApp]') &&
  !html.includes('[Email Resmi]') &&
  !html.includes('[Alamat Kantor]') &&
  !html.includes('[Tautan Pendaftaran]')
);

// 5. Asset Verification (Zero 404s!)
const imgMatches = [];
const imgRegex = /src=["']assets\/([^"'\s>]+)["']/g;
let match;
while ((match = imgRegex.exec(html)) !== null) {
  imgMatches.push(match[1]);
}

assert('Image references found in HTML', imgMatches.length > 0, `${imgMatches.length} references`);

let missingAssets = 0;
const uniqueAssets = Array.from(new Set(imgMatches));
for (const assetFile of uniqueAssets) {
  const assetPath = path.join(ASSETS_DIR, assetFile);
  const exists = fs.existsSync(assetPath) && fs.statSync(assetPath).size > 0;
  if (!exists) {
    missingAssets++;
  }
  assert(`Asset exists on disk: assets/${assetFile}`, exists, exists ? `${fs.statSync(assetPath).size} bytes` : 'NOT FOUND (404)');
}

assert('Zero 404 image assets on disk', missingAssets === 0, `${uniqueAssets.length - missingAssets}/${uniqueAssets.length} verified`);

console.log('\n========================================');
if (allPassed) {
  console.log(`ALL VALIDATION CHECKS PASSED PERFECTLY FOR ${slug}!`);
  process.exit(0);
} else {
  console.error(`SOME VALIDATION CHECKS FAILED FOR ${slug}!`);
  process.exit(1);
}
