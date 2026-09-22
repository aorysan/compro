const { splitDenseSlides } = require('../skills/builder/scripts/build-deck');
const mk = (n) => ({ title: 'Warga dan Iuran', content: Array.from({length: n}, (_, i) => `- **Fitur ${i+1}** — desc singkat delapan kata pas`).join('\n') });
const mkWithImage = (n) => ({ title: 'Galeri dan Iuran', content: `<!-- image: gallery.jpg -->\n` + Array.from({length: n}, (_, i) => `- **Item ${i+1}** — deskripsi singkat`).join('\n') });
let out = splitDenseSlides([mk(11)]);
if (out.length !== 3) { console.error(`FAIL: 11 bullets -> ${out.length} slides, expected 3`); process.exit(1); }
if (!out[1].title.includes('Part 2')) { console.error('FAIL: continuation title missing Part 2'); process.exit(1); }
out = splitDenseSlides([mk(4)]);
if (out.length !== 1) { console.error('FAIL: 4 bullets must not split'); process.exit(1); }
out = splitDenseSlides([mk(6)]);
if (out.length !== 2) { console.error(`FAIL: 6 bullets -> ${out.length} slides, expected 2`); process.exit(1); }
if (!out[1].title.includes('Part 2')) { console.error('FAIL: 6-bullet split missing Part 2 title'); process.exit(1); }
out = splitDenseSlides([mkWithImage(6)]);
if (out.length !== 2) { console.error(`FAIL: 6-bullet with image -> ${out.length} slides, expected 2`); process.exit(1); }
for (const chunk of out) { const imgMatches = chunk.content.match(/<!-- image:/g) || []; if (imgMatches.length !== 1) { console.error(`FAIL: chunk has ${imgMatches.length} image directives, expected 1`); process.exit(1); } }
console.log('PASS: density splitter 4/4/3 + Part titles, 6-bullet split, single directive per chunk');
process.exit(0);
