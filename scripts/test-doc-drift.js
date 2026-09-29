// scripts/test-doc-drift.js — Documentation anti-drift test.
//
// `test-cinematic-classifier.js` guarantees the *code* vocabularies agree
// (themes/modern.js ↔ manifest.json ↔ imageFetcher.SLOT_MAP). It cannot see the
// markdown, which is exactly how the docs drifted to "7 archetypes" while the
// SSOT shipped 9. This test closes that gap: every human-facing document that
// enumerates the archetype vocabulary must list all of them, and no document may
// repeat the stale count.
const fs = require('fs');
const path = require('path');
const { CINEMATIC_ARCHETYPES } = require('../skills/builder/scripts/themes/modern');

function assert(cond, msg) { if (!cond) { console.error('FAIL: ' + msg); process.exit(1); } }

const rootDir = path.join(__dirname, '..');

// Documents that enumerate the archetype vocabulary for a human/agent reader.
const DOCS = [
  'README.md',
  'skills/compro/SKILL.md',
  'skills/writer/SKILL.md',
  'skills/builder/SKILL.md',
  'skills/builder/references/visual-hierarchy.md',
  'skills/builder/templates/modern/README.md'
];

// Stale-count phrasings that must never come back.
const STALE_COUNT_RES = [
  /\b7 core slide archetypes\b/i,
  /\b7 layout archetypes\b/i,
  /\b7 slide archetypes\b/i,
  /\b7 arketipe\b/i,
  /\b7 archetypes\b/i,
  /\(7 core\)/i,
  /\bexactly \*\*7 archetypes\*\*/i,
  /\b7 arketipe renderers\b/i
];

assert(CINEMATIC_ARCHETYPES.length === 9, `SSOT must expose 9 archetypes, got ${CINEMATIC_ARCHETYPES.length}`);

for (const rel of DOCS) {
  const full = path.join(rootDir, rel);
  assert(fs.existsSync(full), `doc missing: ${rel}`);
  const text = fs.readFileSync(full, 'utf-8');

  for (const archetype of CINEMATIC_ARCHETYPES) {
    assert(
      text.includes('`' + archetype + '`'),
      `${rel} does not enumerate archetype \`${archetype}\` (docs drifted from CINEMATIC_ARCHETYPES)`
    );
  }

  for (const re of STALE_COUNT_RES) {
    const m = text.match(re);
    assert(!m, `${rel} still carries the stale archetype count "${m && m[0]}" — SSOT has 9`);
  }
}

console.log('PASS: all ' + DOCS.length + ' docs enumerate the 9 CINEMATIC_ARCHETYPES and carry no stale count');
process.exit(0);
