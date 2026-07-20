# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing site + blog for **RRG Tech**, a digital agency in Kathmandu. Next.js 14 (App Router) with a Contentlayer-powered MDX blog. Heavy on animation (GSAP, Framer Motion, Lenis smooth scroll, a WebGL cursor) and SEO (JSON-LD, sitemap, RSS, per-post OG images).

## Commands

```bash
npm run dev          # dev server on PORT 3400 (not 3000) - http://localhost:3400
npm run build        # production build (runs Contentlayer codegen first via withContentlayer)
npm run lint         # next lint (eslint-config-next core-web-vitals)
npm run format       # prettier --write . (single quotes, semicolons, printWidth 120, trailing commas)

npm run generate-blog -- "<topic>"            # scaffold a draft post (published: false)
npm run generate-blog -- --publish "<topic>"  # scaffold a publish-ready post
npm run validate-blog                          # lint all posts against repo conventions
npm run validate-blog -- <slug>                # lint one post (run before committing any post)
npm run optimize-images                        # compress images in public/
```

There is **no test suite**. `npm run validate-blog` is the closest thing to a test - it is the gate for blog content and must pass with 0 errors before a post is committed.

## Architecture

### Import alias
`@/*` → `src/*` (tsconfig). `contentlayer/generated` → `.contentlayer/generated` (generated; do not edit by hand - it's produced from `content/` by `npm run dev`/`build`).

### Source layout (`src/`)
- **`app/`** - App Router routes. `page.tsx` is the animated landing page (client component composing widgets). `layout.tsx` wraps everything in `SmoothScroll` + injects Organization JSON-LD. `blog/`, `book/`, `api/`, plus SEO endpoints `sitemap.ts`, `robots.ts`, `feed.xml/route.ts`, and `metadata.ts`.
- **`widgets/`** - large page sections (Hero, About, Services, Approach, CallToAction, Navigation, BookForm). Each is a folder with `index.tsx`. These are the building blocks the landing page assembles.
- **`components/`** - reusable UI. `ui/` holds primitives (shadcn-style, configured in `components.json` with alias `@/components/ui`); `blog/` holds the entire blog reading experience (TOC, ReadingProgress, PostMeta, RelatedPosts, and `mdx/` renderers).
- **`lib/`** - server-side domain logic. `blog.ts` (post queries: `getAllPosts`, `getPostBySlug`, `getRelatedPosts`, etc. - all filter to `published` and sort newest-first), `seo.ts` (JSON-LD + metadata builders), `site.ts` (`siteConfig` - single source of truth for name/url/social; use `absoluteUrl()` for absolute links).
- **`shared/`** - cross-cutting `utils/` (animation helpers, WebGL cursor) and `styles/` (global + blog SCSS).
- **`data/`**, **`composables/`**, **`icons/`**, **`types/`** - static content, reusable hooks, SVG icon components, shared TS types.

### Blog system (the core subsystem)
Posts are MDX files in `content/blogs/*.mdx`. The filename is the slug **and** the public URL (`/blog/<slug>`) - renaming breaks links and the generator refuses to overwrite.

- **`contentlayer.config.ts`** defines the `Blog` document type, its frontmatter schema, and computed fields. Notably it parses the **raw markdown** (not compiled MDX) to derive `headings` (table of contents) and `faq` (for FAQPage JSON-LD) - both rely on `##`/`###` structure and on the FAQ section being titled "Frequently Asked Questions". Slugs are generated with `github-slugger` to match `rehype-slug` anchors.
- Frontmatter: `title`, `description`, `date` are required. `published` (default true, but generator scaffolds drafts as false) gates listing/sitemap/RSS/static-generation. Categories are constrained to **Engineering / Design / Announcements**.
- Blog pages use ISR (`export const revalidate = 3600`) so merged posts appear without a manual deploy.
- **`/api/blog`** is a public, CORS-enabled, paginated JSON feed for syndicating posts to other sites.
- Only these MDX components are allowed in posts: `<Note> <Info> <Tip> <Warning> <BlogImage>` (and `<Callout>`). `validate-blog` errors on any other capitalized component.

### Blog authoring workflow
Content rules live in **`docs/blog-writing-guide.md`**; the agent-facing generation prompt is **`prompts/blog-generator.md`**. The end-to-end automated routine ("daily-blog") is **`prompts/daily-blog-routine.md`**: pick topic (`scripts/next-blog-topic.mjs`) → scaffold (`generate-blog`) → write the prose by hand following the guide → `validate-blog` until 0 errors → open a PR.

**Prose style is machine-enforced.** `scripts/lib/ai-writing-rules.mjs` is the single source of truth for the anti-AI-writing rules (adapted from [Wikipedia's "Signs of AI writing"](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)) - em dashes, negative parallelism, AI vocabulary, Title Case headings, bold/bullet overuse and more. `validate-blog` reports them as **errors**, so a non-compliant post cannot ship. Guide §4 explains each rule in prose and cites its rule id; never restate the word lists anywhere else. Posts in `scripts/blog-legacy-baseline.json` predate the rules and are downgraded to warnings; `validate-blog -- --no-legacy` audits them. **Posts are published by merging a PR to `main`; the scaffolder/scripts never merge, deploy, or set `published: true` on their own** (except the explicit `--publish` scaffold flag, which still requires human review + merge).

## Conventions
- The site uses **VW units** for responsive scaling - keep that convention when adding layout.
- Security headers (incl. a strict CSP) are defined in `next.config.mjs`; new external scripts/origins must be added to the CSP there or they will be blocked.
- The WebGL `ShadowCursor` only mounts on fine-pointer devices; the contact form posts to `/api/contact` (nodemailer/SMTP, configured via `.env.local` - see `.env.example`).
