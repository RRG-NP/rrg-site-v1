#!/usr/bin/env node
/**
 * Validate RRG Tech blog content (MDX) against the repo's conventions.
 *
 *   npm run validate-blog                 # validate every post in content/blogs
 *   npm run validate-blog -- <slug>       # validate a single post
 *   npm run validate-blog -- --no-legacy  # audit mode: hold old posts to today's rules
 *
 * Dependency-free (Node built-ins only). Mirrors the rules in
 * docs/blog-writing-guide.md and the schema in contentlayer.config.ts.
 *
 * ERRORS (exit code 1) are things that break the build, the render, or links:
 *   - missing/invalid required frontmatter (title, description, date)
 *   - wrong types (published/featured not boolean, tags not a list)
 *   - an H1 ("#") in the body (the title is the only H1)
 *   - unbalanced code fences
 *   - an unknown capitalized MDX component
 *   - a broken internal /blog/<slug> link
 *   - any AI-writing tell from scripts/lib/ai-writing-rules.mjs (guide §4)
 *
 * WARNINGS (non-fatal) are quality/SEO nudges:
 *   - title/description length, tag count, missing category
 *   - missing FAQ section, missing /book CTA
 *   - H4+ headings or skipped heading levels (not in the TOC)
 *   - low word count, unresolved TODO scaffolding
 *
 * Posts listed in scripts/blog-legacy-baseline.json predate the §4 rules; their
 * AI-writing findings are downgraded to warnings so the gate only binds new work.
 * Remove a slug from that file once the post has been rewritten.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { checkAiWriting } from './lib/ai-writing-rules.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, '..');
const BLOG_DIR = path.join(REPO_ROOT, 'content', 'blogs');
const LEGACY_BASELINE = path.join(__dirname, 'blog-legacy-baseline.json');

const REQUIRED_FIELDS = ['title', 'description', 'date'];
const ALLOWED_COMPONENTS = new Set(['Callout', 'Note', 'Info', 'Tip', 'Warning', 'BlogImage']);
const ALLOWED_CATEGORIES = new Set(['Engineering', 'Design', 'Announcements']);
const KNOWN_BOOLEANS = ['published', 'featured'];

// Every prose/style rule lives in scripts/lib/ai-writing-rules.mjs - the single
// source of truth. Do not add phrase lists here.

function loadLegacyBaseline() {
  try {
    const parsed = JSON.parse(fs.readFileSync(LEGACY_BASELINE, 'utf8'));
    return new Set(parsed.slugs || []);
  } catch {
    return new Set();
  }
}

// ── Tiny frontmatter parser (handles inline scalars, lists, and >|- block scalars) ──
function parseFrontmatter(raw) {
  if (!raw.startsWith('---')) return { data: {}, body: raw, ok: false };
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return { data: {}, body: raw, ok: false };

  const fmBlock = raw.slice(3, end).replace(/^\n/, '');
  const body = raw.slice(end + 4).replace(/^\r?\n/, '');

  const data = {};
  const lines = fmBlock.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const m = /^([A-Za-z0-9_]+):\s?(.*)$/.exec(line);
    if (!m) {
      i++;
      continue;
    }
    const key = m[1];
    let rest = m[2];

    if (/^[>|][-+]?\s*$/.test(rest)) {
      // Block scalar: collect more-indented following lines.
      const collected = [];
      i++;
      while (i < lines.length && (lines[i].trim() === '' || /^\s+/.test(lines[i]))) {
        collected.push(lines[i].trim());
        i++;
      }
      data[key] = collected.join(' ').trim();
      continue;
    }

    if (rest === '') {
      // Possibly a list on subsequent "- item" lines.
      const list = [];
      let j = i + 1;
      while (j < lines.length && /^\s*-\s+/.test(lines[j])) {
        list.push(
          lines[j]
            .replace(/^\s*-\s+/, '')
            .trim()
            .replace(/^['"]|['"]$/g, ''),
        );
        j++;
      }
      if (list.length) {
        data[key] = list;
        i = j;
        continue;
      }
      data[key] = '';
      i++;
      continue;
    }

    // Inline flow-style list: tags: [a, b, c]
    const flow = /^\[(.*)\]$/.exec(rest.trim());
    if (flow) {
      data[key] = flow[1]
        .split(',')
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean);
      i++;
      continue;
    }

    data[key] = rest.trim().replace(/^['"]|['"]$/g, '');
    i++;
  }

  return { data, body, ok: true };
}

/** Remove fenced code blocks and inline code so we don't scan code as content. */
function stripCode(body) {
  const noFences = body.replace(/```[\s\S]*?```/g, '\n').replace(/~~~[\s\S]*?~~~/g, '\n');
  return noFences.replace(/`[^`\n]*`/g, ' ');
}

function countFences(body) {
  const matches = body.match(/^\s*(```|~~~)/gm);
  return matches ? matches.length : 0;
}

function wordCount(body) {
  const text = stripCode(body)
    .replace(/<[^>]+>/g, ' ') // drop component/HTML tags
    .replace(/[#>*_~`\-|]/g, ' ');
  const words = text.split(/\s+/).filter(Boolean);
  return words.length;
}

// ── Validate one file. Returns { errors: [], warnings: [] } ───────────────────
function validateFile(filePath, knownSlugs, legacySlugs = new Set()) {
  const errors = [];
  const warnings = [];
  const slug = path.basename(filePath, '.mdx');
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, body, ok } = parseFrontmatter(raw);

  // Filename / slug shape
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    errors.push(`Filename "${slug}.mdx" is not lowercase kebab-case (it is the public URL).`);
  }

  if (!ok) {
    errors.push('Missing or malformed YAML frontmatter (must open and close with "---").');
    return { slug, errors, warnings };
  }

  // 1. Frontmatter completeness / required metadata
  for (const field of REQUIRED_FIELDS) {
    const v = data[field];
    if (v === undefined || v === '' || (Array.isArray(v) && v.length === 0)) {
      errors.push(`Missing required frontmatter field: "${field}".`);
    }
  }

  // Types
  for (const b of KNOWN_BOOLEANS) {
    if (data[b] !== undefined && !['true', 'false'].includes(String(data[b]))) {
      errors.push(`Frontmatter "${b}" must be true or false (got "${data[b]}").`);
    }
  }
  if (data.tags !== undefined && !Array.isArray(data.tags)) {
    errors.push('Frontmatter "tags" must be a YAML list.');
  }
  if (data.date && !/^\d{4}-\d{2}-\d{2}/.test(String(data.date))) {
    errors.push(`Frontmatter "date" must be YYYY-MM-DD (got "${data.date}").`);
  } else if (data.date && Number.isNaN(new Date(data.date).getTime())) {
    errors.push(`Frontmatter "date" is not a valid date ("${data.date}").`);
  }

  // 2. SEO requirements (warnings)
  if (typeof data.title === 'string' && data.title.length > 60) {
    warnings.push(`title is ${data.title.length} chars (recommended ≤ 60).`);
  }
  if (typeof data.description === 'string') {
    const len = data.description.length;
    if (data.description.startsWith('TODO')) {
      warnings.push('description is still the TODO placeholder - draft not yet written.');
    } else if (len < 120 || len > 160) {
      warnings.push(`description is ${len} chars (recommended 120–160).`);
    }
  }
  const tags = Array.isArray(data.tags) ? data.tags : [];
  if (tags.some((t) => /^TODO/.test(t))) {
    warnings.push('tags still contain TODO placeholders - draft not yet written.');
  } else if (tags.length < 3) {
    warnings.push(`only ${tags.length} tag(s) (recommended 3–6).`);
  } else if (tags.length > 6) {
    warnings.push(`${tags.length} tags (recommended 3–6).`);
  }
  if (!data.category) {
    warnings.push('no category set (recommended; becomes articleSection).');
  } else if (!ALLOWED_CATEGORIES.has(data.category)) {
    warnings.push(`category "${data.category}" is outside the usual set (${[...ALLOWED_CATEGORIES].join(', ')}).`);
  }

  // 3. Heading hierarchy (scan body outside code fences)
  let inFence = false;
  let prevLevel = 1; // title is the implicit H1
  let sawH1 = false;
  let sawHeading = false;
  for (const line of body.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const h = /^(#{1,6})\s+\S/.exec(line);
    if (!h) continue;
    sawHeading = true;
    const level = h[1].length;
    if (level === 1) sawH1 = true;
    if (level >= 4) {
      warnings.push(`heading "${line.trim().slice(0, 50)}" is H${level}; only H2/H3 appear in the TOC.`);
    }
    if (level > prevLevel + 1) {
      warnings.push(`heading level jumps from H${prevLevel} to H${level} ("${line.trim().slice(0, 40)}").`);
    }
    prevLevel = level;
  }
  if (sawH1) {
    errors.push('Body contains an H1 ("# ..."). The title frontmatter is the only H1 - start at "##".');
  }
  if (!sawHeading) {
    warnings.push('no H2 sections found in the body.');
  }

  // 4. MDX syntax: balanced fences + only-known components
  if (countFences(body) % 2 !== 0) {
    errors.push('Unbalanced code fences (``` count is odd).');
  }
  const codeless = stripCode(body);
  const tagRe = /<\s*([A-Za-z][A-Za-z0-9]*)/g;
  let tm;
  const unknown = new Set();
  while ((tm = tagRe.exec(codeless)) !== null) {
    const name = tm[1];
    if (/^[A-Z]/.test(name) && !ALLOWED_COMPONENTS.has(name)) {
      unknown.add(name);
    }
  }
  for (const name of unknown) {
    errors.push(`Unknown MDX component <${name}>. Allowed: ${[...ALLOWED_COMPONENTS].join(', ')}.`);
  }

  // 5. Broken internal links
  const linkRe = /\]\((\/blog\/[^)\s]+)\)/g;
  let lm;
  while ((lm = linkRe.exec(body)) !== null) {
    const target = lm[1].split('#')[0].split('?')[0].replace(/\/$/, '');
    const linkedSlug = target.replace(/^\/blog\//, '');
    if (!linkedSlug) continue; // /blog index
    if (!knownSlugs.has(linkedSlug)) {
      errors.push(`Broken internal link: "${lm[1]}" → no content/blogs/${linkedSlug}.mdx.`);
    }
  }

  // 6. Reading quality (warnings)
  const words = wordCount(body);
  const isDraftScaffold = typeof data.description === 'string' && data.description.startsWith('TODO');
  if (!isDraftScaffold && words < 400) {
    warnings.push(`body is ~${words} words; aim for 500–1000 (a 2–5 minute read).`);
  } else if (words > 1300) {
    warnings.push(`body is ~${words} words; trim toward 500–1000 (a 2–5 minute read).`);
  }
  if (!/\]\(\/book\)/.test(body)) {
    warnings.push('no closing /book CTA found (house style links to /book).');
  }

  // 6b. AI-writing rules (guide §4). Errors unless the post predates the rules.
  const ai = checkAiWriting({
    body,
    title: typeof data.title === 'string' ? data.title : '',
    description: typeof data.description === 'string' ? data.description : '',
    words,
  });
  if (legacySlugs.has(slug)) {
    for (const e of ai.errors) warnings.push(`${e} [legacy post - not blocking]`);
  } else {
    errors.push(...ai.errors);
  }
  warnings.push(...ai.warnings);

  // 7. FAQ
  const faqIdx = body.search(/^##\s+Frequently Asked Questions\s*$/m);
  if (faqIdx === -1) {
    warnings.push('no "## Frequently Asked Questions" section (recommended for substantive posts).');
  } else {
    const faqBody = body.slice(faqIdx);
    const questions = faqBody.match(/^###\s+.+$/gm) || [];
    if (questions.length === 0) {
      warnings.push('FAQ section has no "###" question headings.');
    }
  }

  return { slug, errors, warnings };
}

// ── Main ──────────────────────────────────────────────────────────────────────
function main() {
  if (!fs.existsSync(BLOG_DIR)) {
    console.error(`Blog directory not found at ${BLOG_DIR}. Run from the repo root.`);
    process.exit(1);
  }

  const allFiles = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));
  const knownSlugs = new Set(allFiles.map((f) => path.basename(f, '.mdx')));

  const argv = process.argv.slice(2);
  const noLegacy = argv.includes('--no-legacy');
  const legacySlugs = noLegacy ? new Set() : loadLegacyBaseline();

  const arg = argv.find((a) => !a.startsWith('--'));
  let targets = allFiles;
  if (arg) {
    const wanted = arg.replace(/\.mdx$/, '');
    if (!knownSlugs.has(wanted)) {
      console.error(`No such post: content/blogs/${wanted}.mdx`);
      process.exit(1);
    }
    targets = [`${wanted}.mdx`];
  }

  if (targets.length === 0) {
    console.log('No .mdx posts found in content/blogs.');
    return;
  }

  let totalErrors = 0;
  let totalWarnings = 0;

  for (const file of targets) {
    const { slug, errors, warnings } = validateFile(path.join(BLOG_DIR, file), knownSlugs, legacySlugs);
    totalErrors += errors.length;
    totalWarnings += warnings.length;

    const status = errors.length ? 'FAIL' : warnings.length ? 'warn' : 'ok';
    console.log(`\n[${status}] ${slug}.mdx`);
    for (const e of errors) console.log(`   error:   ${e}`);
    for (const w of warnings) console.log(`   warning: ${w}`);
    if (!errors.length && !warnings.length) console.log('   no issues.');
  }

  console.log(`\n- ${targets.length} post(s) checked · ${totalErrors} error(s) · ${totalWarnings} warning(s) -`);

  if (totalErrors > 0) process.exit(1);
}

main();
