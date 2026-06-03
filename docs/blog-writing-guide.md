# Blog Writing Guide

> The authoring rules for the RRG Tech blog. These are derived from the repository's
> actual schema, rendering code, and existing posts — not from generic blogging advice.
> For the underlying architecture, see [`blog-automation-analysis.md`](./blog-automation-analysis.md).

A post is one MDX file at `content/blogs/<slug>.mdx`. The **filename is the URL**
(`/blog/<slug>`), so name it in lowercase kebab-case, ASCII only.

---

## 1. Frontmatter requirements

Every post starts with a YAML frontmatter block. **Required** keys block the build if
missing; the rest are strongly recommended for a quality post.

```yaml
---
title: Building with the Next.js App Router          # required
description: >-                                       # required — 120–160 chars, one benefit-led sentence
  Server components, streaming, and metadata done right. A pragmatic tour of the
  patterns we reach for on every App Router project.
date: 2026-05-10                                      # required — YYYY-MM-DD
updated: 2026-05-15                                   # optional — set when you materially revise
published: false                                      # false while drafting; true to publish
featured: false                                       # true only for a flagship post
category: Engineering                                 # one of the established categories
tags:                                                 # 3–6 tags from the shared vocabulary
  - Next.js
  - React
  - Performance
author: RRG Tech                                      # defaults to "RRG Tech"
# Optional SEO overrides — usually omit; the defaults are good:
# seoTitle: ...
# seoDescription: ...
# coverImage: /images/blog/<slug>.jpg
# canonicalUrl: https://...                           # only when republishing from elsewhere
---
```

Rules:

- **Do not** add a `slug` field — the slug is the filename.
- **Do not** add computed fields (`url`, `readingTime`, `wordCount`, `headings`) — Contentlayer derives them.
- `date` must be `YYYY-MM-DD`. `published: false` is the default draft state and keeps the post
  out of listings, sitemap, RSS, related posts, and static generation.
- `featured: true` promotes the post into the featured slot — use sparingly (≈ one at a time).

**Established categories** (keep this set small; pick one): `Engineering`, `Design`,
`Announcements`. Add a new category only when a post genuinely doesn't fit.

**Tag vocabulary** (reuse existing tags before inventing new ones): `Web Development`,
`Next.js`, `React`, `Performance`, `Accessibility`, `Design`, `UX`, `Company`,
`Announcements`.

---

## 2. SEO requirements

| Field            | Rule                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------- |
| `title`          | ≤ **60 characters**. Specific and descriptive; sentence case.                         |
| `description`    | **120–160 characters**, one complete benefit-led sentence. Doubles as the meta description and on-page sub-headline. |
| `tags`           | **3–6**, reused from the vocabulary above. They become `keywords` and drive related posts. |
| `category`       | Set it — it becomes `articleSection` in structured data and shows on the OG card.     |
| `seoTitle` / `seoDescription` | Optional overrides. Only add when the on-page title/description aren't ideal for search. |
| `canonicalUrl`   | Only when the post is republished from another canonical source.                      |
| `coverImage`     | Optional. **Not needed for the social card** — that's auto-generated per post.        |

You never write OG images, JSON-LD, sitemap entries, or canonical tags by hand — the
framework generates all of them from frontmatter (see the analysis doc, §5). Just fill the
frontmatter well.

---

## 3. Writing style

- **Voice: first-person plural ("we"),** as the RRG Tech team. "These are the patterns we
  keep coming back to." Never "I"; avoid faceless passive voice.
- **Pragmatic and opinionated.** Take a clear position and justify it from real project
  experience. Prefer "do X because Y" over surveying every option neutrally.
- **Concise.** Short paragraphs (2–4 sentences). Plain words. Cut throat-clearing
  ("In this article we will…"). Open with the substance.
- **Concrete.** Show, don't just tell: pair a claim with a code sample, table, or a
  wrong-way/right-way contrast.
- **Skimmable.** A reader scanning headings, callouts, and the closing checklist should get
  the gist.

### Length

Target **~400–900 words** of prose. The existing posts sit at the shorter end (~300–450,
1–3 min read) and are tightly scoped to a single idea. Go longer only with more substance,
never with filler — keep the density high.

---

## 4. Tone of voice

Knowledgeable peer, not lecturer or marketer. Confident but not boastful; helpful and
direct. Light, dry asides are fine ("The constraints are the feature."). Avoid hype,
buzzwords, and exclamation marks. The reader is a competent developer or designer.

---

## 5. Heading structure

- The `title` frontmatter **is the page `<h1>`**. **Never write an `#` H1 in the body.**
- **Body starts at `##` (H2).** Use **only `##` and `###`** — the table of contents parses
  H2/H3 only, so `####` (H4) will render but vanish from the TOC. Don't skip levels (no H3
  before its parent H2).
- Headings are **sentence case** and declarative/verb-led:
  "Server components are the default", "Focus is not optional", "Images need real alt text".
- Aim for **3–5 H2 sections**. A short closing section (often a checklist or "What's next")
  plus a one-paragraph wrap-up is the house pattern.

---

## 6. Internal linking strategy

- Use **root-relative markdown links**: `[get in touch](/book)`, `[our App Router
  post](/blog/building-with-the-nextjs-app-router)`. The link handler turns `/…` into a
  prefetched `next/link` automatically.
- **Link to the `/book` page once** as the closing CTA (see §10).
- **Cross-link 1–3 related posts** where genuinely relevant. Don't over-link — related posts
  are also surfaced automatically by shared tags/category.
- For in-page jumps use `#heading-slug` anchors (slugs match the heading text).
- External links open in a safe new tab automatically — just write a normal markdown link.
- **Every internal `/blog/<slug>` link must resolve to a real file.** The validator checks this.

---

## 7. Image usage rules

- Prefer markdown images `![alt text](/images/blog/<file>.png)` — they're rendered through
  the optimized `BlogImage`. Use `<BlogImage>` directly when you need explicit
  `width`/`height` (intrinsic sizing) or a `className`.
- **`alt` is mandatory.** Describe the image's *purpose*. Use `alt=""` **only** for purely
  decorative images.
- Store images under `public/images/blog/`. Reference them with a root-relative path
  (`/images/blog/...`). Run `npm run optimize-images` style conversion where it helps.
- Without `width`/`height`, `BlogImage` fills a 16:9 frame (no layout shift). Provide both
  dimensions for non-16:9 images to avoid cropping.
- `coverImage` (frontmatter) is the hero/JSON-LD image and is optional — the social share
  card is generated automatically and does not require it.

---

## 8. MDX component usage rules

Allowed components (the **complete** set — anything else fails to compile or renders an
undefined tag):

| Component     | When to use                                              |
| ------------- | -------------------------------------------------------- |
| `<Note>`      | A neutral aside or piece of context.                     |
| `<Info>`      | Neutral supplementary detail.                            |
| `<Tip>`       | A best-practice nudge ("do this").                       |
| `<Warning>`   | A gotcha, footgun, or "don't do this."                   |
| `<Callout type="…">` | Generic form; prefer the named shortcuts above.   |
| `<BlogImage>` | Content image needing explicit dimensions / class.       |

Rules:

- Use **1–3 callouts** per post, where they add value — don't decorate every section.
- All four callouts accept an optional `title`; default labels are the type name.
- Callout content is markdown — keep it to a sentence or two.
- **Links and code blocks use plain markdown**, not components. Always tag code fences with
  a language (` ```tsx `, ` ```ts `, ` ```css `, ` ```html `, ` ```bash `). Untagged code
  falls back to plaintext.
- Don't import anything, and don't use raw HTML beyond what GFM/MDX supports. No `<script>`,
  `<style>`, or custom JSX components outside the list above.

### Worked example

```mdx
## Server components are the default

Push `'use client'` as far down the tree as possible.

```tsx
export default async function Dashboard() {
  const stats = await getStats(); // runs on the server
  return <LiveChart initial={stats} />;
}
```

<Warning>
A `'use client'` directive is contagious downward — every imported component becomes
client code too.
</Warning>
```

---

## 9. FAQ section

End substantive posts with an FAQ — it improves SEO (a `FAQPage` JSON-LD block is generated
automatically from this section) and answers common reader questions.

- Add a single H2 titled exactly **`## Frequently Asked Questions`**.
- Each question is an **`###` (H3)** heading phrased as a real question.
- Each answer is **1–3 sentences** of plain prose directly under the question.
- Include **2–5 questions.** Keep answers self-contained (they're extracted into structured
  data, so don't rely on surrounding context).

```mdx
## Frequently Asked Questions

### Do I need a database to run this blog?

No. Posts are MDX files in the repo, compiled at build time by Contentlayer — there's no
database or admin panel.

### How long until a new post goes live?

Pages revalidate hourly (ISR), so a published post appears within the hour without a manual
redeploy.
```

---

## 10. Closing CTA

Finish with one conversational CTA linking to `/book`, in the final paragraph (the FAQ, if
present, comes before it or after — keep the CTA as the last line). Match the house style:

> If you're building something ambitious and want a partner who sweats these details,
> [get in touch](/book).

Don't use buttons, banners, or multiple CTAs.

---

## 11. Content quality checklist

Before setting `published: true`, confirm:

- [ ] Required frontmatter present: `title`, `description`, `date`.
- [ ] `title` ≤ 60 chars; `description` 120–160 chars; 3–6 reused `tags`; `category` set.
- [ ] Filename is lowercase-kebab-case and matches the intended URL.
- [ ] Body starts at `##`; only H2/H3 used; no level skips; no body `#` H1.
- [ ] Written in the "we" voice; pragmatic, concise, concrete.
- [ ] At least one code block (language-tagged), table, or wrong/right contrast where useful.
- [ ] 1–3 callouts, used meaningfully (not decoration).
- [ ] All images have meaningful `alt` (or `alt=""` if decorative); stored under `/images/blog/`.
- [ ] Internal `/blog/<slug>` links resolve to real posts; 1–3 relevant cross-links.
- [ ] FAQ section present (`## Frequently Asked Questions`, H3 questions) for substantive posts.
- [ ] Single closing `/book` CTA in the house style.
- [ ] `npm run validate-blog -- <slug>` passes with no errors.
- [ ] Previewed with `npm run dev`.
