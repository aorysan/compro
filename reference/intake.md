# INTAKE — Tanyakan SEBELUM Generate (jangan asal-asalan)

> GATE: **Jangan mulai generate** sampai semua ⭐ WAJIB terisi — terutama **LOGO**.
> Kalau user cuma bilang "buatkan compro X", tampilkan daftar ini dan minta lengkapi dulu.

## ⭐ WAJIB (tanpa ini, STOP)
1. **⬆️ UPLOAD LOGO** — file logo brand (PNG/SVG, transparan kalau ada).
   **Warna seluruh deck diambil dari logo ini**, jadi tidak bisa jalan tanpa logo.
   - Kirim juga versi **putih/inverse** kalau punya (untuk footer gelap). Kalau tidak, kami buatkan.
   - Alternatif: beri **URL website resmi** → logo & warna diambil dari situ.
2. **Nama brand + tagline.**
3. **Produk/jasa** (1 kalimat) + kategori (software / jasa / produk).
4. **Target audiens** — siapa yang membaca deck ini.
5. **Bahasa** deck — Indonesia / English.
6. **Struktur slide** — pakai default (Cover → Problem → Solution → Fitur → Portfolio → Pricelist → Special Offer → Bonus → Penutup) atau tentukan sendiri?
7. **Hook/poin tiap slide** — mau kasih sendiri, atau izinkan kami susun lalu Anda koreksi?

## OPSIONAL (kalau kosong → kami lengkapi & konfirmasi)
- Conviction / angka bukti (tahun berdiri, jumlah klien, proyek).
- Poin masalah target (untuk slide Problem).
- Keunggulan / reason-to-buy (untuk slide Solution).
- Struktur harga / paket (Pricelist).
- Special offer / garansi / bonus.
- Testimoni (quote + nama + jabatan).
- Kontak (email, WA, alamat, web).
- Foto: pilih dari **stok** (kami pilihkan) atau **upload sendiri** (tim/kantor/produk/screenshot app).
- Preferensi font (default: Sora + Plus Jakarta Sans).

## Setelah intake lengkap
1. Ambil warna dari **logo** → set `--cyan/--blue/--navy` di `core.css`/deck.
2. Simpan `logo.png` (+ `logo-white.png`) & foto ke `compros/<brand>/assets/`.
3. Generate **slide-per-slide** (variasikan layout tiap slide — lihat katalog di SKILL.md).
4. QC (`scripts/render.js`) → perbaiki → rangkai jadi 1 deck (`index.html`).
