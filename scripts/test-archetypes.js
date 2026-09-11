const assert = require('assert');
const buildDeck = require('./build-deck.js');

const brand = { name: 'Venturo Pro', primaryColor: '#009BAD', secondaryColor: '#38BDF8' };

// Test Narrative Split renderer
const problemSlide = {
  title: 'Masalah yang Dihadapi',
  content: 'Creator terjebak.\n\n- **Biaya tinggi**: Jasa mahal.\n- **Konsistensi sulit**: Video acak.'
};

const renderedProblem = buildDeck.renderEditorialNarrativeSplit(problemSlide, brand, 'problem');
assert.ok(renderedProblem.includes('archetype-narrative-split'), 'Has archetype-narrative-split class');
assert.ok(renderedProblem.includes('01'), 'Contains 01 number badge');
assert.ok(renderedProblem.includes('02'), 'Contains 02 number badge');
assert.ok(renderedProblem.includes('Biaya tinggi'), 'Contains card title');

console.log('PASS: Archetype renderer tests passed');
