const assert = require('assert');
const buildDeck = require('./build-deck.js');

// Test 1: Strip Tagline prefix and frontmatter
const rawSlideText = `---
Meta Title: Venturo Pro
---
Tagline: Video ber-brand konsisten.

Deskripsi produk kami.`;

const cleaned = buildDeck.sanitizeSlideContent(rawSlideText);
assert.ok(!cleaned.includes('Tagline:'), 'Tagline: prefix must be stripped');
assert.ok(!cleaned.includes('Meta Title:'), 'Meta Title must be stripped');
assert.ok(cleaned.includes('Video ber-brand konsisten.'), 'Tagline body preserved');
assert.ok(cleaned.includes('Deskripsi produk kami.'), 'Body text preserved');

// Test 2: Contact bracket sanitization
const rawContact = `- WhatsApp: [Nomor WhatsApp]
- Email: [Email Resmi]
- Kantor: [Alamat Kantor]`;
const sanitizedContact = buildDeck.sanitizeContactDetails(rawContact, 'venturo-pro');
assert.ok(!sanitizedContact.includes('[Nomor WhatsApp]'), 'Bracket WhatsApp replaced');
assert.ok(sanitizedContact.includes('+62 812-9000-8899'), 'Has formatted WhatsApp');
assert.ok(sanitizedContact.includes('contact@venturo.pro') || sanitizedContact.includes('halo@venturo-pro.id'), 'Has formatted email');
assert.ok(!sanitizedContact.includes('[Alamat Kantor]'), 'Bracket Alamat replaced');
assert.ok(sanitizedContact.includes('Jakarta Selatan'), 'Has formatted address');

// Test 3: Big Number regex extraction
const metricItem = `- **LTV:CAC jauh di atas standar.** Dengan asumsi churn rendah, estimasi rasio LTV:CAC di atas 20:1 — lebih dari 6 kali.`;
const extractedMetric = buildDeck.extractBigNumberMetric(metricItem);
assert.strictEqual(extractedMetric.number, '20:1', 'Extracted 20:1 ratio');
assert.strictEqual(extractedMetric.title, 'LTV:CAC jauh di atas standar.', 'Extracted title');

// Test 4: Pre-flight Ruling 3 (No double period if title has period)
const metricItemWithDot = `- **Efisiensi Biaya.** Operasional 80% lebih hemat.`;
const extractedWithDot = buildDeck.extractBigNumberMetric(metricItemWithDot);
assert.strictEqual(extractedWithDot.title, 'Efisiensi Biaya.', 'No double period added');
assert.strictEqual(extractedWithDot.number, '80%', 'Extracted 80% percentage');

const metricItemWithoutDot = `- **Efisiensi Biaya** Operasional 80% lebih hemat.`;
const extractedWithoutDot = buildDeck.extractBigNumberMetric(metricItemWithoutDot);
assert.strictEqual(extractedWithoutDot.title, 'Efisiensi Biaya.', 'Period appended when missing');

// Test 5: Markdown parsing integrates sanitizeSlideContent
const sampleMd = `---
Meta Title: Brand Deck
---
# First Slide
Tagline: Powerful Deck Engine
Content paragraph here.`;
const parsed = buildDeck.parseAndSanitizeMarkdown(sampleMd);
assert.strictEqual(parsed.length, 1);
assert.ok(!parsed[0].content.includes('Tagline:'), 'Integrated sanitizeSlideContent strips Tagline prefix');
assert.ok(!parsed[0].content.includes('Meta Title:'), 'Integrated sanitizeSlideContent strips Meta Title');

console.log('PASS: sanitizer tests passed');
