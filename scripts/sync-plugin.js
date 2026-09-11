const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const LOCAL_PLUGIN = path.join(ROOT, '.claude', 'plugins', 'compro');
const CACHE_PLUGIN = path.join(os.homedir(), '.claude', 'plugins', 'cache', 'aorysan-marketplace', 'compro', '2.3.0');

const filesToSync = [
  { src: path.join(ROOT, 'scripts', 'build-deck.js'), subpath: 'skills/builder/scripts/build-deck.js' },
  { src: path.join(ROOT, 'scripts', 'asset-generator.js'), subpath: 'skills/builder/scripts/asset-generator.js' },
  { src: path.join(ROOT, 'templates', 'editorial.css'), subpath: 'skills/builder/templates/editorial.css' },
  { src: path.join(ROOT, 'templates', 'editorial-shell.html'), subpath: 'skills/builder/templates/editorial-shell.html' }
];

function syncTarget(targetBase, label) {
  if (!fs.existsSync(targetBase)) {
    console.warn(`[WARN] Target does not exist: ${targetBase}`);
    return false;
  }
  console.log(`[SYNC] Syncing to ${label} (${targetBase})...`);
  for (const item of filesToSync) {
    const dest = path.join(targetBase, item.subpath);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(item.src, dest);
    console.log(`  -> Copied ${path.basename(item.src)} (${fs.statSync(dest).size} bytes)`);
  }
  return true;
}

syncTarget(LOCAL_PLUGIN, 'Local Plugin Repo');
syncTarget(CACHE_PLUGIN, 'Global Claude Cache');
console.log('[SUCCESS] Plugin files synchronized successfully!');
