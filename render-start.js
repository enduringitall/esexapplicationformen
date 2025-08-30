#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Start the serve command
const serve = spawn('npx', ['serve', '-s', 'dist', '-l', process.env.PORT || '3000'], {
  stdio: 'inherit',
  cwd: process.cwd()
});

serve.on('close', (code) => {
  console.log(`serve process exited with code ${code}`);
  process.exit(code);
});

serve.on('error', (err) => {
  console.error('Failed to start serve:', err);
  process.exit(1);
});