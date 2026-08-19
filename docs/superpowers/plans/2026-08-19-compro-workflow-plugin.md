# Compro Workflow Plugin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the single `compro` skill into a multi-agent plugin structure with dedicated skills (`compro`, `writer`, `reviewer`, `seo`, `builder`, `publisher`, `deploy-to-vercel`).

**Architecture:** Prompt-based orchestration where `compro` acts as the state machine driver directing task-specific skills (`writer`, `reviewer`, `seo`, `builder`, `publisher`, `deploy-to-vercel`). State and deliverables are shared via the filesystem (`input/`, `artifacts/`, `site/`, `qa/`, `deploy/`).

**Tech Stack:** Markdown (Prompt-based Skills), Node.js (QC scripts/Puppeteer), HTML/CSS/JS (Deck shell), Vercel CLI (Bash deployment).

**Spec:** `docs/superpowers/specs/2026-08-19-compro-workflow-plugin-design.md`

## Global Constraints

- All prompts must be plain markdown without vendor-specific tags to support Claude, Gemini, and OpenCode.
- Multi-agent communication relies strictly on file artifacts on disk.
- HTML output must follow PPT-style slide decks (16:9 cqw, `core.css` identity, non-web CTA/shadows).

---

### Task 1: Reorganize Directory Structure & Add `.codex-plugin/plugin.json`

**Files:**
- Create: `.codex-plugin/plugin.json`
- Create Directories: `skills/compro/`, `skills/writer/`, `skills/reviewer/`, `skills/seo/`, `skills/builder/`, `skills/publisher/`, `skills/deploy-to-vercel/`, `templates/deck/`, `scripts/`

- [ ] **Step 1: Create plugin manifest**

Create `.codex-plugin/plugin.json` with skill definitions.

```json
{
  "name": "compro",
  "description": "Multi-agent company profile & pitch deck generator plugin",
  "version": "1.0.0",
  "skills": [
    {
      "name": "compro",
      "path": "skills/compro/SKILL.md"
    },
    {
      "name": "writer",
      "path": "skills/writer/SKILL.md"
    },
    {
      "name": "reviewer",
      "path": "skills/reviewer/SKILL.md"
    },
    {
      "name": "seo",
      "path": "skills/seo/SKILL.md"
    },
    {
      "name": "builder",
      "path": "skills/builder/SKILL.md"
    },
    {
      "name": "publisher",
      "path": "skills/publisher/SKILL.md"
    },
    {
      "name": "deploy-to-vercel",
      "path": "skills/deploy-to-vercel/SKILL.md"
    }
  ]
}
```

- [ ] **Step 2: Reorganize existing template and script files**

Move `deck-template.html`, `core.css`, `deck.css`, `deck.js`, `layouts/` to `templates/deck/`. Move QC scripts to `scripts/`.

```bash
mkdir -p templates/deck scripts
mv deck-template.html core.css deck.css deck.js layouts templates/deck/
```

- [ ] **Step 3: Commit structural reorganization**

```bash
git add .codex-plugin/plugin.json templates/
git commit -m "chore: organize plugin structure and manifest"
```

---

### Task 2: Implement Writer Skill (`skills/writer/SKILL.md`)

**Files:**
- Create: `skills/writer/SKILL.md`

- [ ] **Step 1: Write `skills/writer/SKILL.md`**

Define the copywriting & slide structure generator prompt.

```markdown
---
name: writer
description: Generate draft content for company profile slides based on intake data
---

# Writer Skill

Generate draft content for the company profile slide deck based on facts provided in the business knowledge base.

## Inputs
- `input/business-knowledge-base.md`
- `input/brand-story-guide.md`
- `input/brand-assets/`

## Outputs
- `artifacts/01-company-profile-draft.md`

## Rules
1. Never hallucinate claims, stats, or facts not in `business-knowledge-base.md`.
2. Ensure 1 main message per slide following the arc: Attention -> Problem -> Solution -> Proof -> Offer -> CTA.
3. Every slide must contain:
   - Slide Number & Title
   - Headline (punchy hook + cyan accent word)
   - Subheadline & Body copy
   - Visual direction (suggested archetype: Split-hero, Grid, Full-bleed, etc.)
   - Source reference for stats/claims
```

- [ ] **Step 2: Commit Writer Skill**

```bash
git add skills/writer/SKILL.md
git commit -m "feat: add writer skill definition"
```

---

### Task 3: Implement Reviewer Skill (`skills/reviewer/SKILL.md`)

**Files:**
- Create: `skills/reviewer/SKILL.md`

- [ ] **Step 1: Write `skills/reviewer/SKILL.md`**

Define the QA reviewer prompt that checks accuracy, tone, and flow.

```markdown
---
name: reviewer
description: Review company profile draft for factual accuracy, storytelling, and tone
---

# Reviewer Skill

Verify the draft company profile against business facts and brand guidelines.

## Inputs
- `artifacts/01-company-profile-draft.md`
- `input/business-knowledge-base.md`
- `input/brand-story-guide.md`

## Outputs
- `artifacts/02-review-report.md`
- `artifacts/02-company-profile-final.md` (if APPROVED)

## Checklist
1. Factual consistency (pricing, stats, claims).
2. Storytelling flow across slides.
3. Hook quality and tone of voice.
4. No sensitive information or placeholders left unflagged.

## Statuses
- `APPROVED`: Draft is ready for SEO & building. Copy to `02-company-profile-final.md`.
- `REVISION_REQUIRED`: Detailed list of fixes required in `02-review-report.md`.
- `BLOCKED`: Critical missing business context.
```

- [ ] **Step 2: Commit Reviewer Skill**

```bash
git add skills/reviewer/SKILL.md
git commit -m "feat: add reviewer skill definition"
```

---

### Task 4: Implement Dual-Mode SEO Skill (`skills/seo/SKILL.md`)

**Files:**
- Create: `skills/seo/SKILL.md`

- [ ] **Step 1: Write `skills/seo/SKILL.md`**

Define content SEO and technical SEO evaluation rules.

```markdown
---
name: seo
description: Perform content SEO planning or technical HTML SEO validation
---

# SEO Skill

Supports two modes depending on pipeline stage.

## Mode 1: Content SEO (Post-Review)
**Inputs**: `artifacts/02-company-profile-final.md`, `input/business-knowledge-base.md`  
**Outputs**: `artifacts/03-seo-brief.md`  
**Focus**: Keywords, SEO title, meta description, structured data recommendations (Organization/LocalBusiness), canonical URLs.

## Mode 2: Technical SEO (Post-Build)
**Inputs**: `site/`, `artifacts/03-seo-brief.md`  
**Outputs**: `qa/seo-report.md`  
**Focus**: Validate HTML semantics, meta tags in `site/index.html`, `robots.txt`, `sitemap.xml`, local asset optimization, image alt text.
**Statuses**: `PASSED` or `FIX_REQUIRED`.
```

- [ ] **Step 2: Commit SEO Skill**

```bash
git add skills/seo/SKILL.md
git commit -m "feat: add seo skill definition"
```

---

### Task 5: Implement Builder Skill (`skills/builder/SKILL.md`)

**Files:**
- Create: `skills/builder/SKILL.md`

- [ ] **Step 1: Write `skills/builder/SKILL.md`**

Define the HTML slide deck builder prompt incorporating visual rules.

```markdown
---
name: builder
description: Build interactive HTML PPT-style deck from final approved content
---

# Builder Skill

Constructs the static HTML presentation deck adhering strictly to core visual identity.

## Inputs
- `artifacts/02-company-profile-final.md`
- `artifacts/03-seo-brief.md`
- `templates/deck/`

## Outputs
- `site/index.html`
- `site/core.css`
- `site/deck.css`
- `site/deck.js`
- `site/robots.txt`
- `site/sitemap.xml`
- `site/assets/`

## Technical Rules
1. Sample brand colors from logo to populate `:root` `--cyan`, `--blue`, `--navy`.
2. Link every slide to `core.css`.
3. Varied archetype per slide (Split-hero, Full-bleed, Grid cards, etc.).
4. PPT presentation style (no web cards/shadows/badges).
5. Hash navigation (`#1`, `#2`).
```

- [ ] **Step 2: Commit Builder Skill**

```bash
git add skills/builder/SKILL.md
git commit -m "feat: add builder skill definition"
```

---

### Task 6: Implement Publisher Skill (`skills/publisher/SKILL.md`)

**Files:**
- Create: `skills/publisher/SKILL.md`

- [ ] **Step 1: Write `skills/publisher/SKILL.md`**

Define pre-flight validation rules for publication.

```markdown
---
name: publisher
description: Perform pre-deployment QA on site assets and layout
---

# Publisher Skill

Verifies site readiness prior to deployment.

## Inputs
- `site/`
- `qa/seo-report.md`
- `input/deployment-config.md`

## Outputs
- `qa/publish-report.md`
- `deploy/deployment-status.md`

## Checklist
1. All local assets load cleanly without 404s.
2. Technical SEO status is `PASSED`.
3. Desktop and mobile layout checks complete without overflow.
4. Deployment target specified.

## Statuses
- `READY_TO_DEPLOY`
- `BLOCKED`
```

- [ ] **Step 2: Commit Publisher Skill**

```bash
git add skills/publisher/SKILL.md
git commit -m "feat: add publisher skill definition"
```

---

### Task 7: Implement Deploy to Vercel Skill (`skills/deploy-to-vercel/SKILL.md`)

**Files:**
- Create: `skills/deploy-to-vercel/SKILL.md`

- [ ] **Step 1: Write `skills/deploy-to-vercel/SKILL.md`**

Define Vercel CLI execution instructions.

```markdown
---
name: deploy-to-vercel
description: Deploy site/ directory to Vercel using Vercel CLI
---

# Deploy to Vercel Skill

Deploys the static site to Vercel via CLI.

## Inputs
- `site/`
- `input/deployment-config.md`

## Outputs
- `deploy/vercel-preview-url.txt`
- `deploy/vercel-production-url.txt`
- `deploy/deployment-status.md`

## Execution Steps
1. Run `vercel` command via Bash tool for preview deployment.
2. Capture deployment output and extract Preview URL.
3. Save Preview URL to `deploy/vercel-preview-url.txt`.
4. Production deploy (`vercel --prod`) MUST be explicitly requested by user.
```

- [ ] **Step 2: Commit Deploy to Vercel Skill**

```bash
git add skills/deploy-to-vercel/SKILL.md
git commit -m "feat: add deploy-to-vercel skill definition"
```

---

### Task 8: Implement Compro Orchestrator Skill (`skills/compro/SKILL.md`)

**Files:**
- Create: `skills/compro/SKILL.md`

- [ ] **Step 1: Write `skills/compro/SKILL.md`**

Define the state machine orchestrator prompt that coordinates all skills.

```markdown
---
name: compro
description: Main orchestrator for generating company profile pitch decks
---

# Compro Orchestrator

Drives the company profile creation lifecycle across all specialized sub-skills.

## Pipeline State Machine

1. **Gate 0 - Intake Check**: Check `input/` folder for `business-knowledge-base.md`, `brand-story-guide.md`, and logo asset. Stop and request missing items if incomplete.
2. **Phase 1 - Drafting**: Invoke `/writer`.
3. **Phase 2 - Content Review**: Invoke `/reviewer`.
   - If `REVISION_REQUIRED`, re-invoke `/writer` (max 3 loops).
   - If `APPROVED`, proceed to Content SEO.
4. **Phase 3 - Content SEO**: Invoke `/seo` (content mode).
5. **Phase 4 - HTML Deck Build**: Invoke `/builder`.
6. **Phase 5 - Technical SEO**: Invoke `/seo` (technical mode).
   - If `FIX_REQUIRED`, re-invoke `/builder` (max 3 loops).
   - If `PASSED`, proceed to Publishing.
7. **Phase 6 - Pre-flight Publish**: Invoke `/publisher`.
8. **Phase 7 - Deployment**: If deployment target is Vercel and status is `READY_TO_DEPLOY`, invoke `/deploy-to-vercel`.
```

- [ ] **Step 2: Commit Orchestrator Skill**

```bash
git add skills/compro/SKILL.md
git commit -m "feat: add main compro orchestrator skill"
```
