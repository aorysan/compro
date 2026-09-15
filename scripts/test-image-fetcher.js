const assert = require('assert');
const fs = require('fs');
const path = require('path');
const imageFetcher = require('./image-fetcher.js');

async function runTests() {
  const tmpDir = path.join(__dirname, '..', 'scratch', 'test-assets');
  fs.mkdirSync(tmpDir, { recursive: true });

  try {
    // Test 1: Markdown Comment Slot Mapping
    const slotInfo = imageFetcher.mapCommentToSlot('<!-- image: hero -- sudut pandang kantor kreatif modern -->');
    assert.strictEqual(slotInfo.slot, 'hero');
    assert.strictEqual(slotInfo.category, 'architecture-portrait');
    assert.strictEqual(slotInfo.orientation, 'portrait');

    // Additional Mapping checks
    const solutionInfo = imageFetcher.mapCommentToSlot('<!-- image: solution -- team collaboration -->');
    assert.strictEqual(solutionInfo.slot, 'solution');
    assert.strictEqual(solutionInfo.category, 'creative-meeting');

    const defaultInfo = imageFetcher.mapCommentToSlot(null);
    assert.strictEqual(defaultInfo.slot, 'hero');

    // Test 2: Fallback trigger when given invalid URL / offline mode
    const testDest = path.join(tmpDir, 'test-fallback.jpg');
    if (fs.existsSync(testDest)) fs.unlinkSync(testDest);
    
    await imageFetcher.fetchImageWithFallback({
      category: 'non-existent-category',
      destPath: testDest,
      slot: 'hero',
      forceFallback: true
    });
    assert.ok(fs.existsSync(testDest), 'Fallback image must exist on destination');
    assert.ok(fs.statSync(testDest).size > 100, 'Image size should be > 100 bytes');

    // Test 3: Idempotency check (existing file skipped)
    const statsBefore = fs.statSync(testDest).mtimeMs;
    await imageFetcher.fetchImageWithFallback({
      category: 'architecture-portrait',
      destPath: testDest,
      slot: 'hero'
    });
    const statsAfter = fs.statSync(testDest).mtimeMs;
    assert.strictEqual(statsBefore, statsAfter, 'Existing valid file must not be redownloaded');

    // Test 4: Verify local SVG fallbacks exist for all slots
    const slots = ['hero', 'problem', 'solution', 'features', 'services', 'metrics', 'closing'];
    for (const slot of slots) {
      const info = imageFetcher.mapCommentToSlot(`<!-- image: ${slot} -->`);
      const fallbackPath = path.join(__dirname, '..', 'templates', 'assets', 'fallback', info.fallback);
      assert.ok(fs.existsSync(fallbackPath), `Fallback SVG must exist for slot ${slot}: ${fallbackPath}`);
    }

    console.log('PASS: image-fetcher tests passed');
  } finally {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  }
}

runTests().catch(err => {
  console.error('FAIL:', err);
  process.exit(1);
});
