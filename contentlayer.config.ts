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
