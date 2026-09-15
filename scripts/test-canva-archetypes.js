const assert = require('assert');
const path = require('path');
const fs = require('fs');
const buildDeck = require('./build-deck.js');

const brand = { name: 'Venturo Pro', primaryColor: '#009BAD', secondaryColor: '#38BDF8' };

// Test Archetype 1: Cover / Hero Presentation
const coverSlide = {
  title: 'Platform Video AI Otomatis',
  content: `Tagline: Skalakan konten video brand Anda tanpa batas.\n\n💼 Solusi enterprise modern untuk visual konsisten.`
};
const coverHtml = buildDeck.renderCanvaCover(coverSlide, brand);
assert.ok(coverHtml.includes('archetype-canva-cover'), 'Has archetype-canva-cover class');
assert.ok(coverHtml.includes('Platform Video AI Otomatis'), 'Contains title');
assert.ok(coverHtml.includes('btn-charcoal'), 'Has solid Charcoal CTA button');
assert.ok(coverHtml.includes('btn-outline-brand'), 'Has outline Teal button');

// Test Archetype 2: Welcome (Problem & Solution)
const problemSlide = {
  title: 'Tantangan Industri Konten',
  content: `- **Biaya Tinggi.** Biaya per render API cloud mahal.\n- **Konsistensi Rusak.** Format video tidak selaras brand DNA.`
};
const problemHtml = buildDeck.renderCanvaWelcome(problemSlide, brand, 1, 'problem');
assert.ok(problemHtml.includes('archetype-canva-welcome'), 'Has archetype-canva-welcome class');
assert.ok(problemHtml.includes('canva-welcome-problem'), 'Has problem modifier class');
assert.ok(problemHtml.includes('Biaya Tinggi.'), 'Renders problem item');
assert.ok(problemHtml.includes('01'), 'Has thick number 01');

const solutionSlide = {
  title: 'Solusi Terpadu Venturo Pro',
  content: `- **Render Lokal Nol Biaya.** Biaya operasional terprediksi.\n- **Brand Kit Terkunci.** Palet warna terjaga konsisten.`
};
const solutionHtml = buildDeck.renderCanvaWelcome(solutionSlide, brand, 2, 'solution');
assert.ok(solutionHtml.includes('archetype-canva-welcome'), 'Has archetype-canva-welcome class for solution');
assert.ok(solutionHtml.includes('canva-welcome-solution'), 'Has solution modifier class');
assert.ok(solutionHtml.includes('Render Lokal Nol Biaya.'), 'Renders solution item');

// Test Archetype 3: Services Grid (2x2 + photo)
const servicesSlide = {
  title: 'Layanan Unggulan',
  content: `- **Brand DNA Engine.** Konfigurasi otomatis font, palette, logo.\n- **GPU Local Pipeline.** Render video tanpa tagihan API.\n- **Google Sheets Sync.** Sinkronisasi konten skala besar.\n- **AI Copilot Integration.** Asisten konteks pintar.`
};
const servicesHtml = buildDeck.renderCanvaServices(servicesSlide, brand);
assert.ok(servicesHtml.includes('archetype-canva-services'), 'Has archetype-canva-services class');
assert.ok(servicesHtml.includes('Brand DNA Engine.'), 'Renders service item');
assert.ok(servicesHtml.includes('service-pill-charcoal'), 'Has charcoal pill label');
assert.ok(servicesHtml.includes('01'), 'Has number 01');

// Test Archetype 4: AI Ecosystem Orbit
const ecoSlide = {
  title: 'Arsitektur & Ekosistem AI',
  content: `- **Groq & Gemini.** Mesin penalaran cepat.\n- **Cloudflare & Supabase.** Penyimpanan dan auth.\n- **Local ComfyUI.** Pipeline render video tanpa biaya marginal.`
};
const ecoHtml = buildDeck.renderCanvaEcosystem(ecoSlide, brand);
assert.ok(ecoHtml.includes('archetype-canva-ecosystem'), 'Has archetype-canva-ecosystem class');
assert.ok(ecoHtml.includes('ecosystem-orbit-svg'), 'Renders ecosystem orbit SVG');
assert.ok(ecoHtml.includes('Groq') && ecoHtml.includes('Gemini'), 'Contains ecosystem AI nodes');

// Test Archetype 5: Metrics Big Number
const metricsSlide = {
  title: 'Pencapaian & Bukti',
  content: `- **Efisiensi Biaya.** Operasional 80% lebih hemat dibanding agensi.\n- **Rasio LTV:CAC.** Estimasi rasio LTV:CAC mencapai 20:1 di atas standar.\n- **Kapabilitas Render.** Hingga 100+ video per batch harian.\n- **Biaya per Video.** Estimasi Rp10.000 per video final.`
};
const metricsHtml = buildDeck.renderCanvaMetrics(metricsSlide, brand);
assert.ok(metricsHtml.includes('archetype-canva-metrics'), 'Has archetype-canva-metrics class');
assert.ok(metricsHtml.includes('80%') || metricsHtml.includes('20:1'), 'Contains extracted big numbers');
assert.ok(metricsHtml.includes('metric-big-number'), 'Has metric-big-number element');

// Test Archetype 6: Table Differentiator
const tableSlide = {
  title: 'Mengapa Kami',
  content: `| | **CapCut** | **Venturo Pro** |\n|---|---|---|\n| **Biaya** | Murah | Terprediksi |`
};
const tableHtml = buildDeck.renderCanvaDifferentiator(tableSlide, brand);
assert.ok(tableHtml.includes('archetype-canva-differentiator'), 'Has archetype-canva-differentiator class');
assert.ok(tableHtml.includes('<table'), 'Renders HTML table');
assert.ok(tableHtml.includes('col-brand'), 'Highlights brand column');

// Test Archetype 7: 3-Tier Pricing
const pricingSlide = {
  title: 'Paket & Kerjasama',
  content: `- **Lite (Rp0)**: 5 video\n- **Pro (Rp99.000)**: Unlimited\n- **Team (Rp299.000)**: 5 user`
};
const pricingHtml = buildDeck.renderCanvaPricing(pricingSlide, brand);
assert.ok(pricingHtml.includes('archetype-canva-pricing'), 'Has archetype-canva-pricing class');
assert.ok(pricingHtml.includes('pricing-card-elevated'), 'Has elevated Pro card');
assert.ok(pricingHtml.includes('Best Seller'), 'Has Best Seller badge');

// Test Archetype 8: Closing 3-Column
const closingSlide = {
  title: 'Hubungi Kami',
  content: `Saluran kontak:\n- WhatsApp: [Nomor WhatsApp]\n- Email: [Email Resmi]`
};
const closingHtml = buildDeck.renderCanvaClosing(closingSlide, brand);
assert.ok(closingHtml.includes('archetype-canva-closing'), 'Has archetype-canva-closing class');
assert.ok(closingHtml.includes('+62 812-9000-8899'), 'Has replaced WhatsApp');
assert.ok(!closingHtml.includes('[Nomor WhatsApp]'), 'Bracket WhatsApp stripped');
assert.ok(!closingHtml.includes('[Email Resmi]'), 'Bracket Email stripped');

// Test Prior Review Ruling: extractBigNumberMetric null guard and currency regex
const nullMetric = buildDeck.extractBigNumberMetric(null);
assert.strictEqual(nullMetric.number, '100%', 'Null bulletLine returns fallback 100%');
const currencyMetric = buildDeck.extractBigNumberMetric('- **Biaya Produksi.** Hanya Rp10.000 per video');
assert.strictEqual(currencyMetric.number, 'Rp10.000', 'Extracts formatted Indonesian currency correctly');
const currencySuffixMetric = buildDeck.extractBigNumberMetric('- **Harga Satuan.** Rp99 rb per episode');
assert.strictEqual(currencySuffixMetric.number, 'Rp99 rb', 'Extracts currency with suffix');

// Test Prior Review Ruling: SVG fallback accommodation in resolveSlideImageUrl
const mockDir = path.join('/tmp', 'mock-assets-' + Date.now());
fs.mkdirSync(mockDir, { recursive: true });
fs.writeFileSync(path.join(mockDir, 'slide-1-hero.svg'), '<svg></svg>');
const resolvedSvg = buildDeck.resolveSlideImageUrl(1, 'hero', mockDir);
assert.strictEqual(resolvedSvg, 'assets/slide-1-hero.svg', 'Resolves .svg extension when SVG fallback is present');
fs.writeFileSync(path.join(mockDir, 'slide-1-hero.jpg'), 'fake-jpg-content');
const resolvedJpg = buildDeck.resolveSlideImageUrl(1, 'hero', mockDir);
assert.strictEqual(resolvedJpg, 'assets/slide-1-hero.jpg', 'Prefers .jpg when present');
fs.rmSync(mockDir, { recursive: true, force: true });

// Test Slide Routing
const routedCover = buildDeck.renderSlide(coverSlide, 0, 8, brand, 'editorial');
assert.ok(routedCover.includes('archetype-canva-cover'), 'renderSlide routes slide 0 to canva cover');

const routedClosing = buildDeck.renderSlide(closingSlide, 7, 8, brand, 'editorial');
assert.ok(routedClosing.includes('archetype-canva-closing'), 'renderSlide routes last slide to canva closing');

console.log('PASS: canva-archetypes tests passed');
