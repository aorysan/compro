# Company Profile Slides — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun dua skill plugin compro — company-profile-builder (Markdown → HTML presentasi Reveal.js) dan company-profile-publisher (HTML → deploy ke Vercel) — berdasarkan spec `company-profile-slides-design.md`.

**Architecture:** 
- Builder: skill yang menerima Markdown input, melakukan chunking deterministic berdasarkan aturan H1/H2/word-count, menghasilkan single-file HTML Reveal.js berbasis template statis + CDN, menyimpan output di `<project>/compros/<name>/`
- Publisher: skill yang memvalidasi HTML, menyiapkan folder deployment, memanggil Vercel CLI untuk deploy, mengembalikan preview URL

**Tech Stack:**
- Reveal.js 4.6.1 (CDN:cdnjs)
- HTML/CSS/JavaScript statis (tidak ada build step)
- Vercel CLI (v112+ disarankan) untuk deployment
- Node.js 20+ untuk menjalankan script (opsional, kalau dipakai)
- Python 3.11+ (jika dipakai untuk parsing/helpers)

**Spec:** `company-profile-slides-design.md` (root repo)

**Spec Coverage:**
- §3 Template approach untuk konsistensi (statis shell + custom CSS + konten template + chunking rules)
- §4 Builder workflow (5 step: parse, chunk, image, assembly, output)
- §5 Chunking algorithm
- §6 Image handling (validasi, inject, fallback)
- §7 Reveal.js config
- §8 Output directory structure
- §9 Publisher workflow (4 step: pre-deploy, prepare, execute, post-deploy)
- §10 Error handling

---

## Global Constraints

- **Output konsisten:** Template HTML dan CSS statis, tidak di-generate ulang tiap build. Builder hanya inject konten ke dalam template.
- **Chunking deterministic:** H1 = pemisah slide utama, konten ≤250 kata atau 1 topik per slide, H2/H3 sub-section jadi slide terpisah jika ada.
- **Gambar wajib divalidasi:** HEAD request harus 200 sebelum inject. Tidak ada placeholder yang menyesatkan.
- **CDN Reveal.js:** Gunakan versi 4.6.1 dari cdnjs. Tidak bundle library.
- **Deploy selalu preview:** Kecuali user minta eksplisit production.
- **Output direktori:** `<project>/compros/<name>/` dengan struktur: index.html, compro.md, assets/, build.log

---

## File Structure

### Plugin directory structure

```
.claude/plugins/compro/
├── skills/
│   ├── company-profile-builder/
│   │   ├── SKILL.md              ← Skill definition, instruksi untuk AI agent
│   │   ├── templates/
│   │   │   ├── profile-shell.html  ← Reveal.js HTML shell (statis)
│   │   │   └── custom.css          ← Brand CSS (statis, dikunci)
│   │   └── scripts/
│   │       └── build.js            ← (opsional) helper script Node.js
│   └── company-profile-publisher/
│       ├── SKILL.md               ← Skill definition, instruksi untuk AI agent
│       └── scripts/
│           └── deploy.js           ← (opsional) wrapper Vercel CLI
├── templates/                     ← Template global (jika diperlukan di level plugin)
│   └── ...
└── ...
```

### Output directory structure (di-project)

```
<project-root>/
└── compros/
    └── <name>/
        ├── index.html
        ├── compro.md
        ├── assets/
        │   └── *.png, *.jpg, *.webp
        └── build.log
```

---

## Task 1: Setup Plugin Directory Structure

**Files:**
- Create: `.claude/plugins/compro/skills/company-profile-builder/SKILL.md`
- Create: `.claude/plugins/compro/skills/company-profile-builder/templates/profile-shell.html`
- Create: `.claude/plugins/compro/skills/company-profile-builder/templates/custom.css`
- Create: `.claude/plugins/compro/skills/company-profile-publisher/SKILL.md`
- Create: `.claude/plugins/compro/skills/company-profile-publisher/scripts/deploy.js` (placeholder, implement di Task 5)

**Langkah-langkah:**

- [ ] **Step 1: Buat direktori plugin**

```bash
cd D:/AryokPunya/Magang/compro
mkdir -p .claude/plugins/compro/skills/company-profile-builder/templates
mkdir -p .claude/plugins/compro/skills/company-profile-builder/scripts
mkdir -p .claude/plugins/compro/skills/company-profile-publisher/scripts
```

- [ ] **Step 2: Commit direktori ke git**

```bash
git add -A
git commit -m "chore: create plugin directory structure for company-profile skills"
git push origin improvement
```

---

## Task 2: Buat Template HTML Shell dan Custom CSS (Builder)

**Files:**
- Create: `.claude/plugins/compro/skills/company-profile-builder/templates/profile-shell.html`
- Create: `.claude/plugins/compro/skills/company-profile-builder/templates/custom.css`

**Konten profile-shell.html:**

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Company Profile — <nama-company></title>

  <!-- Reveal.js CDN -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.6.1/reveal.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.6.1/theme/black.min.css" id="theme-link">
  <link rel="stylesheet" href="custom.css">

  <style>
    /* Inline critical CSS untuk memastikan render awal */
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
      // Set bahasa Indonesia
      locale: 'id',
    });
  </script>
</body>
</html>
```

**Konten custom.css:**

```css
/* ========================================
   Company Profile Slides — Custom CSS
   Template statis: edit file ini untuk perubahan visual
   ======================================== */

/* Warna brand — sesuaikan dengan kebutuhan */
:root {
  --color-primary: #6366f1;      /* Indigo */
  --color-secondary: #ec4899;    /* Pink */
  --color-accent: #10b981;       /* Emerald */
  --color-text: #f8fafc;         /* Light text on dark */
  --color-text-muted: #94a3b8;   /* Muted text */
  --color-background: #0f172a;   /* Dark slide background */
  --color-card-bg: rgba(255,255,255,0.05);
  --color-card-border: rgba(255,255,255,0.1);
}

/* Global */
.reveal {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--color-text);
}

.reveal .slides section {
  background-color: var(--color-background);
}

/* Typography */
.reveal h1, .reveal h2, .reveal h3 {
  color: var(--color-text);
  font-weight: 700;
}

.reveal h1 {
  font-size: 2.5em;
  margin-bottom: 0.5em;
}

.reveal h2 {
  font-size: 1.8em;
  margin-top: 0;
  margin-bottom: 0.5em;
}

.reveal p {
  font-size: 1.1em;
  line-height: 1.6;
  color: var(--color-text-muted);
}

/* Statistik / angka besar */
.reveal .stat {
  font-size: 3em;
  font-weight: 800;
  color: var(--color-accent);
}

/* Kartu fitur */
.reveal .feature-card {
  background: var(--color-card-bg);
  border: 1px solid var(--color-card-border);
  border-radius: 12px;
  padding: 1.5em;
  margin: 1em 0;
  transition: transform 0.2s, box-shadow 0.2s;
}

.reveal .feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.3);
}

.reveal .feature-card h3 {
  color: var(--color-accent);
  margin-top: 0;
}

/* Tabel */
.reveal table {
  font-size: 0.9em;
  border-collapse: collapse;
  width: 100%;
}

.reveal th {
  background: rgba(99,102,241,0.3);
  padding: 0.5em 1em;
  text-align: left;
  font-weight: 600;
}

.reveal td {
  padding: 0.5em 1em;
  border-bottom: 1px solid var(--color-card-border);
}

/* Hero section */
.reveal .hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 60%;
}

.reveal .hero-section h1 {
  font-size: 3.5em;
  margin-bottom: 0.3em;
}

.reveal .hero-section .tagline {
  font-size: 1.5em;
  color: var(--color-text-muted);
  margin-bottom: 1em;
}

/* Gaya list */
.reveal ul {
  font-size: 1em;
}

.reveal li {
  margin-bottom: 0.3em;
}

/* Logo placeholder */
.reveal .logo-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--color-card-bg);
  border: 2px dashed var(--color-card-border);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1em;
  color: var(--color-text-muted);
  font-size: 0.9em;
}

/* Gaya presentasi contact */
.reveal .contact-item {
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin: 0.3em 0;
}
```

- [ ] **Step 1: Write template files**

Gunakan perintah write_file untuk membuat kedua file di atas.

- [ ] **Step 2: Validasi template**

Buka file di editor, pastikan tidak ada syntax error. Cek:
  - HTML tag tertutup dengan benar
  - CSS valid (tidak ada syntax error)
  - CDN link benar (https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.6.1/...)

- [ ] **Step 3: Commit**

```bash
git add .claude/plugins/compro/skills/company-profile-builder/templates/
git commit -m "feat(builder): add Reveal.js template shell and custom CSS"
git push origin improvement
```

---

## Task 3: Implementasi Skill Definition — company-profile-builder (SKILL.md)

**Files:**
- Modify/Create: `.claude/plugins/compro/skills/company-profile-builder/SKILL.md`

**Skill definition ini adalah instruksi utama untuk AI agent yang menjalankan skill.** Berikut isi yang harus ditulis:

```markdown
# Company Profile Builder

> **Skill untuk:** Mengubah Company Profile (Markdown) menjadi HTML presentasi slide-based (Reveal.js) yang siap di-deploy.

## Tujuan
Mengkonversi dokumen Markdown company profile menjadi single-file HTML presentasi interactif menggunakan Reveal.js. Output harus konsisten — urutan, struktur, dan gaya ditentukan oleh template statis, bukan discretion AI.

## Input
- File Markdown company profile: path disediakan oleh caller
- Gambar (opsional): path/URL gambar yang disediakan user, atau jika user ingin tambah gambar, agent boleh mencari/generate

## Output
- `<project>/compros/<name>/index.html` — single-file HTML presentasi
- `<project>/compros/<name>/compro.md` — Markdown asli (copy)
- `<project>/compros/<name>/assets/` — folder gambar (jika ada)
- `<project>/compros/<name>/build.log` — log chunking dan image handling

## Prinsip
1. **Konsistensi:** Gunakan template statis (`templates/profile-shell.html`) dan CSS statis (`templates/custom.css`). Jangan modifikasi template; hanya inject konten.
2. **Chunking deterministic:** H1 = pemisah slide utama. Konten dalam satu slide dibatasi ~150-250 kata atau 1 topik utama.
3. **Gambar valid:** HEAD request ke URL gambar harus 200 sebelum inject. Jika tidak accessible, skip dan catat di build.log.
4. **Tidak ada hallucination:** Jika gambar tidak tersedia, tidak paksa placeholder. Slide tetap tampil tanpa gambar.

## Langkah Kerja

### 1. Parse dan Analyze Markdown
- Baca file Markdown input
- Identifikasi struktur heading (H1, H2, H3)
- Hitung perkiraan kata per section
- Catat semua referensi gambar yang ada di Markdown

### 2. Chunking — Tentukan Slide
Terapkan aturan chunking:
- Setiap H1 → awal slide baru
- Konten dalam satu slide: maksimal ~250 kata atau 1 topik
- Kalau section terlalu panjang, pecah berdasarkan H2/H3 sub-section, atau paragraf natural
- Tabel besar (>5 baris): slide sendiri
- Tiap fitur utama: slide terpisah

Hasil: daftar slide dengan konten yang sudah dipetakan.

### 3. Handle Gambar
- Jika user menyediakan gambar (path/URL dalam Markdown atau via instruksi khusus):
  - Validasi setiap URL: HEAD request, cek 200
  - Jika URL remote dan valid: inject sebagai `<img src="URL">`
  - Jika path lokal: copy ke `assets/`, inject sebagai path relatif
  - Jika gagal: catat di build.log, skip gambar
- Jika user ingin tambah gambar dan AI perlu mencari/generate:
  - Cari atau generate gambar yang relevan
  - Validasi accessibility (HEAD 200)
  - Simpan ke assets/, inject
  - Jika tidak ada yang valid: skip, catat

### 4. Assembly HTML
- Load template `profile-shell.html`
- Inject konten setiap slide ke dalam `<div class="slides">` sebagai `<section>`
- Konten slide menggunakan format sesuai template (lihat panduan di bawah)
- Jika ada gambar, inject `<img>` dengan path yang valid
- Tulis file `index.html` ke output directory

### 5. Output
- Create directory: `<project>/compros/<name>/`
- Tulis `index.html`
- Copy `compro.md` (Markdown asli)
- Buat `assets/` folder (kalau ada gambar)
- Tulis `build.log` dengan:
  - Jumlah slide
  - Alasan splitting per slide (jika ada)
  - Path gambar yang di-inject
  - Gambar yang skip (jika ada)

## Template Konten per Slide

### Slide Hero
```
# [Judul Perusahaan]
[Tagline/slogan — 1 baris]

💼 [1 kalimat deskripsi singkat]

📊 [1-3 statistik kunci, bulleted]
```

### Slide Problem
```
## Masalah yang Dihadapi

- [Pain point 1]
- [Pain point 2]
- [Pain point 3]
```

### Slide Solusi/Fitur
```
## [Nama Fitur]

[Deskripsi fitur: 1-3 kalimat]

✨ [Benefit utama]
```

### Slide Pricing
```
## Paket & Harga

| Paket | Harga | Fitur Utama |
|-------|-------|-------------|
| ...   | ...   | ...         |
```

### Slide CTA/Contact
```
## Hubungi Kami

📞 [Kontak]
🌐 [Website]
📍 [Alamat]
```

## Error Handling

| Skenario | Tindakan |
|----------|----------|
| File Markdown tidak ada | Error: "Markdown file not found at <path>" |
| File kosong | Error: "Markdown file is empty" |
| Gambar tidak accessible | Skip gambar, catat di build.log |
| Konten sangat pendek (<50 kata) | Tetap generate minimal 1 slide |
| Konten sangat panjang (>5000 kata) | Chunking ke banyak slide, tidak error |

## Contoh Penggunaan

**User request:** "Buatkan company profile slides dari file `D:/project/compro.md` dengan nama perusahaan 'Acme Inc'"

**Skill execution:**
1. Baca `D:/project/compro.md`
2. Parse, chunking → tentukan slide
3. Handle gambar (jika ada)
4. Assembly HTML dengan template
5. Output ke `<project>/compros/acme-inc/index.html`
6. Return pesan: "Company profile slides dibuat di `<path>/index.html` dengan N slide"
```

- [ ] **Step 1: Write SKILL.md**

Tulis file SKILL.md dengan konten di atas.

- [ ] **Step 2: Commit**

```bash
git add .claude/plugins/compro/skills/company-profile-builder/SKILL.md
git commit -m "feat(builder): add company-profile-builder skill definition"
git push origin improvement
```

---

## Task 4: Implementasi Skill Definition — company-profile-publisher (SKILL.md)

**Files:**
- Create/Modify: `.claude/plugins/compro/skills/company-profile-publisher/SKILL.md`

**Isi SKILL.md:**

```markdown
# Company Profile Publisher

> **Skill untuk:** Mendeploy HTML Company Profile (hasil dari company-profile-builder) ke Vercel sebagai website live.

## Tujuan
Menerima file HTML presentasi dari builder, memvalidasi, menyiapkan folder deployment, dan mendeploy ke Vercel menggunakan Vercel CLI. Kembalikan preview URL ke user.

## Input
- Path ke HTML file: `<project>/compros/<name>/index.html`
- (Opsional) Informasi nama project dari caller

## Output
- Preview URL: URL website yang sudah di-deploy
- Status deploy: berhasil / gagal + pesan error (kalau gagal)
- Claim URL (jika tersedia dari CLI output)

## Prinsip
1. **Selalu preview:** Deploy sebagai preview URL, bukan production, kecuali user minta eksplisit.
2. **Validasi dulu:** Cek file ada dan bisa dibaca sebelum deploy.
3. **CDN dependency check:** Pastikan CDN Reveal.js reachable (karena HTML bergantung ke CDN).

## Langkah Kerja

### 1. Pre-deploy Validation
- Cek file HTML ada: `test -f <path>/index.html`
- Cek file bisa dibaca: `test -r <path>/index.html`
- Cek dependencies: lakukan HEAD request ke `https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.6.1/reveal.min.css` — pastikan 200
- Jika ada yang gagal: error dengan pesan jelas

### 2. Prepare Deployment Directory
- Buat folder deployment sementara (misal: `<temp>/deploy-<timestamp>/`)
- Copy `index.html` ke folder deployment
- Jika ada `assets/` folder: copy seluruh isinya ke folder deployment
- Folder deployment harus flat: index.html di root, assets/ di root

### 3. Execute Deploy ke Vercel
- Cek Vercel CLI tersedia: `vercel --version`
- Jika tidak ada: error "Vercel CLI not found. Install with: npm i -g vercel"
- Eksekusi deploy:

```bash
cd <deployment-directory>
vercel deploy --yes --implicit-commit --path <deployment-directory>
```

- Parse output CLI untuk mendapatkan preview URL

### 4. Post-deploy
- Cek preview URL accessibility: HTTP GET, pastikan 200
- Kembalikan ke user:
  - Preview URL
  - Status: berhasil
  - (Opsional) Claim URL jika tersedia

## Error Handling

| Skenario | Tindakan |
|----------|----------|
| HTML file tidak ada | Error: "HTML file not found at <path>" |
| Vercel CLI tidak ter-install | Error: "Vercel CLI not found. Install: npm i -g vercel" |
| Vercel CLI tidak ter-auth | Error: "Vercel CLI not authenticated. Run: vercel login" |
| Deploy gagal | Kembalikan error message dari CLI |
| Preview URL tidak reachable | Cek ulang, laporkan ke user |

## Contoh Penggunaan

**User request:** "Deploy company profile slides ke Vercel"

**Skill execution:**
1. Validasi HTML file
2. Prepare deployment folder
3. Deploy ke Vercel
4. Return: "Company profile berhasil di-deploy ke: https://project-git-branch-user.vercel.app"
```

- [ ] **Step 1: Write SKILL.md**

Tulis file SKILL.md dengan konten di atas.

- [ ] **Step 2: Commit**

```bash
git add .claude/plugins/compro/skills/company-profile-publisher/SKILL.md
git commit -m "feat(publisher): add company-profile-publisher skill definition"
git push origin improvement
```

---

## Task 5: Implementasi Script Helper (opsional — publisher deploy wrapper)

**Files:**
- Create: `.claude/plugins/compro/skills/company-profile-publisher/scripts/deploy.js`

Script ini adalah helper yang bisa dipanggil oleh skill (atau digunakan mandiri) untuk mempersiapkan dan men-deploy. Implementasi bisa didorong ke dalam skill definition (Task 4) sebagai langkah-langkah yang dijalankan oleh AI agent. Jika ingin script otomatis, implementasi di task ini.

**Konten deploy.js (Node.js):**

```javascript
#!/usr/bin/env node

/**
 * deploy.js — Helper script untuk company-profile-publisher
 * Men-deploy folder ke Vercel menggunakan CLI
 * 
 * Usage: node deploy.js <folder-path> [--prod]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

const FOLDER = process.argv[2];
const IS_PROD = process.argv.includes('--prod');

if (!FOLDER) {
  console.error('Usage: node deploy.js <folder-path> [--prod]');
  process.exit(1);
}

if (!fs.existsSync(FOLDER)) {
  console.error(`Folder not found: ${FOLDER}`);
  process.exit(1);
}

// Step 1: Check Vercel CLI
try {
  execSync('vercel --version', { stdio: 'ignore' });
} catch {
  console.error('Vercel CLI not found. Install with: npm i -g vercel');
  process.exit(1);
}

// Step 2: Check auth
try {
  execSync('vercel whoami', { stdio: 'ignore' });
} catch {
  console.error('Vercel CLI not authenticated. Run: vercel login');
  process.exit(1);
}

// Step 3: Deploy
const args = ['deploy', '--yes', '--implicit-commit'];
if (IS_PROD) args.push('--prod');
args.push('--path', FOLDER);

try {
  const output = execSync(`vercel ${args.join(' ')}`, {
    cwd: FOLDER,
    encoding: 'utf-8',
  });
  
  console.log('Deploy output:');
  console.log(output);
  
  // Extract preview URL from output ( 간단한 regex )
  const urlMatch = output.match(/https:\/\/[^\s\n]+/);
  if (urlMatch) {
    console.log('\nPreview URL:', urlMatch[0]);
  }
} catch (error) {
  console.error('Deploy failed:');
  console.error(error.stdout || error.message);
  process.exit(1);
}
```

- [ ] **Step 1: Write deploy.js**

Tulis file deploy.js dengan konten di atas.

- [ ] **Step 2: Test script (jika ada Vercel CLI)**

```bash
node .claude/plugins/compro/skills/company-profile-publisher/scripts/deploy.js ./compros/test-deploy
```

- [ ] **Step 3: Commit**

```bash
git add .claude/plugins/compro/skills/company-profile-publisher/scripts/deploy.js
git commit -m "feat(publisher): add deploy helper script for Vercel CLI"
git push origin improvement
```

---

## Task 6: Testing & Validasi

**Tujuan:** Memastikan kedua skill berfungsi sesuai spec.

### Builder Testing

- [ ] **Test 1: Build dengan Markdown pendek (50-100 kata)**
  - Buat file testMarkdown pendek
  - Eksekusi skill builder
  - Cek: index.html tercipta, minimal 1 slide ada

- [ ] **Test 2: Build dengan Markdown panjang (beberapa H1, H2, tabel)**
  - Buat file Markdown dengan struktur lengkap
  - Eksekusi skill builder
  - Cek: chunking benar, jumlah slide sesuai konten, tabel render

- [ ] **Test 3: Build dengan referensi gambar**
  - Tambah gambar ke Markdown (URL yang valid)
  - Eksekusi builder
  - Cek: gambar muncul di HTML

- [ ] **Test 4: Build dengan gambar tidak valid**
  - Tambah gambar dengan URL tidak valid
  - Eksekusi builder
  - Cek: gambar tidak inject, build.log mencatat skip

- [ ] **Test 5: Konsistensi — jalankan 2x dengan input sama**
  - Jalankan builder 2 kali dengan file Markdown sama
  - Cek: hasil sama (jumlah slide, struktur, tidak ada perbedaan discretionary)

### Publisher Testing

- [ ] **Test 6: Deploy HTML ke Vercel**
  - Pastikan Vercel CLI ter-install dan ter-auth
  - Jalankan publisher pada HTML hasil builder
  - Cek: preview URL dikembalikan, URL accessible

- [ ] **Test 7: Handle error — CLI tidak ada**
  - (Simulation) Jalankan publisher di environment tanpa Vercel CLI
  - Cek: error message jelas

- [ ] **Test 8: Handle error — HTML tidak ada**
  - (Simulation) Jalankan publisher dengan path yang salah
  - Cek: error message jelas

### Konsistensi Testing

- [ ] **Test 9: Cek template statis**
  - Bandingkan output HTML dari 2 build berbeda
  - Cek: template HTML dan CSS identik (hanya konten slide berbeda)

---

## Task 7: Final Review & Cleanup

- [ ] **Step 1: Review semua file yang dibuat**
  - Cek struktur plugin: semua file ada di lokasi yang benar?
  - Cek SKILL.md kedua skill: instruksi jelas dan lengkap?
  - Cek template: HTML valid, CSS valid?

- [ ] **Step 2: Clean up file yang tidak perlu**
  - Hapus file .DS_Store yang tidak perlu (kalau ada)
  - Pastikan .gitignore.update sudah benar

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete company-profile-builder and company-profile-publisher skills"
git push origin improvement
```

- [ ] **Step 4: Update spec jika ada perubahan**
  - Jika ada penyesuaian selama implementasi, update `company-profile-slides-design.md`

---

## Execution Handoff

Plan complete and saved. Dua execution options:

**1. Subagent-Driven (recommended)** — Dispatch subagent per task, review antar task, iterasi cepat

**2. Inline Execution** — Execute tasks di session ini menggunakan executing-plans, batch execution dengan checkpoints

Mana yang diinginkan?
