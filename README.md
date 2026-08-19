# Compro (Company Profile & Pitch Deck Generator)

Sebuah arsitektur multi-agen (orchestrator plugin) untuk menghasilkan slide presentasi *Company Profile* berbasis HTML/CSS statis dari input *knowledge-base* bisnis. Didesain untuk dioperasikan oleh AI Assistants (Claude, Gemini, dll) atau melalui *Claude Code* (Anthropic).

## Alur Kerja (The Pipeline)

Plugin `compro` berfungsi sebagai *orchestrator state-machine* yang mengkoordinasikan tugas agen-agen spesialis lainnya:

1. **Gate 0 - Intake Check**: Mengecek ketersediaan bahan dasar (`input/business-knowledge-base.md`, `brand-story-guide.md`, logo).
2. **Phase 1 - Drafting** (`/writer`): Menghasilkan draf *copywriting* per-slide.
3. **Phase 2 - Content Review** (`/reviewer`): Memverifikasi akurasi draf terhadap fakta dan panduan merek. Terdapat mekanisme revisi berulang bila belum disetujui.
4. **Phase 3 - Content SEO** (`/seo` - mode konten): Menyusun kerangka *keywords* dan metatag untuk output akhir.
5. **Phase 4 - HTML Deck Build** (`/builder`): Membangun file presentasi statis (*slide deck*) dari layout di folder `templates/deck/` dengan menerapkan warna spesifik dari *brand*.
6. **Phase 5 - Technical SEO** (`/seo` - mode teknikal): Verifikasi implementasi semantik HTML, dan metadata. Terdapat siklus *fix/rebuild* ke `builder` bila diperlukan.
7. **Phase 6 - Pre-flight Publish** (`/publisher`): Verifikasi menyeluruh memastikan aset termuat dan resolusi layar responsif.
8. **Phase 7 - Deployment** (`/deploy-to-vercel`): Menayangkan slide ke URL publik via Vercel CLI (opsional).

## Struktur Repositori

```text
├── .codex-plugin/
│   └── plugin.json           # File manifest untuk mendefinisikan skills
├── skills/                   # Prompt Markdown berisi instruksi per-skill
│   ├── compro/               # Orchestrator
│   ├── writer/               # Copywriting 
│   ├── reviewer/             # QA Checker
│   ├── seo/                  # SEO Content & Technical validator
│   ├── builder/              # HTML/CSS UI assembler
│   ├── publisher/            # Publikasi pre-flight checker
│   └── deploy-to-vercel/     # Script deployment 
├── templates/
│   └── deck/                 # Blueprint untuk file output 
│       ├── deck-template.html
│       ├── core.css          # Design system core (warna brand)
│       ├── deck.css          # Logika UI deck PPT
│       └── deck.js           # Fungsi transisi/navigasi
├── scripts/                  # Alat QC via Node.js
├── assets/                   # Aset global
└── input/                    # Folder input (berisi dokumen referensi bisnis)
```

## Persyaratan (Requirements)
* **Node.js** (untuk Puppeteer jika ingin menjalankan QC render *screenshot*)
* **Vercel CLI** (jika ingin melakukan deployment instan)
* Environment AI (*Claude Code* / *Codex*)

## Setup & Instalasi Lokal

Repositori ini hanya berisi logika skrip dan plugin. Untuk melakukan instalasi dependensi (mis. pengecekan UI QA lewat *Puppeteer*):

```bash
npm install
```

> **Catatan**: Hasil *generate* (deck presentasi akhir per klien) akan ditaruh di dalam folder **`compros/`**, dan bukan sebagai isi dari repositori ini. Folder hasil buatan AI telah kami masukkan ke dalam `.gitignore`.