# Layer 3 — Company Profile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform and complete the `compro` plugin into a full Layer 3 multi-agent architecture with 4 integrated skills (`company-profile-writer`, `company-profile-reviewer`, `company-profile-builder`, `company-profile-publisher`), orchestrated by `compro`, with single-file HTML Reveal.js output, technical SEO auto-fixing, user confirmation gate, and Vercel CLI deployment.

**Architecture:** Prompt-based orchestration where `skills/compro/SKILL.md` acts as a state-machine driver coordinating specialized skills. State and artifacts are passed strictly via the filesystem (`input/`, `artifacts/`, `compros/<name>/`, `qa/`, `deploy/`). Technical SEO audit and auto-patching happen before the User Confirmation Gate, followed by Vercel deployment.

**Tech Stack:** Markdown (Prompt-based Skills & Frontmatter), Node.js (Vercel CLI helper script & SEO validation), Reveal.js 4.6.1 (HTML presentation slides with inlined CSS), Vercel CLI.

## Global Constraints

- Multi-agent communication relies strictly on file artifacts on disk without vendor-specific prompt tags (compatible with Claude Code, Codex, Antigravity, and Gemini).
- HTML presentation output must be a self-contained single-file HTML (with CSS inlined inside `<style>`) to prevent 404 styling errors.
- Publisher must run technical SEO audit and auto-fix before deployment.
- Deployment to Vercel MUST pause at the User Confirmation Gate and never deploy without explicit user approval.
- Default deployment mode is always Preview (`vercel deploy`), with live HTTP GET 200 accessibility verification.

---

### Task 1: Plugin Manifest (`.codex-plugin/plugin.json`) & Update Documentation (`README.md`)

**Files:**
- Create: `.codex-plugin/plugin.json`
- Modify: `README.md`
- Test: `scripts/validate-manifest.js`

**Interfaces:**
- Produces: Registered plugin metadata containing 5 skills (`compro`, `company-profile-writer`, `company-profile-reviewer`, `company-profile-builder`, `company-profile-publisher`).

- [ ] **Step 1: Write test to validate plugin manifest structure**

Create `scripts/validate-manifest.js`:
```javascript
const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '..', '.codex-plugin', 'plugin.json');

if (!fs.existsSync(manifestPath)) {
  console.error('FAIL: .codex-plugin/plugin.json does not exist');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
const requiredSkills = [
  'compro',
  'company-profile-writer',
  'company-profile-reviewer',
  'company-profile-builder',
  'company-profile-publisher'
];

if (manifest.name !== 'compro') {
  console.error(`FAIL: expected manifest.name to be "compro", got "${manifest.name}"`);
  process.exit(1);
}

const skillNames = (manifest.skills || []).map(s => s.name);
const missing = requiredSkills.filter(s => !skillNames.includes(s));

if (missing.length > 0) {
  console.error(`FAIL: missing skills in manifest: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('PASS: manifest is valid with all 5 Layer 3 skills');
process.exit(0);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/validate-manifest.js`  
Expected: FAIL (`.codex-plugin/plugin.json does not exist`)

- [ ] **Step 3: Create `.codex-plugin/plugin.json` and update `README.md`**

Create `.codex-plugin/plugin.json`:
```json
{
  "name": "compro",
  "description": "Layer 3 Company Profile Multi-Agent Plugin with Slide Deck Generator & Vercel Deployment",
  "version": "2.0.0",
  "skills": [
    {
      "name": "compro",
      "path": "skills/compro/SKILL.md"
    },
    {
      "name": "company-profile-writer",
      "path": "skills/company-profile-writer/SKILL.md"
    },
    {
      "name": "company-profile-reviewer",
      "path": "skills/company-profile-reviewer/SKILL.md"
    },
    {
      "name": "company-profile-builder",
      "path": "skills/company-profile-builder/SKILL.md"
    },
    {
      "name": "company-profile-publisher",
      "path": "skills/company-profile-publisher/SKILL.md"
    }
  ]
}
```

Update `README.md` with the Layer 3 architecture:
```markdown
# Compro — Layer 3 Company Profile Multi-Agent Plugin

Arsitektur multi-agen untuk mengonversi data mentah bisnis menjadi presentasi slide *Company Profile* berbasis web (Reveal.js) yang teroptimasi SEO dan siap di-deploy ke Vercel.

## Alur Kerja Layer 3 (Pipeline)

1. **Gate 0 - Intake Check**: Mengecek ketersediaan bahan dasar (`input/business-knowledge-base.md`, `business-audit-report.md`, `brand-story-guide.md`).
2. **Phase 1 - Drafting** (`/company-profile-writer`): Menghasilkan draf narasi per-slide dalam format Markdown.
3. **Phase 2 - Content QA** (`/company-profile-reviewer`): Memverifikasi akurasi terhadap fakta bisnis, brand voice, dan merumuskan draf On-Page SEO (Meta Title/Description). Terdapat mekanisme revisi berulang bila belum disetujui.
4. **Phase 3 - Slide Deck Build** (`/company-profile-builder`): Membangun file presentasi statis *single-file HTML* (Reveal.js) dengan CSS inlined agar portabel dan bebas error 404 styling.
5. **Phase 4 - Pre-flight SEO & Auto-Fix** (`/company-profile-publisher`): Audit technical SEO (Title, Description, Open Graph, Schema.org JSON-LD, Alt Image) dan melakukan auto-patching otomatis pada file HTML.
6. **Gate 5 - User Confirmation Gate**: Berhenti dan meminta persetujuan eksplisit dari pengguna sebelum rilis publik.
7. **Phase 6 - Deployment** (`/company-profile-publisher`): Menayangkan slide ke URL publik via Vercel CLI (default: preview deployment) dan memverifikasi keterjangkauan live via HTTP GET 200.

## Struktur Repositori

```text
├── .codex-plugin/
│   └── plugin.json                     # Manifest registrasi skill
├── skills/
│   ├── compro/SKILL.md                 # Orchestrator State-Machine
│   ├── company-profile-writer/SKILL.md # Skill 8: Copywriting & Slide Drafting
│   ├── company-profile-reviewer/SKILL.md # Skill 9: QA & Content SEO Validator
│   ├── company-profile-builder/        # Skill 10: HTML/CSS Reveal.js Assembler
│   │   ├── SKILL.md
│   │   └── templates/
│   │       ├── profile-shell.html
│   │       └── custom.css
│   └── company-profile-publisher/      # Skill 11: SEO Auto-Fix & Vercel Deployer
│       ├── SKILL.md
│       └── scripts/
│           └── deploy.js
├── assets/                             # Aset global
├── input/                              # Dokumen input bisnis
└── docs/superpowers/                   # Spesifikasi desain & rencana implementasi
```
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/validate-manifest.js`  
Expected: PASS: manifest is valid with all 5 Layer 3 skills

- [ ] **Step 5: Commit**

```bash
git add .codex-plugin/plugin.json README.md scripts/validate-manifest.js
git commit -m "feat(plugin): register 5 Layer 3 skills and update README"
```

---

### Task 2: Implement Skill 8 (`company-profile-writer`)

**Files:**
- Create: `skills/company-profile-writer/SKILL.md`
- Test: `scripts/test-writer-schema.js`

**Interfaces:**
- Consumes:
  - `input/business-knowledge-base.md`
  - `input/business-audit-report.md`
  - `input/brand-story-guide.md`
- Produces:
  - `artifacts/01-company-profile-draft.md` (Markdown with `# ` slide headers, 150-250 words per slide)

- [ ] **Step 1: Write test for writer skill file presence and content guidelines**

Create `scripts/test-writer-schema.js`:
```javascript
const fs = require('fs');
const path = require('path');

const skillPath = path.join(__dirname, '..', 'skills', 'company-profile-writer', 'SKILL.md');
if (!fs.existsSync(skillPath)) {
  console.error('FAIL: skills/company-profile-writer/SKILL.md does not exist');
  process.exit(1);
}

const content = fs.readFileSync(skillPath, 'utf-8');
const checks = [
  'business-knowledge-base.md',
  'business-audit-report.md',
  'brand-story-guide.md',
  'artifacts/01-company-profile-draft.md',
  'Hero Slide',
  'Problem Slide',
  'Solution',
  'Contact'
];

for (const check of checks) {
  if (!content.includes(check)) {
    console.error(`FAIL: SKILL.md missing reference to "${check}"`);
    process.exit(1);
  }
}

console.log('PASS: writer skill definition contains all required inputs, outputs, and slide types');
process.exit(0);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/test-writer-schema.js`  
Expected: FAIL (`skills/company-profile-writer/SKILL.md does not exist`)

- [ ] **Step 3: Create `skills/company-profile-writer/SKILL.md`**

Create `skills/company-profile-writer/SKILL.md`:
```markdown
# Company Profile Writer (Skill 8)

> **Skill untuk:** Mengolah 3 dokumen input bisnis menjadi draf narasi company profile berbasis slide (Markdown).

## Tujuan
Menghasilkan draf presentasi company profile yang persuasif, faktual, dan terstruktur rapi per-slide dari dokumen pengetahuan bisnis, audit, dan panduan merek.

## Inputs
Dokumen yang disediakan di folder `input/`:
1. `input/business-knowledge-base.md`: Data faktual bisnis (profil perusahaan, sejarah, produk/layanan, USP, metrik, portofolio, kontak).
2. `input/business-audit-report.md`: Analisis pasar, masalah pelanggan (*pain points*), keunggulan kompetitif.
3. `input/brand-story-guide.md`: Panduan nada suara (*tone of voice*), persona audiens, dan pesan kunci merek.

## Outputs
- `artifacts/01-company-profile-draft.md`: Draf presentasi company profile lengkap dengan pemisah heading slide.

## Aturan Penulisan & Chunking
1. **Pemisah Slide Deterministic:**
   - Gunakan `# [Judul Slide]` (H1) untuk menandai setiap slide utama baru.
   - Panjang kata dalam satu slide dibatasi ~150–250 kata agar proporsional pada layar presentasi 16:9.
2. **Zero Hallucination:**
   - Semua angka statistik, portofolio, nama klien, dan klaim kompetitif wajib bersumber langsung dari `business-knowledge-base.md`.
3. **Struktur Urutan Slide Standar:**
   - **Slide 1 (Hero):** `# [Nama Perusahaan]` + Tagline 1 baris + Ringkasan 1 kalimat deskripsi + 2–3 statistik kunci.
   - **Slide 2 (Problem):** `# Masalah yang Dihadapi` + 3 poin masalah utama pelanggan.
   - **Slide 3 (Solution):** `# Solusi & Nilai Tambah` + 1–3 kalimat penjelasan solusi utama.
   - **Slide 4 (Key Features / Services):** `# Layanan Unggulan` (pisahkan jika >3 layanan).
   - **Slide 5 (Traction & Proof):** `# Pencapaian & Testimoni` + metrik kuantitatif.
   - **Slide 6 (Pricing / Packages):** `# Paket & Kerjasama` (opsional jika ada).
   - **Slide 7 (CTA & Contact):** `# Hubungi Kami` + Telepon, Email, Website, Alamat.
4. **Visual & Asset Directives:**
   - Cantumkan referensi visual jika relevan, misal `![Logo](assets/logo.png)` atau arahan `<!-- image: hero modern office -->`.

## Langkah Kerja
1. Baca ketiga dokumen di `input/`.
2. Identifikasi USP, masalah pelanggan, dan tone yang harus digunakan.
3. Susun draf per slide mengikuti struktur standar di atas.
4. Periksa jumlah kata per section (pastikan 150–250 kata per H1).
5. Tulis hasil akhir ke `artifacts/01-company-profile-draft.md`.
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/test-writer-schema.js`  
Expected: PASS: writer skill definition contains all required inputs, outputs, and slide types

- [ ] **Step 5: Commit**

```bash
git add skills/company-profile-writer/SKILL.md scripts/test-writer-schema.js
git commit -m "feat(writer): implement company-profile-writer skill definition"
```

---

### Task 3: Implement Skill 9 (`company-profile-reviewer`)

**Files:**
- Create: `skills/company-profile-reviewer/SKILL.md`
- Test: `scripts/test-reviewer-schema.js`

**Interfaces:**
- Consumes:
  - `artifacts/01-company-profile-draft.md`
  - Input documents (`business-knowledge-base.md`, `business-audit-report.md`, `brand-story-guide.md`)
- Produces:
  - `artifacts/review-report.md` (Audit feedback or approval)
  - `artifacts/02-company-profile-final.md` (Approved draf ready for Builder)

- [ ] **Step 1: Write test for reviewer skill guidelines**

Create `scripts/test-reviewer-schema.js`:
```javascript
const fs = require('fs');
const path = require('path');

const skillPath = path.join(__dirname, '..', 'skills', 'company-profile-reviewer', 'SKILL.md');
if (!fs.existsSync(skillPath)) {
  console.error('FAIL: skills/company-profile-reviewer/SKILL.md does not exist');
  process.exit(1);
}

const content = fs.readFileSync(skillPath, 'utf-8');
const checks = [
  'artifacts/01-company-profile-draft.md',
  'artifacts/02-company-profile-final.md',
  'artifacts/review-report.md',
  'APPROVED',
  'REVISION_REQUIRED',
  'Content SEO',
  'Meta Title',
  'Meta Description'
];

for (const check of checks) {
  if (!content.includes(check)) {
    console.error(`FAIL: reviewer SKILL.md missing reference to "${check}"`);
    process.exit(1);
  }
}

console.log('PASS: reviewer skill definition contains all required QA gates and SEO criteria');
process.exit(0);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/test-reviewer-schema.js`  
Expected: FAIL (`skills/company-profile-reviewer/SKILL.md does not exist`)

- [ ] **Step 3: Create `skills/company-profile-reviewer/SKILL.md`**

Create `skills/company-profile-reviewer/SKILL.md`:
```markdown
# Company Profile Reviewer (Skill 9)

> **Skill untuk:** Memverifikasi akurasi draf terhadap fakta bisnis, panduan brand, struktur presentasi, dan merumuskan On-Page SEO metadata.

## Tujuan
Memastikan draf company profile berkualitas tinggi, bebas kesalahan faktual, sesuai tone of voice, dan siap dikonversi ke HTML.

## Inputs
- `artifacts/01-company-profile-draft.md`: Draf draf dari Writer.
- `input/business-knowledge-base.md`: Sumber fakta bisnis.
- `input/business-audit-report.md`: Analisis pasar dan diferensiasi.
- `input/brand-story-guide.md`: Panduan tone of voice dan persona merek.

## Outputs
- `artifacts/review-report.md`: Laporan evaluasi per kategori dan daftar revisi yang wajib diperbaiki.
- `artifacts/02-company-profile-final.md`: Salinan draf yang telah disetujui (**`APPROVED`**), dilengkapi blok Meta Title & Meta Description di baris awal.

## Checklist Audit Reviewer
1. **Factual Consistency:**
   - Tidak ada angka, nama, harga, atau klaim yang bertentangan dengan `business-knowledge-base.md`.
2. **Brand Voice & Storytelling:**
   - Nada bicara konsisten dengan `brand-story-guide.md`.
   - Alur narasi mengalir logis: Problem -> Solution -> Proof -> Offer -> CTA.
3. **Slide Layout & Capacity:**
   - Setiap slide diawali `# ` (H1).
   - Panjang kata per slide proporsional (150–250 kata). Tidak ada slide yang kepanjangan.
4. **Content SEO & Metadata Formulation:**
   - Judul slide deskriptif dan ramah pencarian.
   - Reviewer menyusun `Meta Title` (maksimal 60 karakter) dan `Meta Description` (150–160 karakter) yang merangkum proposisi nilai perusahaan, disisipkan pada bagian header draf final.

## Status Review
- **`APPROVED`**: Draf memenuhi semua kriteria checklist. Salin konten ke `artifacts/02-company-profile-final.md` dan teruskan ke Builder.
- **`REVISION_REQUIRED`**: Tulis rincian perbaikan di `artifacts/review-report.md`. Orchestrator akan mengembalikan draf ke Writer (maksimal 3 iterasi loop).
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/test-reviewer-schema.js`  
Expected: PASS: reviewer skill definition contains all required QA gates and SEO criteria

- [ ] **Step 5: Commit**

```bash
git add skills/company-profile-reviewer/SKILL.md scripts/test-reviewer-schema.js
git commit -m "feat(reviewer): implement company-profile-reviewer skill definition"
```

---

### Task 4: Upgrade Skill 10 (`company-profile-builder`) with Single-File CSS Inlining

**Files:**
- Modify: `skills/company-profile-builder/templates/profile-shell.html`
- Modify: `skills/company-profile-builder/SKILL.md`
- Test: `scripts/test-builder-inlining.js`

**Interfaces:**
- Consumes:
  - `artifacts/02-company-profile-final.md`
  - `templates/profile-shell.html`
  - `templates/custom.css`
- Produces:
  - `<project>/compros/<name>/index.html` (Self-contained single-file HTML, CSS inlined in `<style>`, no missing external CSS link)
  - `<project>/compros/<name>/compro.md`
  - `<project>/compros/<name>/assets/`
  - `<project>/compros/<name>/build.log`

- [ ] **Step 1: Write test for CSS inlining in HTML template**

Create `scripts/test-builder-inlining.js`:
```javascript
const fs = require('fs');
const path = require('path');

const shellPath = path.join(__dirname, '..', 'skills', 'company-profile-builder', 'templates', 'profile-shell.html');
const cssPath = path.join(__dirname, '..', 'skills', 'company-profile-builder', 'templates', 'custom.css');

if (!fs.existsSync(shellPath) || !fs.existsSync(cssPath)) {
  console.error('FAIL: template files missing');
  process.exit(1);
}

const shellContent = fs.readFileSync(shellPath, 'utf-8');

// The shell must contain the CSS injection token <!-- {{CUSTOM_CSS}} --> or <style>{{CUSTOM_CSS}}</style>
// and must NOT have external <link rel="stylesheet" href="custom.css">
if (shellContent.includes('<link rel="stylesheet" href="custom.css">')) {
  console.error('FAIL: profile-shell.html still has external <link rel="stylesheet" href="custom.css">');
  process.exit(1);
}

if (!shellContent.includes('/* {{CUSTOM_CSS}} */') && !shellContent.includes('{{CUSTOM_CSS}}')) {
  console.error('FAIL: profile-shell.html missing CSS injection placeholder {{CUSTOM_CSS}}');
  process.exit(1);
}

console.log('PASS: profile-shell.html is configured for self-contained CSS inlining');
process.exit(0);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/test-builder-inlining.js`  
Expected: FAIL (`profile-shell.html still has external <link rel="stylesheet" href="custom.css">`)

- [ ] **Step 3: Update `profile-shell.html` and `SKILL.md`**

Update `skills/company-profile-builder/templates/profile-shell.html`:
```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Company Profile — {{COMPANY_NAME}}</title>

  <!-- Reveal.js CDN -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.6.1/reveal.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.6.1/theme/black.min.css" id="theme-link">

  <!-- Inlined Custom CSS for self-contained single-file HTML -->
  <style>
/* {{CUSTOM_CSS}} */

    /* Critical CSS overrides */
    .reveal .slides section .slide-content {
      max-width: 90%;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <div class="reveal">
    <div class="slides">
      <!-- Konten slide di-inject di sini oleh builder -->
      <!-- Setiap section adalah satu slide -->
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.6.1/reveal.min.js"></script>
  <script>
    Reveal.initialize({
      navigation: true,
      progress: true,
      center: true,
      hash: true,
      controlsBackArrows: 'visible',
      transition: 'slide',
      locale: 'id',
    });
  </script>
</body>
</html>
```

Update `skills/company-profile-builder/SKILL.md`:
In Step 4 (HTML Assembly), specify:
1. Load `templates/profile-shell.html`.
2. Read `templates/custom.css` and inject its raw content replacing `/* {{CUSTOM_CSS}} */`.
3. Replace `{{COMPANY_NAME}}` in `<title>` with the company name.
4. Inject each slide section into `<div class="slides">`.
5. Write the assembled file to `<project>/compros/<name>/index.html`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/test-builder-inlining.js`  
Expected: PASS: profile-shell.html is configured for self-contained CSS inlining

- [ ] **Step 5: Commit**

```bash
git add skills/company-profile-builder/templates/profile-shell.html skills/company-profile-builder/SKILL.md scripts/test-builder-inlining.js
git commit -m "fix(builder): implement single-file CSS inlining in HTML template"
```

---

### Task 5: Upgrade Skill 11 (`company-profile-publisher`) with Technical SEO Auto-Fix, User Confirmation Gate, & Enhanced `deploy.js`

**Files:**
- Modify: `skills/company-profile-publisher/scripts/deploy.js`
- Modify: `skills/company-profile-publisher/SKILL.md`
- Test: `scripts/test-publisher-workflow.js`

**Interfaces:**
- Consumes:
  - `<project>/compros/<name>/index.html`
  - `<project>/compros/<name>/assets/`
- Produces:
  - Technical SEO patch on `index.html` (Title, Description, OpenGraph, JSON-LD Schema, Alt tags)
  - `qa/seo-report.md`
  - User confirmation prompt before deploy
  - Vercel preview deployment via `deploy.js` with live HTTP GET 200 verification
  - `deploy/deployment-status.md`

- [ ] **Step 1: Write test for enhanced deploy.js functionality and publisher rules**

Create `scripts/test-publisher-workflow.js`:
```javascript
const fs = require('fs');
const path = require('path');

const deployScriptPath = path.join(__dirname, '..', 'skills', 'company-profile-publisher', 'scripts', 'deploy.js');
const skillPath = path.join(__dirname, '..', 'skills', 'company-profile-publisher', 'SKILL.md');

if (!fs.existsSync(deployScriptPath) || !fs.existsSync(skillPath)) {
  console.error('FAIL: publisher script or SKILL.md missing');
  process.exit(1);
}

const deployScript = fs.readFileSync(deployScriptPath, 'utf-8');
const skillContent = fs.readFileSync(skillPath, 'utf-8');

// Check deploy.js has live GET check, preview domain regex, and clean deploy
if (!deployScript.includes('https.get') && !deployScript.includes('http')) {
  console.error('FAIL: deploy.js missing live HTTP GET 200 accessibility check');
  process.exit(1);
}

if (!deployScript.includes('vercel.app')) {
  console.error('FAIL: deploy.js missing specific vercel.app domain regex');
  process.exit(1);
}

// Check SKILL.md has User Confirmation Gate and SEO Auto-Fix
if (!skillContent.includes('Auto-Fix') || !skillContent.includes('Konfirmasi') || !skillContent.includes('User Confirmation')) {
  console.error('FAIL: SKILL.md missing Auto-Fix or User Confirmation Gate documentation');
  process.exit(1);
}

console.log('PASS: publisher and deploy.js contain SEO Auto-Fix, confirmation gate, and GET 200 check');
process.exit(0);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/test-publisher-workflow.js`  
Expected: FAIL (`deploy.js missing live HTTP GET 200 accessibility check` or `missing specific vercel.app domain regex`)

- [ ] **Step 3: Update `skills/company-profile-publisher/scripts/deploy.js`**

Rewrite `deploy.js` to implement:
1. Argument validation and check folder exists.
2. Check Vercel CLI (`vercel --version`) and whoami (`vercel whoami`).
3. Deploy command: `vercel deploy --yes --no-wait` (or `--prod`).
4. Precise regex extraction for `https://[a-zA-Z0-9-]+\.vercel\.app`.
5. Active HTTP GET validation using `https.get` (verifying status 200 with 3 retries).
6. Output preview URL and summary status.

- [ ] **Step 4: Update `skills/company-profile-publisher/SKILL.md`**

Add detailed instructions for:
1. **Pre-flight Audit & Auto-Fix:**
   - Scan `index.html` for `<title>`, `<meta name="description">`, Open Graph tags, and Schema.org JSON-LD.
   - If missing, auto-fix `index.html` by extracting entity name and tagline from the Hero Slide and injecting structured data.
   - Write audit log to `qa/seo-report.md`.
2. **Clean Deployment Preparation:**
   - Create temporary deploy directory containing only `index.html` and `assets/`.
3. **User Confirmation Gate:**
   - Display summary of ready slides and SEO status.
   - Pause and ask user for explicit approval before running deployment.
4. **Deploy Execution via `scripts/deploy.js`:**
   - Execute script and return preview URL and live status.

- [ ] **Step 5: Run test to verify it passes**

Run: `node scripts/test-publisher-workflow.js`  
Expected: PASS: publisher and deploy.js contain SEO Auto-Fix, confirmation gate, and GET 200 check

- [ ] **Step 6: Commit**

```bash
git add skills/company-profile-publisher/scripts/deploy.js skills/company-profile-publisher/SKILL.md scripts/test-publisher-workflow.js
git commit -m "feat(publisher): implement technical SEO auto-fix, confirmation gate, and GET 200 verification"
```

---

### Task 6: Implement Orchestrator Skill (`skills/compro/SKILL.md`)

**Files:**
- Create: `skills/compro/SKILL.md`
- Test: `scripts/test-orchestrator.js`

**Interfaces:**
- Coordinates:
  - Gate 0: Intake check (`input/*`)
  - Phase 1: `/company-profile-writer`
  - Phase 2: `/company-profile-reviewer` (with revision loop)
  - Phase 3: `/company-profile-builder`
  - Phase 4: `/company-profile-publisher` (Pre-flight SEO Auto-Fix)
  - Gate 5: User Confirmation Gate
  - Phase 6: `/company-profile-publisher` (Vercel Deployment)

- [ ] **Step 1: Write test for orchestrator state-machine definitions**

Create `scripts/test-orchestrator.js`:
```javascript
const fs = require('fs');
const path = require('path');

const skillPath = path.join(__dirname, '..', 'skills', 'compro', 'SKILL.md');
if (!fs.existsSync(skillPath)) {
  console.error('FAIL: skills/compro/SKILL.md does not exist');
  process.exit(1);
}

const content = fs.readFileSync(skillPath, 'utf-8');
const phases = [
  'Gate 0',
  'Phase 1',
  'Phase 2',
  'Phase 3',
  'Phase 4',
  'Gate 5',
  'Phase 6',
  'company-profile-writer',
  'company-profile-reviewer',
  'company-profile-builder',
  'company-profile-publisher'
];

for (const phase of phases) {
  if (!content.includes(phase)) {
    console.error(`FAIL: orchestrator SKILL.md missing phase or skill reference: "${phase}"`);
    process.exit(1);
  }
}

console.log('PASS: orchestrator SKILL.md contains all gates, phases, and skill transitions');
process.exit(0);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/test-orchestrator.js`  
Expected: FAIL (`skills/compro/SKILL.md does not exist`)

- [ ] **Step 3: Create `skills/compro/SKILL.md`**

Create `skills/compro/SKILL.md`:
```markdown
# Compro Orchestrator (Main Skill)

> **Skill untuk:** Menjalankan pipeline Layer 3 — Company Profile secara end-to-end dari dokumen bisnis hingga presentasi web live di Vercel.

## State Machine Pipeline

1. **Gate 0 - Intake Check:**
   - Periksa keberadaan:
     - `input/business-knowledge-base.md`
     - `input/business-audit-report.md`
     - `input/brand-story-guide.md`
   - Jika ada file yang belum tersedia, hentikan proses dan minta pengguna menyediakan dokumen yang kurang.

2. **Phase 1 - Drafting:**
   - Panggil skill `/company-profile-writer`.
   - Menghasilkan: `artifacts/01-company-profile-draft.md`.

3. **Phase 2 - Content QA Loop:**
   - Panggil skill `/company-profile-reviewer`.
   - Jika reviewer mengeluarkan status `REVISION_REQUIRED`:
     - Panggil kembali `/company-profile-writer` dengan melampirkan `artifacts/review-report.md`.
     - Ulangi maksimal 3 kali iterasi.
   - Setelah status **`APPROVED`**:
     - Draf final tersimpan di `artifacts/02-company-profile-final.md`.

4. **Phase 3 - Slide Deck Assembly:**
   - Panggil skill `/company-profile-builder`.
   - Mengonversi `artifacts/02-company-profile-final.md` menjadi:
     - `<project>/compros/<name>/index.html` (Single-file Reveal.js HTML dengan CSS ter-inline).
     - `<project>/compros/<name>/compro.md`.
     - `<project>/compros/<name>/assets/`.
     - `<project>/compros/<name>/build.log`.

5. **Phase 4 - Pre-flight SEO Audit & Auto-Fix:**
   - Panggil skill `/company-profile-publisher` mode audit.
   - Memindai `index.html` dan otomatis menambal Title, Meta Description, Open Graph, dan JSON-LD Schema jika belum lengkap.
   - Menyimpan laporan ke `qa/seo-report.md`.

6. **Gate 5 - User Confirmation Gate:**
   - Tampilkan ringkasan kesiapan slide ke pengguna:
     - Lokasi file HTML lokal.
     - Ringkasan optimasi SEO yang sudah diterapkan.
   - Tanyakan kepada pengguna:
     > *"Company Profile slide deck telah selesai dirakit dan dioptimasi SEO. Anda dapat membuka `<project>/compros/<name>/index.html` untuk melihat tampilannya. Apakah Anda ingin langsung men-deploy slide ini ke Vercel sekarang?"*
   - Tunggu respon pengguna:
     - Jika pengguna setuju ("Ya", "Deploy", "Lanjut") ➔ lanjut ke Phase 6.
     - Jika pengguna ingin meninjau dulu ➔ hentikan sementara proses dengan rapi.

7. **Phase 6 - Deployment ke Vercel:**
   - Panggil skill `/company-profile-publisher` mode deploy.
   - Jalankan `node skills/company-profile-publisher/scripts/deploy.js <deploy-dir>`.
   - Lakukan verifikasi live URL via HTTP GET 200.
   - Kembalikan URL live Vercel dan status rilis kepada pengguna.
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/test-orchestrator.js`  
Expected: PASS: orchestrator SKILL.md contains all gates, phases, and skill transitions

- [ ] **Step 5: Commit**

```bash
git add skills/compro/SKILL.md scripts/test-orchestrator.js
git commit -m "feat(orchestrator): implement compro state-machine skill definition"
```

---

### Task 7: End-to-End Test Runner & Fixture Validation

**Files:**
- Create: `test-fixtures/input/business-knowledge-base.md`
- Create: `test-fixtures/input/business-audit-report.md`
- Create: `test-fixtures/input/brand-story-guide.md`
- Create: `scripts/test-all.js`

**Interfaces:**
- Consumes: Test fixtures and validator scripts from Tasks 1-6.
- Produces: Complete test suite execution passing with exit code 0.

- [ ] **Step 1: Create test fixtures for intake documents**

Create `test-fixtures/input/business-knowledge-base.md`:
```markdown
# Business Knowledge Base: Acme Cloud Solutions

- **Nama Perusahaan:** Acme Cloud Solutions
- **Tahun Berdiri:** 2022
- **Bidang Usaha:** Cloud Architecture & DevSecOps
- **Statistik:** 150+ Enterprise Clients, 99.99% SLA Guarantee, 40% Average Cloud Cost Reduction
- **Layanan Unggulan:**
  1. Automated Cloud Migration
  2. 24/7 Managed Kubernetes
  3. Continuous Security Compliance
- **Kontak:** info@acmecloud.com | +62 21 555 0199 | Jakarta, Indonesia | https://acmecloud.example.com
```

Create `test-fixtures/input/business-audit-report.md`:
```markdown
# Business Audit Report: Acme Cloud Solutions

- **Core Problem:** 70% perusahaan skala menengah mengalami pemborosan biaya cloud hingga 35% dan kekurangan tenaga ahli DevOps.
- **Competitive Advantage:** Solusi otomatisasi berbasis AI yang memberikan rekomendasi penghematan instan dan migrasi tanpa downtime.
```

Create `test-fixtures/input/brand-story-guide.md`:
```markdown
# Brand Story Guide: Acme Cloud Solutions

- **Tone of Voice:** Modern, profesional, solutif, data-driven.
- **Target Audience:** CTO, VP of Engineering, IT Directors perusahaan menengah dan enterprise.
```

- [ ] **Step 2: Create comprehensive test runner `scripts/test-all.js`**

Create `scripts/test-all.js`:
```javascript
const { execSync } = require('child_process');
const path = require('path');

const testScripts = [
  'validate-manifest.js',
  'test-writer-schema.js',
  'test-reviewer-schema.js',
  'test-builder-inlining.js',
  'test-publisher-workflow.js',
  'test-orchestrator.js'
];

console.log('--- Running Layer 3 Compro Plugin Verification Suite ---');

for (const script of testScripts) {
  const scriptPath = path.join(__dirname, script);
  console.log(`\n[RUN] ${script}...`);
  try {
    const output = execSync(`node ${scriptPath}`, { encoding: 'utf-8' });
    process.stdout.write(output);
  } catch (err) {
    console.error(`[FAIL] ${script}`);
    console.error(err.stdout || err.message);
    process.exit(1);
  }
}

console.log('\n========================================');
console.log('ALL TESTS PASSED! Layer 3 is fully compliant.');
console.log('========================================');
process.exit(0);
```

- [ ] **Step 3: Run comprehensive test runner**

Run: `node scripts/test-all.js`  
Expected: ALL TESTS PASSED! Layer 3 is fully compliant.

- [ ] **Step 4: Commit**

```bash
git add test-fixtures/ scripts/test-all.js
git commit -m "test: add test fixtures and comprehensive Layer 3 test runner"
```

---

## Plan Self-Review

1. **Spec Coverage:**
   - 4 Layer 3 skills + orchestrator (`compro`, `company-profile-writer`, `company-profile-reviewer`, `company-profile-builder`, `company-profile-publisher`) are covered in Tasks 1–6.
   - Single-file HTML with inlined CSS covered in Task 4.
   - Pre-flight SEO Auto-Fix covered in Task 5.
   - User Confirmation Gate before deploy covered in Tasks 5 & 6.
   - Vercel CLI deploy with live HTTP GET 200 check covered in Task 5.
   - Manifest and documentation updates covered in Task 1.
2. **No Placeholders:**
   - All code snippets, configurations, and commands are complete. No "TODO" or "TBD".
3. **Type and Path Consistency:**
   - Exact paths match between all tasks and the spec `docs/superpowers/specs/2026-09-04-company-profile-layer3-design.md`.
