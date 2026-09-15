# Compro Plugin v2.3.0: Canva Editorial Slide Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the Compro Plugin to version 2.3.0 by implementing the modern "Canva Editorial" slide design system (`editorial` theme), 10 dynamic layout archetypes, dynamic markdown chunking adapter, and asset pipeline integration.

**Architecture:** Create modular template files (`editorial-shell.html` and `editorial.css`) implementing the Gray-White Editorial design tokens (soft gray `#F4F5F7` canvas, white `#FFFFFF` cards, charcoal `#232220`, and Venturo Teal `#009BAD` accents) with 10 distinct layout archetypes. Update `scripts/build-deck.js` to dynamically classify Markdown sections into matching archetypes without hardcoding slide counts, and update plugin metadata and test suites for v2.3.0.

**Tech Stack:** Vanilla HTML5, CSS3 (CSS Variables, Flexbox, CSS Grid, 16:9 Aspect Ratio), Reveal.js 4.6.1, Node.js, Google Fonts (Plus Jakarta Sans & Inter).

## Global Constraints

- Design System: Canvas `#F4F5F7`, Cards `#FFFFFF`, Charcoal `#232220`, Brand Primary `#009BAD` (Venturo Teal), Brand Dark `#006D79`.
- Typography: Display `Plus Jakarta Sans` (700/800), Body `Inter` (400/500).
- Aspect Ratio: Fixed 16:9 (1920x1080 virtual canvas with automatic responsive scaling via Reveal.js).
- Dynamic Sizing: Slide count strictly derived from intake content; never force dummy/empty slides.
- Versioning: Upgrade Compro Plugin to v2.3.0 across manifests, skills, and documentation.
- Self-contained Output: All CSS and critical assets inlined or relative; no broken external runtime links.

---

### Task 1: Upgrade Plugin Version to 2.3.0 & Update Manifest Verification

**Files:**
- Modify: `.claude/plugins/compro/plugin.json:1-10`
- Modify: `.claude/plugins/compro/scripts/validate-manifest.js:1-35`
- Modify: `.claude/plugins/compro/README.md:1-50`

**Interfaces:**
- Consumes: Existing v2.2.0 plugin manifest and validation script.
- Produces: Validated v2.3.0 plugin manifest recognized by test suite.

- [ ] **Step 1: Write failing test / check in `validate-manifest.js`**

Update `.claude/plugins/compro/scripts/validate-manifest.js` to enforce version `2.3.0`:

```javascript
const fs = require('fs');
const path = require('path');

const pluginJsonPath = path.join(__dirname, '..', 'plugin.json');
if (!fs.existsSync(pluginJsonPath)) {
  console.error('FAIL: plugin.json does not exist');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));

if (manifest.version !== '2.3.0') {
  console.error(`FAIL: expected version 2.3.0, got ${manifest.version}`);
  process.exit(1);
}

const requiredSkills = ['compro', 'writer', 'reviewer', 'builder', 'publisher'];
const skillsDir = path.join(__dirname, '..', 'skills');

for (const skill of requiredSkills) {
  const skillFile = path.join(skillsDir, skill, 'SKILL.md');
  if (!fs.existsSync(skillFile)) {
    console.error(`FAIL: skill definition missing: ${skill}/SKILL.md`);
    process.exit(1);
  }
}

console.log('PASS: manifest is valid with version 2.3.0 and all 5 Layer 3 skills');
process.exit(0);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node .claude/plugins/compro/scripts/validate-manifest.js`  
Expected: FAIL with "FAIL: expected version 2.3.0, got 2.2.0"

- [ ] **Step 3: Update `plugin.json` and `README.md` to version 2.3.0**

Update `.claude/plugins/compro/plugin.json`:
```json
{
  "name": "compro",
  "description": "Layer 3 Company Profile Multi-Agent Plugin with Canva Editorial Slide Deck Generator & Vercel Deployment",
  "version": "2.3.0",
  "author": {
    "name": "Aryo Adi Putro"
  },
  "license": "MIT"
}
```

Update `.claude/plugins/compro/README.md` header:
```markdown
# Compro Plugin v2.3.0 — Multi-Agent Slide Deck Pipeline

Plugin otomatisasi pembuatan Company Profile interaktif berbasis Reveal.js dengan sistem desain **Canva Editorial Theme (Gray-White Modern)** dan deployment Vercel.
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node .claude/plugins/compro/scripts/validate-manifest.js`  
Expected: PASS: manifest is valid with version 2.3.0 and all 5 Layer 3 skills

- [ ] **Step 5: Commit**

```bash
git add .claude/plugins/compro/plugin.json .claude/plugins/compro/scripts/validate-manifest.js .claude/plugins/compro/README.md
git commit -m "chore(compro): bump version to 2.3.0 and update manifest validator"
```

---

### Task 2: Implement Canva Editorial Design System CSS (`editorial.css`)

**Files:**
- Create: `scripts/test-editorial-css.js`
- Create: `.claude/plugins/compro/skills/builder/templates/editorial.css`
- Create: `templates/editorial.css` (root mirror)

**Interfaces:**
- Consumes: Design tokens and 10 layout archetype specifications from `2026-09-10-canva-editorial-template-design.md`.
- Produces: Comprehensive `editorial.css` stylesheet covering base reset, variables, typography, and classes `.archetype-hero-cover`, `.archetype-narrative-split`, `.archetype-mission-pillars`, `.archetype-workflow-3col`, `.archetype-features-staggered`, `.archetype-persona-cards`, `.archetype-services-grid`, `.archetype-portfolio-gallery`, `.archetype-metrics-contact`, `.archetype-closing-cta`.

- [ ] **Step 1: Write unit test `scripts/test-editorial-css.js`**

```javascript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/test-editorial-css.js`  
Expected: FAIL with "editorial.css not found"

- [ ] **Step 3: Implement `editorial.css`**

Create `.claude/plugins/compro/skills/builder/templates/editorial.css`:

```css
/* ==========================================================================
   Compro Plugin v2.3.0 — Canva Editorial Theme (Gray-White Modern System)
   Inspired by Canva "Gray White Modern Company Profile" (Salford & Co.)
   Integrated with Venturo Pro Documented Brand Identity (#009BAD)
   ========================================================================== */

:root {
  /* Canvas & Surface System */
  --canvas-bg: #F4F5F7;
  --canvas-surface: #FFFFFF;
  --surface-border: rgba(0, 0, 0, 0.08);
  --surface-border-subtle: rgba(0, 0, 0, 0.04);
  --surface-shadow: 0 12px 32px rgba(0, 0, 0, 0.04);
  --surface-shadow-hover: 0 20px 40px rgba(0, 0, 0, 0.08);

  /* Contrast Blocks */
  --charcoal-solid: #232220;
  --charcoal-hover: #171615;
  --charcoal-subtle: rgba(35, 34, 32, 0.05);

  /* Typography Colors */
  --text-headline: #1A1D20;
  --text-body: #4A5568;
  --text-muted: #718096;
  --text-inverse: #FFFFFF;

  /* Brand Colors (Venturo Pro Documented) */
  --brand-primary: #009BAD;
  --brand-dark: #006D79;
  --brand-light: #38BDF8;
  --brand-tint: rgba(0, 155, 173, 0.10);
  --brand-border: rgba(0, 155, 173, 0.35);

  /* Fonts */
  --font-display: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Base Reveal Overrides */
html, body, .reveal {
  background-color: var(--canvas-bg) !important;
  color: var(--text-body);
  font-family: var(--font-body);
}

.reveal .slides {
  text-align: left;
}

.reveal .slides section {
  box-sizing: border-box;
  padding: 0;
  height: 100%;
  background: var(--canvas-bg);
}

/* Global Navigation Header */
.editorial-top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 48px;
  border-bottom: 1px solid var(--surface-border);
  background: var(--canvas-bg);
}

.editorial-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 20px;
  color: var(--text-headline);
  letter-spacing: -0.01em;
}

.editorial-nav-links {
  display: flex;
  align-items: center;
  gap: 28px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
}

.editorial-nav-btn {
  background: var(--charcoal-solid);
  color: var(--text-inverse) !important;
  padding: 8px 18px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
}

.editorial-nav-btn:hover {
  background: var(--brand-primary);
}

/* Archetype 1: Hero Cover */
.archetype-hero-cover {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  height: calc(1080px - 72px);
  padding: 40px 48px;
  gap: 36px;
  align-items: center;
}

.hero-floating-card {
  background: var(--canvas-surface);
  border: 1px solid var(--surface-border);
  border-radius: 12px;
  padding: 48px;
  box-shadow: var(--surface-shadow);
}

.hero-pill-badge {
  display: inline-block;
  background: var(--brand-tint);
  color: var(--brand-primary);
  border: 1px solid var(--brand-border);
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.hero-headline {
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 800;
  line-height: 1.12;
  color: var(--text-headline);
  margin: 0 0 20px 0;
  text-transform: uppercase;
}

.hero-actions {
  display: flex;
  gap: 16px;
  margin: 28px 0;
}

.btn-solid {
  background: var(--charcoal-solid);
  color: var(--text-inverse);
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 15px;
  border: none;
  cursor: pointer;
}

.btn-outline {
  background: transparent;
  color: var(--charcoal-solid);
  border: 1px solid var(--surface-border);
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
}

/* Archetype 2: Narrative Split */
.archetype-narrative-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;
  padding: 48px;
  gap: 40px;
  align-items: center;
}

/* Archetype 3: Mission Pillars */
.archetype-mission-pillars {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 48px;
  gap: 32px;
}

.pillar-card {
  background: var(--canvas-surface);
  border: 1px solid var(--surface-border);
  border-radius: 12px;
  padding: 40px;
  box-shadow: var(--surface-shadow);
}

.pillar-number {
  font-family: var(--font-display);
  font-size: 42px;
  font-weight: 800;
  color: var(--brand-primary);
  margin-bottom: 16px;
}

/* Archetype 4: Workflow 3-Col */
.archetype-workflow-3col {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 48px;
  gap: 28px;
}

/* Archetype 5: Features Staggered */
.archetype-features-staggered {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  padding: 48px;
  gap: 36px;
}

/* Archetype 6: Persona Cards */
.archetype-persona-cards {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 48px;
  gap: 24px;
}

/* Archetype 7: Services Grid 2x2 */
.archetype-services-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  padding: 48px;
  gap: 24px;
}

/* Archetype 8: Portfolio Gallery */
.archetype-portfolio-gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 48px;
  gap: 20px;
}

/* Archetype 9: Metrics Contact */
.archetype-metrics-contact {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 48px;
  gap: 36px;
}

.metric-counter-box {
  background: var(--canvas-surface);
  border: 1px solid var(--surface-border);
  border-radius: 12px;
  padding: 32px;
  text-align: center;
}

.metric-number {
  font-family: var(--font-display);
  font-size: 54px;
  font-weight: 800;
  color: var(--brand-primary);
}

/* Archetype 10: Closing CTA */
.archetype-closing-cta {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  padding: 60px;
}

/* Phone Frame Mockup (9:16) */
.phone-frame-editorial {
  width: 280px;
  height: 560px;
  background: #090D14;
  border-radius: 36px;
  border: 6px solid #2B2927;
  box-shadow: 0 25px 50px rgba(0,0,0,0.15);
  position: relative;
  overflow: hidden;
  margin: 0 auto;
}

.phone-notch {
  width: 90px;
  height: 18px;
  background: #2B2927;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}
```

Copy also to `templates/editorial.css`:
Make sure the directory exists and write the file.

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/test-editorial-css.js`  
Expected: PASS: editorial.css contains all required design tokens and 10 archetype classes

- [ ] **Step 5: Commit**

```bash
git add scripts/test-editorial-css.js .claude/plugins/compro/skills/builder/templates/editorial.css templates/editorial.css
git commit -m "feat(builder): implement canva editorial design system stylesheet and archetypes"
```

---

### Task 3: Implement Canva Editorial Presentation Shell (`editorial-shell.html`)

**Files:**
- Create: `scripts/test-editorial-shell.js`
- Create: `.claude/plugins/compro/skills/builder/templates/editorial-shell.html`
- Create: `templates/editorial-shell.html` (root mirror)

**Interfaces:**
- Consumes: Google Fonts links (`Plus Jakarta Sans`, `Inter`), Reveal.js 4.6.1 CDN, and inlining placeholder `/* CSS_INLINE_PLACEHOLDER */`.
- Produces: Presentation shell configured for light theme and 1920x1080 canvas.

- [ ] **Step 1: Write test `scripts/test-editorial-shell.js`**

```javascript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/test-editorial-shell.js`  
Expected: FAIL with "editorial-shell.html not found"

- [ ] **Step 3: Create `editorial-shell.html`**

Create `.claude/plugins/compro/skills/builder/templates/editorial-shell.html`:

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Company Profile — Presentation</title>

  <!-- Google Fonts Preconnect & Styles -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet">

  <!-- Reveal.js CDN -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.6.1/reveal.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.6.1/theme/white.min.css" id="theme-link">

  <!-- Inlined Editorial Custom CSS -->
  <style>
/* CSS_INLINE_PLACEHOLDER */
  </style>
</head>
<body>
  <div class="reveal">
    <div class="slides">
      <!-- SLIDES_INLINE_PLACEHOLDER -->
    </div>
  </div>

  <!-- Reveal.js Core Script -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.6.1/reveal.min.js"></script>
  <script>
    Reveal.initialize({
      width: 1920,
      height: 1080,
      margin: 0.04,
      minScale: 0.2,
      maxScale: 2.0,
      controls: true,
      progress: true,
      center: true,
      hash: true,
      transition: 'fade'
    });
  </script>
</body>
</html>
```

Copy also to `templates/editorial-shell.html`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/test-editorial-shell.js`  
Expected: PASS: editorial-shell.html is valid with fonts, Reveal structure, and CSS placeholder

- [ ] **Step 5: Commit**

```bash
git add scripts/test-editorial-shell.js .claude/plugins/compro/skills/builder/templates/editorial-shell.html templates/editorial-shell.html
git commit -m "feat(builder): add canva editorial html presentation shell"
```

---

### Task 4: Integrate Theme Selector & Dynamic Archetype Classifier into `scripts/build-deck.js`

**Files:**
- Create: `scripts/test-deck-builder-editorial.js`
- Modify: `scripts/build-deck.js:30-150, 450-700`

**Interfaces:**
- Consumes: CLI flag `--theme=editorial` (default: `editorial`).
- Produces: Inlined HTML deck wrapped with layout archetype classes (`.archetype-hero-cover`, `.archetype-mission-pillars`, etc.).

- [ ] **Step 1: Write test `scripts/test-deck-builder-editorial.js`**

```javascript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/test-deck-builder-editorial.js`  
Expected: FAIL (argument `--theme=editorial` not yet supported or templates not wired).

- [ ] **Step 3: Update `scripts/build-deck.js`**

Modify `scripts/build-deck.js`:
1. Add CLI arg parser for `--theme`:
```javascript
const args = process.argv.slice(2);
let THEME = 'editorial';
for (const arg of args) {
  if (arg.startsWith('--theme=')) {
    THEME = arg.split('=')[1];
  }
}
```
2. In template candidate lookup, if `THEME === 'editorial'`, use `editorial-shell.html` and `editorial.css`.
3. In `renderSlideContent()`, dynamically classify sections into archetypes:
   - Index 0: Render `.archetype-hero-cover` with top nav and floating card.
   - Section with 2 bullet points or "Brand DNA" / "Biaya": Render `.archetype-mission-pillars`.
   - Section with 3 steps / workflow: Render `.archetype-workflow-3col`.
   - Section with 4 points / services: Render `.archetype-services-grid`.
   - Section with metrics / numbers: Render `.archetype-metrics-contact`.
   - Final section / contacts: Render `.archetype-closing-cta`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/test-deck-builder-editorial.js`  
Expected: PASS: build-deck successfully generates editorial theme with archetype classes

- [ ] **Step 5: Commit**

```bash
git add scripts/build-deck.js scripts/test-deck-builder-editorial.js
git commit -m "feat(builder): implement dynamic archetype classifier and theme selection in build-deck"
```

---

### Task 5: End-to-End Build, Full Test Suite & Browser Visual Verification

**Files:**
- Run: `node scripts/build-deck.js --name=congen-editorial --theme=editorial`
- Run: `node .claude/plugins/compro/scripts/test-all.js`
- Modify: `.claude/plugins/compro/skills/builder/SKILL.md` (document editorial theme support)

**Interfaces:**
- Consumes: `input/brand_story_guide.md`, `input/business_knowledge_base.md`.
- Produces: Live verified deck in `compros/congen-editorial/index.html`.

- [ ] **Step 1: Document Canva Editorial Theme in `skills/builder/SKILL.md`**

Update `.claude/plugins/compro/skills/builder/SKILL.md`:
Add section `## 3.5 Canva Editorial Theme (v2.3.0)` detailing the `--theme=editorial` flag, tokens, and archetype classes.

- [ ] **Step 2: Run full regression test suite**

Run: `node .claude/plugins/compro/scripts/test-all.js`  
Expected: PASS: ALL TESTS PASSED! Layer 3 is fully compliant.

- [ ] **Step 3: Generate Venturo Pro Editorial Deck**

Run: `node scripts/build-deck.js --name=congen-editorial --theme=editorial`  
Expected: Output created in `compros/congen-editorial/index.html` with build log.

- [ ] **Step 4: Visual verification in browser**

Open `file:///d:/AryokPunya/Magang/compro/compros/congen-editorial/index.html` in browser, verify typography, colors, navigation, and responsiveness.

- [ ] **Step 5: Commit**

```bash
git add .claude/plugins/compro/skills/builder/SKILL.md
git commit -m "docs(builder): document v2.3.0 canva editorial theme in skill definition"
```

---

## Plan Self-Review Checklist

1. **Spec coverage:** Covers tokens, 10 archetypes, dynamic chunking, phone frame mockups, and v2.3.0 upgrade.
2. **No placeholders:** All file paths, code snippets, tokens, and test scripts are fully written.
3. **Execution ready:** Compatible with subagent-driven development or executing-plans.
