const assert = require('assert');
const path = require('path');
const fs = require('fs');

const buildDeck = require('./build-deck.js');

// Test 1: CLI flag override
const explicitRoot = '/tmp/explicit-test-root';
const resolvedExplicit = buildDeck.detectProjectRoot(['--root=' + explicitRoot]);
assert.strictEqual(resolvedExplicit, explicitRoot, 'CLI --root flag must take highest priority');

// Test 2: Environment variable override
process.env.COMPRO_PROJECT_ROOT = '/tmp/env-test-root';
const resolvedEnv = buildDeck.detectProjectRoot([]);
assert.strictEqual(resolvedEnv, '/tmp/env-test-root', 'COMPRO_PROJECT_ROOT env must take priority over cwd');
delete process.env.COMPRO_PROJECT_ROOT;

// Test 3: Normal workspace detection finds compros folder
const resolvedDefault = buildDeck.detectProjectRoot([]);
assert.ok(fs.existsSync(path.join(resolvedDefault, 'compros')), 'Default resolution must find directory with compros');

// Test 4: postBuildSyncGuarantee mirrors when outDir !== expectedDir
const tempWorktree = path.join('/tmp', 'test-wt-' + Date.now());
const tempMain = path.join('/tmp', 'test-main-' + Date.now());
const testSlug = 'testslug';
const wtOut = path.join(tempWorktree, 'compros', testSlug);
fs.mkdirSync(wtOut, { recursive: true });
fs.writeFileSync(path.join(wtOut, 'index.html'), '<h1>Test</h1>');
buildDeck.postBuildSyncGuarantee(wtOut, tempMain, testSlug);
assert.ok(fs.existsSync(path.join(tempMain, 'compros', testSlug, 'index.html')), 'postBuildSyncGuarantee must copy files to main workspace');
// Clean up
fs.rmSync(tempWorktree, { recursive: true, force: true });
fs.rmSync(tempMain, { recursive: true, force: true });

console.log('PASS: workspace-resolver tests passed');
