const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Load sample markdown with frontmatter & Meta Title
const sampleMd = `---
Meta Title: Venturo Pro — Video Ber-brand Konsisten
Meta Description: Platform produksi video
---

# Venturo Pro

Tagline: Video ber-brand yang konsisten.

Venturo Pro adalah platform produksi video ber-brand.

- ⚙️ Pipeline video berjalan di GPU lokal
- 🎨 Brand DNA menjaga warna dan font

---

# Masalah yang Dihadapi

Creator terjebak di antara dua pilihan yang merugikan.

- **Biaya produksi tinggi.** Jasa editor mahal per proyek.
- **Konsistensi brand sulit dijaga.** Video generik tidak selaras.
`;

const buildDeck = require('./build-deck.js');

// Test 1: Sanitize markdown
const sanitizedSlides = buildDeck.parseAndSanitizeMarkdown(sampleMd);
assert.strictEqual(sanitizedSlides.length, 2, 'Should extract exactly 2 slides');
assert.strictEqual(sanitizedSlides[0].title, 'Venturo Pro', 'Slide 1 title should not have Meta Title');
assert.ok(!sanitizedSlides[0].content.includes('Meta Title:'), 'Slide 1 content must not contain Meta Title:');

// Test 2: Card parsing
const problemCards = buildDeck.parseEditorialCards(sanitizedSlides[1].content);
assert.strictEqual(problemCards.cards.length, 2, 'Problem slide must have 2 cards');
assert.strictEqual(problemCards.cards[0].title, 'Biaya produksi tinggi.', 'Card 1 title extracted from bold');
assert.ok(problemCards.cards[0].desc.includes('Jasa editor mahal'), 'Card 1 desc extracted');

console.log('PASS: parseAndSanitizeMarkdown and parseEditorialCards tests passed');