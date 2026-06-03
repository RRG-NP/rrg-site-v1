#!/usr/bin/env node
/**
 * Pick (or retire) topics from the curated backlog in prompts/blog-topics.md.
 * Used by the daily blog routine; also handy by hand.
 *
 *   node scripts/next-blog-topic.mjs              # print the next unchecked topic
 *   node scripts/next-blog-topic.mjs --done "<topic>"  # mark a topic written ([x])
 *   node scripts/next-blog-topic.mjs --list       # list remaining topics
 *   node scripts/next-blog-topic.mjs --count      # how many remain
 *
 * Exit codes: 0 ok · 2 backlog empty · 1 usage/IO error.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOPICS_FILE = path.join(__dirname, '..', 'prompts', 'blog-topics.md');

const OPEN_RE = /^- \[ \]\s+(.+?)\s*$/;
const DONE_RE = /^- \[[xX]\]\s+(.+?)\s*$/;

function read() {
  if (!fs.existsSync(TOPICS_FILE)) {
    console.error(`Topic backlog not found at ${TOPICS_FILE}`);
    process.exit(1);
  }
  return fs.readFileSync(TOPICS_FILE, 'utf8');
}

function openTopics(content) {
  return content
    .split('\n')
    .map((l) => OPEN_RE.exec(l))
    .filter(Boolean)
    .map((m) => m[1]);
}

const args = process.argv.slice(2);
const content = read();

if (args[0] === '--list') {
  const open = openTopics(content);
  console.log(open.length ? open.map((t) => `- ${t}`).join('\n') : '(backlog empty)');
  process.exit(open.length ? 0 : 2);
}

if (args[0] === '--count') {
  console.log(String(openTopics(content).length));
  process.exit(0);
}

if (args[0] === '--done') {
  const target = args.slice(1).join(' ').trim();
  if (!target) {
    console.error('Usage: --done "<exact topic text>"');
    process.exit(1);
  }
  const lines = content.split('\n');
  let changed = false;
  const out = lines.map((line) => {
    const m = OPEN_RE.exec(line);
    if (!changed && m && m[1] === target) {
      changed = true;
      return line.replace('- [ ]', '- [x]');
    }
    return line;
  });
  if (!changed) {
    // Idempotent: if it's already done, that's fine; otherwise it's a mismatch.
    const already = lines.some((l) => {
      const d = DONE_RE.exec(l);
      return d && d[1] === target;
    });
    if (already) {
      console.log(`Already marked done: ${target}`);
      process.exit(0);
    }
    console.error(`Topic not found in backlog (exact match required): ${target}`);
    process.exit(1);
  }
  fs.writeFileSync(TOPICS_FILE, out.join('\n'), 'utf8');
  console.log(`Marked done: ${target}`);
  process.exit(0);
}

// Default: print the next available topic.
const open = openTopics(content);
if (open.length === 0) {
  console.error('Backlog empty — add topics to prompts/blog-topics.md.');
  process.exit(2);
}
console.log(open[0]);
