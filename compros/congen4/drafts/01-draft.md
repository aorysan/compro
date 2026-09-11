# Venturo Pro

Tagline: Video ber-brand yang konsisten — tanpa biaya per-video yang tak terduga.

Venturo Pro adalah platform produksi video ber-brand untuk creator dan brand kecil Indonesia: masukkan Brand DNA sekali, lalu hasilkan video pendek yang konsisten dengan biaya terprediksi — karena generasi berjalan di komputermu sendiri.

- ⚙️ Pipeline video berjalan di GPU lokal — tanpa tagihan per-render seperti SaaS cloud
- 🎨 Brand DNA menjaga warna, font, dan cara bicara di setiap video
- 📊 On-ramp spreadsheet: guideline dari Google Sheets bisa ditarik sekali klik

<!-- image: hero -- sudut pandang kantor kreatif modern dengan layar menampilkan deretan video pendek -->

---

# Masalah yang Dihadapi

Creator dan brand kecil Indonesia yang rutin produksi video pendek terjebak di antara dua pilihan yang sama-sama merugikan.

- **Biaya produksi tinggi dan tak terprediksi.** Jasa editor atau agency mahal per proyek; SaaS cloud membebankan tagihan per-generasi. Saat volume naik, biaya menjumlah.
- **Konsistensi brand sulit dijaga.** Video AI generik tidak selaras dengan warna, font, dan tone brand. Hasil terasa murahan dan merusak persepsi brand.
- **Workflow terfragmentasi.** Script di satu aplikasi, gambar di aplikasi lain, video di aplikasi lain lagi. Berlompatan konteks, rawan error.
- **Tekanan frekuensi.** Algoritma short-form memberi reward pada konsistensi posting. Creator yang lambat kehilangan momentum.

Pilihannya dulu hanya dua: bayar mahal, atau puas dengan hasil generik. Tidak peduli ke mana melangkah, ada satu biaya yang selalu mengikuti — waktu dan uang yang tak terprediksi.

<!-- image: problem -- ilustrasi sederhana tagihan menumpuk dan warna palet brand tidak nyambung -->

---

# Solusi & Nilai Tambah

Venturo Pro mengubah cara berbeda: bukan menyewa studio, tapi menjadikan komputermu sendiri pabrik video.

- **Biaya marginal rendah.** Setelah setup GPU lokal, generate video tambahan tidak dibebani per-render. Alih-alih membayar per video, kamu menikmati biaya yang bisa dikira-kira.
- **Brand DNA menempel di semua output.** Isi identitas brand sekali — warna, font, cara bicara. Copilot konteks-aware menjaganya di setiap langkah.
- **Dari brief ke tayang satu alur.** Script, gambar, video, subtitle, dan editing disatukan. Guideline spreadsheet ditarik dengan satu klik.

Hasilnya pergeseran: dari *satu video, satu pertempuran biaya dan identitas* menjadi *satu brand, banyak video, biaya yang bisa kamu kira-kira*. Brand kecil bisa tampil konsisten seperti tim produksi — tanpa harus bayar seperti tim produksi.

<!-- image: solution -- alur dari brand DNA hingga hasil akhir beberapa video -->

---

# Layanan Unggulan

Empat kemampuan inti yang bekerja sebagai satu sistem.

- **Brand DNA Form** — Data identitas brand (warna, font, tone narasi, gaya cut) diisi sekali, dipakai di semua output. Diferensiasi yang jarang ada di tool AI video generik.
- **AI Copilot konteks-aware** — Mendampingi setiap langkah produksi dengan konteks brand yang sama; bukan wizard kaku, tapi sidecar yang bisa diajak bolak-balik.
- **Pipeline produksi lokal (0 biaya API untuk video)** — Empat workflow ComfyUI berjalan di GPU lokal, FFmpeg server-side. Tidak ada tagihan per-render.
- **Google Sheets Sync satu klik** — On-ramp untuk audience Indonesia yang spreadsheet-native: guideline dan brief yang sudah ada ditarik tanpa belajar platform baru.

Layanan chat, director, dan text-to-image tetap memakai layanan cloud dengan biaya kecil — kami tidak menyembunyikan itu.

<!-- image: features -- empat kartu ikon: DNA, copilot, GPU, spreadsheet -->

---

# Arsitektur & Ekosistem

Pipeline multi-AI yang memilih model terbaik per peran, terintegrasi dalam satu state.

- **Groq (chat)** — percakapan copilot dan interaksi pengguna.
- **Gemini (director)** — memimpin struktur dan arahan produksi.
- **Cloudflare (text-to-image)** — opening still dan gambar konten.
- **ComfyUI (production, GPU lokal)** — render video: SVD, ACE-Step, VoxCPM2, Whisper, melalui empat workflow.
- **FFmpeg server-side** — stitching dan assembly akhir.
- **Supabase (auth & data)** — tiga datamodel inti: DNAData, VisualGuideData, AssetFolder.

Satu titik state (ClientLayout) menjaga identitas mengalir ke seluruh output. Komputermu sendiri yang menjadi pabriknya; cloud hanya untuk peran percakapan, arahan, dan still.

<!-- image: ecosystem -- diagram blok GPU lokal di tengah, layanan cloud di sekeliling -->

---

# Pencapaian & Bukti

Berbasis produk yang benar-benar berjalan — bukan sekadar konsep.

- **Pipeline live.** Empat workflow ComfyUI berjalan di GPU lokal; proses stitching dan assembly berfungsi; produk berada di versi v0.1.0 dengan tiga datamodel inti terdokumentasi rapi.
- **Margin kontribusi sehat.** Struktur cost per-user diperkirakan di bawah Rp10.000 per bulan setelah setup — fondasi margin kotor sekitar 90 persen.
- **LTV:CAC jauh di atas standar.** Dengan asumsi churn rendah, estimasi rasio LTV:CAC di atas 20:1 — lebih dari 6 kali ambang sehat 3:1.
- **Desain freemium yang tepat.** Gating 5 video per bulan dengan watermark cukup untuk trial, tidak cukup untuk produksi rutin — menghindari jebakan free tier yang terlalu longgar.

Catatan jujur: angka churn, konversi, dan accessibility GPU masih asumsi yang perlu divalidasi lewat pengukuran nyata. Statistik di atas adalah fondasi, bukan janji.

<!-- image: traction -- grafik naik sederhana dengan label pipeline live, margin, LTV:CAC -->

---

# Mengapa Kami

Perbandingan pilihan yang biasanya dihadapi creator mikro Indonesia.

| | **CapCut / Template** | **SaaS Cloud (per-video)** | **Jasa / Agency** | **Venturo Pro** |
|---|---|---|---|---|
| **Biaya** | Murah/free | Naik per generasi | Sangat mahal | Terprediksi, marginal rendah |
| **Konsistensi brand** | Generik | Terbatas | Tinggi | Menempel via Brand DNA |
| **Cepat untuk rutin** | Cepat tapi seragam | Cepat | Lambat & antre | Cepat, satu alur |
| **Tanpa tim produksi** | Ya | Ya | Tidak | Ya |

Venturo Pro menang bukan dari harga absolut. Kemenangannya: brand yang tidak jeblok, waktu yang hemat, dan biaya yang bisa dikira-kira. Tidak menyerang Runway/Pika di segmen artistik, tidak bersaing dengan Canva di template murah — menyerang pilihan default creator Indonesia saat ini.

<!-- image: why -- tabel perbandingan sederhana dengan kolom Venturo Pro disorot -->

---

# Paket & Kerjasama

Struktur harga sederhana yang menjual ketenangan biaya, bukan tagihan per video.

- **Venturo Lite (Rp0)** — 1 Brand DNA, copilot dengan limit, kuota 5 video/bulan dengan watermark, antrean standar.
- **Pro (Rp99.000/bulan; annual Rp990.000/tahun)** — unlimited generate di lokal, full pipeline, tanpa watermark, sync lanjutan, priority support terstruktur.
- **Brand/Team (Rp299.000/bulan)** — multi-seat hingga 5 user, shared asset, kolaborasi, dedicated support.

Struktur ini masih proposal, bukan keputusan final — model subscription dipilih karena biaya marginal rendah setelah setup, sehingga yang dijual adalah kenyamanan biaya yang terprediksi, bukan per-render.

<!-- image: pricing -- tiga kartu tier dari kiri ke kanan, Pro di tengah disorot -->

---

# Hubungi Kami

Mulai dari komputermu sendiri — satu kali setup, lalu produksi berjalan di tempatmu.

- **Coba Venturo Lite** — gratis, 5 video per bulan, watermark.
- **Konsultasi setup GPU** — kami bantu lewati bagian teknis di awal.
- **Tim atau agensi kecil** — lihat paket Brand/Team untuk kolaborasi multi-seat.

Saluran kontak:

- **WhatsApp:** `[Nomor WhatsApp]`
- **Email:** `[Email Resmi]`
- **Kantor:** `[Alamat Kantor]`
- **Pendaftaran:** `[Tautan Pendaftaran]`

*Catatan jujur: kontak resmi belum tersedia di dokumen bisnis — saluran di atas akan dilengkapi saat tersedia.*

Video ber-brand yang konsisten dimulai dari langkah pertama. Biarkan brand-mu tetap terlihat seperti dirimu — di setiap video, tanpa tagihan yang tak terduga.

<!-- image: cta -- layar komputer dengan tombol mulai, latar warna brand -->