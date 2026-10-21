#!/usr/bin/env node
/* eslint-disable no-console -- CLI script: prints the violations */
// Image policy. Run: `bun run images:check`.
// - Images live only in public/. Anywhere else in the app is an error.
// - Use WebP or AVIF for raster images, SVG for icons and logos.
// - PNG/JPG/GIF are blocked except in public/og/ (social preview images,
//   which some platforms still require as PNG/JPG).
// - Every image must be under MAX_KB.

import { readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const ROOT = process.cwd();
const PUBLIC_DIR = 'public';
// Tooling and build output, not app code.
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', '.claude', '.agents']);
const BLOCKED = new Set(['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tif', '.tiff']);
const IMAGE = new Set([...BLOCKED, '.webp', '.avif', '.svg', '.ico']);
const ALLOW_LEGACY_IN = ['public/og/'];
const MAX_KB = 300;

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) return [];
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const problems = [];
for (const file of walk(ROOT)) {
  const ext = extname(file).toLowerCase();
  if (!IMAGE.has(ext)) continue;

  const path = relative(ROOT, file);
  if (!path.startsWith(`${PUBLIC_DIR}/`)) {
    problems.push(`${path}: images must live in public/ (e.g. public/images/). Move it there.`);
    continue;
  }

  if (BLOCKED.has(ext) && !ALLOW_LEGACY_IN.some((prefix) => path.startsWith(prefix))) {
    problems.push(`${path}: ${ext} is not allowed. Convert to .webp or .avif (or .svg for icons).`);
  }

  const kb = statSync(file).size / 1024;
  if (kb > MAX_KB) {
    problems.push(
      `${path}: ${kb.toFixed(0)} KB is over the ${MAX_KB} KB limit. Resize or compress it.`
    );
  }
}

if (problems.length > 0) {
  console.error(`Image policy failed:\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log('Image policy passed.');
