#!/usr/bin/env node
/* eslint-disable no-console -- CLI script: prints the budget table */
// Bundle budget: gzipped first-load JS per route, checked against bundle-budget.json.
// Run after `next build`: `bun run bundle:check`. Exits 1 when a route is over budget.
//
// Next 16 no longer prints sizes in `next build`, so this reads the build output:
// each route's client-reference manifest lists the JS chunks of every segment it
// renders (layouts, page, parallel slots), and build-manifest.json lists the
// runtime chunks every page loads.

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import vm from 'node:vm';

const ROOT = process.cwd();
const NEXT_DIR = join(ROOT, '.next');
const APP_DIR = join(NEXT_DIR, 'server', 'app');
const BUDGET_FILE = join(ROOT, 'bundle-budget.json');
const MANIFEST_NAME = 'page_client-reference-manifest.js';
// Loaded only when something goes wrong, not on first load.
const EXCLUDED_ENTRIES = ['/not-found', '/global-error'];

if (!existsSync(APP_DIR)) {
  console.error('No build found. Run `bun run build` first.');
  process.exit(1);
}

function findManifests(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return findManifests(path);
    return entry.name === MANIFEST_NAME ? [path] : [];
  });
}

function readManifest(file) {
  const sandbox = { globalThis: {} };
  sandbox.globalThis = sandbox;
  vm.runInNewContext(readFileSync(file, 'utf8'), sandbox);
  return Object.entries(sandbox.__RSC_MANIFEST)[0];
}

const gzipCache = new Map();
function gzipSize(chunk) {
  if (!gzipCache.has(chunk)) {
    gzipCache.set(chunk, gzipSync(readFileSync(join(NEXT_DIR, chunk))).length);
  }
  return gzipCache.get(chunk);
}

// `/dashboard/(group)/x/page` → `/dashboard/x`; a parallel-route slot
// (`/dashboard/overview/@sales/page`) belongs to its parent route.
function toRoute(manifestKey) {
  const route = manifestKey
    .replace(/\/page$/, '')
    .replace(/\/@[^/]+.*$/, '')
    .replace(/\/\([^/]+\)/g, '');
  return route === '' ? '/' : route;
}

const buildManifest = JSON.parse(readFileSync(join(NEXT_DIR, 'build-manifest.json'), 'utf8'));
const rootChunks = buildManifest.rootMainFiles ?? [];
const budget = existsSync(BUDGET_FILE) ? JSON.parse(readFileSync(BUDGET_FILE, 'utf8')) : {};

const rows = new Map();
for (const file of findManifests(APP_DIR)) {
  const [key, manifest] = readManifest(file);
  if (key.startsWith('/_')) continue;

  const chunks = new Set(rootChunks);
  for (const [entry, files] of Object.entries(manifest.entryJSFiles ?? {})) {
    if (EXCLUDED_ENTRIES.some((excluded) => entry.endsWith(excluded))) continue;
    files.forEach((chunk) => chunks.add(chunk));
  }

  const route = toRoute(key);
  const kb = [...chunks].reduce((sum, chunk) => sum + gzipSize(chunk), 0) / 1024;
  // Every slot of a parallel route lists all slots; keep the largest reading.
  if ((rows.get(route)?.kb ?? 0) >= kb) continue;
  rows.set(route, { route, kb, limit: budget.routes?.[route] ?? budget.default });
}

const sorted = [...rows.values()].sort((a, b) => b.kb - a.kb);

const pad = Math.max(...sorted.map((row) => row.route.length));
console.log(`${'Route'.padEnd(pad)}  First-load JS (gzip)  Budget`);
let failed = 0;
for (const { route, kb, limit } of sorted) {
  const over = limit !== undefined && kb > limit;
  if (over) failed++;
  const budgetText = limit === undefined ? '-' : `${limit} KB${over ? '  OVER' : ''}`;
  console.log(`${route.padEnd(pad)}  ${`${kb.toFixed(1)} KB`.padStart(20)}  ${budgetText}`);
}

if (failed > 0) {
  console.error(
    `\n${failed} route(s) over budget. Trim the bundle or raise the limit in bundle-budget.json.`
  );
  process.exit(1);
}
