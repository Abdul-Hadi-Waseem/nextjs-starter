#!/usr/bin/env node
// Stop hook: if code changed (src/, next.config.ts, package.json) and that exact
// diff hasn't been reviewed, ask Claude once to run the frontend-reviewer agent.
// Never loops: skips when stop_hook_active, and reminds at most once per diff.
//
// `node .claude/hooks/review-on-stop.mjs --mark` records the current diff as
// reviewed. The frontend-reviewer agent runs it when its verdict is "ready".
// State lives in the git dir (.git/frontend-review.json), never in the tree.

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { isAbsolute, join } from 'node:path';

const PATHS = ['src', 'next.config.ts', 'package.json'];
const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();

function git(args) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  return result.status === 0 ? result.stdout : null;
}

function fingerprint() {
  const hasHead = git(['rev-parse', '--verify', '-q', 'HEAD']) !== null;
  const diff = git(['diff', ...(hasHead ? ['HEAD'] : []), '--', ...PATHS]) ?? '';
  const untracked = (git(['ls-files', '--others', '--exclude-standard', '--', ...PATHS]) ?? '')
    .split('\n')
    .filter(Boolean);
  if (!diff && untracked.length === 0) return null;
  const hash = createHash('sha256').update(diff);
  for (const file of untracked) {
    hash.update(file);
    const path = join(root, file);
    if (existsSync(path)) hash.update(readFileSync(path));
  }
  return hash.digest('hex');
}

const gitPath = git(['rev-parse', '--git-path', 'frontend-review.json'])?.trim();
if (!gitPath) process.exit(0);
const stateFile = isAbsolute(gitPath) ? gitPath : join(root, gitPath);

function readState() {
  try {
    return JSON.parse(readFileSync(stateFile, 'utf8'));
  } catch {
    return {};
  }
}

const writeState = (state) => writeFileSync(stateFile, JSON.stringify(state));

if (process.argv.includes('--mark')) {
  writeState({ ...readState(), reviewed: fingerprint() });
  process.exit(0);
}

const input = JSON.parse((await new Response(process.stdin).text()) || '{}');
if (input.stop_hook_active) process.exit(0);

const current = fingerprint();
if (!current) process.exit(0);

const state = readState();
if (state.reviewed === current || state.reminded === current) process.exit(0);

writeState({ ...state, reminded: current });
process.stdout.write(
  JSON.stringify({
    decision: 'block',
    reason:
      'Code under src/, next.config.ts or package.json changed and this diff has not been reviewed. ' +
      'Run the frontend-reviewer agent (or /review) now, fix every Must-fix item, then finish. ' +
      'If this was a docs-only or trivial change the user asked you not to review, say so and stop.'
  })
);
