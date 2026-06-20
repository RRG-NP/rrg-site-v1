# Daily blog routine

This is the playbook the scheduled agent runs every morning. It generates one publish-ready
post and **commits + pushes it directly to `main`** - no PR, no manual review. The site
builds from `main` (ISR, hourly), so the post goes live within ~1 hour of the push.

Work from the repo root. If any step fails, stop and report the failure (don't push a broken
post).

## Steps

1. **Sync main.**
   ```bash
   git checkout main && git pull --ff-only
   ```

2. **Pick the next topic.**
   ```bash
   node scripts/next-blog-topic.mjs
   ```
   Capture the printed topic as `$TOPIC`. If the script exits 2 ("backlog empty"), stop and
   report that the backlog needs new topics - do not invent one.

3. **Scaffold a publish-ready file.**
   ```bash
   npm run generate-blog -- --publish "$TOPIC"
   ```
   Note the printed slug as `$SLUG` and the file `content/blogs/$SLUG.mdx`.

4. **Write the article.** Open `content/blogs/$SLUG.mdx` and write the full post by following
   the **five-step routine** in `prompts/blog-generator.md` (research → angle → outline →
   write → review) and `docs/blog-writing-guide.md` exactly:
   - **Research first:** search the web for 2-3 current sources; pull real numbers and the
     angle (what the reader believes vs. reality) before drafting.
   - Refine the scaffolded `title` into a clean, ≤60-char headline (sentence case).
   - Replace the TODO `description` (120–160 chars) and `tags` (3–6 from the vocabulary);
     pick the right `category`.
   - First-person engineer persona, 500–1000 words, one core idea, no AI-slop phrases.
   - **Plain ASCII punctuation - no em or en dashes (`—`/`–`); use a hyphen `-`.**
   - Use allowed MDX components only; FAQ section; 1–3 real internal links to existing posts;
     one closing `/book` CTA.
   - **Review pass:** every section adds something, every claim has a number/example, the hook
     earns the click; cut anything a busy reader would bail on.
   - Leave `published: true` (already set by `--publish`).

5. **Validate - this is the gate.**
   ```bash
   npm run validate-blog -- $SLUG
   ```
   Fix any **errors** and re-run until it passes with 0 errors. Clear the AI-slop/length
   **warnings** too. Do not continue while errors remain.

6. **Retire the topic.**
   ```bash
   node scripts/next-blog-topic.mjs --done "$TOPIC"
   ```

7. **Commit on `main`.** Stay on `main` (from step 1) - do **not** create a branch.
   ```bash
   git add "content/blogs/$SLUG.mdx" prompts/blog-topics.md
   git commit -m "blog: $TITLE"
   ```
   (`$TITLE` = the final title from the frontmatter.) **Do not add a `Co-Authored-By` or
   "Generated with" trailer** - the commit is authored by the repo's configured git user
   only.

8. **Push to `main`.**
   ```bash
   git push origin main
   ```

9. **Report** the title, the file path, and the validator summary, and confirm the push to
   `main`. The post goes live within ~1 hour (ISR); Facebook sharing (when wired) fires on
   push.

## Guardrails
- Push to `main` is the publish step - that's expected. Never open a PR, never `git merge`
  by hand, never deploy manually, never rewrite `main`'s history.
- Commit as the repo's git user only - no `Co-Authored-By` / "Generated with" trailer.
- One post per run. If the slug already exists, `generate-blog` will refuse - pick the next
  topic instead and report the skip.
- If validation can't reach 0 errors after a couple of honest attempts, push nothing and
  report the problem.
