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
