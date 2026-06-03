import { defineDocumentType, makeSource } from 'contentlayer2/source-files';
import readingTime from 'reading-time';
import GithubSlugger from 'github-slugger';

import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import rehypePrettyCode from 'rehype-pretty-code';

/** A single entry in a post's table of contents. */
export type TocHeading = {
  level: number;
  text: string;
  slug: string;
};

/**
 * Parse `##` / `###` headings out of the raw markdown body so we can build a
 * table of contents without re-parsing MDX on the client. Slugs are generated
 * with the same library `rehype-slug` uses, so anchors line up exactly.
 */
function extractHeadings(raw: string): TocHeading[] {
  const slugger = new GithubSlugger();
  const headings: TocHeading[] = [];
  let inFence = false;

  for (const line of raw.split('\n')) {
    // Toggle in/out of fenced code blocks so `#` comments aren't treated as headings.
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.*)$/.exec(line);
    if (!match) continue;

    const level = match[1].length;
    // Strip markdown emphasis / inline code markers from the visible text.
    const text = match[2].replace(/[#*`_~]/g, '').trim();
    if (!text) continue;

    headings.push({ level, text, slug: slugger.slug(text) });
  }

  return headings;
}

/** A single question/answer pair extracted from a post's FAQ section. */
export type FaqItem = {
  question: string;
  answer: string;
};

/**
 * Parse a "## Frequently Asked Questions" section out of the raw markdown so we
 * can emit FAQPage structured data without re-parsing MDX. Each `###` under the
 * FAQ heading is a question; its answer is the first paragraph that follows (the
 * authoring guide constrains answers to a single 1–3 sentence paragraph, so this
 * stays clean even when a closing CTA paragraph follows the last question).
 * Markdown markers are stripped so the JSON-LD stays plain text.
 */
function extractFaq(raw: string): FaqItem[] {
  const lines = raw.split('\n');
  const items: FaqItem[] = [];
  let inFence = false;
  let inFaq = false;
  let current: { question: string; answer: string[]; done: boolean } | null = null;

  const clean = (s: string) => s.replace(/[*`_~]/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').trim();
  const flush = () => {
    if (current && current.answer.join(' ').trim()) {
      items.push({ question: current.question, answer: clean(current.answer.join(' ')) });
    }
    current = null;
  };

  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    if (!inFence) {
      const h2 = /^##\s+(.*)$/.exec(line);
      if (h2) {
        // Entering or leaving the FAQ section.
        flush();
        inFaq = /frequently asked questions/i.test(h2[1]);
        continue;
      }
    }
    if (!inFaq) continue;

    const h3 = /^###\s+(.*)$/.exec(line);
    if (h3) {
      flush();
      current = { question: clean(h3[1]), answer: [], done: false };
      continue;
    }
    if (!current || current.done) continue;

    if (line.trim() === '') {
      // Blank line ends the answer once we've captured its first paragraph.
      if (current.answer.length > 0) current.done = true;
      continue;
    }
    current.answer.push(line.trim());
  }
  flush();

  return items;
}

export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: 'blogs/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    date: { type: 'date', required: true },
    updated: { type: 'date', required: false },
    published: { type: 'boolean', default: true },
    featured: { type: 'boolean', default: false },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    category: { type: 'string', required: false },
    coverImage: { type: 'string', required: false },
    author: { type: 'string', default: 'RRG Tech' },
    seoTitle: { type: 'string', required: false },
    seoDescription: { type: 'string', required: false },
    canonicalUrl: { type: 'string', required: false },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.replace(/^blogs\//, ''),
    },
    url: {
      type: 'string',
      resolve: (doc) => `/blog/${doc._raw.flattenedPath.replace(/^blogs\//, '')}`,
    },
    readingTime: {
      type: 'string',
      resolve: (doc: any) => readingTime(doc.body.raw).text,
    },
    wordCount: {
      type: 'number',
      resolve: (doc: any) => readingTime(doc.body.raw).words,
    },
    headings: {
      type: 'json',
      resolve: (doc: any) => extractHeadings(doc.body.raw),
    },
    faq: {
      type: 'json',
      resolve: (doc: any) => extractFaq(doc.body.raw),
    },
  },
}));

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Blog],
  disableImportAliasWarning: true,
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      rehypeAccessibleEmojis,
      [
        rehypePrettyCode,
        {
          theme: 'github-dark-dimmed',
          // We paint the code surface ourselves (blog.scss) so it matches the palette.
          keepBackground: false,
          defaultLang: 'plaintext',
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'wrap',
          properties: { className: ['heading-anchor'], ariaLabel: 'Link to this section' },
        },
      ],
    ] as any,
  },
});
