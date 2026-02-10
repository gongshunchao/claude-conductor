#!/usr/bin/env node
// Stop hook - Remind about in-progress work

const fs = require('fs').promises;
const path = require('path');

async function main() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const input = chunks.join('');

  const data = JSON.parse(input);
  const cwd = data.cwd || process.cwd();
  const tracksFile = path.join(cwd, 'conductor', 'tracks.md');

  // Try to read tracks file (TOCTOU fix)
  const content = await fs.readFile(tracksFile, 'utf8').catch(() => null);
  if (!content) {
    // No conductor project, approve stop silently
    console.log(JSON.stringify({ decision: 'approve' }));
    process.exit(0);
  }

  const inProgress = (content.match(/\[in-progress\]/g) || []).length;

  if (inProgress > 0) {
    // Approve stop but remind about in-progress tracks
    console.log(JSON.stringify({
      decision: 'approve',
      systemMessage: `Conductor: ${inProgress} track(s) still in progress. Run /conductor:status to see details.`
    }));
  } else {
    console.log(JSON.stringify({ decision: 'approve' }));
  }
}

main().catch(() => {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
});
