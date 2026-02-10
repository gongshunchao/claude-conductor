#!/usr/bin/env node
// PreToolUse hook - Warn when modifying core config files

const path = require('path');

async function main() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const input = chunks.join('');

  const data = JSON.parse(input);
  const filePath = data.tool_input?.file_path || '';

  // Check if modifying core conductor config
  const configPattern = /conductor\/(product|tech-stack|workflow|product-guidelines)\.md$/;
  if (configPattern.test(filePath)) {
    const configName = path.basename(filePath);
    console.log(JSON.stringify({
      hookSpecificOutput: {
        permissionDecision: 'ask'
      },
      systemMessage: `⚠️ Modifying core conductor config: ${configName}. This file affects the entire project. Proceed with caution.`
    }));
  }
}

main().catch(() => process.exit(0));
