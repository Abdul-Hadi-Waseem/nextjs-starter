#!/usr/bin/env node
/* eslint-disable no-console -- CLI script: prints the violations */
// Image policy: only small, modern formats in the repo. Run: `bun run images:check`.
// - Use WebP or AVIF for raster images, SVG for icons and logos.
// - PNG/JPG/GIF are blocked everywhere except public/og/ (social preview images,
//   which some platforms still require as PNG/JPG).
// - Every image must be under MAX_KB.

import { readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const ROOT = process.cwd();
const SCAN_DIRS = ['public', 'src'];
const BLOCKED = new Set(['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tif', '.tiff']);
const IMAGE = new Set([...BLOCKED, '.webp', '.avif', '.svg', '.ico']);
const ALLOW_LEGACY_IN = ['public/og/'];
const MAX_KB = 300;

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const problems = [];
for (const dir of SCAN_DIRS) {
  for (const file of walk(join(ROOT, dir))) {
    const ext = extname(file).toLowerCase();
    if (!IMAGE.has(ext)) continue;

    const path = relative(ROOT, file);
    const kb = statSync(file).size / 1024;

    if (BLOCKED.has(ext) && !ALLOW_LEGACY_IN.some((prefix) => path.startsWith(prefix))) {
      problems.push(
        `${path}: ${ext} is not allowed. Convert to .webp or .avif (or .svg for icons).`
      );
    }
    if (kb > MAX_KB) {
      problems.push(
        `${path}: ${kb.toFixed(0)} KB is over the ${MAX_KB} KB limit. Resize or compress it.`
      );
    }
  }
}

if (problems.length > 0) {
  console.error(`Image policy failed:\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log('Image policy passed.');
