#!/usr/bin/env node

/**
 * deploy.js — Helper script untuk company-profile-publisher
 * Men-deploy folder ke Vercel menggunakan CLI
 * 
 * Usage: node deploy.js <folder-path> [--prod]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

const FOLDER = process.argv[2];
const IS_PROD = process.argv.includes('--prod');

if (!FOLDER) {
  console.error('Usage: node deploy.js <folder-path> [--prod]');
  process.exit(1);
}

if (!fs.existsSync(FOLDER)) {
  console.error(`Folder not found: ${FOLDER}`);
  process.exit(1);
}

// Step 1: Check Vercel CLI
try {
  execSync('vercel --version', { stdio: 'ignore' });
} catch {
  console.error('Vercel CLI not found. Install with: npm i -g vercel');
  process.exit(1);
}

// Step 2: Check auth
try {
  execSync('vercel whoami', { stdio: 'ignore' });
} catch {
  console.error('Vercel CLI not authenticated. Run: vercel login');
  process.exit(1);
}

// Step 3: Deploy
const args = ['deploy', '--yes', '--implicit-commit'];
if (IS_PROD) args.push('--prod');
args.push('--path', FOLDER);

try {
  const output = execSync(`vercel ${args.join(' ')}`, {
    cwd: FOLDER,
    encoding: 'utf-8',
  });
  
  console.log('Deploy output:');
  console.log(output);
  
  // Extract preview URL from output ( 간단한 regex )
  const urlMatch = output.match(/https:\/\/[^\s\n]+/);
  if (urlMatch) {
    console.log('\nPreview URL:', urlMatch[0]);
  }
} catch (error) {
  console.error('Deploy failed:');
  console.error(error.stdout || error.message);
  process.exit(1);
}
