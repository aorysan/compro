const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');

const syncPlugin = require('./sync-plugin.js');

// Test 1: Resolve targets
const targets = syncPlugin.resolveSyncTargets();
assert.ok(targets.marketplaceDir, 'Marketplace directory resolved');
assert.ok(targets.cacheDir, 'Cache directory resolved');
assert.ok(targets.version === '2.5.0', `Version should be 2.5.0, got ${targets.version}`);

// Test 2: Files to sync includes core builder scripts and templates
const files = syncPlugin.getFilesToSync();
const filenames = files.map(f => path.basename(f.src));
assert.ok(filenames.includes('build-deck.js'), 'Sync includes build-deck.js');
assert.ok(filenames.includes('editorial.css'), 'Sync includes editorial.css');
assert.ok(filenames.includes('image-fetcher.js'), 'Sync includes image-fetcher.js');

// Test 3: Manifests and skills to mirror lists
assert.ok(syncPlugin.MANIFESTS_TO_MIRROR.includes('plugin.json'), 'Includes plugin.json');
assert.ok(syncPlugin.MANIFESTS_TO_MIRROR.includes(path.join('.claude-plugin', 'plugin.json')), 'Includes .claude-plugin/plugin.json');
assert.ok(syncPlugin.MANIFESTS_TO_MIRROR.includes(path.join('.codex-plugin', 'plugin.json')), 'Includes .codex-plugin/plugin.json');
assert.strictEqual(syncPlugin.SKILLS_TO_MIRROR.length, 5, 'Must mirror all 5 skills');
for (const s of ['compro', 'writer', 'reviewer', 'publisher', 'builder']) {
  assert.ok(syncPlugin.SKILLS_TO_MIRROR.includes(s), `Includes skill ${s}`);
}

// Test 4: Execution of sync mirrors manifests and all 5 skills to cache
syncPlugin.runSync();
for (const m of syncPlugin.MANIFESTS_TO_MIRROR) {
  assert.ok(fs.existsSync(path.join(targets.cacheDir, m)), `Cache has manifest ${m}`);
}
for (const s of syncPlugin.SKILLS_TO_MIRROR) {
  assert.ok(fs.existsSync(path.join(targets.cacheDir, 'skills', s, 'SKILL.md')), `Cache has skill ${s}/SKILL.md`);
}

console.log('PASS: sync-plugin tests passed');
