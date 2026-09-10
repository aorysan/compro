const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', '.claude', 'plugins', 'compro', 'skills', 'builder', 'templates', 'editorial.css');
if (!fs.existsSync(cssPath)) {
  console.error(`FAIL: editorial.css not found at ${cssPath}`);
  process.exit(1);
}

const content = fs.readFileSync(cssPath, 'utf8');

const requiredTokens = [
  '--canvas-bg: #F4F5F7',
  '--canvas-surface: #FFFFFF',
  '--charcoal-solid: #232220',
  '--brand-primary: #009BAD',
  '--brand-dark: #006D79',
  'Plus Jakarta Sans',
  'Inter'
];

for (const token of requiredTokens) {
  if (!content.includes(token)) {
    console.error(`FAIL: missing token or font: ${token}`);
    process.exit(1);
  }
}

const requiredArchetypes = [
  '.archetype-hero-cover',
  '.archetype-narrative-split',
  '.archetype-mission-pillars',
  '.archetype-workflow-3col',
  '.archetype-features-staggered',
  '.archetype-persona-cards',
  '.archetype-services-grid',
  '.archetype-portfolio-gallery',
  '.archetype-metrics-contact',
  '.archetype-closing-cta',
  '.phone-frame-editorial'
];

for (const arch of requiredArchetypes) {
  if (!content.includes(arch)) {
    console.error(`FAIL: missing archetype class: ${arch}`);
    process.exit(1);
  }
}

console.log('PASS: editorial.css contains all required design tokens and 10 archetype classes');
process.exit(0);
