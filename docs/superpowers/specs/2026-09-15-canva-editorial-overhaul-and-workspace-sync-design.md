# Specification: Canva Editorial 1:1 Overhaul, Hybrid Asset Pipeline, & Workspace Sync Guarantee

**Date:** 2026-09-15  
**Status:** Approved by User  
**Target Plugin:** `compro` (v2.5.0)  
**Primary Files:**
- `scripts/image-fetcher.js` (NEW)
- `scripts/build-deck.js` (REFACTOR)
- `templates/editorial.css` (REFACTOR)
- `templates/editorial-shell.html` (REFACTOR)
- `scripts/sync-plugin.js` (REFACTOR / FIX PATH)
- `skills/compro/SKILL.md` (UPDATE PROTOCOL)
- `skills/builder/SKILL.md` (UPDATE PROTOCOL)

---

## 1. Problem Statement & Root Cause Analysis

Pada pengujian pembuatan Company Profile untuk Venturo Pro (`congen5`), pengguna melaporkan tiga masalah kritis:
1. **Output Tidak Muncul di Workspace Utama:** File hasil generate tidak ditemukan di `/home/aorysan/aorysan/AryokPunya/Magang/compro/compros/congen5/`.
2. **Tampilan Berantakan & Jauh dari Canva Reference:** Hasil generate dinilai jelek, tidak proporsional, dan tidak merefleksikan template referensi Canva *Salford & Co.* (`docs/canva-reference/`).
3. **Deadcode & Flow Tidak Optimal:** Terdapat duplikasi folder rekursif di dalam plugin dan cache yang out-of-sync.

### Temuan Akar Masalah (Root Causes):
1. **Git Worktree Isolation Leak:** Claude Code menjalankan sesi di dalam git worktree terisolasi (`.claude/worktrees/congen5`). Plugin menulis artefak ke jalur relatif `compros/<slug>/`, sehingga file tersimpan di dalam worktree tersebut dan tidak disalin ke workspace utama saat sesi di-reset (`/new`).
2. **Logika `findRoot()` Rapuh:** Fungsi `findRoot()` di `build-deck.js` berhenti pada direktori `.git` terdekat ke atas. Jika dipanggil di dalam worktree atau subfolder plugin, ia menganggap folder lokal tersebut sebagai root, bukan root project pengguna.
3. **Cache Plugin Claude Code Ketinggalan Versi (Out-of-Sync):** File `build-deck.js` di cache `~/.claude/plugins/cache/aorysan-marketplace/compro/2.4.0/` berukuran 55 KB (versi lama), sedangkan di repo lokal sudah 70 KB. Claude Code selalu mengeksekusi script usang dari cache.
4. **Anomali Folder Rekursif:** Skrip `sync-plugin.js` memiliki bug path (`path.join(ROOT, '.claude', 'plugins', 'compro')`), yang menyebabkan terbentuknya folder duplikat mati `.claude/plugins/compro/.claude/plugins/compro/`.
5. **Ketiadaan Downloader Gambar (Missing Asset Pipeline):** Komentar gambar `<!-- image: ... -->` diabaikan, dan generator hanya membuat 5 SVG dasar dengan smartphone mockup berlayar hitam pekat yang terpotong di tepi bawah slide (overflow bug).
6. **Layout Timpang (Vertical Void 60%):** Pada slide Layanan, Pricing, dan Closing, konten terkonsentrasi di 40% area atas slide, meninggalkan 60% area bawah berupa ruang kosong abu-abu.
7. **Slide Bukti & Kontak Rusak:** Slide pencapaian menampilkan 4 bar teks panjang tanpa angka metrik raksasa, dan slide closing memuat teks mentah `[Nomor WhatsApp]` dan `[Email Resmi]`.

---

## 2. Goals & Design Principles

1. **Faithful Canva Salford & Co. 1:1 Aesthetic:**
   - Kanvas abu-abu lembut (`#F4F5F7`), kartu putih bersih (`#FFFFFF`) berbayangan halus (`0 12px 32px rgba(0,0,0,0.05)`), kontras charcoal `#232220`, dan aksen Venturo Teal `#009BAD` (dengan teks AA-compliant `#007A87`).
   - Proporsi visual seimbang: tidak ada elemen terpotong ke bawah layar, dan tidak ada ruang kosong melompong (60% blank void) di bawah slide.
2. **Hybrid Asset Pipeline (Internet Fetch + Local Download):**
   - Mengambil foto resolusi tinggi dari Unsplash berdasarkan kata kunci kontekstual slide.
   - Mengunduh dan menyimpan foto secara lokal ke `compros/<slug>/assets/slide-*.jpg` agar deck mandiri (*self-contained*), cepat, dan bebas risiko CORS/link mati saat dibuka offline atau dideploy ke Vercel.
   - Fallback otomatis ke visual geometris lokal jika koneksi internet terputus.
3. **Adaptive Canva Archetypes (Modular System):**
   - 9 hingga 10 section markdown dipetakan secara cerdas ke 7 arketipe layout Canva tanpa memaksakan jumlah slide kaku.
4. **Zero-Loss Workspace Guarantee:**
   - Builder menerima argumen `--root` dan env `COMPRO_PROJECT_ROOT`.
   - Di akhir proses build, script wajib menyalin/memverifikasi keberadaan seluruh folder proyek di `/home/aorysan/aorysan/AryokPunya/Magang/compro/compros/<slug>/`.
5. **Total Deadcode Cleanup & Robust Sync:**
   - Menghapus folder rekursif `.claude/plugins/compro/.claude/plugins/compro/`.
   - Memperbaiki `scripts/sync-plugin.js` agar menyinkronkan kode lokal ke cache global secara akurat dengan verifikasi byte size.

---

## 3. Detailed Architecture & Technical Components

### 3.1. Asset Downloader Pipeline (`scripts/image-fetcher.js`)
Modul independen Node.js berbasis `https` standar (tanpa dependensi npm eksternal berat):
- **Input:** Kategori/keyword slide (misal: `office-architecture`, `creative-meeting`, `tech-workspace`, `corporate-team`, `skyline-building`), orientasi (`landscape` 16:9 atau `portrait` 4:5), dan target output file.
- **Sourcing:** Endpoint kurasi Unsplash Source / direct high-res CDN photos dengan ukuran teroptimasi (landscape: 1600x900, portrait: 800x1200).
- **Caching & Idempotency:** Jika file gambar `slide-<n>-<slot>.jpg` sudah ada di `compros/<slug>/assets/` dengan ukuran valid (>10 KB), lewati proses download.
- **Timeout & Error Handling:** Batas waktu 5 detik per request. Jika koneksi gagal atau offline, fallback ke SVG arsitektural lokal yang elegan (`templates/assets/fallback/`).

### 3.2. Workspace Resolver & Sanitizer (`scripts/build-deck.js`)
- **CLI Options:**
  - `--name=<slug>`: Identifier proyek (contoh: `congen5`).
  - `--theme=editorial`: Mengunci tema editorial Canva.
  - `--root=<path>`: Jalur root workspace proyek aktif.
- **Sanitasi Konten Tingkat Lanjut:**
  1. Hapus frontmatter YAML dan baris `Meta Title:` / `Meta Description:` di posisi mana pun.
  2. Hapus prefix kaku seperti `Tagline:`.
  3. Deteksi teks kurung siku `[...]` pada slide kontak dan ubah menjadi nilai demo terformat rapi (`+62 812-9000-XXXX`, `contact@venturo.pro`, `Jakarta, Indonesia`).
  4. Ekstrak data metrik bertipe angka (`20:1`, `90%`, `Rp10.000`, `v0.1.0`) untuk dirender sebagai **Big Number Counter** (`font-size: 44px; font-weight: 800; color: #007A87;`).
- **Workspace Sync Guarantee Hook:**
  Setelah file `index.html`, `compro.md`, `assets/`, dan `reports/` ditulis ke direktori target, periksa apakah direktori target berada di luar root utama. Jika ya (misal di dalam `.claude/worktrees/*`), lakukan sinkronisasi rekursif instan ke `/home/aorysan/aorysan/AryokPunya/Magang/compro/compros/<slug>/`.

### 3.3. Canva Layout Archetypes (`templates/editorial.css` & HTML Engine)

1. **`archetype-canva-cover` (Slide 1 - Hero Presentation):**
   - Top Nav Bar: Logo teks + badge solid "Company Profile" latar Charcoal.
   - Split 55/45:
     - Kiri: Floating white box dengan badge kategori, H1 judul, paragraf ringkas, tombol primer Charcoal & tombol sekunder outline Teal.
     - Kanan: Frame foto arsitektur gedung kaca modern tinggi dengan bayangan lembut, mengisi tinggi slide tanpa overflow.
2. **`archetype-canva-welcome` (Slide 2 Masalah & Slide 3 Solusi):**
   - Split 45/55:
     - Kiri: Frame foto vertikal tinggi (arsitektur/workspace) di atas panel aksen offset Charcoal.
     - Kanan: Judul section H2, pengantar, dan susunan kartu bernomor tebal `01`, `02`, `03` berlatar putih bersih.
3. **`archetype-canva-services` (Slide 4 Layanan):**
   - Split 35/65:
     - Kiri: Judul H2 "Layanan Unggulan", sub-deskripsi, dan frame foto vertikal kreatif di bawahnya.
     - Kanan: Grid 2x2 rapi berisi 4 kartu layanan bernomor besar `01` s/d `04`, label pill charcoal, dan deskripsi kemampuan.
4. **`archetype-canva-ecosystem` (Slide 5 Arsitektur & Alur):**
   - Split 50/50:
     - Kiri: Diagram SVG sirkular orbit ekosistem AI yang tajam dan terpusat (Groq, Gemini, Cloudflare, ComfyUI, Supabase).
     - Kanan: Foto landscape workspace tech di bagian atas, dan kartu penjelasan alur GPU lokal di bagian bawah.
5. **`archetype-canva-metrics` (Slide 6 Pencapaian & Bukti):**
   - Split 40/60:
     - Kiri: Frame foto gedung modern bertingkat.
     - Kanan: Grid 4 kartu metrik dengan angka raksasa (`44px`, font weight 800, teal `#007A87`) dan label penjelasan di bawahnya.
6. **`archetype-canva-comparison-pricing` (Slide 7 & 8 Komparasi & Paket):**
   - Grid 3 kartu terpusat secara vertikal di tengah slide.
   - Kartu Pro di tengah diperbesar sedikit (*elevated*), dilengkapi pita badge *"Best Seller"*, border Teal, dan tombol CTA Charcoal.
7. **`archetype-canva-closing` (Slide 9 Hubungi Kami / Closing):**
   - Meniru Slide 10 Canva:
   - Kartu Charcoal elegan di tengah diapit 2 foto arsitektur/tim di kiri dan kanan, dilengkapi kartu info kontak rapi (WhatsApp, Email, Kantor) tanpa kurung siku mentah.

---

## 4. Deadcode Elimination & Clean-up

1. **Hapus Folder Rekursif:**
   Hapus tuntas direktori duplikat `.claude/plugins/compro/.claude/plugins/compro/` beserta seluruh isinya.
2. **Refactor `scripts/sync-plugin.js`:**
   Perbaiki definisi root:
   ```javascript
   const PLUGIN_ROOT = path.resolve(__dirname, '..');
   const CACHE_PLUGIN = path.join(os.homedir(), '.claude', 'plugins', 'cache', 'aorysan-marketplace', 'compro', '2.4.0');
   ```
   Tambahkan target sinkronisasi cache versi `2.5.0` dan verifikasi integritas ukuran file setelah proses copy.
3. **Pembersihan Template Legacy:**
   Isolasi atau hapus kode pemanggilan `profile-shell.html` dan `custom.css` di engine agar seluruh pipeline secara konsisten hanya mengeksekusi tema Canva Editorial.

---

## 5. Verification & Testing Plan

1. **Test Sanitizer & Image Fetcher:**
   - Jalankan unit test fetcher untuk mengunduh 5 kategori gambar ke folder temporary.
   - Jalankan uji parsing pada `compros/congen4/drafts/02-final.md` dan pastikan tidak ada kebocoran metadata.
2. **Build End-to-End (`congen5`):**
   - Jalankan:
     ```bash
     node .claude/plugins/compro/scripts/build-deck.js --name=congen5 --theme=editorial --root=/home/aorysan/aorysan/AryokPunya/Magang/compro
     ```
   - Verifikasi bahwa file tercipta di `/home/aorysan/aorysan/AryokPunya/Magang/compro/compros/congen5/index.html` dan folder `assets/` memuat file foto `slide-*.jpg`.
3. **Visual Inspection:**
   - Ambil screenshot slide `slide-0.png` s/d `slide-8.png` dari `congen5`.
   - Bandingkan dengan referensi Canva: pastikan tidak ada layout terpotong ke bawah, tidak ada smartphone layar hitam, dan tidak ada ruang kosong 60% di bawah slide.
4. **Cache Sync Test:**
   - Jalankan `node .claude/plugins/compro/scripts/sync-plugin.js`.
   - Pastikan checksum file di cache global Claude Code identik dengan repositori lokal.
