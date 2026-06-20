# Daily blog routine

This is the playbook the scheduled agent runs every morning. It generates one publish-ready
post and opens a **PR for a human to merge** - it never merges or deploys itself. Merging the
PR is what puts the post online (the site builds from `main`).

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

7. **Branch, commit, push.** Use a unique, dated branch name:
   ```bash
   DATE=$(date +%Y-%m-%d)
   git checkout -b "blog/$DATE-$SLUG"
   git add "content/blogs/$SLUG.mdx" prompts/blog-topics.md
   git commit -m "blog: $TITLE"
   git push -u origin "blog/$DATE-$SLUG"
   ```
   (`$TITLE` = the final title from the frontmatter.)

8. **Open a PR (do not merge).**
   ```bash
   gh pr create \
     --title "blog: $TITLE" \
     --body "Automated daily draft for $DATE. Topic: $TOPIC.

   - Validated: \`npm run validate-blog -- $SLUG\` passed (0 errors).
   - published: true - merging this PR puts it live at /blog/$SLUG.
   - Please skim for voice and accuracy before merging." \
     --base main
   ```

9. **Report** the PR URL, the title, and the validator summary. Stop. A human reviews and
   merges; Facebook sharing (when wired) fires on merge.

## Guardrails
- Never run `gh pr merge`, never push to `main`, never deploy.
- One post per run. If the slug already exists, `generate-blog` will refuse - pick the next
  topic instead and report the skip.
- If validation can't reach 0 errors after a couple of honest attempts, push nothing and
  report the problem.
