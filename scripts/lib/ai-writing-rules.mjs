/**
 * The single source of truth for RRG Tech's anti-AI-writing rules.
 *
 * Derived from Wikipedia's "Signs of AI writing":
 *   https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing
 *
 * Every rule cites the sign it implements (WP #n) and the guide section that
 * explains it in prose (docs/blog-writing-guide.md §4.x). Do NOT restate these
 * rules anywhere else - the guide, the prompts and the scaffolder all point here.
 *
 * Three tiers, chosen so the gate stays usable day to day:
 *
 *   HARD_RULES     any single occurrence is an ERROR. Unambiguous tells only -
 *                  words and constructions a human writing this blog would not use.
 *   CAPPED_RULES   ordinary English that turns into a tell at machine frequency.
 *                  ERROR only above a per-post budget (some budgets scale with length).
 *   Advisory       statistical signals, reported as WARNINGS. Never block.
 *
 * Dependency-free (Node built-ins only).
 */

// ── Helpers for building patterns ────────────────────────────────────────────

/** Combine literal phrases into one word-boundary alternation. */
function anyPhrase(list) {
  const escaped = list.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(`\\b(?:${escaped.join('|')})\\b`, 'gi');
}

// ── HARD RULES: any occurrence is an error ───────────────────────────────────

/**
 * AI vocabulary. The first block is the repo's original banned list; the rest
 * comes from Wikipedia's three dated word lists (WP #1, #4, #8).
 *
 * Deliberately NOT included, because they are load-bearing in a dev blog and
 * would fire on honest prose: "key" (cache key, API key), "enhance", "ensure",
 * "crucial", "landscape", "align with" - those are capped instead, below.
 */
const AI_VOCABULARY = [
  // Original repo list (docs/blog-writing-guide.md §4, pre-Wikipedia).
  "in today's fast-paced world",
  'it is important to note',
  "it's worth mentioning",
  "it's worth noting",
  'game changer',
  'game-changer',
  'revolutionize',
  'revolutionizes',
  'revolutionizing',
  'unlock the power of',
  'comprehensive guide',
  'cutting-edge',
  'transformative',
  'ever-evolving landscape',
  'robust',
  'furthermore',
  'moreover',
  'in conclusion',
  // Wikipedia AI-vocabulary lists (WP #8).
  'delve',
  'delves',
  'delving',
  'tapestry',
  'testament to',
  'intricacies',
  'intricate',
  'interplay',
  'garner',
  'garnered',
  'garnering',
  'bolster',
  'bolsters',
  'bolstered',
  'pivotal',
  'meticulous',
  'meticulously',
  'vibrant',
  'myriad',
  // Promotional / advertisement register (WP #4).
  'boasts',
  'boasting',
  'nestled',
  'in the heart of',
  'groundbreaking',
  'diverse array',
  'renowned',
  'commitment to',
  'exemplifies',
  'showcasing',
  'showcases',
  'profound',
  // Undue significance (WP #1).
  'indelible mark',
  'deeply rooted',
  'evolving landscape',
  'key turning point',
  'setting the stage for',
  'marking a shift',
  'represents a shift',
  // Filler transitions and closers.
  'navigate the complexities',
  'at the end of the day',
  "let's dive in",
  'in summary',
  'to sum up',
  'valuable insights',
  'when it comes to',
];

export const HARD_RULES = [
  {
    id: 'ai-vocab',
    wp: '#1, #4, #8',
    guide: '§4.1',
    re: anyPhrase(AI_VOCABULARY),
    message: 'AI vocabulary - say the plain thing instead',
  },
  {
    id: 'ai-vocab-leverage',
    wp: '#8',
    guide: '§4.1',
    re: /\bleverag(?:e|es|ed|ing)\b/gi,
    message: 'AI vocabulary - use "use"',
  },
  {
    id: 'ai-vocab-seamless',
    wp: '#4',
    guide: '§4.1',
    re: /\bseamless(?:ly)?\b/gi,
    message: 'AI vocabulary - describe what actually happens',
  },
  {
    id: 'ai-vocab-underscore',
    wp: '#3',
    guide: '§4.1',
    re: /\bunderscor(?:es|ing|e)\s+(?:the|its|his|her|their|how|why|a|an)\b/gi,
    message: 'AI vocabulary - "underscores the importance of" says nothing',
  },
  {
    id: 'additionally',
    wp: '#8',
    guide: '§4.1',
    // Sentence-start only: "Additionally," as a connective. Mid-sentence is rare and fine.
    re: /(?:^|(?<=[.!?]\s))Additionally\b/gm,
    message: 'sentence-initial "Additionally" - join the thought to the one before it',
  },

  // ── Sentence constructions (WP #10, #11, #12) ──
  {
    id: 'neg-parallelism-not-just',
    wp: '#10',
    guide: '§4.2',
    re: /\bnot just\b[^.!?\n]{1,80}?[,;]\s*(?:it'?s|its|they'?re|but|but also)\b/gi,
    message: 'negative parallelism ("not just X, it\'s Y") - state the claim directly',
  },
  {
    id: 'neg-parallelism-not-only',
    wp: '#10',
    guide: '§4.2',
    re: /\bnot only\b[^.!?\n]{1,80}?\bbut\b/gi,
    message: 'negative parallelism ("not only X but Y") - state the claim directly',
  },
  {
    id: 'neg-parallelism-not-x-but-y',
    wp: '#11',
    guide: '§4.2',
    re: /\b(?:it'?s|this is|that'?s|it isn'?t|this isn'?t)\s+not\b[^.!?\n]{1,60}?,\s*(?:it'?s|this is|that'?s)\b/gi,
    message: 'negative parallelism ("it\'s not X, it\'s Y") - drop the thing it is not',
  },
  {
    id: 'neg-parallelism-rather',
    wp: '#11',
    guide: '§4.2',
    re: /\bis not\b[^.!?\n]{1,60}[.!?]\s+Rather,/gi,
    message: 'negative parallelism ("X is not Y. Rather, ...") - lead with what it is',
  },
  {
    id: 'neg-parallelism-less-more',
    wp: '#11',
    guide: '§4.2',
    re: /\bless about\b[^.!?\n]{1,60}\bmore about\b/gi,
    message: 'negative parallelism ("less about X, more about Y") - just say Y',
  },

  // ── Conclusion formula (WP #6) ──
  {
    id: 'challenges-formula',
    wp: '#6',
    guide: '§4.3',
    re: /\bdespite (?:its|these|the|this)\b[^.!?\n]{0,60}\bchallenges?\b/gi,
    message: '"Despite these challenges..." conclusion formula - end on something concrete',
  },
  {
    id: 'canned-heading',
    wp: '#6',
    guide: '§4.3',
    re: /^#{2,4}\s+(?:challenges and\b|future outlook\b|conclusion\s*$|final thoughts\s*$|key takeaways\s*$)/gim,
    message: 'canned section heading - name what the section actually says',
  },

  // ── Vague attribution (WP #5) ──
  {
    id: 'vague-attribution',
    wp: '#5',
    guide: '§4.5',
    re: /\b(?:experts?\s+(?:argue|say|agree|suggest|note)|industry reports?|observers have|some critics|critics argue|studies show|research shows|several (?:sources|publications)|it is (?:widely )?(?:believed|accepted|known))\b/gi,
    message: 'vague attribution - name the source and link it, or cut the claim',
    // Suppressed when the same line carries a real link (see checkAiWriting).
    skipIfLinked: true,
  },

  // ── Assistant voice leaking through (WP #24, #25) ──
  {
    id: 'llm-meta',
    wp: '#24, #25',
    guide: '§4.6',
    re: /\b(?:as of my (?:last|knowledge) (?:update|cutoff)|I'?d be happy to|let me know if you|feel free to (?:ask|reach out if)|I cannot access|as an AI|in this (?:article|post),?\s+we'?ll|by the end of this (?:article|post))\b/gi,
    message: 'assistant/meta voice - the post is not a chat reply',
  },

  // ── Typography (WP #18, #19, #21, #23) ──
  {
    id: 'typography-dash',
    wp: '#18',
    guide: '§4.4',
    re: /[—–]/g,
    message: 'em/en dash - house style is a plain hyphen "-", and vary the sentence shape too',
  },
  {
    id: 'typography-smart-quotes',
    wp: '#21',
    guide: '§4.4',
    re: /[‘’“”]/g,
    message: 'curly quote - use a straight \' or "',
  },
  {
    id: 'typography-ellipsis',
    wp: '#21',
    guide: '§4.4',
    re: /…/g,
    message: 'ellipsis character - use three dots "..."',
  },
  {
    id: 'emoji',
    wp: '#19',
    guide: '§4.4',
    re: /\p{Extended_Pictographic}/gu,
    message: 'emoji - not house style',
  },
  {
    id: 'thematic-break',
    wp: '#23',
    guide: '§4.4',
    re: /^\s*(?:---|\*\*\*|___)\s*\n(?:\s*\n)*#{2,}\s/gm,
    message: 'horizontal rule immediately before a heading - the heading is the separator',
  },
];

// ── CAPPED RULES: ordinary English, banned only at machine frequency ─────────

export const CAPPED_RULES = [
  {
    id: 'rule-of-three',
    wp: '#13',
    guide: '§4.2',
    // "A, B, and C" where each item is 1-3 words.
    re: /\b\w+(?:\s+\w+){0,2},\s+\w+(?:\s+\w+){0,2},\s+and\s+\w+(?:\s+\w+){0,2}\b/g,
    cap: 3,
    // Advisory on purpose: technical prose has honest triads ("download, parse,
    // and execute"). Only the tricolon habit is the tell, and no regex can tell
    // the two apart - so this nudges rather than blocks.
    severity: 'warning',
    message: 'rule-of-three triads ("X, Y, and Z") - check these are real lists, not rhetorical padding',
  },
  {
    id: 'participial-closer',
    wp: '#3',
    guide: '§4.2',
    re: /,\s+(?:ensuring|highlighting|reflecting|allowing|fostering|enhancing|emphasizing|symbolizing|cultivating|encompassing|contributing to|making it possible)\b/gi,
    cap: 2,
    message: 'participial closers (", ensuring/highlighting/...") - restates the fact without adding one',
  },
  {
    id: 'copulative-avoidance',
    wp: '#9',
    guide: '§4.2',
    re: /\b(?:serves as|stands as|functions as|operates as|represents a|marks a|refers to)\b/gi,
    cap: 1,
    message: 'dressed-up copulatives - "is" is a fine word',
  },
  {
    id: 'rather-than',
    wp: '#12',
    guide: '§4.2',
    re: /\brather than\b/gi,
    cap: 2,
    message: '"X rather than Y" contrast - state the preference plainly',
  },
  {
    id: 'soft-vocab',
    wp: '#8',
    guide: '§4.1',
    re: /\b(?:crucial|pivotal|vital|enhance[sd]?|enhancing|ensures?|ensuring|landscape|align(?:s|ed)? with|significant(?:ly)?|essential)\b/gi,
    cap: 3,
    message: 'soft AI vocabulary used at machine frequency - vary or cut',
  },
];

// ── Budgets that scale with post length ──────────────────────────────────────

export const BUDGETS = {
  /** Bold spans: 2 minimum, then 1 per 250 words. An 800-word post gets 3. */
  bold: (words) => Math.max(2, Math.floor(words / 250)),
  /** Share of body lines that may be bullets before it reads as an outline. */
  listDensity: 0.3,
  /** Below this stdev of sentence length, the rhythm reads as machine-uniform. */
  burstinessFloor: 4.5,
  /** " - " interruption clauses: the em-dash rhythm surviving a character swap. */
  dashRhythm: 4,
};

/**
 * Headings that are Title Case on purpose and must never be flagged.
 * "Frequently Asked Questions" is required verbatim by contentlayer.config.ts
 * to build the FAQPage JSON-LD.
 */
const HEADING_ALLOWLIST = new Set(['frequently asked questions']);

/** Capitalised tokens that are proper nouns, not Title Case styling. */
const PROPER_NOUNS = new Set([
  'i',
  'react',
  'native',
  'node',
  'next',
  'nextjs',
  'typescript',
  'javascript',
  'python',
  'docker',
  'kubernetes',
  'postgres',
  'postgresql',
  'redis',
  'graphql',
  'rest',
  'aws',
  'git',
  'github',
  'gitlab',
  'linux',
  'macos',
  'windows',
  'claude',
  'openai',
  'anthropic',
  'chatgpt',
  'nepal',
  'nepali',
  'kathmandu',
  'rrg',
  'tech',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
]);

// ── Prose extraction ─────────────────────────────────────────────────────────

/**
 * Split the body into per-line prose, blanking anything that is not the
 * author's sentences: fenced code, inline code, MDX comments, link URLs and
 * JSX tags. Returns an array parallel to body.split('\n') so every finding
 * keeps its line number.
 *
 * This is the seam every prose rule must run through - a naive regex over the
 * raw body will match inside code samples and inside `](/some-url)`.
 */
export function proseLines(body) {
  let inFence = false;
  let inComment = false;

  return body.split('\n').map((raw) => {
    if (/^\s*(?:```|~~~)/.test(raw)) {
      inFence = !inFence;
      return '';
    }
    if (inFence) return '';

    let line = raw;

    if (inComment) {
      const close = line.indexOf('*/}');
      if (close === -1) return '';
      inComment = false;
      line = line.slice(close + 3);
    }
    line = line.replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ');
    const open = line.indexOf('{/*');
    if (open !== -1) {
      inComment = true;
      line = line.slice(0, open);
    }

    return line
      .replace(/`[^`\n]*`/g, ' ') // inline code
      .replace(/!\[[^\]]*\]\([^)\s]*\)/g, ' ') // images
      .replace(/\]\([^)\s]*\)/g, '] ') // link URLs, keep the link text
      .replace(/<[^>\n]*>/g, ' '); // JSX/HTML tags, keep the children
  });
}

/** Sentence-ish split, good enough for length statistics. */
function sentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.split(/\s+/).filter(Boolean).length >= 3);
}

function stdev(nums) {
  if (nums.length < 2) return Infinity;
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  const variance = nums.reduce((a, b) => a + (b - mean) ** 2, 0) / nums.length;
  return Math.sqrt(variance);
}

/** Collect every match of `re` across the prose lines, with line numbers. */
function scan(lines, re, { skipIfLinked = false } = {}) {
  const hits = [];
  const multiline = re.flags.includes('m');

  if (multiline) {
    // Patterns anchored to line starts (or spanning lines) run against the join.
    const joined = lines.join('\n');
    const rx = new RegExp(re.source, re.flags);
    let m;
    while ((m = rx.exec(joined)) !== null) {
      const line = joined.slice(0, m.index).split('\n').length;
      hits.push({ text: m[0].trim().replace(/\s+/g, ' '), line });
      if (m[0].length === 0) rx.lastIndex++;
    }
    return hits;
  }

  lines.forEach((line, i) => {
    if (!line.trim()) return;
    if (skipIfLinked && /\]\s*$|https?:\/\//.test(line)) return;
    const rx = new RegExp(re.source, re.flags);
    let m;
    while ((m = rx.exec(line)) !== null) {
      hits.push({ text: m[0].trim().replace(/\s+/g, ' '), line: i + 1 });
      if (m[0].length === 0) rx.lastIndex++;
    }
  });
  return hits;
}

/** "…at lines 12, 40, 61 (+2 more)" */
function locate(hits) {
  const shown = hits.slice(0, 3).map((h) => `L${h.line} "${h.text.slice(0, 40)}"`);
  const extra = hits.length - shown.length;
  return shown.join(', ') + (extra > 0 ? ` (+${extra} more)` : '');
}

function label(rule) {
  return `[${rule.id}]`;
}

function cite(rule) {
  return `(guide ${rule.guide}, WP:AI ${rule.wp})`;
}

// ── The check ────────────────────────────────────────────────────────────────

/**
 * Run every AI-writing rule over one post.
 *
 * @param {object} input
 * @param {string} input.body        MDX body, frontmatter already removed
 * @param {string} [input.title]     frontmatter title (reader-facing)
 * @param {string} [input.description] frontmatter description (reader-facing)
 * @param {number} [input.words]     body word count, for length-scaled budgets
 * @returns {{errors: string[], warnings: string[]}}
 */
export function checkAiWriting({ body, title = '', description = '', words = 0 }) {
  const errors = [];
  const warnings = [];
  const lines = proseLines(body);
  const prose = lines.join('\n');

  // 1. Hard rules - any occurrence fails.
  for (const rule of HARD_RULES) {
    const hits = scan(lines, rule.re, { skipIfLinked: rule.skipIfLinked });
    if (hits.length) {
      errors.push(`${label(rule)} ${rule.message} ${cite(rule)} - ${locate(hits)}`);
    }
  }

  // 2. Reader-facing frontmatter gets the typography rules too.
  for (const field of ['title', 'description']) {
    const value = field === 'title' ? title : description;
    if (typeof value !== 'string' || !value) continue;
    for (const rule of HARD_RULES) {
      if (!rule.id.startsWith('typography-') && rule.id !== 'emoji' && rule.id !== 'ai-vocab') continue;
      const rx = new RegExp(rule.re.source, rule.re.flags);
      if (rx.test(value)) {
        errors.push(`${label(rule)} ${field} - ${rule.message} ${cite(rule)}`);
      }
    }
  }

  // 3. Capped rules - a budget, not a ban.
  for (const rule of CAPPED_RULES) {
    const hits = scan(lines, rule.re);
    if (hits.length > rule.cap) {
      const finding = `${label(rule)} ${hits.length} ${rule.message} - budget is ${rule.cap} ${cite(rule)} - ${locate(hits)}`;
      (rule.severity === 'warning' ? warnings : errors).push(finding);
    }
  }

  // 4. Boldface density (WP #16). blog-generator allows one key insight, not a
  //    highlighter pass over the whole post.
  const boldHits = scan(lines, /\*\*[^*\n]+\*\*/g);
  const boldBudget = BUDGETS.bold(words);
  if (boldHits.length > boldBudget) {
    errors.push(
      `[bold-density] ${boldHits.length} bold spans - budget is ${boldBudget} for ~${words} words; ` +
        `bold is for the one insight that matters (guide §4.3, WP:AI #16) - ${locate(boldHits)}`,
    );
  }

  // 5. Inline-header vertical lists (WP #17): "- **Header**: description".
  const inlineHeaders = scan(lines, /^\s*(?:[-*+]|\d+\.)\s+\*\*[^*\n]+\*\*\s*[:-]/gm);
  if (inlineHeaders.length > 1) {
    errors.push(
      `[inline-header-list] ${inlineHeaders.length} "- **Header**: text" list items - write them as sentences ` +
        `(guide §4.3, WP:AI #17) - ${locate(inlineHeaders)}`,
    );
  }

  // 6. Outline feel: too much of the post is bullets (WP #17).
  const bodyLines = lines.filter((l) => l.trim());
  const bulletLines = bodyLines.filter((l) => /^\s*(?:[-*+]|\d+\.)\s+\S/.test(l));
  if (bodyLines.length >= 20) {
    const ratio = bulletLines.length / bodyLines.length;
    if (ratio > BUDGETS.listDensity) {
      errors.push(
        `[list-density] ${Math.round(ratio * 100)}% of body lines are bullets - keep it under ` +
          `${BUDGETS.listDensity * 100}%; this is an article, not an outline (guide §4.3, WP:AI #17)`,
      );
    }
  }

  // 7. Title Case headings (WP #15). House style is sentence case.
  lines.forEach((line, i) => {
    const h = /^#{2,4}\s+(.+?)\s*$/.exec(line);
    if (!h) return;
    const text = h[1].replace(/[?:.!]/g, '');
    if (HEADING_ALLOWLIST.has(text.toLowerCase())) return;
    const words_ = text.split(/\s+/).filter(Boolean);
    if (words_.length < 4) return;
    const capitalised = words_.slice(1).filter((w) => {
      const bare = w.replace(/[^A-Za-z.]/g, '');
      if (!/^[A-Z]/.test(bare)) return false;
      if (bare === bare.toUpperCase()) return false; // API, AI, SQL
      if (bare.includes('.')) return false; // Next.js
      return !PROPER_NOUNS.has(bare.toLowerCase());
    });
    if (capitalised.length >= 3) {
      errors.push(
        `[title-case-heading] L${i + 1} "${text.slice(0, 50)}" is Title Case - house style is ` +
          `sentence case (guide §4.3, WP:AI #15)`,
      );
    }
  });

  // 8. Advisory: em-dash rhythm surviving a character swap. The guide's subtlest
  //    rule - swapping "—" for "-" but keeping the interrupting clause.
  const dashClauses = scan(lines, /\s-\s[^-\n]{3,60}\s-\s/g);
  if (dashClauses.length > BUDGETS.dashRhythm) {
    warnings.push(
      `[dash-rhythm] ${dashClauses.length} hyphen-interrupted clauses - you swapped the character but ` +
        `kept the em-dash rhythm; vary the sentence shape instead (guide §4.4)`,
    );
  }

  // 9. Advisory: uniform sentence length reads as machine-generated.
  const lens = sentences(prose.replace(/^#{1,6}\s+.*$/gm, '')).map((s) => s.split(/\s+/).filter(Boolean).length);
  if (lens.length >= 12) {
    const sd = stdev(lens);
    if (sd < BUDGETS.burstinessFloor) {
      warnings.push(
        `[burstiness] sentence lengths are unusually uniform (stdev ${sd.toFixed(1)}, want ` +
          `> ${BUDGETS.burstinessFloor}) - mix short punchy sentences with longer ones (guide §4.5)`,
      );
    }
  }

  return { errors, warnings };
}
