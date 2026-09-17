/* themes/modern.js — Modern multi-template renderers (part 1: hero, welcome, services).
   Direct ports of congen6 build_deck.py sections 1-4, adapted to generic
   { title, content } slides with shared parsers from ../build-deck.
   Zero-hallucination rule: render only parsed cards (cards.slice(0,4) as-is);
   never invent default services/cards. Empty grid + console.warn on zero cards.
*/
const {
  parseEditorialCards,
  extractBigNumberMetric,
  sanitizeSlideContent,
  resolveSlideSlot,
  resolveSlideImageUrl
} = require('../build-deck');

// NOTE: `inline` is duplicated here verbatim from build-deck.js (8-line helper)
// to avoid cross-module HTML-escaping drift between theme renderers.
function inline(mdtext) {
  if (!mdtext) return '';
  return mdtext
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}

function slideBadge(index, totalSlides) {
  return `${String(index + 1).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;
}

// Modern archetype classifier: title-keyword map over the 10 modern archetypes
// (cover/problem/solution/services/ecosystem/metrics/differentiator/pricing/
// closing/social-proof) with positional fallback.
function classifyModernArchetype(slide, index, totalSlides) {
  const t = (slide.title || '').toLowerCase();
  if (index === 0) return 'cover';
  if (index === totalSlides - 1 || /hubungi|kontak|contact|closing|cta/.test(t)) return 'closing';
  if (/testimoni|testimonial|klien|kepercayaan/.test(t)) return 'social-proof';
  if (/paket|harga|pricing|kerjasama|plan/.test(t)) return 'pricing';
  if (/mengapa|kenapa|why|differentiator|keunggulan kompetitif/.test(t)) return 'differentiator';
  if (/arsitektur|ekosistem|ecosystem|stack/.test(t)) return 'ecosystem';
  if (/pencapaian|bukti|traction|showcase|metric|statistik|angka|kpi/.test(t)) return 'metrics';
  if (/masalah|tantangan|pain|problem/.test(t)) return 'problem';
  if (/solusi|solution|nilai tambah|value/.test(t)) return 'solution';
  if (/profil|profile|tentang|cover/.test(t)) return 'cover';
  if (/layanan|fitur|services|feature|keunggulan/.test(t)) return 'services';
  return index === 1 ? 'problem' : 'solution';
}

// Slide 1: Hero Cover — congen6 section 1 port (hero-layout-grid).
function renderModernHero(slide, brand, index = 0, assetsDir = '', totalSlides = 9) {
  const content = sanitizeSlideContent(slide.content || '').replace(/<!--[\s\S]*?-->/g, '').trim();
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
  let tagline = '';
  let desc = '';
  const statLines = [];
  for (const line of lines) {
    if (/^[-*]\s/.test(line)) {
      statLines.push(line);
    } else if (!tagline && !/^💼/u.test(line) && line.length > 5) {
      tagline = line;
    } else if (/^💼/u.test(line)) {
      desc = line.replace(/^💼\s*/u, '');
    } else if (!desc && line.length > 25) {
      desc = line;
    }
  }

  const targetSlot = resolveSlideSlot(slide, index, totalSlides, 'hero');
  const imgSrc = resolveSlideImageUrl(index + 1, targetSlot, assetsDir);

  const statsHtml = statLines.slice(0, 3).map(st => {
    const m = extractBigNumberMetric(st);
    return `
      <div class="hero-stat-card">
        <span class="hero-stat-value">${inline(m.number)}</span>
        <span class="hero-stat-desc">${inline(m.title ? `${m.title} ${m.desc}` : m.desc)}</span>
      </div>`;
  }).join('\n');

  return `
    <section>
      <div class="editorial-slide-container">
        <div class="hero-layout-grid">
          <div class="hero-left-panel">
            <div style="display:flex; flex-direction:column; gap:10px;">
              <div class="hero-header-brand-row">
                <div class="hero-logo-mark">${inline(brand.name)}</div>
                <span class="slide-kicker-badge">Company Profile &amp; Pitch Deck</span>
                <span class="slide-index-badge" style="margin-left:auto;">${slideBadge(index, totalSlides)}</span>
              </div>
              <h1 class="hero-main-title">${inline(slide.title)}</h1>
              ${tagline ? `<p class="hero-deck-description">${inline(tagline)}</p>` : ''}
              ${desc ? `<p class="hero-deck-description">${inline(desc)}</p>` : ''}
            </div>
            ${statsHtml ? `<div class="hero-metrics-strip">${statsHtml}</div>` : ''}
          </div>
          <div class="editorial-image-frame">
            <img src="${imgSrc}" alt="${inline(slide.title)}" />
            ${tagline ? `<div class="image-floating-badge"><div class="dot"></div><span>${inline(tagline)}</span></div>` : ''}
          </div>
        </div>
      </div>
    </section>`;
}

// Slides 2 & 3: Problem / Solution — congen6 sections 2-3 port (two-col-layout-grid).
function renderModernWelcome(slide, brand, index = 1, type = 'problem', assetsDir = '', totalSlides = 9) {
  const content = sanitizeSlideContent(slide.content || '').trim();
  const { introText, cards } = parseEditorialCards(content);
  const isProblem = type === 'problem' || /masalah|tantangan|pain|problem/i.test(slide.title || '');
  const badgeText = isProblem ? 'Tantangan Industri' : 'Solusi & Nilai Tambah';
  const badgeClass = isProblem ? 'slide-kicker-badge danger' : 'slide-kicker-badge';
  const targetSlot = resolveSlideSlot(slide, index, totalSlides, isProblem ? 'problem' : 'solution');
  const imgSrc = resolveSlideImageUrl(index + 1, targetSlot, assetsDir);

  if (cards.length === 0) console.warn(`[modern] welcome slide ${index + 1} has zero cards; rendering empty grid`);
  const cardsHtml = cards.slice(0, 4).map((card, i) => {
    const num = String(i + 1).padStart(2, '0');
    return `
      <div class="editorial-story-card">
        <div>
          <div class="card-top-row">
            <span class="card-number-badge${isProblem ? ' danger' : ''}">${num}</span>
            <span class="card-pill-tag${isProblem ? ' danger' : ' solution'}">${inline(badgeText)}</span>
          </div>
          <h3 class="card-main-title">${inline(card.title)}</h3>
          <p class="card-body-text">${inline(card.desc)}</p>
        </div>
      </div>`;
  }).join('\n');

  return `
    <section>
      <div class="editorial-slide-container">
        <div class="slide-header">
          <div class="slide-header-left">
            <span class="${badgeClass}">${inline(badgeText)}</span>
            <h2 class="slide-title">${inline(slide.title)}</h2>
          </div>
          <div class="slide-header-right">
            ${introText ? `<p class="slide-subtitle">${inline(introText)}</p>` : ''}
            <span class="slide-index-badge">${slideBadge(index, totalSlides)}</span>
          </div>
        </div>
        <div class="two-col-layout-grid">
          <div class="editorial-image-frame">
            <img src="${imgSrc}" alt="${inline(slide.title)}" />
          </div>
          <div class="cards-vertical-stack">
            ${cardsHtml}
          </div>
        </div>
      </div>
    </section>`;
}

// Slide 4: Services Bento — congen6 section 4 port (services-layout-grid).
function renderModernServices(slide, brand, index = 3, assetsDir = '', totalSlides = 9) {
  const content = sanitizeSlideContent(slide.content || '').trim();
  const { introText, cards } = parseEditorialCards(content);
  const targetSlot = resolveSlideSlot(slide, index, totalSlides, 'services');
  const imgSrc = resolveSlideImageUrl(index + 1, targetSlot, assetsDir);

  if (cards.length === 0) console.warn(`[modern] services slide ${index + 1} has zero cards; rendering empty grid`);
  const cardsHtml = cards.slice(0, 4).map((card, i) => {
    const num = String(i + 1).padStart(2, '0');
    return `
      <div class="service-card">
        <div>
          <div class="service-top-row">
            <span class="service-badge-num">${num}</span>
            <span class="service-tag-pill">Layanan</span>
          </div>
          <h3 class="service-title">${inline(card.title)}</h3>
          <p class="service-desc">${inline(card.desc)}</p>
        </div>
      </div>`;
  }).join('\n');

  return `
    <section>
      <div class="editorial-slide-container">
        <div class="slide-header">
          <div class="slide-header-left">
            <span class="slide-kicker-badge">Kemampuan Platform</span>
            <h2 class="slide-title">${inline(slide.title)}</h2>
          </div>
          <div class="slide-header-right">
            ${introText ? `<p class="slide-subtitle">${inline(introText)}</p>` : ''}
            <span class="slide-index-badge">${slideBadge(index, totalSlides)}</span>
          </div>
        </div>
        <div class="services-layout-grid">
          <div class="services-left-col">
            <div class="services-stat-summary">
              <span class="hero-trust-label">Layanan Unggulan</span>
              ${introText ? `<p class="services-metric-desc">${inline(introText)}</p>` : ''}
            </div>
            <div class="editorial-image-frame services-photo-frame">
              <img src="${imgSrc}" alt="${inline(slide.title)}" />
            </div>
          </div>
          <div class="services-2x2-grid">
            ${cardsHtml}
          </div>
        </div>
      </div>
    </section>`;
}

module.exports = {
  classifyModernArchetype,
  renderModernHero,
  renderModernWelcome,
  renderModernServices
};
