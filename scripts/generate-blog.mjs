#!/usr/bin/env node
/**
 * Scaffold a new blog post for the RRG Tech blog.
 *
 *   npm run generate-blog -- "<topic or title>"            # draft (published: false)
 *   npm run generate-blog -- --publish "<topic or title>"  # publish-ready (published: true)
 *
 * What it does:
 *   1. Analyzes the topic into a title + kebab-case slug.
 *   2. Refuses to overwrite an existing post (the filename is the public URL).
 *   3. Writes content/blogs/<slug>.mdx with valid frontmatter (published: false,
 *      today's date) and an outline placeholder.
 *   4. Prints next steps.
 *
 * It does NOT write the article prose - that is the agent's job, following
 * prompts/blog-generator.md and docs/blog-writing-guide.md. It NEVER sets
 * `published: true` and never commits or deploys. Drafts are excluded from the
 * listing, sitemap, RSS, and static generation until you publish them.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, '..');
const BLOG_DIR = path.join(REPO_ROOT, 'content', 'blogs');

const ALLOWED_CATEGORIES = ['Engineering', 'Design', 'Announcements'];

/** Turn an arbitrary string into a lowercase, ASCII, kebab-case slug. */
function slugify(input) {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip combining diacritics (accents)
    .toLowerCase()
    .replace(/['"]/g, '') // drop quotes/apostrophes outright
    .replace(/[^a-z0-9]+/g, '-') // everything else → hyphen
    .replace(/^-+|-+$/g, '') // trim leading/trailing hyphens
    .replace(/-{2,}/g, '-'); // collapse repeats
}

/** Title-case a raw topic into a reasonable headline (the agent can refine it). */
function toTitle(input) {
  const small = new Set(['a', 'an', 'and', 'the', 'to', 'of', 'in', 'on', 'for', 'with', 'from']);
  const words = input.trim().replace(/\s+/g, ' ').split(' ');
  return words
    .map((w, i) => {
      const lower = w.toLowerCase();
      if (i !== 0 && small.has(lower)) return lower;
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(' ');
}

/** Today's date as YYYY-MM-DD in local time. */
function today() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function fail(msg) {
  console.error(`\nError: ${msg}\n`);
  process.exit(1);
}

// ── Parse args ───────────────────────────────────────────────────────────────
const rawArgs = process.argv.slice(2);
const publish = rawArgs.includes('--publish');
const topic = rawArgs
  .filter((a) => !a.startsWith('--'))
  .join(' ')
  .trim();
if (!topic) {
  fail('Usage: npm run generate-blog -- [--publish] "<topic or title>"');
}

const title = toTitle(topic);
const slug = slugify(topic);
if (!slug) {
  fail(`Could not derive a slug from "${topic}". Try a more descriptive topic.`);
}

const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
if (fs.existsSync(filePath)) {
  fail(
    `content/blogs/${slug}.mdx already exists. The filename is the public URL - ` +
      `pick a different topic or edit the existing draft.`,
  );
}

// ── Build the draft ──────────────────────────────────────────────────────────
const frontmatter = `---
title: ${title}
description: TODO - one benefit-led sentence, 120-160 characters, used as the meta description.
date: ${today()}
published: ${publish ? 'true' : 'false'}
featured: false
category: ${ALLOWED_CATEGORIES[0]}
tags:
  - TODO-tag-1
  - TODO-tag-2
  - TODO-tag-3
author: Rohan Gautam
---`;

const body = `

{/*
  SCAFFOLD - fill this in by following prompts/blog-generator.md and
  docs/blog-writing-guide.md, then run:  npm run validate-blog -- ${slug}

  Reminders:
  - Body starts at "##" (the title above is the H1). Use only "##" and "###", sentence case.
  - Voice: first-person singular - a 27-year-old Nepali software engineer with 6+ years'
    experience sharing lessons from real work. Practical, honest, friendly.
  - READ docs/blog-writing-guide.md §4 BEFORE WRITING. It is the anti-AI-writing rule set
    (no em dashes, no "not just X, it's Y", no AI vocabulary, sparing bold) and every rule
    is a build error, not a warning. Source of truth: scripts/lib/ai-writing-rules.mjs.
  - Length: ~500-1000 words (a 2-5 minute read), one core idea, no filler.
  - Allowed components: <Note> <Info> <Tip> <Warning> <BlogImage src alt>.
  - Links and code blocks are plain markdown; tag every code fence with a language.
  - Replace the TODO description/tags/category in the frontmatter above.
  - published is set to ${publish ? 'true (publish-ready - review before merging)' : 'false (draft - flip to true to publish)'}.
*/}

Intro hook - replace with one or two sentences stating the core idea. No "in this article".

## First section

Replace with real content.

## Second section

Replace with real content.

## Frequently Asked Questions

### A real question readers would ask?

A self-contained answer in 1-3 sentences.

### Another question?

A self-contained answer in 1-3 sentences.

Closing wrap-up paragraph.

If you're building something ambitious and want a partner who sweats these details,
[get in touch](/book).
`;

if (!fs.existsSync(BLOG_DIR)) {
  fail(`Blog directory not found at ${BLOG_DIR}. Run this from the repo root.`);
}

fs.writeFileSync(filePath, frontmatter + body, 'utf8');

// ── Report ───────────────────────────────────────────────────────────────────
console.log(`
✓ Created: content/blogs/${slug}.mdx
  Title:    ${title}
  Slug/URL: /blog/${slug}
  Status:   published: ${publish ? 'true   (publish-ready - review before merging)' : 'false  (draft - not listed, not in sitemap, not deployed)'}

Next steps:
  1. Have an agent fill the body using prompts/blog-generator.md
     (or write it by hand following docs/blog-writing-guide.md).
  2. Replace the TODO description, tags, and category in the frontmatter.
  3. Validate:   npm run validate-blog -- ${slug}
  4. Preview:    npm run dev   (http://localhost:3400/blog/${slug})${
    publish
      ? '\n  5. Review, then commit on a branch and open a PR (merge publishes it).'
      : '\n  5. Publish only after review by setting published: true and committing.'
  }
`);
