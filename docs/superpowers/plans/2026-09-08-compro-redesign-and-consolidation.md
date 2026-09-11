# Compro Plugin Visual Overhaul & Unified Folder Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the `compro` plugin to produce modern corporate slide presentations matching the visual quality of `compro.pdf`, embed `ui-ux-pro-max` & `impeccable` design intelligence self-contained inside the plugin, simplify skill names by removing `company-profile-` prefix, and consolidate 100% of generated project files into a single `compros/<slug>/` folder.

**Architecture:** Refactor the plugin skill structure into concise names (`writer`, `reviewer`, `builder`, `publisher`, `compro`). Integrate design tokens, visual hierarchy guidelines, and dynamic HSL brand theming directly into `builder`. Overhaul `profile-shell.html`, `custom.css`, and `build-deck.js` to render interactive 16:9 Reveal.js slides equipped with smartphone UI mockups, dashed pain-point cards, circular ecosystem diagrams, pricing tiers with "Best Seller" badges, and PDF export stylesheets. Consolidate all pipeline outputs (`index.html`, `assets/`, `reports/`, `drafts/`, `compro.md`) into `compros/<slug>/`.

**Tech Stack:** Node.js, Reveal.js 4.6+, Vanilla CSS (CSS Custom Properties, Grid, Flexbox, 3D shadows, `@media print`), SVG vectors (inline icons, device frames, circular diagram).

## Global Constraints
- The plugin must be 100% self-contained: no runtime dependencies on external user global skills.
- Zero broken images: if external images are not provided, render crisp inline SVG mockups and diagrams.
- 16:9 presentation aspect ratio (1920x1080) preserved across both interactive web display and PDF print export.
- Clean root directory: zero temp files left in root `artifacts/` or `qa/` — everything lives in `compros/<slug>/`.

---

### Task 1: Simplify Skill Names & Update Plugin Manifest

**Files:**
- Modify: `D:/AryokPunya/Magang/compro/.claude/plugins/compro/.codex-plugin/plugin.json`
- Rename folders:
  - `.claude/plugins/compro/skills/company-profile-writer/` ➔ `writer/`
  - `.claude/plugins/compro/skills/company-profile-reviewer/` ➔ `reviewer/`
  - `.claude/plugins/compro/skills/company-profile-builder/` ➔ `builder/`
  - `.claude/plugins/compro/skills/company-profile-publisher/` ➔ `publisher/`
- Modify: `.claude/plugins/compro/skills/writer/SKILL.md`
- Modify: `.claude/plugins/compro/skills/reviewer/SKILL.md`
- Modify: `.claude/plugins/compro/skills/builder/SKILL.md`
- Modify: `.claude/plugins/compro/skills/publisher/SKILL.md`
- Modify: `.claude/plugins/compro/skills/compro/SKILL.md`
- Modify: `.claude/plugins/compro/scripts/validate-manifest.js`

**Interfaces:**
- Consumes: Existing plugin configuration.
- Produces: Normalized skill names (`writer`, `reviewer`, `builder`, `publisher`, `compro`) and updated manifest.

- [ ] **Step 1: Rename skill directories in `.claude/plugins/compro/skills/`**
  Move each directory to remove `company-profile-` prefix.
- [ ] **Step 2: Update `.codex-plugin/plugin.json`**
  Update skill array to reflect the new paths (`skills/writer/SKILL.md`, `skills/reviewer/SKILL.md`, `skills/builder/SKILL.md`, `skills/publisher/SKILL.md`, `skills/compro/SKILL.md`).
- [ ] **Step 3: Update `SKILL.md` files**
  Update headings, descriptions, and invocations in each `SKILL.md` to reference the shortened skill names and output paths (`compros/<slug>/drafts/`, `compros/<slug>/reports/`, etc.).
- [ ] **Step 4: Update `validate-manifest.js`**
  Update expected skill names in `validate-manifest.js` to `['compro', 'writer', 'reviewer', 'builder', 'publisher']`.
- [ ] **Step 5: Run manifest validation test**
  Run: `node .claude/plugins/compro/scripts/validate-manifest.js`
  Expected: PASS: manifest is valid with all 5 Layer 3 skills.
- [ ] **Step 6: Commit changes**
  Commit with message: `refactor(plugin): simplify skill names and update manifest`

---

### Task 2: Embed UI/UX Pro Max & Impeccable Design Intelligence into `builder`

**Files:**
- Create: `D:/AryokPunya/Magang/compro/.claude/plugins/compro/skills/builder/references/design-tokens.md`
- Create: `D:/AryokPunya/Magang/compro/.claude/plugins/compro/skills/builder/references/visual-hierarchy.md`
- Modify: `D:/AryokPunya/Magang/compro/.claude/plugins/compro/skills/builder/SKILL.md`

**Interfaces:**
- Consumes: Knowledge and rules from `C:/Users/ThinkPad/.agents/skills/ui-ux-pro-max` and `impeccable`.
- Produces: Self-contained reference documentation and rules in `builder` skill.

- [ ] **Step 1: Create `references/design-tokens.md` in `builder`**
  Extract color palette systems (HSL dynamic brand colors, surface tones, typography scales for 1920x1080 16:9, spacing scales, shadow tokens) from `ui-ux-pro-max`.
- [ ] **Step 2: Create `references/visual-hierarchy.md` in `builder`**
  Extract layout composition rules, scannability patterns, contrast ratios, and micro-interaction principles from `impeccable`.
- [ ] **Step 3: Update `builder/SKILL.md`**
  Document how `builder` applies these design tokens and hierarchy guidelines during slide compilation.
- [ ] **Step 4: Commit changes**
  Commit with message: `feat(builder): embed self-contained UI/UX design references`

---

### Task 3: Overhaul HTML Shell & CSS Design System (`profile-shell.html` & `custom.css`)

**Files:**
- Modify: `D:/AryokPunya/Magang/compro/.claude/plugins/compro/skills/builder/templates/profile-shell.html`
- Modify: `D:/AryokPunya/Magang/compro/.claude/plugins/compro/skills/builder/templates/custom.css`
- Modify: `D:/AryokPunya/Magang/compro/.claude/plugins/compro/scripts/test-builder-inlining.js`

**Interfaces:**
- Consumes: Design tokens from Task 2.
- Produces: Responsive 16:9 Reveal.js slide template with dynamic theming, modern card components, smartphone frames, circular diagram styling, pricing tables, and print styles.

- [ ] **Step 1: Overhaul `profile-shell.html`**
  - Add Google Fonts: *Plus Jakarta Sans* (600, 700, 800) and *Inter* (400, 500, 600).
  - Configure Reveal.js for 1920x1080 resolution, `margin: 0.04`, `minScale: 0.2`, `maxScale: 2.0`, `hash: true`, `slideNumber: true`.
  - Include PDF print stylesheet loader (`pdf.css`).
- [ ] **Step 2: Rewrite `custom.css`**
  - Implement dynamic CSS custom properties: `--brand-primary`, `--brand-primary-light`, `--brand-secondary`, `--brand-dark`, `--brand-muted`, `--brand-surface`, `--brand-card-bg`, `--brand-border`.
  - Style Hero slide: 2-column flex/grid, large punchy title, stat badges with icons, device visual container.
  - Style Problem slide: dashed border cards (`.problem-card`), warning accent indicators, clean typography.
  - Style Solution slide: 2-column benefit cards with clean SVG icon badges.
  - Style Circular Ecosystem Diagram (`.ecosystem-diagram`): center brand bubble connected to orbiting feature nodes.
  - Style Smartphone Mockup (`.phone-frame`): realistic frame with dynamic island, speaker notch, screen bezel, drop shadow, and clean UI screen container.
  - Style Pricing slide: modern cards, highlighted best-seller card with ribbon badge, strikethrough price, and green checkmark features.
  - Style Special Offer & Facility container: guarantee badge, deadline pill, checklist bullets.
  - Style Closing slide: banner layout, App Store & Google Play badge buttons, complete contacts grid (WA, IG, Website, Office Address).
  - Style `@media print`: 1920x1080 landscape page size, exact color rendering, zero unwanted page breaks.
- [ ] **Step 3: Update `test-builder-inlining.js`**
  Update template path in `test-builder-inlining.js` to `skills/builder/templates/...` and verify CSS placeholder replacement.
- [ ] **Step 4: Run builder template test**
  Run: `node .claude/plugins/compro/scripts/test-builder-inlining.js`
  Expected: PASS.
- [ ] **Step 5: Commit changes**
  Commit with message: `feat(builder): implement modern 16:9 slide template and CSS design system`

---

### Task 4: Overhaul Builder Script (`build-deck.js`) & Smart Asset Pipeline

**Files:**
- Modify: `D:/AryokPunya/Magang/compro/scripts/build-deck.js`
- Create: `D:/AryokPunya/Magang/compro/scripts/asset-generator.js` (helper for vector SVG mockups/diagrams)

**Interfaces:**
- Consumes: Markdown draft, brand guidelines in `input/`.
- Produces: Complete slide deck in `compros/<slug>/index.html`, SVG assets in `compros/<slug>/assets/`, and consolidated files.

- [ ] **Step 1: Build `asset-generator.js`**
  Provide helper functions to generate:
  - Realistic smartphone UI mockup SVG/HTML (app header, balance/status, AI chat bubble / video pipeline screen, action buttons).
  - Circular ecosystem diagram SVG based on brand name and feature list.
  - Tech accent hero and closing banners with gradient mesh.
  - Crisp inline SVG icons (dollar, clock, palette, spreadsheet, checkmark, phone, mail, map-pin, whatsapp, shield, star).
- [ ] **Step 2: Update `build-deck.js` slide parser & generator**
  - Accept output directory argument (e.g. `node scripts/build-deck.js [slug]`).
  - Read input documents (`brand-story-guide.md` / `business-knowledge-base.md`) to dynamically extract primary brand color, brand name, and key assets.
  - Detect slide types based on headings and content (Hero, Problem, Solution, Key Features / Diagram, Showcase / Mockup, Traction, Pricing, Promo, Closing).
  - Convert markdown sections into modern semantic HTML components matching the CSS classes from Task 3.
  - Embed vector SVG mockups, icons, and diagrams when external images are not provided.
  - Inject custom brand color CSS variables into the slide shell.
- [ ] **Step 3: Implement Folder Consolidation in `build-deck.js`**
  - Output target: `compros/<slug>/`.
  - Write `compros/<slug>/index.html`.
  - Write `compros/<slug>/compro.md`.
  - Ensure `compros/<slug>/assets/` exists and contains all required assets.
  - Create `compros/<slug>/reports/` and move `build.log`, `review-report.md`, and `seo-report.md`.
  - Create `compros/<slug>/drafts/` and move `01-company-profile-draft.md` and `02-company-profile-final.md`.
  - Clean up root `artifacts/` and `qa/`.
- [ ] **Step 4: Test build-deck execution on `congen`**
  Run: `node scripts/build-deck.js congen`
  Expected: Successful compilation with consolidated folder output.
- [ ] **Step 5: Commit changes**
  Commit with message: `feat(builder): overhaul build-deck with smart asset pipeline and folder consolidation`

---

### Task 5: Update Publisher (SEO Audit), Test Suite, & Orchestrator

**Files:**
- Modify: `D:/AryokPunya/Magang/compro/scripts/seo-audit.js`
- Modify: `.claude/plugins/compro/skills/publisher/SKILL.md`
- Modify: `.claude/plugins/compro/skills/compro/SKILL.md`
- Modify: `.claude/plugins/compro/scripts/test-writer-schema.js`
- Modify: `.claude/plugins/compro/scripts/test-reviewer-schema.js`
- Modify: `.claude/plugins/compro/scripts/test-publisher-workflow.js`
- Modify: `.claude/plugins/compro/scripts/test-orchestrator.js`
- Modify: `.claude/plugins/compro/scripts/test-all.js`

**Interfaces:**
- Consumes: Updated skill names and consolidated paths.
- Produces: Fully passing test suite and verified orchestrator.

- [ ] **Step 1: Update `seo-audit.js` & Publisher Skill**
  Ensure SEO audit checks `compros/<slug>/index.html` and outputs report to `compros/<slug>/reports/seo-report.md`.
- [ ] **Step 2: Update Orchestrator Skill (`compro/SKILL.md`)**
  Update state machine to invoke `writer` ➔ `reviewer` ➔ `builder` ➔ `publisher` and ensure paths point to `compros/<slug>/`.
- [ ] **Step 3: Update all test scripts in `.claude/plugins/compro/scripts/`**
  Update paths and skill names across `test-writer-schema.js`, `test-reviewer-schema.js`, `test-publisher-workflow.js`, `test-orchestrator.js`, and `test-all.js`.
- [ ] **Step 4: Run full verification suite**
  Run: `node .claude/plugins/compro/scripts/test-all.js`
  Expected: ALL TESTS PASSED! Layer 3 is fully compliant.
- [ ] **Step 5: Commit changes**
  Commit with message: `test: update test suite and orchestrator for consolidated compro structure`

---

### Task 6: End-to-End Generation & Visual Validation on `congen`

**Files:**
- Target Output: `D:/AryokPunya/Magang/compro/compros/congen/`

- [ ] **Step 1: Run full compro generation for `congen`**
  Re-generate `congen` using the updated scripts and templates.
- [ ] **Step 2: Verify folder structure consolidation**
  Verify that:
  - `compros/congen/index.html` exists.
  - `compros/congen/compro.md` exists.
  - `compros/congen/assets/` contains all assets/mockups.
  - `compros/congen/reports/` contains `build.log`, `review-report.md`, and `seo-report.md`.
  - `compros/congen/drafts/` contains `01-draft.md` and `02-final.md`.
  - Root `artifacts/` and `qa/` no longer hold fragmented files.
- [ ] **Step 3: Verify visual rendering in browser**
  Check `http://127.0.0.1:3000/compros/congen/index.html` via browser inspection.
  Confirm:
  - 16:9 presentation layout with modern Google Fonts.
  - Dynamic Venturo teal `#009BAD` theming and crisp card components.
  - Realistic smartphone UI mockups and SVG ecosystem diagram rendered.
  - Pricing table with "Best Seller" badge and promotional strike-through.
  - Collaboration banner with App Store / Google Play buttons and full contact details.
- [ ] **Step 4: Final commit & Walkthrough documentation**
  Commit all generated artifacts and create walkthrough report.
