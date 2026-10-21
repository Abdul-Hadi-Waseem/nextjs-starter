#!/usr/bin/env node
// Stop hook: run the TypeScript check before Claude finishes. Type errors exit 2,
// which sends them back to Claude to fix. Runs once per stop to avoid loops.

import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const input = JSON.parse(await new Response(process.stdin).text());
if (input.stop_hook_active) process.exit(0);

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const tsc = spawnSync(join(root, 'node_modules', '.bin', 'tsc'), ['--noEmit'], {
  cwd: root,
  encoding: 'utf8'
});

if (tsc.status !== 0) {
  process.stderr.write(`Typecheck failed. Fix these before finishing:\n${tsc.stdout}${tsc.stderr}`);
  process.exit(2);
}
