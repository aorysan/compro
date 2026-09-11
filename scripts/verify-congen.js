const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CONGEN = path.join(ROOT, 'compros', 'congen');
const HTML_PATH = path.join(CONGEN, 'index.html');

console.log('=== TASK 6 VALIDATION SUITE FOR CONGEN ===\n');

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
assert('index.html exists', fs.existsSync(HTML_PATH), `${fs.statSync(HTML_PATH).size} bytes`);
assert('compro.md exists', fs.existsSync(path.join(CONGEN, 'compro.md')));
assert('assets directory exists', fs.existsSync(path.join(CONGEN, 'assets')));
assert('reports directory exists', fs.existsSync(path.join(CONGEN, 'reports')));
assert('drafts directory exists', fs.existsSync(path.join(CONGEN, 'drafts')));

// 2. Drafts
assert('01-draft.md or 01-company-profile-draft.md exists',
  fs.existsSync(path.join(CONGEN, 'drafts', '01-draft.md')) ||
  fs.existsSync(path.join(CONGEN, 'drafts', '01-company-profile-draft.md'))
);
assert('02-final.md or 02-company-profile-final.md exists',
  fs.existsSync(path.join(CONGEN, 'drafts', '02-final.md')) ||
  fs.existsSync(path.join(CONGEN, 'drafts', '02-company-profile-final.md'))
);

// 3. Reports
assert('reports/build.log exists', fs.existsSync(path.join(CONGEN, 'reports', 'build.log')));
assert('reports/review-report.md exists', fs.existsSync(path.join(CONGEN, 'reports', 'review-report.md')));
assert('reports/seo-report.md exists', fs.existsSync(path.join(CONGEN, 'reports', 'seo-report.md')));

// 4. Clean root check
assert('root artifacts/ does not exist or empty', !fs.existsSync(path.join(ROOT, 'artifacts')));
assert('root qa/ does not exist or empty', !fs.existsSync(path.join(ROOT, 'qa')));

// 5. Assets
const expectedAssets = [
  'smartphone-mockup.svg',
  'ecosystem-diagram.svg',
  'hero-banner.svg',
  'closing-banner.svg',
  'logo.svg'
];
expectedAssets.forEach(a => {
  const p = path.join(CONGEN, 'assets', a);
  assert(`assets/${a} exists`, fs.existsSync(p), fs.existsSync(p) ? `${fs.statSync(p).size} bytes` : 'not found');
});

// 6. HTML Content & Visual features
const html = fs.readFileSync(HTML_PATH, 'utf8');

assert('16:9 Presentation Dimensions (1920x1080)',
  html.includes('width: 1920') && html.includes('height: 1080')
);

assert('Google Fonts: Plus Jakarta Sans',
  html.includes('Plus+Jakarta+Sans') || html.includes('Plus Jakarta Sans')
);

assert('Google Fonts: Inter',
  html.includes('family=Inter') || html.includes('Inter')
);

assert('Dynamic Venturo Teal #009BAD CSS properties / HSL',
  (html.includes('--brand-h: 186') && html.includes('--brand-s: 100%')) || html.includes('#009BAD')
);

assert('Smartphone mockup (.phone-frame) with dynamic island & UI screen',
  html.includes('phone-frame') &&
  html.includes('dynamic-island') &&
  html.includes('phone-screen')
);

assert('Circular ecosystem diagram (.ecosystem-diagram)',
  html.includes('ecosystem-diagram') &&
  html.includes('ecosystem-diagram.svg')
);

assert('Problem cards with dashed borders',
  html.includes('problem-card') &&
  html.includes('dashed')
);

assert('Solution cards with SVG checkmarks',
  html.includes('solution-card') &&
  html.includes('solution-check')
);

assert('Pricing grid with Best Seller ribbon badge and strikethrough price',
  html.includes('pricing-grid') &&
  html.includes('badge-ribbon') &&
  html.includes('Best Seller') &&
  html.includes('price-strikethrough')
);

assert('Closing banner with App Store & Google Play pills and contact grid',
  html.includes('closing-banner') &&
  html.includes('app-store-pill') &&
  html.includes('google-play-pill') &&
  html.includes('contact-grid')
);

console.log('\n========================================');
if (allPassed) {
  console.log('ALL VALIDATION CHECKS PASSED PERFECTLY!');
  process.exit(0);
} else {
  console.error('SOME VALIDATION CHECKS FAILED!');
  process.exit(1);
}
