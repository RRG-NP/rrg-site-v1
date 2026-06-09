# Blog Automation Analysis

> A complete map of how blogging works in this repository, written so an automated
> agent (or a new teammate) can generate posts that fit the existing architecture
> exactly. Everything here was derived from the source, not assumed.

**Repo:** `rrg-agency-site` · **Analyzed:** 2026-06-03

---

## 1. Framework

### Stack

| Concern        | Choice                                                  |
| -------------- | ------------------------------------------------------- |
| Framework      | **Next.js `14.2.35`** (App Router)                      |
| UI             | **React 18**, TypeScript 5                              |
| Styling        | Tailwind CSS 3.4 + SCSS (`sass`)                        |
| Content engine | **Contentlayer2 `^0.5.8`** (`next-contentlayer2`)       |
| Markdown       | MDX, via Contentlayer's remark/rehype pipeline          |
| Animation      | Framer Motion, GSAP, Lenis (site chrome, not blog body) |

Next.js is wrapped with `withContentlayer` in `next.config.mjs`, so content is compiled
as part of `next build` / `next dev`.

### Routing structure (App Router, `src/app`)

```
src/app
├── layout.tsx                     Root layout (injects Organization JSON-LD)
├── page.tsx                       Home  ( / )
├── metadata.ts                    Root metadata export
├── robots.ts                      /robots.txt
├── sitemap.ts                     /sitemap.xml  (auto-includes published posts)
├── feed.xml/route.ts              RSS feed
├── api/contact/route.ts           POST /api/contact
├── book/                          /book, /book/success  (the conversion funnel)
└── blog/
    ├── layout.tsx                 Title template for blog routes
    ├── page.tsx                   Blog index  ( /blog )
    ├── loading.tsx                Loading UI
    ├── not-found.tsx              404 for unknown slugs
    └── [slug]/
        ├── page.tsx               Individual post  ( /blog/<slug> )
        └── opengraph-image.tsx    Per-post 1200×630 social card (auto-generated)
```

Only one dynamic route exists: `/blog/[slug]`. It is statically generated for every
published post via `generateStaticParams`, with `revalidate = 3600` (ISR) and
`dynamicParams = true` so new posts appear on a schedule without a manual deploy.

### Content architecture

Content is **file-based and Git-versioned** - no CMS, no database. MDX files live under
`content/blogs/`. Contentlayer reads them at build time, validates frontmatter against a
typed schema, computes derived fields, and emits a typed module (`contentlayer/generated`)
that the app imports. The data flow:

```
content/blogs/*.mdx
   └─(contentlayer.config.ts)→ contentlayer/generated  (typed `allBlogs`, `Blog` type)
        └─(src/lib/blog.ts)→ query helpers (getAllPosts, getPostBySlug, …)
             └─(src/app/blog/**)→ rendered pages + metadata + JSON-LD + sitemap + RSS
```

---

## 2. Blog implementation

### Where posts are stored

```
content/blogs/<slug>.mdx
```

Current posts (3):

- `welcome-to-the-rrg-tech-blog.mdx`
- `building-with-the-nextjs-app-router.mdx`
- `designing-accessible-interfaces.mdx`

> **Note on sample size:** the task brief asked for an analysis of "at least 10 existing
> blog posts." The repository contains only **3** at the time of writing. All three were
> read in full and the conventions below are drawn from them plus the rendering/SEO code,
> which is the authoritative source. As more posts are added the patterns should be
> re-confirmed against this guide.

### MDX configuration (`contentlayer.config.ts`)

- **Document type:** `Blog`, `filePathPattern: 'blogs/**/*.mdx'`, `contentType: 'mdx'`.
- **Content root:** `contentDirPath: 'content'`.
- **Remark plugins:** `remark-gfm` (GitHub-flavored markdown - tables, task lists,
  strikethrough, autolinks).
- **Rehype plugins (in order):**
  1. `rehype-slug` - adds `id`s to headings.
  2. `rehype-accessible-emojis` - wraps emoji with accessible markup.
  3. `rehype-pretty-code` - Shiki syntax highlighting, theme `github-dark-dimmed`,
     `keepBackground: false` (the surface is painted by `blog.scss`), `defaultLang: 'plaintext'`.
  4. `rehype-autolink-headings` - `behavior: 'wrap'`, class `heading-anchor`,
     `ariaLabel: 'Link to this section'`.

### Frontmatter schema

Defined in `contentlayer.config.ts`. **Required fields fail the build if missing.**

| Field           | Type       | Required | Default      | Notes                                            |
| --------------- | ---------- | -------- | ------------ | ------------------------------------------------ |
| `title`         | string     | **Yes**  | -            | Rendered as the page `<h1>`.                     |
| `description`   | string     | **Yes**  | -            | Sub-headline + meta description fallback.        |
| `date`          | date (ISO) | **Yes**  | -            | `YYYY-MM-DD`. Drives ordering & `publishedTime`. |
| `updated`       | date       | No       | -            | Sets `dateModified` / `modifiedTime`.            |
| `published`     | boolean    | No       | `true`       | `false` ⇒ excluded everywhere. **Drafts.**       |
| `featured`      | boolean    | No       | `false`      | Surfaces the post in the featured slot.          |
| `tags`          | string[]   | No       | `[]`         | Keywords + related-post scoring + tag filter.    |
| `category`      | string     | No       | -            | Single section label (e.g. `Engineering`).       |
| `coverImage`    | string     | No       | -            | Path under `/public`. Used as hero + JSON-LD.    |
| `author`        | string     | No       | `'RRG Tech'` | Byline.                                          |
| `seoTitle`      | string     | No       | -            | Overrides `<title>` (else `title`).              |
| `seoDescription`| string     | No       | -            | Overrides meta description (else `description`). |
| `canonicalUrl`  | string     | No       | -            | Overrides canonical (else the post's own URL).   |

**Computed fields** (do not write these by hand - Contentlayer derives them):

| Field         | Source                                                            |
| ------------- | ----------------------------------------------------------------- |
| `slug`        | filename: `blogs/<slug>.mdx` → `<slug>`                            |
| `url`         | `/blog/<slug>`                                                    |
| `readingTime` | `reading-time` over the raw body (e.g. `"2 min read"`)            |
| `wordCount`   | `reading-time` word count                                         |
| `headings`    | H2/H3 parsed from raw markdown → `{ level, text, slug }[]` (TOC)  |

### Required fields

Minimum valid frontmatter is exactly three keys: **`title`, `description`, `date`**. In
practice every post should also set `tags`, `category`, and `author` for good SEO and
navigation. See the writing guide for the recommended baseline.

### Slug generation

Slugs come **only from the filename** - there is no `slug` frontmatter field:

```ts
slug: doc._raw.flattenedPath.replace(/^blogs\//, '')   // blogs/my-post.mdx → my-post
url:  `/blog/${slug}`
```

So the filename **is** the URL. Use lowercase kebab-case, ASCII only, no spaces. Renaming
a file changes its public URL (and would need a redirect if the old URL was live).

### Query helpers (`src/lib/blog.ts`)

| Function                  | Purpose                                                       |
| ------------------------- | ------------------------------------------------------------- |
| `getAllPosts()`           | All **published** posts, newest first. The canonical ordering.|
| `getFeaturedPosts()`      | Published + `featured`.                                       |
| `getPostBySlug(slug)`     | Single published post.                                        |
| `getAllTags()`            | `{ tag, count }[]`, most common first.                        |
| `getRelatedPosts(post,n)` | Scored by shared tags (+category bonus); tops up with newest. |
| `getAdjacentPosts(slug)`  | `{ previous, next }` in chronological order.                  |
| `getPostHeadings(post)`   | Typed access to the computed `headings` TOC.                  |
| `toSummary(post)`         | Strips the heavy compiled body for card/list views.           |

Unpublished posts are filtered out at the `getAllPosts` layer, so a draft
(`published: false`) is safe to commit - it never appears in lists, the sitemap, the RSS
feed, related posts, or `generateStaticParams`.

---

## 3. Content conventions

Derived from the 3 existing posts (`welcome-to-the-rrg-tech-blog`,
`building-with-the-nextjs-app-router`, `designing-accessible-interfaces`) and the
rendering code.

### Writing style & voice

> **Forward-looking note:** the three legacy posts use the first-person-plural "we" team
> voice described below. The **current writing standard** (see
> [`blog-writing-guide.md`](./blog-writing-guide.md) §3–4) is a **first-person individual**
> persona - a 28-year-old Nepali software engineer sharing lessons from real work - written
> for a broad audience, 500–1000 words, with strict anti-AI-slop rules. New posts follow the
> guide; the observations below document the existing corpus.

- **First-person plural ("we").** The blog speaks as the RRG Tech team: "these are the
  patterns we keep coming back to," "we hold ourselves to a simple standard."
- **Pragmatic and opinionated**, grounded in real project experience. Takes a position
  ("Server components are the default - keep it that way") rather than hedging.
- **Concise and direct.** Short paragraphs (2–4 sentences), plain language, minimal
  throat-clearing. Concrete over abstract.
- **Teaching tone.** Show the wrong way, then the right way (`<div onClick>` vs `<button>`;
  `outline: none` vs `:focus-visible`).

### Article length

The current posts run **~300–450 words** of prose (short, focused essays;
1–3 min read). They are tightly scoped to a single idea. This is the existing baseline;
longer how-to/pillar posts are reasonable but should stay this dense and skimmable.

### Heading patterns

- The **`title` frontmatter renders as the only `<h1>`.** Body content must **start at
  `<h2>`** (`##`).
- Body headings use **`##` (H2) and `###` (H3) only** - this matters because the
  table-of-contents (`extractHeadings`) parses **only H2 and H3**. An `<h4>` (`####`) will
  render but never appear in the TOC.
- Headings are **sentence-case and verb-led / declarative**: "Server components are the
  default - keep it that way", "Focus is not optional", "Images need real alt text".
- Posts typically have **3–5 H2 sections** and frequently close with a short
  checklist section and a one-paragraph wrap-up.

### Internal linking patterns

- Internal links are written as **root-relative markdown links**: `[get in touch](/book)`.
- The MDX `a` handler (`MdxLink`) routes `/…` links through `next/link` (prefetch), `#…`
  through a plain anchor, and external `http(s)` links through a safe new tab
  (`target="_blank" rel="noopener noreferrer"`).
- The dominant internal link today is the **`/book` CTA**. Cross-links between posts
  (`/blog/<slug>`) are encouraged where relevant - `getRelatedPosts` also surfaces related
  content automatically via shared tags/category, so manual links should be intentional,
  not exhaustive.

### CTA patterns

- A single, low-pressure closing CTA. The canonical pattern (from the welcome post):

  > If you're building something ambitious and want a partner who sweats these details,
  > [get in touch](/book).

- CTAs are conversational sentences with an inline link, **not** buttons or banners. Place
  them in the final paragraph.

### SEO patterns (as authored)

- Most posts rely on `title` + `description` for SEO. The flagship post
  (`welcome-to-the-rrg-tech-blog`) additionally sets `seoTitle`, `seoDescription`,
  `coverImage`, and `featured: true` - the template for a high-value post.
- `description` is a complete, benefit-led sentence (~140–155 chars) that doubles as the
  meta description and the on-page sub-headline.
- 3–4 `tags` per post, drawn from a small shared vocabulary (e.g. `Web Development`,
  `Next.js`, `Performance`, `Accessibility`, `Design`).

### Structural ingredients seen across posts

Fenced code blocks with a language tag (`tsx`, `ts`, `html`, `css`), GFM **tables**
(decision matrices, contrast ratios), GFM **task lists** (`- [x]` checklists), a
**blockquote** (a relevant quotation), and **1–2 Callouts** (`<Note>`, `<Tip>`,
`<Warning>`). A typical post uses 3–4 of these, not all at once.

---

## 4. MDX components

The component map passed to compiled MDX lives in
`src/components/blog/mdx/mdx-components.tsx`. Block-level typography (headings, paragraphs,
lists, tables, blockquotes) is **not** componentized - it's styled globally by the
`.prose-rrg` rules in `src/shared/styles/blog.scss`. The map only overrides elements that
need behavior, plus the authoring components.

### Automatic element overrides (you don't write these; they apply to plain markdown)

| Element | Component   | Behavior                                                                                       |
| ------- | ----------- | ---------------------------------------------------------------------------------------------- |
| `a`     | `MdxLink`   | `/…` → `next/link`; `#…` → anchor; external → new tab with `rel="noopener noreferrer"`.        |
| `img`   | `MdxImage`  | Delegates to `BlogImage` (so even plain markdown images get optimized).                        |
| `pre`   | `CodeBlock` | Wraps fenced code with a copy-to-clipboard button. `'use client'`.                             |

Because of these, you get optimized links/images/code **for free** from standard markdown -
prefer plain markdown links and fenced code over hand-writing components.

### Authoring components (use directly in MDX)

| Component     | Props                                          | Purpose                                                       |
| ------------- | ---------------------------------------------- | ------------------------------------------------------------- |
| `<Callout>`   | `type?: 'note'\|'info'\|'tip'\|'warning'`, `title?` | Generic highlighted aside. The four shortcuts below are preferred. |
| `<Note>`      | `title?`                                       | Neutral aside (primary color, sticky-note icon).              |
| `<Info>`      | `title?`                                       | Informational aside (sky blue, info icon).                    |
| `<Tip>`       | `title?`                                       | Best-practice tip (emerald, lightbulb icon).                  |
| `<Warning>`   | `title?`                                       | Caution / gotcha (amber, alert-triangle icon).                |
| `<BlogImage>` | `src` (req), `alt` (req), `width?`, `height?`, `className?` | Optimized `next/image`. With `width`+`height` uses intrinsic size; otherwise fills a 16:9 frame (no CLS). |

> `<Info>` is exported in code as `Info_` but **registered in MDX as `Info`** - author it
> as `<Info>`.

### Usage examples

```mdx
<Note>
New posts are written in MDX and deploy automatically when we push to GitHub.
</Note>

<Tip title="Measure first">
Profiling in production-like conditions beats guessing every time.
</Tip>

<Warning>
`outline: none` with no replacement strands keyboard users. Audit for it.
</Warning>

<BlogImage src="/images/blog/diagram.png" alt="Request flow from edge to origin" />
```

Code blocks and links use **plain markdown** (the overrides handle the rest):

````mdx
```tsx
export default function Page() {
  return <h1>Hello</h1>;
}
```

See our [booking page](/book) or the [App Router post](/blog/building-with-the-nextjs-app-router).
````

### Which components to use automatically in future posts

- **Always available, zero effort:** links, images, and code blocks via plain markdown
  (handled by `MdxLink` / `MdxImage` / `CodeBlock`). Always tag code fences with a language.
- **Use when the content calls for it (most posts use 1–2):**
  - `<Warning>` for a gotcha, footgun, or "don't do this."
  - `<Tip>` for a best-practice nudge.
  - `<Note>` for an aside or context.
  - `<Info>` for neutral supplementary detail.
- **Use `<BlogImage>` for every content image** (or just markdown `![]()`, which becomes
  `BlogImage`). **`alt` is mandatory** - empty string only for decorative images.
- **Don't** invent components that aren't in the map - MDX will fail to compile or render a
  literal undefined tag. The full allowed set is: `Callout`, `Note`, `Info`, `Tip`,
  `Warning`, `BlogImage` (plus standard markdown/GFM).

---

## 5. SEO implementation

### Metadata generation

- **Root:** `src/app/metadata.ts` (title template, default OG/Twitter, robots directives,
  verification codes, RSS alternate) exported from the root layout.
- **Blog section:** `src/app/blog/layout.tsx` sets a title template for blog routes.
- **Per post:** `generateMetadata` in `src/app/blog/[slug]/page.tsx` calls
  **`buildPostMetadata(post)`** (`src/lib/seo.ts`), which resolves:
  - `title` = `seoTitle || title`
  - `description` = `seoDescription || description`
  - `canonical` = `canonicalUrl || url`
  - `keywords` = `tags`, `authors`, and full OpenGraph **article** + Twitter blocks.

Single source of identity is `src/lib/site.ts` (`siteConfig`: name, URL
`https://rrg.com.np`, logo, locale, social) with `absoluteUrl()` for building absolute URLs.

### OpenGraph & Twitter

- Defaults (site image, `summary_large_image`) in `src/app/metadata.ts`.
- Per-post OG block built in `buildPostMetadata` (`type: 'article'`, `publishedTime`,
  `modifiedTime`, `authors`, `tags`).
- **Per-post social image** is generated at request/build time by
  `src/app/blog/[slug]/opengraph-image.tsx` using `ImageResponse` (Satori) - a branded
  1200×630 card (logo, category, title, reading time, domain). Because the file convention
  supplies the image, `buildPostMetadata` deliberately **omits** `images` to avoid emitting
  it twice. **You do not need to create OG images for posts.**

### Structured data (JSON-LD)

| Schema                  | Builder / source                                            | Rendered in                         |
| ----------------------- | ----------------------------------------------------------- | ----------------------------------- |
| `Organization` / service| `src/components/StructuredData/OrganizationJsonLd.tsx`      | root `layout.tsx`                   |
| `BlogPosting`           | `buildArticleJsonLd(post)` (`src/lib/seo.ts`)               | `blog/[slug]/page.tsx`              |
| `BreadcrumbList`        | `buildBreadcrumbJsonLd(items)` (`src/lib/seo.ts`)           | `blog/[slug]/page.tsx`              |
| `FAQPage`               | `buildFaqJsonLd(faqs)` - **added by this workflow**          | `blog/[slug]/page.tsx` (if FAQ present) |

`BlogPosting` includes headline, description, image (`coverImage || siteConfig.ogImage`),
`datePublished`/`dateModified`, author + publisher orgs, `mainEntityOfPage`, `keywords`, and
`articleSection` (category). All are injected via
`<script type="application/ld+json">`.

### Sitemap

`src/app/sitemap.ts` lists Home (priority 1), `/blog` (0.9), `/book` (0.8), and **every
published post** (0.7, monthly) by mapping `getAllPosts()`. Drafts are excluded
automatically. Output served at `/sitemap.xml`.

### Canonical URLs

Handled in `buildPostMetadata` via `alternates.canonical = canonicalUrl || url`. Set
`canonicalUrl` in frontmatter only when republishing content that lives elsewhere; otherwise
leave it unset and the post canonicalizes to its own `/blog/<slug>`.

### robots & feed

- `src/app/robots.ts` → `/robots.txt`: allow all, points to `${siteConfig.url}/sitemap.xml`.
- `src/app/feed.xml/route.ts` → RSS at `/feed.xml`, linked from root metadata `alternates`.

---

## 6. Publishing workflow

### How content reaches production

1. **Author** an MDX file in `content/blogs/<slug>.mdx` (scaffold with
   `npm run generate-blog -- "<topic>"`; see the generator below). Drafts use
   `published: false`.
2. **Validate** locally with `npm run validate-blog` (frontmatter, SEO, links, headings,
   MDX, FAQ).
3. **Preview** with `npm run dev` (port 3400). Contentlayer recompiles on save.
4. **Publish** by setting `published: true` and committing.
5. **Deploy** by pushing to Git (see below).

### Git workflow

- Default branch: `main`. Recent history shows a **feature-branch → PR → merge** flow
  (e.g. `fix/perf-issue`, `fix/splash-animation` merged via PRs). New posts should follow
  the same: branch, commit the MDX, open a PR, merge.
- No CI workflow files (`.github/workflows`) exist in the repo today; validation is run
  locally / on demand. The `validate-blog` script is CI-ready (non-zero exit on errors) if
  a pipeline is added later.

### Build process

- `npm run build` → `next build`, wrapped by `withContentlayer` (in `next.config.mjs`), so
  Contentlayer compiles `content/blogs/*.mdx`, **fails the build on invalid frontmatter**,
  and regenerates `contentlayer/generated`.
- Blog pages are statically generated per published slug; ISR `revalidate = 3600` refreshes
  them hourly without a redeploy. Security headers and image optimization (AVIF/WebP) are
  configured in `next.config.mjs`.

### Deployment process

- No `vercel.json` / `netlify.toml` / CI in-repo; the project is a standard Next.js app
  deployed via a **Git-push integration** (Vercel-style): pushing to the production branch
  triggers a build + deploy. With ISR, edits to existing posts also surface within the
  revalidation window without a full redeploy.

---

## Key files index

| Path                                              | Role                                           |
| ------------------------------------------------- | ---------------------------------------------- |
| `content/blogs/*.mdx`                             | The posts.                                     |
| `contentlayer.config.ts`                          | Schema, MDX pipeline, computed fields.         |
| `src/lib/blog.ts`                                 | Post queries / ordering / related.             |
| `src/lib/seo.ts`                                  | Metadata + JSON-LD builders.                   |
| `src/lib/site.ts`                                 | Site identity (`siteConfig`, `absoluteUrl`).   |
| `src/components/blog/mdx/mdx-components.tsx`       | MDX component map.                             |
| `src/components/blog/mdx/{Callout,BlogImage,CodeBlock}.tsx` | Authoring components.                 |
| `src/app/blog/[slug]/page.tsx`                    | Post page + JSON-LD render.                    |
| `src/app/blog/[slug]/opengraph-image.tsx`         | Auto OG image.                                 |
| `src/app/sitemap.ts`, `robots.ts`, `feed.xml/route.ts` | Discovery surfaces.                       |
| `docs/blog-writing-guide.md`                      | Authoring rules (companion to this doc).       |
| `prompts/blog-generator.md`                       | Generation prompt for agents.                  |
| `scripts/generate-blog.mjs`                       | Draft scaffolder.                              |
| `scripts/validate-blog-content.mjs`               | Content validator.                             |
