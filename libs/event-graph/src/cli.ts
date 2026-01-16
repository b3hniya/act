#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { setRootPath, startServer, analyzeAndCache } from './server/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Find the project root by looking for a directory that contains 'modules' folder
 */
function findProjectRoot(): string {
  let currentDir = process.cwd();

  // Try current directory first
  if (fs.existsSync(path.join(currentDir, 'modules'))) {
    return currentDir;
  }

  // Go up from the CLI file location
  currentDir = path.resolve(__dirname, '..', '..', '..');
  if (fs.existsSync(path.join(currentDir, 'modules'))) {
    return currentDir;
  }

  // Last resort: go up from cwd
  currentDir = process.cwd();
  for (let i = 0; i < 5; i++) {
    if (fs.existsSync(path.join(currentDir, 'modules'))) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }

  throw new Error('Could not find project root with modules folder');
}

async function main() {
  console.log('');
  console.log('┌─────────────────────────────────────────┐');
  console.log('│  🔗 Event Graph - CQRS Flow Visualizer  │');
  console.log('└─────────────────────────────────────────┘');
  console.log('');

  // Find the project root (where modules folder is)
  const rootPath = findProjectRoot();
  console.log(`📂 Project root: ${rootPath}`);
  setRootPath(rootPath);

  // Analyze the codebase first
  await analyzeAndCache();

  // Start API server
  await startServer(4201);

  // Start Vite dev server
  console.log('');
  console.log('🌐 Starting web server...');

  const viteProcess = spawn('npx', ['vite', '--port', '4200'], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'inherit',
    shell: true,
  });

  viteProcess.on('error', (error) => {
    console.error('Failed to start Vite:', error);
    process.exit(1);
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n👋 Shutting down...');
    viteProcess.kill();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    viteProcess.kill();
    process.exit(0);
  });

  // Wait a bit then open browser
  setTimeout(async () => {
    try {
      const open = (await import('open')).default;
      await open('http://localhost:4200');
    } catch {
      console.log('');
      console.log('📎 Open http://localhost:4200 in your browser');
    }
  }, 2000);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
