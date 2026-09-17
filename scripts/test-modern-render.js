const modern = require('../skills/builder/scripts/themes/modern');
const brand = { name: 'Venturo Pro', primaryColor: '#009BAD', secondaryColor: '#006D79' };

const hero = modern.renderModernHero({ title: 'Venturo Pro', content: 'Tagline here\n\nDesc here longer than thirty chars yes' }, brand, 0, '', 9);
if (!hero.includes('hero-layout-grid') || !hero.includes('Venturo Pro')) { console.error('FAIL: hero'); process.exit(1); }

const welcome = modern.renderModernWelcome({ title: 'Masalah yang Dihadapi', content: 'Intro line here\n\n- **Biaya naik** — tagihan cloud\n- **Brand lepas** — template generik' }, brand, 1, 'problem', '', 9);
if (!welcome.includes('two-col-layout-grid') || !welcome.includes('01') || !welcome.includes('Biaya naik')) { console.error('FAIL: welcome'); process.exit(1); }

const services = modern.renderModernServices({ title: 'Layanan Unggulan', content: 'Intro\n\n- **Brand DNA** — kunci identitas\n- **Pipeline** — render lokal' }, brand, 3, '', 9);
if (!services.includes('services-layout-grid') || !services.includes('Brand DNA')) { console.error('FAIL: services'); process.exit(1); }
// Zero-hallucination: 2 cards in, no invented 3rd/4th card titles
if (/Paket \d|Fitur Utama \d/.test(services)) { console.error('FAIL: services invented defaults'); process.exit(1); }

if (modern.classifyModernArchetype({ title: 'Paket & Kerjasama', content: '' }, 7, 9) !== 'pricing') { console.error('FAIL: classify'); process.exit(1); }
console.log('PASS: modern hero/welcome/services render');
process.exit(0);
