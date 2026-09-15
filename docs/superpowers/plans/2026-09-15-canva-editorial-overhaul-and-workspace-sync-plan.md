# Canva Editorial 1:1 Overhaul, Hybrid Asset Pipeline, & Workspace Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the `compro` plugin (v2.5.0) with an Unsplash Direct CDN hybrid asset pipeline, dynamic Git Worktree and zero-loss workspace synchronization, advanced markdown content sanitization, and 8 distinct Canva Salford & Co. 1:1 layout archetypes on a 1920x1080 canvas with zero vertical void.

**Architecture:** Build a standalone `scripts/image-fetcher.js` using curated direct CDN Unsplash photo endpoints with cascading fallbacks (Picsum and local SVG). Refactor `scripts/build-deck.js` to dynamically detect workspace roots across Git Worktrees without hardcoded paths, sanitize contact placeholders and big number metrics, and render 8 distinct Canva layout archetypes into `templates/editorial.css`. Eliminate recursive deadcode folders and update `scripts/sync-plugin.js` with dynamic versioning to synchronize to `.claude/marketplace/compro/` and `~/.claude/plugins/cache/aorysan-marketplace/compro/2.5.0/`.

**Tech Stack:** Node.js (v18+ native https, fs, path), Reveal.js 4.6.1, Modern CSS (Grid 1080p, Flexbox, Custom Variables), SVG Vector Assets, Plus Jakarta Sans & Inter typography.

**Spec:** [.claude/plugins/compro/docs/superpowers/specs/2026-09-15-canva-editorial-overhaul-and-workspace-sync-design.md](file:///home/aorysan/aorysan/AryokPunya/Magang/compro/.claude/plugins/compro/docs/superpowers/specs/2026-09-15-canva-editorial-overhaul-and-workspace-sync-design.md)

## Global Constraints

- Design Tokens: Canvas `#F4F5F7`, Surface cards `#FFFFFF`, Charcoal container/buttons `#232220`, Brand primary `#009BAD` (Venturo Teal), Accent text AA `#007A87`.
- Target Canvas: 1920x1080 (16:9 1080p). Slide containers must enforce full height (`height: 1080px !important; display: flex/grid; align-items: stretch;`) with 0% vertical blank void.
- Zero Hardcoded Paths: No `/home/aorysan/...` strings in runtime scripts; all paths resolved via `--root`, `COMPRO_PROJECT_ROOT`, or Git Worktree inspection.
- Zero API Key Barrier: Image downloader must run zero-config using curated high-res Unsplash direct CDN links (`images.unsplash.com`) with cascading fallbacks.
- Version Flooring: Plugin bumped to `2.5.0` across `plugin.json`, `plugins.json`, and runtime cache.

---

### Task 1: Eliminate Recursive Deadcode & Upgrade `sync-plugin.js` with Dynamic Versioning

**Files:**
- Create: `.claude/plugins/compro/scripts/test-sync-plugin.js`
- Modify: `.claude/plugins/compro/scripts/sync-plugin.js`
- Modify: `.claude/marketplace/compro/plugin.json`
- Modify: `.claude/marketplace/plugins.json`

**Interfaces:**
- Consumes: `.claude/plugins/compro/` source files.
- Produces: Cleaned repo tree (no `.claude/plugins/compro/.claude/`), updated `v2.5.0` manifest in marketplace, and `syncTarget()` copying to marketplace and `~/.claude/plugins/cache/aorysan-marketplace/compro/2.5.0/`.

- [ ] **Step 1: Remove recursive duplicate folder**

Execute recursive deletion of deadcode directory:
```bash
rm -rf /home/aorysan/aorysan/AryokPunya/Magang/compro/.claude/plugins/compro/.claude
```

- [ ] **Step 2: Bump version to 2.5.0 in marketplace manifests**

Update `.claude/marketplace/compro/plugin.json`:
```json
{
  "name": "compro",
  "description": "Layer 3 Company Profile Multi-Agent Plugin with Canva Editorial Slide Deck Generator & Vercel Deployment",
  "version": "2.5.0",
  "author": {
    "name": "Aryo Adi Putro"
  },
  "license": "MIT"
}
```

Update `.claude/marketplace/plugins.json` entry for `compro`:
```json
    {
        "name":  "compro",
        "path":  "compro",
        "version":  "2.5.0",
        "description":  "Layer 3 Company Profile Multi-Agent Plugin with Canva Editorial Slide Deck Generator & Vercel Deployment",
        "category":  "content-generation"
    }
```

- [ ] **Step 3: Write failing unit test for `sync-plugin.js`**

Create `.claude/plugins/compro/scripts/test-sync-plugin.js`:
```javascript
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');

const syncPlugin = require('./sync-plugin.js');

// Test 1: Resolve targets
const targets = syncPlugin.resolveSyncTargets();
assert.ok(targets.marketplaceDir, 'Marketplace directory resolved');
assert.ok(targets.cacheDir, 'Cache directory resolved');
assert.ok(targets.version === '2.5.0', `Version should be 2.5.0, got ${targets.version}`);

// Test 2: Files to sync includes core builder scripts and templates
const files = syncPlugin.getFilesToSync();
const filenames = files.map(f => path.basename(f.src));
assert.ok(filenames.includes('build-deck.js'), 'Sync includes build-deck.js');
assert.ok(filenames.includes('editorial.css'), 'Sync includes editorial.css');

console.log('PASS: sync-plugin tests passed');
```

- [ ] **Step 4: Refactor `scripts/sync-plugin.js` to implement dynamic versioning and multi-destination sync**

Update `.claude/plugins/compro/scripts/sync-plugin.js`:
```javascript
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const WORKSPACE_ROOT = path.resolve(ROOT, '../../..');
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
```

- [ ] **Step 5: Run unit test and verify sync execution**

Run:
```bash
node /home/aorysan/aorysan/AryokPunya/Magang/compro/.claude/plugins/compro/scripts/test-sync-plugin.js
node /home/aorysan/aorysan/AryokPunya/Magang/compro/.claude/plugins/compro/scripts/sync-plugin.js
```
Expected: `PASS: sync-plugin tests passed`, followed by successful sync reporting byte copies to marketplace and cache `2.5.0`.

- [ ] **Step 6: Commit Task 1 changes**

```bash
git add .claude/marketplace/plugin.json .claude/marketplace/plugins.json .claude/plugins/compro/scripts/sync-plugin.js .claude/plugins/compro/scripts/test-sync-plugin.js
git commit -m "fix(sync): eliminate recursive deadcode and upgrade sync-plugin with dynamic v2.5.0 targeting"
```

---

### Task 2: Create Hybrid Asset Downloader Pipeline & Local Fallback SVGs (`scripts/image-fetcher.js`)

**Files:**
- Create: `.claude/plugins/compro/scripts/image-fetcher.js`
- Create: `.claude/plugins/compro/templates/assets/fallback/hero-fallback.svg`
- Create: `.claude/plugins/compro/templates/assets/fallback/problem-fallback.svg`
- Create: `.claude/plugins/compro/templates/assets/fallback/solution-fallback.svg`
- Create: `.claude/plugins/compro/templates/assets/fallback/services-fallback.svg`
- Create: `.claude/plugins/compro/templates/assets/fallback/metrics-fallback.svg`
- Create: `.claude/plugins/compro/templates/assets/fallback/closing-fallback.svg`
- Create: `.claude/plugins/compro/scripts/test-image-fetcher.js`

**Interfaces:**
- Consumes: Slide markdown comment `<!-- image: <slot> -- <prompt> -->`, slide index, and target destination directory.
- Produces: Downloaded or fallback image saved to `compros/<slug>/assets/slide-<n>-<slot>.jpg` (or `.svg`), returning relative asset path `assets/slide-<n>-<slot>.jpg`.

- [ ] **Step 1: Create local architectural SVG fallback templates**

Create `.claude/plugins/compro/templates/assets/fallback/hero-fallback.svg`:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="800" height="1200">
  <defs>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1A202C"/>
      <stop offset="100%" stop-color="#2D3748"/>
    </linearGradient>
    <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#009BAD" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#004D56" stop-opacity="0.9"/>
    </linearGradient>
  </defs>
  <rect width="800" height="1200" fill="url(#skyGrad)"/>
  <polygon points="100,1200 100,300 450,150 450,1200" fill="url(#glassGrad)"/>
  <polygon points="450,150 720,280 720,1200 450,1200" fill="#006D79"/>
  <!-- Glass Grid lines -->
  <line x1="100" y1="400" x2="450" y2="250" stroke="#E2E8F0" stroke-width="1.5" opacity="0.3"/>
  <line x1="100" y1="550" x2="450" y2="400" stroke="#E2E8F0" stroke-width="1.5" opacity="0.3"/>
  <line x1="100" y1="700" x2="450" y2="550" stroke="#E2E8F0" stroke-width="1.5" opacity="0.3"/>
  <line x1="100" y1="850" x2="450" y2="700" stroke="#E2E8F0" stroke-width="1.5" opacity="0.3"/>
  <text x="400" y="1120" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="700" fill="#E2E8F0" letter-spacing="4">VENTURO ARCHITECTURE</text>
</svg>
```

Create fallback SVG copies for problem, solution, services, metrics, and closing:
- `problem-fallback.svg`: Architectural geometry with muted contrast and diagonal lines.
- `solution-fallback.svg`: Geometric creative team meeting abstract shapes with Teal accent.
- `services-fallback.svg`: Modern tech workspace geometric visual with grid lines.
- `metrics-fallback.svg`: Modern corporate skyscraper grid visual.
- `closing-fallback.svg`: Split architecture and team composition.

- [ ] **Step 2: Write failing unit test for `image-fetcher.js`**

Create `.claude/plugins/compro/scripts/test-image-fetcher.js`:
```javascript
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const imageFetcher = require('./image-fetcher.js');

async function runTests() {
  const tmpDir = path.join(__dirname, '..', 'scratch', 'test-assets');
  fs.mkdirSync(tmpDir, { recursive: true });

  // Test 1: Markdown Comment Slot Mapping
  const slotInfo = imageFetcher.mapCommentToSlot('<!-- image: hero -- sudut pandang kantor kreatif modern -->');
  assert.strictEqual(slotInfo.slot, 'hero');
  assert.strictEqual(slotInfo.category, 'architecture-portrait');
  assert.strictEqual(slotInfo.orientation, 'portrait');

  // Test 2: Fallback trigger when given invalid URL / offline mode
  const testDest = path.join(tmpDir, 'test-fallback.jpg');
  if (fs.existsSync(testDest)) fs.unlinkSync(testDest);
  
  await imageFetcher.fetchImageWithFallback({
    category: 'non-existent-category',
    destPath: testDest,
    slot: 'hero',
    forceFallback: true
  });
  assert.ok(fs.existsSync(testDest), 'Fallback image must exist on destination');
  assert.ok(fs.statSync(testDest).size > 100, 'Image size should be > 100 bytes');

  // Test 3: Idempotency check (existing file skipped)
  const statsBefore = fs.statSync(testDest).mtimeMs;
  await imageFetcher.fetchImageWithFallback({
    category: 'architecture-portrait',
    destPath: testDest,
    slot: 'hero'
  });
  const statsAfter = fs.statSync(testDest).mtimeMs;
  assert.strictEqual(statsBefore, statsAfter, 'Existing valid file must not be redownloaded');

  console.log('PASS: image-fetcher tests passed');
}

runTests().catch(err => {
  console.error('FAIL:', err);
  process.exit(1);
});
```

- [ ] **Step 3: Implement `scripts/image-fetcher.js`**

Create `.claude/plugins/compro/scripts/image-fetcher.js`:
```javascript
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const CURATED_IMAGE_CATALOG = {
  'architecture-portrait': [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&h=1200&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&h=1200&q=80'
  ],
  'architecture-modern': [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&h=900&q=80',
    'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1600&h=900&q=80'
  ],
  'creative-meeting': [
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&h=1200&q=80',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&h=1200&q=80'
  ],
  'tech-workspace': [
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&h=1200&q=80',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&h=1200&q=80'
  ],
  'corporate-team': [
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&h=900&q=80',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&h=1200&q=80'
  ]
};

const SLOT_MAP = {
  'hero': { category: 'architecture-portrait', orientation: 'portrait', fallback: 'hero-fallback.svg' },
  'problem': { category: 'architecture-portrait', orientation: 'portrait', fallback: 'problem-fallback.svg' },
  'solution': { category: 'creative-meeting', orientation: 'portrait', fallback: 'solution-fallback.svg' },
  'features': { category: 'tech-workspace', orientation: 'portrait', fallback: 'services-fallback.svg' },
  'services': { category: 'tech-workspace', orientation: 'portrait', fallback: 'services-fallback.svg' },
  'ecosystem': { category: 'tech-workspace', orientation: 'landscape', fallback: 'services-fallback.svg' },
  'traction': { category: 'architecture-portrait', orientation: 'portrait', fallback: 'metrics-fallback.svg' },
  'metrics': { category: 'architecture-portrait', orientation: 'portrait', fallback: 'metrics-fallback.svg' },
  'closing': { category: 'corporate-team', orientation: 'portrait', fallback: 'closing-fallback.svg' }
};

function mapCommentToSlot(commentStr) {
  if (!commentStr) return { slot: 'hero', ...SLOT_MAP['hero'] };
  const match = commentStr.match(/<!--\s*image:\s*([a-zA-Z0-9_-]+)/i);
  const slot = match ? match[1].toLowerCase() : 'hero';
  const mapped = SLOT_MAP[slot] || SLOT_MAP['hero'];
  return { slot, ...mapped };
}

function downloadFile(url, destPath, timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { timeout: timeoutMs }, response => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location, destPath, timeoutMs).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(destPath, () => {});
        return reject(new Error(`HTTP Status ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(destPath));
      });
    });

    req.on('timeout', () => {
      req.destroy();
      file.close();
      fs.unlink(destPath, () => {});
      reject(new Error('Request timeout'));
    });

    req.on('error', err => {
      file.close();
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function fetchImageWithFallback(options = {}) {
  const { category, destPath, slot = 'hero', forceFallback = false } = options;
  fs.mkdirSync(path.dirname(destPath), { recursive: true });

  // Idempotency: skip if already valid (> 10 KB or valid SVG)
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1024) {
    return destPath;
  }

  const fallbackFile = (SLOT_MAP[slot] && SLOT_MAP[slot].fallback) || 'hero-fallback.svg';
  const localFallbackPath = path.join(__dirname, '..', 'templates', 'assets', 'fallback', fallbackFile);

  if (forceFallback) {
    if (fs.existsSync(localFallbackPath)) {
      fs.copyFileSync(localFallbackPath, destPath);
      return destPath;
    }
  }

  const urls = CURATED_IMAGE_CATALOG[category] || CURATED_IMAGE_CATALOG['architecture-portrait'];
  const targetUrl = urls[0];

  try {
    await downloadFile(targetUrl, destPath, 5000);
    return destPath;
  } catch (err) {
    console.warn(`[WARN] Primary CDN download failed for ${slot}: ${err.message}. Trying Picsum fallback...`);
    try {
      const picsumUrl = (SLOT_MAP[slot] && SLOT_MAP[slot].orientation === 'landscape')
        ? 'https://picsum.photos/1600/900'
        : 'https://picsum.photos/800/1200';
      await downloadFile(picsumUrl, destPath, 4000);
      return destPath;
    } catch (picsumErr) {
      console.warn(`[WARN] Picsum fallback failed: ${picsumErr.message}. Applying local SVG fallback.`);
      if (fs.existsSync(localFallbackPath)) {
        fs.copyFileSync(localFallbackPath, destPath);
        return destPath;
      }
      throw new Error(`Failed all image fetch attempts for ${slot}`);
    }
  }
}

module.exports = {
  CURATED_IMAGE_CATALOG,
  SLOT_MAP,
  mapCommentToSlot,
  fetchImageWithFallback
};
```

- [ ] **Step 4: Run unit test and verify image fetcher**

Run:
```bash
node /home/aorysan/aorysan/AryokPunya/Magang/compro/.claude/plugins/compro/scripts/test-image-fetcher.js
```
Expected: `PASS: image-fetcher tests passed`.

- [ ] **Step 5: Commit Task 2 changes**

```bash
git add .claude/plugins/compro/scripts/image-fetcher.js .claude/plugins/compro/templates/assets/fallback/ .claude/plugins/compro/scripts/test-image-fetcher.js
git commit -m "feat(assets): add hybrid Unsplash direct CDN image fetcher and local SVG fallback pipeline"
```

---

### Task 3: Dynamic Workspace & Git Worktree Resolution in `scripts/build-deck.js`

**Files:**
- Create: `.claude/plugins/compro/scripts/test-workspace-resolver.js`
- Modify: `.claude/plugins/compro/scripts/build-deck.js:70-115, 1500-1590`

**Interfaces:**
- Consumes: CLI args (`--root=<path>`, `--name=<slug>`), `process.env.COMPRO_PROJECT_ROOT`, and file-system traversal.
- Produces: `detectProjectRoot()` returning guaranteed repository root path, and `postBuildSyncGuarantee()` verifying/copying artifacts from worktree to main workspace.

- [ ] **Step 1: Write failing unit test for dynamic workspace resolver**

Create `.claude/plugins/compro/scripts/test-workspace-resolver.js`:
```javascript
const assert = require('assert');
const path = require('path');
const fs = require('fs');

const buildDeck = require('./build-deck.js');

// Test 1: CLI flag override
const explicitRoot = '/tmp/explicit-test-root';
const resolvedExplicit = buildDeck.detectProjectRoot(['--root=' + explicitRoot]);
assert.strictEqual(resolvedExplicit, explicitRoot, 'CLI --root flag must take highest priority');

// Test 2: Environment variable override
process.env.COMPRO_PROJECT_ROOT = '/tmp/env-test-root';
const resolvedEnv = buildDeck.detectProjectRoot([]);
assert.strictEqual(resolvedEnv, '/tmp/env-test-root', 'COMPRO_PROJECT_ROOT env must take priority over cwd');
delete process.env.COMPRO_PROJECT_ROOT;

// Test 3: Normal workspace detection finds compros folder
const resolvedDefault = buildDeck.detectProjectRoot([]);
assert.ok(fs.existsSync(path.join(resolvedDefault, 'compros')), 'Default resolution must find directory with compros');

console.log('PASS: workspace-resolver tests passed');
```

- [ ] **Step 2: Implement dynamic root detection and workspace sync guarantee hook in `build-deck.js`**

In `.claude/plugins/compro/scripts/build-deck.js`, replace `findRoot()` and augment post-build copying:
```javascript
function detectProjectRoot(customArgs) {
  const argv = customArgs || process.argv.slice(2);
  for (const arg of argv) {
    if (arg.startsWith('--root=')) {
      return path.resolve(arg.split('=')[1]);
    }
  }

  if (process.env.COMPRO_PROJECT_ROOT) {
    return path.resolve(process.env.COMPRO_PROJECT_ROOT);
  }

  let cur = process.cwd();
  while (cur && cur !== path.dirname(cur)) {
    const gitPath = path.join(cur, '.git');
    if (fs.existsSync(gitPath)) {
      const stat = fs.statSync(gitPath);
      if (stat.isFile()) {
        try {
          const content = fs.readFileSync(gitPath, 'utf8');
          const match = content.match(/gitdir:\s*(.*)/);
          if (match) {
            const gitdir = match[1].trim();
            const candidate = path.resolve(cur, gitdir, '../../..');
            if (fs.existsSync(path.join(candidate, 'compros')) || fs.existsSync(path.join(candidate, '.gitmodules'))) {
              return candidate;
            }
          }
        } catch (e) {}
      }
      if (fs.existsSync(path.join(cur, 'compros')) || fs.existsSync(path.join(cur, 'input'))) {
        return cur;
      }
    }
    cur = path.dirname(cur);
  }
  return process.cwd();
}

function postBuildSyncGuarantee(outDir, resolvedRoot, slug) {
  const expectedDir = path.join(resolvedRoot, 'compros', slug);
  if (path.resolve(outDir) !== path.resolve(expectedDir)) {
    console.log(`[SYNC] Out directory (${outDir}) is in worktree. Mirroring to main workspace: ${expectedDir}...`);
    fs.mkdirSync(expectedDir, { recursive: true });
    copyRecursiveSync(outDir, expectedDir);
    console.log(`[SYNC-SUCCESS] Workspace guarantee mirrored ${slug} to ${expectedDir}`);
  }
}

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursiveSync(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}
```

Export `detectProjectRoot` and `postBuildSyncGuarantee` from `build-deck.js`.

- [ ] **Step 3: Run unit test and verify dynamic resolver**

Run:
```bash
node /home/aorysan/aorysan/AryokPunya/Magang/compro/.claude/plugins/compro/scripts/test-workspace-resolver.js
```
Expected: `PASS: workspace-resolver tests passed`.

- [ ] **Step 4: Commit Task 3 changes**

```bash
git add .claude/plugins/compro/scripts/build-deck.js .claude/plugins/compro/scripts/test-workspace-resolver.js
git commit -m "feat(resolver): implement dynamic git worktree detection and workspace sync guarantee"
```

---

### Task 4: Advanced Markdown Sanitizer, Contact Replacement, & Big Number Extraction

**Files:**
- Create: `.claude/plugins/compro/scripts/test-sanitizer.js`
- Modify: `.claude/plugins/compro/scripts/build-deck.js:15-65, 1000-1060`

**Interfaces:**
- Consumes: Raw company profile markdown draft.
- Produces: Cleaned slide objects with stripped `Meta Title:`, `Meta Description:`, `Tagline:`, replaced contact demo values (`+62 812-9000-8899`), and structured metric counter objects `{ number, label, desc }`.

- [ ] **Step 1: Write failing unit test for sanitizer and metric extraction**

Create `.claude/plugins/compro/scripts/test-sanitizer.js`:
```javascript
const assert = require('assert');
const buildDeck = require('./build-deck.js');

// Test 1: Strip Tagline prefix and frontmatter
const rawSlideText = `---
Meta Title: Venturo Pro
---
Tagline: Video ber-brand konsisten.

Deskripsi produk kami.`;

const cleaned = buildDeck.sanitizeSlideContent(rawSlideText);
assert.ok(!cleaned.includes('Tagline:'), 'Tagline: prefix must be stripped');
assert.ok(!cleaned.includes('Meta Title:'), 'Meta Title must be stripped');

// Test 2: Contact bracket sanitization
const rawContact = `- WhatsApp: [Nomor WhatsApp]
- Email: [Email Resmi]
- Kantor: [Alamat Kantor]`;
const sanitizedContact = buildDeck.sanitizeContactDetails(rawContact, 'venturo-pro');
assert.ok(!sanitizedContact.includes('[Nomor WhatsApp]'), 'Bracket WhatsApp replaced');
assert.ok(sanitizedContact.includes('+62 812-9000-8899'), 'Has formatted WhatsApp');
assert.ok(sanitizedContact.includes('contact@venturo.pro') || sanitizedContact.includes('halo@venturo-pro.id'), 'Has formatted email');

// Test 3: Big Number regex extraction
const metricItem = `- **LTV:CAC jauh di atas standar.** Dengan asumsi churn rendah, estimasi rasio LTV:CAC di atas 20:1 — lebih dari 6 kali.`;
const extractedMetric = buildDeck.extractBigNumberMetric(metricItem);
assert.strictEqual(extractedMetric.number, '20:1', 'Extracted 20:1 ratio');
assert.strictEqual(extractedMetric.title, 'LTV:CAC jauh di atas standar.', 'Extracted title');

console.log('PASS: sanitizer tests passed');
```

- [ ] **Step 2: Implement sanitizer, contact replacer, and metric extractor in `build-deck.js`**

In `.claude/plugins/compro/scripts/build-deck.js`:
```javascript
function sanitizeSlideContent(text) {
  if (!text) return '';
  let cleaned = text
    .replace(/^---[\s\S]*?---\s*/m, '')
    .replace(/^Meta Title:.*$/gim, '')
    .replace(/^Meta Description:.*$/gim, '')
    .replace(/^Tagline:\s*/gim, '')
    .trim();
  return cleaned;
}

function sanitizeContactDetails(text, brandSlug = 'venturo-pro') {
  if (!text) return '';
  return text
    .replace(/\[Nomor WhatsApp\]/gi, '+62 812-9000-8899')
    .replace(/\[Email Resmi\]/gi, `contact@${brandSlug.replace(/[^a-z0-9]/gi, '')}.pro`)
    .replace(/\[Alamat Kantor\]/gi, 'Jakarta Selatan, DKI Jakarta')
    .replace(/\[Tautan Pendaftaran\]/gi, `${brandSlug.replace(/[^a-z0-9]/gi, '')}.pro/register`);
}

function extractBigNumberMetric(bulletLine) {
  const boldMatch = bulletLine.match(/\*\*(.+?)\*\*/);
  const title = boldMatch ? boldMatch[1] : '';
  const cleanLine = bulletLine.replace(/^[-*]\s*/, '').replace(/\*\*.+?\*\*/, '').trim();

  // Metric regex: extracts ratio, percentage, currency, or version
  const numMatch = cleanLine.match(/\b(\d+(?::\d+)?%?|Rp[\d\.]+|v\d+\.\d+\.\d+|\d+:\d+)\b/);
  const number = numMatch ? numMatch[1] : '100%';
  const desc = cleanLine.replace(number, '').replace(/^[—–-]\s*/, '').trim();

  return {
    number,
    title: title ? `${title}.` : '',
    desc: desc || cleanLine
  };
}
```

- [ ] **Step 3: Run unit test and verify sanitizer**

Run:
```bash
node /home/aorysan/aorysan/AryokPunya/Magang/compro/.claude/plugins/compro/scripts/test-sanitizer.js
```
Expected: `PASS: sanitizer tests passed`.

- [ ] **Step 4: Commit Task 4 changes**

```bash
git add .claude/plugins/compro/scripts/build-deck.js .claude/plugins/compro/scripts/test-sanitizer.js
git commit -m "feat(sanitizer): implement clean metadata stripping, contact demo values, and big number extraction"
```

---

### Task 5: Implement 8 Canva Layout Archetypes & Full-Height 1080p CSS Rules

**Files:**
- Modify: `.claude/plugins/compro/templates/editorial.css`
- Modify: `.claude/plugins/compro/templates/editorial-shell.html`
- Modify: `.claude/plugins/compro/scripts/build-deck.js`
- Create: `.claude/plugins/compro/scripts/test-canva-archetypes.js`

**Interfaces:**
- Consumes: Parsed slide content, brand color variables, and `image-fetcher.js`.
- Produces: Reveal.js HTML slide sections using 8 distinct Canva layout archetypes with 1080p full height, zero vertical void, and zero overflow.

- [ ] **Step 1: Write failing unit test for 8 Canva archetypes**

Create `.claude/plugins/compro/scripts/test-canva-archetypes.js`:
```javascript
const assert = require('assert');
const buildDeck = require('./build-deck.js');

const brand = { name: 'Venturo Pro', primaryColor: '#009BAD', secondaryColor: '#38BDF8' };

// Test Archetype 6: Table Differentiator
const tableSlide = {
  title: 'Mengapa Kami',
  content: `| | **CapCut** | **Venturo Pro** |\n|---|---|---|\n| **Biaya** | Murah | Terprediksi |`
};
const tableHtml = buildDeck.renderCanvaDifferentiator(tableSlide, brand);
assert.ok(tableHtml.includes('archetype-canva-differentiator'), 'Has archetype-canva-differentiator class');
assert.ok(tableHtml.includes('<table'), 'Renders HTML table');

// Test Archetype 7: 3-Tier Pricing
const pricingSlide = {
  title: 'Paket & Kerjasama',
  content: `- **Lite (Rp0)**: 5 video\n- **Pro (Rp99.000)**: Unlimited\n- **Team (Rp299.000)**: 5 user`
};
const pricingHtml = buildDeck.renderCanvaPricing(pricingSlide, brand);
assert.ok(pricingHtml.includes('archetype-canva-pricing'), 'Has archetype-canva-pricing class');
assert.ok(pricingHtml.includes('pricing-card-elevated'), 'Has elevated Pro card');

// Test Archetype 8: Closing 3-Column
const closingSlide = {
  title: 'Hubungi Kami',
  content: `Saluran kontak:\n- WhatsApp: [Nomor WhatsApp]\n- Email: [Email Resmi]`
};
const closingHtml = buildDeck.renderCanvaClosing(closingSlide, brand);
assert.ok(closingHtml.includes('archetype-canva-closing'), 'Has archetype-canva-closing class');
assert.ok(closingHtml.includes('+62 812-9000-8899'), 'Has replaced WhatsApp');

console.log('PASS: canva-archetypes tests passed');
```

- [ ] **Step 2: Update `templates/editorial.css` with 1080p flex/grid rules and 8 archetypes**

In `.claude/plugins/compro/templates/editorial.css`:
- Enforce full height and zero void:
```css
.reveal .slides section {
  box-sizing: border-box;
  padding: 0;
  height: 1080px !important;
  max-height: 1080px;
  overflow: hidden;
  background: var(--canvas-bg);
}

.editorial-slide-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 36px 48px;
  box-sizing: border-box;
}

.editorial-image-frame {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 580px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--surface-shadow);
}

.editorial-image-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
```
- Add styles for `.archetype-canva-cover`, `.archetype-canva-welcome`, `.archetype-canva-services`, `.archetype-canva-ecosystem`, `.archetype-canva-metrics`, `.archetype-canva-differentiator`, `.archetype-canva-pricing`, and `.archetype-canva-closing`.

- [ ] **Step 3: Implement 8 archetypes in `scripts/build-deck.js` and connect `image-fetcher.js`**

In `.claude/plugins/compro/scripts/build-deck.js`:
- Import `imageFetcher = require('./image-fetcher');`
- Wire slide image downloads inside `build-deck.js` build lifecycle:
```javascript
for (let i = 0; i < slides.length; i++) {
  const s = slides[i];
  const slotInfo = imageFetcher.mapCommentToSlot(s.content);
  const destPath = path.join(ASSETS_DIR, `slide-${i + 1}-${slotInfo.slot}.jpg`);
  await imageFetcher.fetchImageWithFallback({
    category: slotInfo.category,
    destPath,
    slot: slotInfo.slot
  });
}
```
- Implement `renderCanvaCover`, `renderCanvaWelcome`, `renderCanvaServices`, `renderCanvaEcosystem`, `renderCanvaMetrics`, `renderCanvaDifferentiator`, `renderCanvaPricing`, and `renderCanvaClosing`.

- [ ] **Step 4: Run unit test and verify archetypes output**

Run:
```bash
node /home/aorysan/aorysan/AryokPunya/Magang/compro/.claude/plugins/compro/scripts/test-canva-archetypes.js
```
Expected: `PASS: canva-archetypes tests passed`.

- [ ] **Step 5: Commit Task 5 changes**

```bash
git add .claude/plugins/compro/templates/editorial.css .claude/plugins/compro/scripts/build-deck.js .claude/plugins/compro/scripts/test-canva-archetypes.js
git commit -m "feat(archetypes): implement 8 distinct Canva layout archetypes and 1080p full-height CSS rules"
```

---

### Task 6: Synchronize Plugin Code to Marketplace Submodule & Claude Cache

**Files:**
- Modify: `.claude/marketplace/compro/skills/builder/SKILL.md`
- Modify: `.claude/marketplace/compro/skills/compro/SKILL.md`
- Run: `.claude/plugins/compro/scripts/sync-plugin.js`

**Interfaces:**
- Consumes: Refactored files in `.claude/plugins/compro/`.
- Produces: Updated documentation in marketplace and mirrored files in `~/.claude/plugins/cache/aorysan-marketplace/compro/2.5.0/`.

- [ ] **Step 1: Update `SKILL.md` in marketplace**

Update `.claude/marketplace/compro/skills/builder/SKILL.md` and `.claude/marketplace/compro/skills/compro/SKILL.md` documenting v2.5.0 default theme (`editorial`), Canva 1:1 archetypes, Unsplash direct CDN fetching, and workspace sync guarantee.

- [ ] **Step 2: Execute `sync-plugin.js`**

Run:
```bash
node /home/aorysan/aorysan/AryokPunya/Magang/compro/.claude/plugins/compro/scripts/sync-plugin.js
```
Verify terminal output confirms byte replication to marketplace and `~/.claude/plugins/cache/aorysan-marketplace/compro/2.5.0/`.

- [ ] **Step 3: Commit Task 6 changes**

```bash
git add .claude/marketplace/compro/skills/builder/SKILL.md .claude/marketplace/compro/skills/compro/SKILL.md
git commit -m "docs(skills): update builder and compro skill protocols for v2.5.0 Canva Editorial default"
```

---

### Task 7: End-to-End Build & Visual Verification on `congen5`

**Files:**
- Run: `scripts/build-deck.js` on `congen5`
- Test: `.claude/plugins/compro/scripts/verify-congen.js`

**Interfaces:**
- Consumes: `compros/congen4/compro.md` (or existing draft).
- Produces: Output deck at `/home/aorysan/aorysan/AryokPunya/Magang/compro/compros/congen5/index.html` with high-res photos and zero-void 1080p layouts.

- [ ] **Step 1: Execute End-to-End deck build**

Run:
```bash
node /home/aorysan/aorysan/AryokPunya/Magang/compro/.claude/plugins/compro/scripts/build-deck.js --name=congen5 --theme=editorial
```
Expected: Build completes, downloads photos to `compros/congen5/assets/slide-*.jpg`, generates `index.html`, and verifies presence in the user workspace.

- [ ] **Step 2: Run verification script**

Run:
```bash
node /home/aorysan/aorysan/AryokPunya/Magang/compro/.claude/plugins/compro/scripts/verify-congen.js congen5
```
Expected: All 9 slides verified:
1. Cover: `slide-1-hero.jpg` loaded, no overflow.
2. Welcome: Numbered badges `01`, `02`, `03` with vertical photo.
3. Services: 2x2 grid filling slide height (0% vertical void).
4. Ecosystem: Clean SVG orbit diagram + tech workspace photo.
5. Metrics: Big numbers (`44px`, `#007A87`) for `20:1`, `90%`, `Rp10.000`.
6. Comparison: Clean editorial table with Venturo Pro column highlighted.
7. Pricing: 3 cards with elevated Pro tier and Best Seller badge.
8. Closing: 3-column composition without raw `[...]` placeholders.

- [ ] **Step 3: Final commit**

```bash
git add compros/congen5/
git commit -m "test(congen5): generate end-to-end Canva Editorial slide deck with verified assets and zero void"
```
