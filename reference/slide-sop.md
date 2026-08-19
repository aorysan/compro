# COMPRO PATTERN — Master Blueprint Generator Company Profile

> Dokumen ini adalah **pattern baku** yang WAJIB diikuti saat men-generate company profile (compro) slide-per-slide untuk bisnis apa pun.
> Sumber: SOP Checklist (kriteria QC) + Deck Venturo Expert Programmers (referensi eksekusi terbukti) + framework copywriting persuasif.
> Cara pakai: isi **INTAKE** dulu → generator jalan slide demi slide → tiap slide divalidasi dengan **QC gate** sebelum lanjut.
> Format tiap slide seragam: **Objective · Requirements · Expected Output · QC Gate**.

---

## 0. PRINSIP DASAR (berlaku di semua slide)

1. **Benefit > Fitur.** Selalu terjemahkan fitur menjadi keuntungan yang dirasakan pembaca.
2. **Satu slide = satu pesan.** Jangan menumpuk banyak ide di satu halaman.
3. **Alur persuasi wajib urut:** Similarity → Yes-Set → Curiosity → Reason to Buy → Scarcity → Social Proof/Liking → Contrast → Now-or-Never → Guarantee → Surprise → Authority.
4. **3 detik pertama menentukan.** Headline harus menangkap perhatian instan; DNA bisnis jadi judul utama.
5. **Konsisten brand.** Warna, font, tone kata-kata mengikuti brand guideline dari awal sampai akhir.
6. **Persuasif, bukan biasa-biasa.** Setiap kalimat dievaluasi: apakah ini menjual, atau cuma informatif?

---

## 1. INTAKE — Data yang dikumpulkan SEBELUM generate

Generator TIDAK boleh mulai sebelum field wajib (⭐) terisi. Field lain boleh diisi "generator lengkapi" → saya buatkan draft asumsi lalu konfirmasi.

### A. Identitas & DNA Bisnis
- ⭐ Nama brand + tagline
- ⭐ DNA bisnis (1 kalimat inti: siapa Anda, untuk siapa, hasil apa) → jadi headline cover
- ⭐ Kategori produk/jasa (software / jasa / produk fisik / dll)
- Conviction / angka pembuktian (tahun berdiri, jumlah klien, proyek selesai, dsb)

### B. Target & Masalah
- ⭐ Target audiens / ICP (siapa pembaca deck ini)
- ⭐ 2–3 masalah utama yang dialami target (untuk slide Problem)
- Tren/statistik pendukung masalah (angka bikin kredibel)

### C. Solusi & Keunggulan
- ⭐ Solusi utama (bagaimana produk menyelesaikan masalah di atas)
- ⭐ 3–5 Unique Strength / Reason to Buy (keunggulan yang membedakan dari kompetitor)
- Value proposition (kalimat janji utama)

### D. Bukti
- Daftar klien/logo, portofolio, angka pencapaian
- Testimoni tertulis (quote + nama + jabatan)
- Nama tokoh/brand terkenal yang pernah pakai (untuk prinsip Liking)

### E. Penawaran
- ⭐ Struktur harga / paket (paket utama + pendukung)
- Special offer (diskon, harga coret, batas waktu)
- Garansi (mis. bug guarantee, jaminan pergantian)
- Bonus / surprise
- CTA + kontak (email, WA, alamat, website)

### F. Visual & Brand
- ⭐ Warna brand (primary/secondary/accent) + font utama & heading
- Aset: logo, foto tim/kantor, mockup produk, screenshot aplikasi

---

## 2. BLUEPRINT SLIDE-PER-SLIDE

Setiap slide memakai format seragam: **Objective · Requirements · Expected Output · QC Gate**.
Placeholder ditulis `{{ }}`. Generator mengisi dari INTAKE; kalau kosong → buat draft + tandai `⚠ asumsi`.
Slide 6 (Software Preview) hanya dipakai jika produk = software.

---

### SLIDE 1 — COVER / HEADLINE

**Objective**
Buat halaman pembuka yang mampu menarik perhatian pembaca dalam 3 detik pertama dan langsung menjelaskan DNA bisnis perusahaan.

**Requirements**
- Tampilkan logo perusahaan.
- Tampilkan tagline yang singkat dan mudah diingat.
- Buat headline utama yang menjelaskan DNA bisnis, bukan sekadar nama perusahaan.
- Tambahkan conviction statement yang meningkatkan rasa percaya terhadap perusahaan.
- Gunakan ilustrasi atau hero image yang relevan dengan produk atau jasa.
- Pastikan pembaca langsung memahami apa yang perusahaan lakukan hanya dengan melihat halaman pertama.

**Expected Output**
- **Headline** — `{{HEADLINE}}` (DNA bisnis, bukan sekadar nama perusahaan)
- **Subheadline** — `{{SUBHEADLINE}}` (tagline / penjelas singkat mudah diingat)
- **Conviction Statement** — `{{CONVICTION}}` (angka/bukti yang menaikkan kepercayaan)
- **Hero Visual Recommendation** — `{{HERO_VISUAL}}` (rekomendasi ilustrasi/hero image relevan produk)

**QC Gate**
- [ ] Ada logo & tagline
- [ ] Headline menjelaskan DNA bisnis (bukan sekadar nama perusahaan)
- [ ] Ada conviction statement penambah kepercayaan
- [ ] Ada rekomendasi hero visual relevan produk
- [ ] Pembaca paham bisnisnya dalam 3 detik dari halaman pertama

---

### SLIDE 2 — PROBLEM

**Objective**
Membuat pembaca merasa bahwa masalah yang diangkat adalah masalah mereka sendiri, sehingga muncul keterhubungan dan persetujuan sebelum solusi ditawarkan.

**Requirements**
- Angkat problem yang relevan dengan tren/kondisi masa kini target.
- Gunakan copywriting berunsur SIMILARITY (membangun kesamaan, tukar posisi, before–after–now).
- Terapkan prinsip YES-SET agar pembaca mengangguk-angguk dan berkata "YA".
- Sajikan 2–3 pain point utama dengan penjelasan singkat.
- Tutup dengan kalimat konsekuensi yang menekan sisi emosional.
- (Opsional) dukung dengan statistik/tren agar kredibel.

**Expected Output**
- **Problem Headline** — `{{PROBLEM_HEADLINE}}`
- **Pain Points** — `{{PAIN_1..3}}` (judul tebal + 1–2 kalimat penjelas)
- **Consequence Statement** — `{{DAMPAK_AKHIR}}`
- **Supporting Statistic** — `{{STATISTIK}}` (opsional)
- **Suggested Visual** — `{{VISUAL}}`

**QC Gate**
- [ ] Problem relevan dengan tren masa kini
- [ ] Mengandung unsur SIMILARITY
- [ ] Memenuhi prinsip YES-SET (pembaca setuju "YA")

---

### SLIDE 3 — OUR SOLUTION (STRESS-FREE SOLUTION)

**Objective**
Perkenalkan solusi yang membuat pembaca penasaran dan yakin bahwa perusahaan mampu menyelesaikan masalah mereka.

**Requirements**
- Jelaskan solusi utama perusahaan.
- Fokus pada benefit, bukan fitur.
- Jelaskan alasan mengapa solusi ini lebih baik dibanding alternatif lain.
- Bangun rasa penasaran terhadap produk.
- Hubungkan seluruh solusi dengan masalah yang dijelaskan pada slide sebelumnya.
- Jika produk berupa software, tampilkan preview aplikasi atau mockup agar pembaca dapat membayangkan hasil akhirnya.

**Expected Output**
- **Headline** — `{{SOLUTION_HEADLINE}}`
- **Value Proposition** — `{{VALUE_PROP}}`
- **Key Benefits** — `{{BENEFIT_1..5}}` (ikon + judul + 1 kalimat, fokus benefit)
- **Suggested Visual** — `{{VISUAL}}` (mockup/preview jika software)

**QC Gate**
- [ ] Membuat pembaca PENASARAN (curious)
- [ ] Menjelaskan Unique Strength yang menjawab Problem slide 2
- [ ] Ada preview/video/mockup (khusus software)
- [ ] Fokus ke benefit, bukan fitur

---

### SLIDE 4 — PORTFOLIO / TRUST

**Objective**
Meyakinkan pembaca bahwa sudah banyak pihak yang mempercayai dan merasakan manfaat perusahaan, sehingga memperkuat authority (mendukung About Us).

**Requirements**
- Tampilkan logo klien / portofolio sebagai bukti sosial.
- Pastikan logo ditampilkan dengan ukuran yang sama, style yang sama, dan proporsional.
- Sertakan headline yang menegaskan kepercayaan.
- Tutup dengan kalimat yang menegaskan manfaat / mengajak.

**Expected Output**
- **Portfolio Headline** — `{{PORTFOLIO_HEADLINE}}`
- **Client Logos / Portfolio Items** — `{{LOGO_LIST}}`
- **Closing Statement** — `{{PORTFOLIO_CLOSER}}`
- **Suggested Visual** — `{{VISUAL}}` (grid logo seragam)

**QC Gate**
- [ ] Meyakinkan bahwa sudah banyak yang merasakan manfaat
- [ ] Logo klien ukuran sama, style sama, proporsional

---

### SLIDE 5 — OUR SERVICE / HOW IT WORKS

**Objective**
Menjelaskan detail benefit produk dan alasan kuat mengapa pembaca harus membeli, sekaligus menstruktur paket layanan.

**Requirements**
- Jelaskan DETAIL BENEFIT produk kepada pembaca.
- Jelaskan REASON TO BUY secara gamblang.
- Sisipkan unsur SCARCITY (kelangkaan stok / produksi / pembeli / akses membeli).
- Jelaskan struktur paket utama dan fitur pendukung.
- Boleh gunakan format perbandingan (cara lama vs cara kami).

**Expected Output**
- **Service Headline** — `{{SERVICE_HEADLINE}}`
- **Detailed Benefits** — `{{SERVICE_DETAIL}}`
- **Reason to Buy** — `{{REASON_TO_BUY}}`
- **Scarcity Element** — `{{SCARCITY}}`
- **Package Structure** — `{{PAKET_UTAMA_PENDUKUNG}}`
- **Suggested Visual** — `{{VISUAL}}` (diagram/tabel perbandingan)

**QC Gate**
- [ ] Menjelaskan DETAIL BENEFIT produk
- [ ] Reason to Buy dijelaskan gamblang
- [ ] Mengandung unsur SCARCITY
- [ ] Struktur paket utama & pendukung jelas

---

### SLIDE 6 — SOFTWARE / PRODUCT PREVIEW *(hanya jika produk = software)*

**Objective**
Menampilkan produk software secara nyata agar pembaca dapat membayangkan hasil akhir yang akan mereka dapatkan.

**Requirements**
- Window 1 menjelaskan fitur produk.
- Window 2 menjelaskan DNA bisnis.
- Window 3–6 menjelaskan value dari Stress-Free Solution.
- Gunakan screenshot / mockup aplikasi yang berurutan dan konsisten.

**Expected Output**
- **Feature Preview (Window 1)** — `{{PREVIEW_FITUR}}`
- **Business DNA Preview (Window 2)** — `{{PREVIEW_DNA}}`
- **Value Previews (Window 3–6)** — `{{PREVIEW_VALUE_1..4}}`
- **Suggested Visual** — `{{VISUAL}}` (mockup berurutan)

**QC Gate**
- [ ] Window 1 menjelaskan fitur
- [ ] Window 2 menjelaskan DNA bisnis
- [ ] Window 3–6 menjelaskan value stress-free solution

---

### SLIDE 7 — SOCIAL PROOF

**Objective**
Memperkuat kepercayaan melalui suara pihak ketiga dan asosiasi dengan tokoh/brand yang disukai pembaca.

**Requirements**
- Tampilkan testimoni pelanggan dalam bentuk kata-kata.
- Sertakan nama orang / brand terkenal untuk memicu prinsip LIKING.
- Lengkapi tiap testimoni dengan nama + jabatan/perusahaan agar kredibel.

**Expected Output**
- **Testimonial Quotes** — `{{TESTIMONI_1..n}}` (quote + nama + jabatan)
- **Notable Names / Brands (Liking)** — `{{LIKING}}`
- **Suggested Visual** — `{{VISUAL}}` (kartu testimoni + foto/logo)

**QC Gate**
- [ ] Ada kata-kata testimoni dari pelanggan
- [ ] Ada nama orang/brand terkenal (LIKING)

---

### SLIDE 8 — PRICELIST

**Objective**
Menyajikan harga secara jelas dan mudah dimengerti agar pembaca langsung memahami nilai yang mereka dapatkan.

**Requirements**
- Tampilkan harga / paket secara jelas dan mudah dimengerti.
- Susun paket agar mudah dibandingkan.
- Sertakan breakdown komponen bila diperlukan.

**Expected Output**
- **Pricelist Headline** — `{{PRICE_HEADLINE}}`
- **Package / Price Table** — `{{PAKET_1..n}}` (nama, harga, isi)
- **Component Breakdown** — `{{BREAKDOWN}}` (opsional)
- **Suggested Visual** — `{{VISUAL}}` (pricing card/tabel)

**QC Gate**
- [ ] Harga ditampilkan jelas & mudah dimengerti

---

### SLIDE 9 — SPECIAL OFFER

**Objective**
Mendorong pembaca mengambil keputusan sekarang dan menghancurkan keraguan untuk membeli.

**Requirements**
- Tonjolkan unsur KONTRAS (harga coret, diskon, uang yang dihemat).
- Buat penawaran bersifat NOW OR NEVER (batas waktu / urgency) untuk mengatasi penunda.
- Tampilkan garansi yang menghancurkan keraguan untuk membeli.

**Expected Output**
- **Offer Headline** — `{{OFFER_HEADLINE}}`
- **Contrast / Pricing** — `{{HARGA_LAMA}}` → `{{HARGA_BARU}}` (harga coret / hemat)
- **Urgency / Deadline** — `{{DEADLINE}}`
- **Guarantee** — `{{GARANSI}}`
- **Suggested Visual** — `{{VISUAL}}` (badge diskon / urgency)

**QC Gate**
- [ ] Ada unsur KONTRAS (harga coret/diskon/hemat)
- [ ] Penawaran bersifat NOW OR NEVER
- [ ] Ada garansi penghancur keraguan

---

### SLIDE 10 — BONUS

**Objective**
Memberikan kejutan bernilai tambah yang memperkuat keputusan pembaca untuk membeli.

**Requirements**
- Berikan SURPRISE / bonus spesial di luar ekspektasi pembaca.
- Jelaskan syarat / kuota bonus bila ada.

**Expected Output**
- **Bonus Offer** — `{{BONUS}}` (mis. free PoC, free consultation)
- **Terms / Quota** — `{{BONUS_SYARAT}}` (opsional)
- **Suggested Visual** — `{{VISUAL}}` (highlight box "GRATIS/BONUS")

**QC Gate**
- [ ] Ada SURPRISE/bonus spesial untuk pembaca

---

### SLIDE 11 — PENUTUP / CTA

**Objective**
Menutup presentasi dengan menegaskan authority perusahaan dan mengajak pembaca mengambil tindakan.

**Requirements**
- Sertakan Reinforce Authority (mis. "Bersama 100+ Perusahaan Lainnya…", "Your Trusted ... Partner").
- Tampilkan foto tim / perusahaan yang meyakinkan authority.
- Sertakan CTA dan kontak yang jelas.

**Expected Output**
- **Authority Statement** — `{{AUTHORITY_LINE}}`
- **Call to Action** — `{{CTA}}`
- **Contact Info** — `{{KONTAK}}` (email, WA, alamat, web)
- **Suggested Visual** — `{{VISUAL}}` (foto tim + kontak)

**QC Gate**
- [ ] Ada Reinforce Authority
- [ ] Menampilkan foto tim/perusahaan yang meyakinkan
- [ ] CTA & kontak jelas

---

## 3. QC GATE GLOBAL — DESAIN KESELURUHAN (cek di akhir)

Setelah semua slide jadi, jalankan checklist final:
- [ ] Warna keseluruhan sesuai brand guideline
- [ ] Semua kata-kata mencerminkan Brand Positioning
- [ ] Semua kata-kata bersifat PERSUASIF (bukan biasa-biasa)
- [ ] Font utama & heading konsisten dari awal sampai akhir
- [ ] Tata letak proporsional, tidak banyak ruang kosong
- [ ] Visual mendukung cerita (ada foto tim/suasana kantor)
- [ ] Desain menarik & tidak membosankan (ada blocking warna di beberapa slide)

---

## 4. ALUR KERJA GENERATOR

1. **INTAKE** — kumpulkan data (bagian 1). Field ⭐ wajib; sisanya boleh "generator lengkapi".
2. **STRUKTUR** — tentukan slide mana yang dipakai (Slide 6 hanya jika software; slide bisa digabung sesuai kebutuhan).
3. **GENERATE per slide** — keluarkan Objective terpenuhi → isi Expected Output sesuai template bagian 2.
4. **QC GATE per slide** — centang checklist slide; kalau ada yang gagal, revisi sebelum lanjut.
5. **QC GLOBAL** — jalankan checklist bagian 3.
6. **OUTPUT** — kompilasi jadi deck lengkap (format: teks terstruktur `.md`).

---

## 5. FORMAT OUTPUT PER SLIDE (baku)

```
### SLIDE {n} — {NAMA}
[Expected Output diisi sesuai slide, contoh Slide 1:]
Headline             : ...
Subheadline          : ...
Conviction Statement : ...
Hero Visual          : ...
---
Prinsip : {copywriting principle yang dipakai}
QC      : ✓/✗ per item (lihat QC Gate slide)
```
