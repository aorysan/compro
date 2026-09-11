#!/usr/bin/env node
/**
 * Integrity check for compros/congen4/index.html (Canva Editorial theme).
 *
 * Runs 7 assertions specified by SDD plan Task 5 Step 2:
 *   1. #F4F5F7 is the background canvas.
 *   2. NO `Meta Title:` / `Meta Description:` anywhere in the page.
 *   3. Slide 2 (Problem) contains .archetype-narrative-split + cards with `01`, `02`.
 *   4. Slide 4 (Features) contains 4 service cards in a 2x2 grid.
 *   5. Slide 5 (Ecosystem) contains an inline <svg> orbit diagram.
 *   6. Slide 9 (Closing) contains charcoal container + structured contact info.
 *   7. ZERO empty sections (every <section> has visible content).
 *
 * Exit code 0 = all assertions pass; 1 = any failure.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const results = [];
function assert(name, pass, detail) {
  results.push({ name, pass, detail: detail || '' });
}

// Regular expression to get all <section ...>...</section> blocks.
// Reveal.js sections are directly under <div class="slides">; use a tolerant
// non-greedy match between section tags.
function getSections(doc) {
  const sections = [];
  const re = /<section\b[^>]*>([\s\S]*?)<\/section>/g;
  let m;
  while ((m = re.exec(doc)) !== null) {
    sections.push({ tag: m[0], body: m[1] });
  }
  return sections;
}

const sections = getSections(html);

/* 1. #F4F5F7 as background canvas */
const canvasOk =
  /--canvas-bg:\s*#F4F5F7/i.test(html) &&
  /background(?:-color)?:\s*var\(--canvas-bg\)/.test(html);
assert(
  'Canvas background is #F4F5F7',
  canvasOk,
  canvasOk ? 'var(--canvas-bg): #F4F5F7 defined and applied' : 'canvas token missing'
);

/* 2. No metadata leaks */
const noMetaTitle = /Meta\s+Title\s*:/.test(html) === false;
const noMetaDesc = /Meta\s+Description\s*:/.test(html) === false;
assert(
  'No Meta Title / Meta Description leaks',
  noMetaTitle && noMetaDesc,
  (noMetaTitle && noMetaDesc)
    ? 'neither Meta Title nor Meta Description appears in HTML'
    : 'metadata leak detected'
);

/* 3. Slide 2 (Problem) — narrative-split with cards 01/02 */
const slide2 = sections[1] || { body: '' };
const slide2HasNarrative = /archetype-narrative-split/.test(slide2.tag);
const slide2HasCards = /editorial-card-numbered/.test(slide2.body);
const slide2HasBadge01 = /editorial-num-badge">\s*01\s*</.test(slide2.body);
const slide2HasBadge02 = /editorial-num-badge">\s*02\s*</.test(slide2.body);
assert(
  'Slide 2 problem: narrative-split + cards 01/02',
  slide2HasNarrative && slide2HasCards && slide2HasBadge01 && slide2HasBadge02,
  JSON.stringify({ narrative: slide2HasNarrative, cards: slide2HasCards, badge01: slide2HasBadge01, badge02: slide2HasBadge02 })
);

/* 4. Slide 4 (Features) — 4 service cards in 2x2 grid */
const slide4 = sections[3] || { body: '' };
const slide4HasServices = /archetype-services-grid/.test(slide4.tag);
const slide4Has2x2 = /services-grid-2x2/.test(slide4.body);
const serviceCards4 = (slide4.body.match(/class="service-card"/g) || []).length;
assert(
  'Slide 4 features: 4 service cards in 2x2 grid',
  slide4HasServices && slide4Has2x2 && serviceCards4 === 4,
  JSON.stringify({ archetype: slide4HasServices, grid2x2: slide4Has2x2, serviceCardCount: serviceCards4 })
);

/* 5. Slide 5 (Ecosystem) — inline <svg> orbit diagram */
const slide5 = sections[4] || { body: '' };
const slide5HasEcosystem = /archetype-ecosystem-orbit/.test(slide5.tag);
const slide5HasSvg = /<svg[\s\S]*<\/svg>/.test(slide5.body);
const slide5HasOrbit = /ecosystem-orbit-diagram/.test(slide5.body);
assert(
  'Slide 5 ecosystem: inline SVG orbit diagram',
  slide5HasEcosystem && slide5HasSvg && slide5HasOrbit,
  JSON.stringify({ archetype: slide5HasEcosystem, inlineSvg: slide5HasSvg, orbitClass: slide5HasOrbit })
);

/* 6. Slide 9 (Closing) — charcoal container + structured contact */
const slide9 = sections[8] || { body: '' };
const slide9HasClosing = /archetype-closing-cta/.test(slide9.tag);
const slide9HasCharcoal = /closing-charcoal-container/.test(slide9.body) && /#232220/i.test(slide9.body);
const slide9HasContact = /contact-grid-4col/.test(slide9.body) && /contact-grid-item/.test(slide9.body);
const contactItems = (slide9.body.match(/class="contact-grid-item"/g) || []).length;
assert(
  'Slide 9 closing: charcoal container + structured contact',
  slide9HasClosing && slide9HasCharcoal && slide9HasContact,
  JSON.stringify({ archetype: slide9HasClosing, charcoal: slide9HasCharcoal, contactGrid: slide9HasContact, contactItems })
);

/* 7. Zero empty sections */
function hasVisibleContent(body) {
  // Strip comments and whitespace; require at least one non-empty text or element.
  const cleaned = body.replace(/<!--[\s\S]*?-->/g, '');
  const textOnly = cleaned.replace(/<[^>]+>/g, '');
  const hasText = textOnly.replace(/\s+/g, '').length > 0;
  const hasMedia = /<(img|svg|video|canvas|table)/.test(cleaned);
  return hasText || hasMedia;
}
const emptyIndexes = sections.map((s, i) => (hasVisibleContent(s.body) ? -1 : i)).filter((i) => i >= 0);
assert(
  'Zero empty sections',
  sections.length === 9 && emptyIndexes.length === 0,
  JSON.stringify({ slideCount: sections.length, emptySlides: emptyIndexes })
);

/* Also assert final archetype ordering integrity for the record. */
const expectedOrder = [
  'archetype-hero-cover',
  'archetype-narrative-split',
  'archetype-narrative-split',
  'archetype-services-grid',
  'archetype-ecosystem-orbit',
  'archetype-metrics-contact',
  'archetype-differentiator',
  'archetype-pricing-cards',
  'archetype-closing-cta',
];
const actualOrder = sections.map((s) => {
  const m = s.tag.match(/class="(archetype-[a-z-]+)/);
  return m ? m[1] : '(none)';
});
assert(
  'Archetype order matches map',
  JSON.stringify(actualOrder) === JSON.stringify(expectedOrder),
  actualOrder.join(' > ')
);

/* Report */
let allPass = true;
for (const r of results) {
  const status = r.pass ? 'PASS' : 'FAIL';
  if (!r.pass) allPass = false;
  console.log(`[${status}] ${r.name}${r.detail ? ' — ' + r.detail : ''}`);
}

console.log(`\n${results.length} assertions, ${results.filter((r) => r.pass).length} passed.`);
process.exit(allPass ? 0 : 1);