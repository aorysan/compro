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
