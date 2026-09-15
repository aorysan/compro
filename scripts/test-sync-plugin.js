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

console.log('PASS: sync-plugin tests passed');
