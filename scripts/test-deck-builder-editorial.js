const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const testOutput = path.join(__dirname, '..', 'compros', 'test-editorial');
if (fs.existsSync(testOutput)) {
  fs.rmSync(testOutput, { recursive: true, force: true });
}

console.log('[TEST] Running build-deck with --theme=editorial...');
execSync(`node scripts/build-deck.js --theme=editorial --name=test-editorial`, {
  cwd: path.join(__dirname, '..'),
  encoding: 'utf8'
});

const generatedHtml = path.join(testOutput, 'index.html');
if (!fs.existsSync(generatedHtml)) {
  console.error('FAIL: index.html not generated in compros/test-editorial');
  process.exit(1);
}

const html = fs.readFileSync(generatedHtml, 'utf8');

if (!html.includes('archetype-hero-cover') && !html.includes('hero-floating-card')) {
  console.error('FAIL: generated HTML does not contain editorial archetype classes');
  process.exit(1);
}

if (!html.includes('--canvas-bg: #F4F5F7') || !html.includes('--brand-primary: #009BAD')) {
  console.error('FAIL: inlined CSS does not have editorial tokens');
  process.exit(1);
}

console.log('PASS: build-deck successfully generates editorial theme with archetype classes');
process.exit(0);
