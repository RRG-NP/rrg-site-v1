# Blog Writing Guide

> The authoring rules for the RRG Tech blog. These are derived from the repository's
> actual schema, rendering code, and existing posts - not from generic blogging advice.
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
description: >-                                       # required - 120–160 chars, one benefit-led sentence
  Server components, streaming, and metadata done right. A pragmatic tour of the
  patterns we reach for on every App Router project.
date: 2026-05-10                                      # required - YYYY-MM-DD
updated: 2026-05-15                                   # optional - set when you materially revise
published: false                                      # false while drafting; true to publish
featured: false                                       # true only for a flagship post
category: Engineering                                 # one of the established categories
tags:                                                 # 3–6 tags from the shared vocabulary
  - Next.js
  - React
  - Performance
author: RRG Tech                                      # defaults to "RRG Tech"
# Optional SEO overrides - usually omit; the defaults are good:
# seoTitle: ...
# seoDescription: ...
# coverImage: /images/blog/<slug>.jpg
# canonicalUrl: https://...                           # only when republishing from elsewhere
---
```

Rules:

- **Do not** add a `slug` field - the slug is the filename.
- **Do not** add computed fields (`url`, `readingTime`, `wordCount`, `headings`) - Contentlayer derives them.
- `date` must be `YYYY-MM-DD`. `published: false` is the default draft state and keeps the post
  out of listings, sitemap, RSS, related posts, and static generation.
- `featured: true` promotes the post into the featured slot - use sparingly (≈ one at a time).

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
| `category`       | Set it - it becomes `articleSection` in structured data and shows on the OG card.     |
| `seoTitle` / `seoDescription` | Optional overrides. Only add when the on-page title/description aren't ideal for search. |
| `canonicalUrl`   | Only when the post is republished from another canonical source.                      |
| `coverImage`     | Optional. **Not needed for the social card** - that's auto-generated per post.        |

You never write OG images, JSON-LD, sitemap entries, or canonical tags by hand - the
framework generates all of them from frontmatter (see the analysis doc, §5). Just fill the
frontmatter well.

**SEO supports readability - never the reverse.** Priority order: (1) helpful content,
(2) human readability, (3) search optimization. No keyword stuffing; write the title,
description, and headings for a person first.

---

## 3. Audience, voice & reading time

### Who you're writing for

Developers, founders, technical professionals, curious learners, and people with **little
or no prior knowledge** of the topic. Assume a smart reader skimming on a coffee break.

- Avoid unnecessary jargon. When you must use a technical term, explain it in a few plain
  words the first time.
- Anyone in the audience should be able to follow the post start to finish without looking
  things up.

### Reading time & length

Target **2–5 minutes** - usually **500–1000 words**.

- Focus on **one core idea**. Cut filler; every section must earn its place.
- Don't pad to hit a length. A tight 600-word post beats a baggy 1,200-word one.

### Voice & persona

Write as **one person**: a 27-year-old Nepali software engineer with 6+ years of
professional experience. Practical, curious, honest, experienced, self-aware, friendly,
direct, occasionally opinionated - never arrogant.

> **Note - this supersedes the older "we" convention.** The three legacy posts used a
> first-person-plural team voice. New posts use a **first-person individual** voice. The
> author shares lessons from real work, not textbook rules:
>
> - Good: "I've shipped this in production," "I've watched this fail," "here's what I learned."
> - Avoid: "According to best practices…", faceless passive voice.

Keep paragraphs short (2–4 sentences), words plain, and open with the substance - no
throat-clearing. Show, don't just tell: back a claim with a code sample, a quick comparison,
or a real wrong-way/right-way contrast. (The `author` frontmatter can stay `RRG Tech` or be
a person's name; it doesn't change the writing voice.)

---

## 4. Tone, authenticity & avoiding AI slop

### Tone

Conversational, human, thoughtful, genuine - smart but approachable, like a real engineer
sharing what they've learned. Confident, not boastful. Light, dry asides are fine. **Avoid**
corporate/marketing language, buzzwords, overly formal prose, clickbait, and exclamation
marks.

### Anti-AI-slop rules

Do **not** use tell-tale AI filler. Banned phrases (non-exhaustive):

> in today's fast-paced world · it is important to note · it's worth mentioning · leveraging ·
> delve into · game changer · revolutionize · unlock the power of · seamlessly · robust ·
> comprehensive guide · cutting-edge · transformative · ever-evolving landscape

Also avoid:

- Template scaffolding repeated every article ("First… Second… Third… Finally…").
- Generic transitions (`Furthermore`, `Moreover`, `Additionally`, `In conclusion`) unless
  they genuinely fit.
- Anything that reads like it was filled into a template.

`npm run validate-blog` flags these phrases as warnings - clear them before publishing.

### Punctuation & characters (write like a human, not a model)

Models reach for typography people rarely type by hand. Keep the prose plain ASCII:

- **No em or en dashes (`—`, `–`). Use a plain hyphen `-`** - with a space on each side when
  you want an aside ("the fix - finally - stuck"). This is the single biggest "an AI wrote
  this" tell, so it's the one to get right.
- Don't just swap the character and keep the rhythm. If every other sentence still has a
  dash-clause interruption, vary the sentence shape instead.
- Prefer straight quotes (`'`, `"`) and write an ellipsis as three plain dots (`...`).

`npm run validate-blog` flags em/en dashes (in the body, title, and description) as a
warning - clear them before publishing.

### Authenticity

Include real-world observations, practical examples, your own reasoning, and honest
tradeoffs. When you discuss a tool/framework, cover **why you'd use it, when it works well,
when it doesn't, and the common mistakes**. No blind praise.

### Creativity - find an angle

Every post needs a unique angle, not just a concept dump. Pick one: a lesson learned, a
mistake made, a surprising discovery, an unpopular opinion, a practical shortcut, a
real-world use case, or a comparison. Aim to be worth reading **even for someone who already
knows the topic**.

### Examples & analogies

Prefer concrete examples (real projects, startup situations, developer workflows) and
everyday analogies over abstract description.

- Good: "Using a monolith for a tiny startup is like renting a warehouse to store one bicycle."
- Bad: "Monolithic architectures have both advantages and disadvantages."

---

## 4b. Article type & structure

Pick the type that fits the idea before you write; each has a natural shape.

- **How-to** - Intro (hook · the problem · why it matters) → step-by-step walkthrough →
  conclusion (recap · lesson learned · a practical next step).
- **Explainer** - Intro (hook · why it matters) → concepts explained simply with examples
  tied to real life → conclusion (key takeaway · what to explore next).
- **Opinion / thought-leadership** - Intro (clear viewpoint · why it matters) → arguments,
  examples, tradeoffs, counterpoints → conclusion (final perspective · invite discussion).
- **Listicle** - Intro (why the list matters) → items (each with explanation, a practical
  example, and a personal insight where possible) → conclusion (favorite takeaway · a reader
  action).

These map onto the heading rules below - the intro is prose before the first `##`, each
phase/step/concept/item is an `##` (or `###`) section.

---

## 5. Heading structure

- The `title` frontmatter **is the page `<h1>`**. **Never write an `#` H1 in the body.**
- **Body starts at `##` (H2).** Use **only `##` and `###`** - the table of contents parses
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
- **Cross-link 1–3 related posts** where genuinely relevant. Don't over-link - related posts
  are also surfaced automatically by shared tags/category.
- For in-page jumps use `#heading-slug` anchors (slugs match the heading text).
- External links open in a safe new tab automatically - just write a normal markdown link.
- **Every internal `/blog/<slug>` link must resolve to a real file.** The validator checks this.

---

## 7. Image usage rules

- Prefer markdown images `![alt text](/images/blog/<file>.png)` - they're rendered through
  the optimized `BlogImage`. Use `<BlogImage>` directly when you need explicit
  `width`/`height` (intrinsic sizing) or a `className`.
- **`alt` is mandatory.** Describe the image's *purpose*. Use `alt=""` **only** for purely
  decorative images.
- Store images under `public/images/blog/`. Reference them with a root-relative path
  (`/images/blog/...`). Run `npm run optimize-images` style conversion where it helps.
- Without `width`/`height`, `BlogImage` fills a 16:9 frame (no layout shift). Provide both
  dimensions for non-16:9 images to avoid cropping.
- `coverImage` (frontmatter) is the hero/JSON-LD image and is optional - the social share
  card is generated automatically and does not require it.

---

## 8. MDX component usage rules

Allowed components (the **complete** set - anything else fails to compile or renders an
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

- Use **1–3 callouts** per post, where they add value - don't decorate every section.
- All four callouts accept an optional `title`; default labels are the type name.
- Callout content is markdown - keep it to a sentence or two.
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
A `'use client'` directive is contagious downward - every imported component becomes
client code too.
</Warning>
```

---

## 9. FAQ section

End substantive posts with an FAQ - it improves SEO (a `FAQPage` JSON-LD block is generated
automatically from this section) and answers common reader questions.

- Add a single H2 titled exactly **`## Frequently Asked Questions`**.
- Each question is an **`###` (H3)** heading phrased as a real question.
- Each answer is **1–3 sentences** of plain prose directly under the question.
- Include **2–5 questions.** Keep answers self-contained (they're extracted into structured
  data, so don't rely on surrounding context).

```mdx
## Frequently Asked Questions

### Do I need a database to run this blog?

No. Posts are MDX files in the repo, compiled at build time by Contentlayer - there's no
database or admin panel.

### How long until a new post goes live?

Pages revalidate hourly (ISR), so a published post appears within the hour without a manual
redeploy.
```

---

## 10. Closing CTA

Finish with one conversational CTA linking to `/book`, in the final paragraph (the FAQ, if
present, comes before it or after - keep the CTA as the last line). Match the house style:

> If you're building something ambitious and want a partner who sweats these details,
> [get in touch](/book).

Don't use buttons, banners, or multiple CTAs.

---

## 11. Content quality checklist

Before setting `published: true`, confirm:

**Mechanics**

- [ ] Required frontmatter present: `title`, `description`, `date`.
- [ ] `title` ≤ 60 chars; `description` 120–160 chars; 3–6 reused `tags`; `category` set.
- [ ] Filename is lowercase-kebab-case and matches the intended URL.
- [ ] Body starts at `##`; only H2/H3 used; no level skips; no body `#` H1.
- [ ] At least one code block (language-tagged), table, or wrong/right contrast where useful.
- [ ] 1–3 callouts, used meaningfully (not decoration).
- [ ] All images have meaningful `alt` (or `alt=""` if decorative); stored under `/images/blog/`.
- [ ] Internal `/blog/<slug>` links resolve to real posts; 1–3 relevant cross-links.
- [ ] FAQ section present (`## Frequently Asked Questions`, H3 questions) for substantive posts.
- [ ] Single closing `/book` CTA in the house style.
- [ ] `npm run validate-blog -- <slug>` passes with no errors.
- [ ] Previewed with `npm run dev`.

**Voice & substance** - answer honestly; if any is "no", revise before saving:

- [ ] Does this sound like a real engineer wrote it (first-person, lived experience)?
- [ ] Would I personally publish this? Does it sound human?
- [ ] Does it avoid the AI clichés in §4 (validator warnings cleared)?
- [ ] Is every section useful, with no filler? One core idea?
- [ ] Can a non-expert follow it, with jargon explained?
- [ ] Would someone finish it in under 5 minutes (~500–1000 words)?
- [ ] Does it offer a unique angle (lesson, mistake, opinion, comparison) - worth reading
      even for someone who knows the topic?
- [ ] Honest tradeoffs included, not blind praise?

> The goal isn't to generate content. It's to publish posts that feel authentic, useful, and
> genuinely written by an experienced engineer sharing what they've learned.
