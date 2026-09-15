# Canva Editorial Slide Deck Overhaul & Plugin Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the Canva Editorial slide generation engine (`editorial` theme) to produce clean, light-mode corporate slide decks matching the 10-slide Canva Salford & Co. reference with procedural inline SVG assets and zero empty slides, and automate synchronization to the Claude Code plugin cache.

**Architecture:** Fix the frontmatter stripper and markdown card parser in `scripts/build-deck.js` to reliably chunk any markdown content. Implement 8 dedicated layout archetypes in `templates/editorial.css` and `scripts/build-deck.js` with procedural SVG visual slots (smartphone mockup, orbit ecosystem, warning/success status icons, numbered badges). Build `scripts/sync-plugin.js` to sync templates and scripts into `.claude/plugins/compro/` and `~/.claude/plugins/cache/aorysan-marketplace/compro/2.3.0/`. Rebuild and visually verify `congen4`.

**Tech Stack:** Node.js, Reveal.js 4.6.1, Vanilla CSS (CSS Grid, Flexbox, custom variables), SVG Vector procedural generation, Plus Jakarta Sans & Inter typography.

**Spec:** [docs/superpowers/specs/2026-09-11-canva-editorial-fix-design.md](file:///home/aorysan/aorysan/AryokPunya/Magang/compro/docs/superpowers/specs/2026-09-11-canva-editorial-fix-design.md)

## Global Constraints

- Design Tokens: Canvas `#F4F5F7`, Surface cards `#FFFFFF`, Charcoal container/buttons `#232220`, Brand primary `#009BAD` (Venturo Teal).
- Zero External Raster Images: All visual elements must be 100% self-contained procedural inline `<svg>` elements.
- Zero Empty Slides: Every slide section with markdown text must produce at least 1-4 structured visual cards.
- Zero Metadata Leaks: Frontmatter and lines like `Meta Title:` or `Meta Description:` must never appear as headings or card text.
- Synchronized Runtime: Root changes must sync to both `.claude/plugins/compro/` and `~/.claude/plugins/cache/aorysan-marketplace/compro/2.3.0/`.

---

### Task 1: Fix Frontmatter Sanitization & Robust Markdown Card Parser

**Files:**
- Create: `scripts/test-parser-fix.js`
- Modify: `scripts/build-deck.js:180-220, 970-1020`

**Interfaces:**
- Consumes: Raw markdown string from `compros/congen4/drafts/02-final.md`.
- Produces: Sanitized array of slide objects `{ title, content }` and `parseEditorialCards(lines)` returning non-empty `{ introText, cards: [{ badge, title, desc }] }`.

- [ ] **Step 1: Write failing test for parser sanitization and card extraction**

Create `scripts/test-parser-fix.js`:
```javascript
const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Load sample markdown with frontmatter & Meta Title
const sampleMd = `---
Meta Title: Venturo Pro — Video Ber-brand Konsisten
Meta Description: Platform produksi video
---

# Venturo Pro

Tagline: Video ber-brand yang konsisten.

Venturo Pro adalah platform produksi video ber-brand.

- ⚙️ Pipeline video berjalan di GPU lokal
- 🎨 Brand DNA menjaga warna dan font

---

# Masalah yang Dihadapi

Creator terjebak di antara dua pilihan yang merugikan.

- **Biaya produksi tinggi.** Jasa editor mahal per proyek.
- **Konsistensi brand sulit dijaga.** Video generik tidak selaras.
`;

const buildDeck = require('./build-deck.js');

// Test 1: Sanitize markdown
const sanitizedSlides = buildDeck.parseAndSanitizeMarkdown(sampleMd);
assert.strictEqual(sanitizedSlides.length, 2, 'Should extract exactly 2 slides');
assert.strictEqual(sanitizedSlides[0].title, 'Venturo Pro', 'Slide 1 title should not have Meta Title');
assert.ok(!sanitizedSlides[0].content.includes('Meta Title:'), 'Slide 1 content must not contain Meta Title:');

// Test 2: Card parsing
const problemCards = buildDeck.parseEditorialCards(sanitizedSlides[1].content);
assert.strictEqual(problemCards.cards.length, 2, 'Problem slide must have 2 cards');
assert.strictEqual(problemCards.cards[0].title, 'Biaya produksi tinggi.', 'Card 1 title extracted from bold');
assert.ok(problemCards.cards[0].desc.includes('Jasa editor mahal'), 'Card 1 desc extracted');

console.log('PASS: parseAndSanitizeMarkdown and parseEditorialCards tests passed');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/test-parser-fix.js`  
Expected: FAIL (functions not yet exported or defined).

- [ ] **Step 3: Implement sanitization and card parser in `scripts/build-deck.js`**

Modify `scripts/build-deck.js`:
1. Implement `parseAndSanitizeMarkdown(md)`:
```javascript
function parseAndSanitizeMarkdown(md) {
  let cleaned = md.replace(/^---[\s\S]*?---\s*/m, '');
  cleaned = cleaned.replace(/^Meta Title:.*$/gim, '').replace(/^Meta Description:.*$/gim, '');
  cleaned = cleaned.trim();
  const rawSlides = cleaned.split(/^# /m).map(s => s.trim()).filter(Boolean);
  return rawSlides.map(s => {
    const newline = s.indexOf('\n');
    const title = newline === -1 ? s.trim() : s.slice(0, newline).trim();
    const content = newline === -1 ? '' : s.slice(newline + 1).trim();
    return { title, content };
  });
}
```
2. Implement `parseEditorialCards(content)`:
```javascript
function parseEditorialCards(content) {
  const lines = content.replace(/<!--[\s\S]*?-->/g, '').split('\n').map(l => l.trim()).filter(Boolean);
  let introText = '';
  const cards = [];

  for (const line of lines) {
    const bulletMatch = line.match(/^[-*]\s+(.*)$/);
    if (bulletMatch) {
      const text = bulletMatch[1].trim();
      const boldMatch = text.match(/^\*\*([^*]+)\*\*\s*[:—–-]?\s*(.*)$/);
      if (boldMatch) {
        cards.push({
          title: boldMatch[1].trim(),
          desc: boldMatch[2].trim() || boldMatch[1].trim()
        });
      } else {
        const parts = text.split(/[—–:-]/);
        if (parts.length > 1) {
          cards.push({ title: parts[0].trim(), desc: parts.slice(1).join(' ').trim() });
        } else {
          cards.push({ title: text.slice(0, 40), desc: text });
        }
      }
    } else if (!introText && !line.startsWith('#') && !line.startsWith('Tagline:')) {
      introText = line;
    }
  }

  // Fallback: if no bullet cards found, treat non-empty paragraphs as cards
  if (cards.length === 0 && lines.length > 0) {
    const paragraphs = content.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    for (const p of paragraphs) {
      if (!p.startsWith('Tagline:') && p !== introText) {
        cards.push({ title: p.slice(0, 35) + '...', desc: p });
      }
    }
  }

  return { introText, cards };
}
```
3. Export `parseAndSanitizeMarkdown` and `parseEditorialCards` for testing (`if (typeof module !== 'undefined') module.exports = { ... };`).

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/test-parser-fix.js`  
Expected: PASS: parseAndSanitizeMarkdown and parseEditorialCards tests passed.

- [ ] **Step 5: Commit**

```bash
git add scripts/build-deck.js scripts/test-parser-fix.js
git commit -m "fix(builder): sanitize frontmatter and implement robust editorial card parser"
```

---

### Task 2: Implement Canva Layout Archetype Renderers in `scripts/build-deck.js`

**Files:**
- Create: `scripts/test-archetypes.js`
- Modify: `scripts/build-deck.js:930-1140`

**Interfaces:**
- Consumes: `parseEditorialCards` output and `brand` metadata.
- Produces: HTML string for each of the 8 Canva layout archetypes (`archetype-hero-cover`, `archetype-narrative-split`, `archetype-services-grid`, `archetype-ecosystem-orbit`, `archetype-metrics-contact`, `archetype-differentiator`, `archetype-pricing-cards`, `archetype-closing-cta`).

- [ ] **Step 1: Write test for archetype renderers**

Create `scripts/test-archetypes.js`:
```javascript
const assert = require('assert');
const buildDeck = require('./build-deck.js');

const brand = { name: 'Venturo Pro', primaryColor: '#009BAD', secondaryColor: '#38BDF8' };

// Test Narrative Split renderer
const problemSlide = {
  title: 'Masalah yang Dihadapi',
  content: 'Creator terjebak.\n\n- **Biaya tinggi**: Jasa mahal.\n- **Konsistensi sulit**: Video acak.'
};

const renderedProblem = buildDeck.renderEditorialNarrativeSplit(problemSlide, brand, 'problem');
assert.ok(renderedProblem.includes('archetype-narrative-split'), 'Has archetype-narrative-split class');
assert.ok(renderedProblem.includes('01'), 'Contains 01 number badge');
assert.ok(renderedProblem.includes('02'), 'Contains 02 number badge');
assert.ok(renderedProblem.includes('Biaya tinggi'), 'Contains card title');

console.log('PASS: Archetype renderer tests passed');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/test-archetypes.js`  
Expected: FAIL (`renderEditorialNarrativeSplit` is not a function).

- [ ] **Step 3: Implement renderers for the 8 Canva archetypes**

Implement in `scripts/build-deck.js`:
1. `renderEditorialHero(slide, brand)`: Top nav, floating white card, Titanium smartphone SVG.
2. `renderEditorialNarrativeSplit(slide, brand, type)`: Left column 35% with status SVG (warning shield or rocket) + Right column 65% with `01`, `02`, `03` cards.
3. `renderEditorialServicesGrid(slide, brand)`: 2x2 grid of white cards with 44x44px SVG icon containers.
4. `renderEditorialEcosystem(slide, brand)`: 50/50 split with circular orbit SVG diagram + feature list cards.
5. `renderEditorialMetrics(slide, brand)`: 3-4 metric cards with 40px Plus Jakarta Sans numbers.
6. `renderEditorialDifferentiator(slide, brand)`: Comparison cards (Cloud vs Venturo Pro).
7. `renderEditorialPricing(slide, brand)`: 3 tier pricing cards with Best Seller ribbon.
8. `renderEditorialClosing(slide, brand)`: Charcoal `#232220` full container with 4-column contacts.
9. Update `classifyEditorialArchetype` and main render loop to dispatch all 8 archetypes.

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/test-archetypes.js`  
Expected: PASS: Archetype renderer tests passed.

- [ ] **Step 5: Commit**

```bash
git add scripts/build-deck.js scripts/test-archetypes.js
git commit -m "feat(builder): implement 8 canva editorial layout archetypes with procedural svg slots"
```

---

### Task 3: Refine `templates/editorial.css` and `templates/editorial-shell.html`

**Files:**
- Modify: `templates/editorial.css`
- Modify: `templates/editorial-shell.html`

**Interfaces:**
- Consumes: Rendered HTML classes from Task 2.
- Produces: Polished 1920x1080 responsive stylesheet matching Canva Salford & Co. aesthetics.

- [ ] **Step 1: Update `templates/editorial.css` with layout classes**

Add / polish styles for:
- `.archetype-narrative-split`: 2-column flex/grid (35% / 65% gap 40px).
- `.editorial-num-badge`: Circular or pill badge (`font-size: 20px`, `font-weight: 800`, `color: var(--brand-primary)`).
- `.editorial-card-numbered`: Card with flex row containing number badge on left and title + desc on right.
- `.services-grid-2x2`: `display: grid; grid-template-columns: 1fr 1fr; gap: 24px;`.
- `.editorial-icon-box`: 44x44px rounded square with subtle brand tint background.
- `.ecosystem-split`: 50/50 split with SVG diagram scaling.
- `.closing-charcoal-container`: Background `#232220`, border-radius 16px, padding 48px, text white.
- `.contact-grid-4col`: `display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;`.

- [ ] **Step 2: Validate CSS syntax**

Run: `node -e "const fs = require('fs'); const css = fs.readFileSync('templates/editorial.css', 'utf8'); console.log('CSS Lines:', css.split('\n').length);"`  
Expected: Valid output without syntax errors.

- [ ] **Step 3: Commit**

```bash
git add templates/editorial.css templates/editorial-shell.html
git commit -m "style(builder): polish editorial css for 8 canva layout archetypes"
```

---

### Task 4: Create Plugin Synchronization Script (`scripts/sync-plugin.js`)

**Files:**
- Create: `scripts/sync-plugin.js`
- Modify: `.claude/plugins/compro/skills/builder/SKILL.md`

**Interfaces:**
- Consumes: Files from root repo `scripts/build-deck.js`, `scripts/asset-generator.js`, `templates/editorial.css`, `templates/editorial-shell.html`.
- Produces: Synchronized files in `.claude/plugins/compro/skills/builder/` and `~/.claude/plugins/cache/aorysan-marketplace/compro/2.3.0/skills/builder/`.

- [ ] **Step 1: Write `scripts/sync-plugin.js`**

Implement automated file copying and verification:
```javascript
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
```

- [ ] **Step 2: Run sync script and verify**

Run: `node scripts/sync-plugin.js`  
Expected: Copied files to both targets with matching file sizes.

- [ ] **Step 3: Update `SKILL.md` in plugin to set editorial as primary template**

Ensure `.claude/plugins/compro/skills/builder/SKILL.md` documents `editorial` as the primary theme and default template.

- [ ] **Step 4: Commit**

```bash
git add scripts/sync-plugin.js .claude/plugins/compro/skills/builder/SKILL.md
git commit -m "feat(sync): add automatic plugin cache synchronizer script"
```

---

### Task 5: End-to-End Build & Visual Verification of `congen4`

**Files:**
- Output: `compros/congen4/index.html`
- Output: `compros/congen4/reports/build.log`

**Interfaces:**
- Consumes: `compros/congen4/drafts/02-final.md`.
- Produces: Fully rendered Canva Editorial slide deck in `compros/congen4/index.html`.

- [ ] **Step 1: Execute build-deck for congen4 with editorial theme**

Run: `node scripts/build-deck.js --name=congen4 --theme=editorial`  
Expected: Exit code 0, 9 slides compiled, assets generated, reports consolidated.

- [ ] **Step 2: Run automated integrity check on `congen4/index.html`**

Write check script or inline check:
- Verify `#F4F5F7` is the background canvas.
- Verify `Meta Title:` is not present in slide 1 H1.
- Verify Slide 2 (Problem) contains `.archetype-narrative-split` and cards with `01`, `02`.
- Verify Slide 4 (Features) contains 4 service cards in 2x2 grid.
- Verify Slide 5 (Ecosystem) contains inline `<svg>` orbit diagram.
- Verify Slide 9 (Closing) contains charcoal container and structured contact info.
- Verify ZERO sections are empty.

- [ ] **Step 3: Run sync to update Claude Code cache**

Run: `node scripts/sync-plugin.js`

- [ ] **Step 4: Commit and finalize**

```bash
git add compros/congen4/
git commit -m "feat(congen4): regenerate slide deck with canva editorial theme"
```
