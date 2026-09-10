const fs = require('fs');
const path = require('path');

const shellPath = path.join(__dirname, '..', '.claude', 'plugins', 'compro', 'skills', 'builder', 'templates', 'editorial-shell.html');
if (!fs.existsSync(shellPath)) {
  console.error(`FAIL: editorial-shell.html not found at ${shellPath}`);
  process.exit(1);
}

const content = fs.readFileSync(shellPath, 'utf8');

const requiredStrings = [
  'Plus+Jakarta+Sans',
  'Inter',
  'CSS_INLINE_PLACEHOLDER',
  '<div class="reveal">',
  '<div class="slides">'
];

for (const s of requiredStrings) {
  if (!content.includes(s)) {
    console.error(`FAIL: editorial-shell.html missing: ${s}`);
    process.exit(1);
  }
}

console.log('PASS: editorial-shell.html is valid with fonts, Reveal structure, and CSS placeholder');
process.exit(0);
