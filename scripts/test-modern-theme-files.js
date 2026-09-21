const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'skills', 'builder', 'templates', 'modern');
for (const f of ['theme.css', 'shell.html', 'manifest.json']) {
  if (!fs.existsSync(path.join(dir, f))) { console.error(`FAIL: modern/${f} missing`); process.exit(1); }
}
const shell = fs.readFileSync(path.join(dir, 'shell.html'), 'utf8');
for (const token of ['/* CSS_INLINE_PLACEHOLDER */', '<!-- SLIDES_INLINE_PLACEHOLDER -->', '{{META}}']) {
  if (!shell.includes(token)) { console.error(`FAIL: shell.html missing ${token}`); process.exit(1); }
}
const css = fs.readFileSync(path.join(dir, 'theme.css'), 'utf8');
for (const token of ['--canvas-bg: #FFFFFF', '.hero-layout-grid', '.narrative-grid', '.services-layout-grid', '.ecosystem-grid-split', '.metrics-layout-grid', '.pricing-cards-grid', '.closing-3col-grid', 'display: grid !important', '.reveal .slide-title']) {
  if (!css.includes(token)) { console.error(`FAIL: theme.css missing ${token}`); process.exit(1); }
}
const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
if (manifest.name !== 'modern' || manifest.renderer !== 'modern' || manifest.archetypes.length !== 12) {
  console.error('FAIL: modern manifest must declare 12 archetypes with renderer modern');
  process.exit(1);
}
console.log('PASS: modern theme files complete');
const cssLight = fs.readFileSync(path.join(__dirname, '..', 'skills', 'builder', 'templates', 'modern', 'theme.css'), 'utf8');
for (const t of ['--canvas-bg: #FFFFFF', '--text-headline: #0B3B82', '.feature-cards-grid', '.feature-split']) {
  if (!cssLight.includes(t)) { console.error(`FAIL: theme.css missing "${t}"`); process.exit(1); }
}
const manifestLight = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'skills', 'builder', 'templates', 'modern', 'manifest.json'), 'utf8'));
if (manifestLight.version !== '2.8.0' || !manifestLight.archetypes.includes('feature-cards') || !manifestLight.archetypes.includes('feature-split')) {
  console.error('FAIL: manifest must be 2.8.0 with feature-cards + feature-split'); process.exit(1);
}
console.log('PASS: light theme + manifest 2.8.0');
process.exit(0);
