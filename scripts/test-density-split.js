const { splitDenseSlides } = require('../skills/builder/scripts/build-deck');
const mk = (n) => ({ title: 'Warga dan Iuran', content: Array.from({length: n}, (_, i) => `- **Fitur ${i+1}** — desc singkat delapan kata pas`).join('\n') });
let out = splitDenseSlides([mk(11)]);
if (out.length !== 3) { console.error(`FAIL: 11 bullets -> ${out.length} slides, expected 3`); process.exit(1); }
if (!out[1].title.includes('Part 2')) { console.error('FAIL: continuation title missing Part 2'); process.exit(1); }
out = splitDenseSlides([mk(4)]);
if (out.length !== 1) { console.error('FAIL: 4 bullets must not split'); process.exit(1); }
console.log('PASS: density splitter 4/4/3 + Part titles');
process.exit(0);
