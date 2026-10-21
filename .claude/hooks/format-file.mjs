#!/usr/bin/env node
// PostToolUse hook (Edit/Write): format the edited file with oxfmt, then lint it
// with oxlint. Lint errors exit 2 so Claude sees them and fixes them right away.

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const FORMATTABLE = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.css']);
const LINTABLE = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);

const input = JSON.parse(await new Response(process.stdin).text());
const file = input.tool_input?.file_path;
const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();

if (!file || !existsSync(file) || relative(root, file).startsWith('..')) process.exit(0);
if (relative(root, file).split('/').includes('node_modules')) process.exit(0);

const ext = extname(file);
const bin = (name) => join(root, 'node_modules', '.bin', name);

if (FORMATTABLE.has(ext)) {
  spawnSync(bin('oxfmt'), ['--write', file], { cwd: root, stdio: 'ignore' });
}

if (LINTABLE.has(ext)) {
  const lint = spawnSync(bin('oxlint'), [file], { cwd: root, encoding: 'utf8' });
  if (lint.status !== 0) {
    process.stderr.write(
      `oxlint found errors in ${relative(root, file)}:\n${lint.stdout}${lint.stderr}`
    );
    process.exit(2);
  }
}
