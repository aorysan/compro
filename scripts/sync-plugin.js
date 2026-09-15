const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const WORKSPACE_ROOT = process.env.COMPRO_PROJECT_ROOT
  ? path.resolve(process.env.COMPRO_PROJECT_ROOT)
  : path.resolve(ROOT, '../../..');
const MARKETPLACE_DIR = path.resolve(WORKSPACE_ROOT, '.claude', 'marketplace', 'compro');

function resolveSyncTargets() {
  let version = '2.5.0';
  const pkgPath = path.join(MARKETPLACE_DIR, 'plugin.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      if (pkg.version) version = pkg.version;
    } catch (e) {
      console.warn(`[WARN] Could not parse ${pkgPath}, fallback version ${version}`);
    }
  }

  const cacheDir = path.join(os.homedir(), '.claude', 'plugins', 'cache', 'aorysan-marketplace', 'compro', version);
  return {
    version,
    marketplaceDir: MARKETPLACE_DIR,
    cacheDir
  };
}

function getFilesToSync() {
  return [
    { src: path.join(ROOT, 'scripts', 'build-deck.js'), subpath: 'skills/builder/scripts/build-deck.js' },
    { src: path.join(ROOT, 'scripts', 'image-fetcher.js'), subpath: 'skills/builder/scripts/image-fetcher.js' },
    { src: path.join(ROOT, 'scripts', 'asset-generator.js'), subpath: 'skills/builder/scripts/asset-generator.js' },
    { src: path.join(ROOT, 'templates', 'editorial.css'), subpath: 'skills/builder/templates/editorial.css' },
    { src: path.join(ROOT, 'templates', 'editorial-shell.html'), subpath: 'skills/builder/templates/editorial-shell.html' }
  ];
}

function syncTarget(targetBase, label) {
  if (!fs.existsSync(targetBase)) {
    fs.mkdirSync(targetBase, { recursive: true });
  }
  console.log(`[SYNC] Syncing to ${label} (${targetBase})...`);
  const files = getFilesToSync();
  for (const item of files) {
    if (!fs.existsSync(item.src)) {
      console.warn(`  [SKIP] Source not found: ${item.src}`);
      continue;
    }
    const dest = path.join(targetBase, item.subpath);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(item.src, dest);
    console.log(`  -> Copied ${path.basename(item.src)} (${fs.statSync(dest).size} bytes)`);
  }

  // Ensure fallback assets directory is prepared or copied when present
  const fallbackSrcDir = path.join(ROOT, 'templates', 'assets', 'fallback');
  const fallbackDestDir = path.join(targetBase, 'skills', 'builder', 'templates', 'assets', 'fallback');
  if (fs.existsSync(fallbackSrcDir)) {
    fs.mkdirSync(fallbackDestDir, { recursive: true });
    const fallbackFiles = fs.readdirSync(fallbackSrcDir);
    for (const f of fallbackFiles) {
      const srcFile = path.join(fallbackSrcDir, f);
      const destFile = path.join(fallbackDestDir, f);
      if (fs.statSync(srcFile).isFile()) {
        fs.copyFileSync(srcFile, destFile);
        console.log(`  -> Copied fallback asset ${f} (${fs.statSync(destFile).size} bytes)`);
      }
    }
  } else {
    fs.mkdirSync(fallbackDestDir, { recursive: true });
  }

  return true;
}

function runSync() {
  const { version, marketplaceDir, cacheDir } = resolveSyncTargets();
  console.log(`[INFO] Synchronizing Compro Plugin v${version}...`);
  syncTarget(marketplaceDir, 'Marketplace Submodule');
  syncTarget(cacheDir, 'Global Claude Cache');
  console.log('[SUCCESS] Plugin files synchronized successfully!');
}

if (require.main === module) {
  runSync();
}

module.exports = {
  resolveSyncTargets,
  getFilesToSync,
  syncTarget,
  runSync
};
