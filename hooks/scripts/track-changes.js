#!/usr/bin/env node
// PostToolUse hook - Track plan.md modifications per track

const fs = require('fs').promises;
const path = require('path');

async function main() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const input = chunks.join('');

  const data = JSON.parse(input);
  const filePath = data.tool_input?.file_path || '';
  const cwd = data.cwd || process.cwd();

  // Only track conductor plan.md changes
  if (filePath.includes('conductor') && filePath.includes('plan.md')) {
    // Extract track directory from path (e.g. conductor/tracks/auth-feature/plan.md)
    const match = filePath.match(/conductor\/tracks\/([^/]+)\//);
    if (match) {
      const trackDir = path.join(cwd, 'conductor', 'tracks', match[1]);
      const logFile = path.join(trackDir, '.session_log');
      const timestamp = new Date().toISOString();
      await fs.appendFile(logFile, `${timestamp}: Modified plan.md\n`);
    }
  }
}

main().catch(() => process.exit(0));
