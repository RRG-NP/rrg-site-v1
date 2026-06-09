import { allBlogs, type Blog } from 'contentlayer/generated';

export type { Blog };

/** One entry in a post's table of contents (computed in contentlayer.config.ts). */
export type TocHeading = {
  level: number;
  text: string;
  slug: string;
};

/** Lightweight post shape for cards/lists - excludes the heavy compiled MDX body. */
export type PostSummary = Pick<
  Blog,
  | 'slug'
  | 'url'
  | 'title'
  | 'description'
  | 'date'
  | 'updated'
  | 'readingTime'
  | 'tags'
  | 'category'
  | 'coverImage'
  | 'featured'
  | 'author'
>;

export function toSummary(post: Blog): PostSummary {
  const { slug, url, title, description, date, updated, readingTime, tags, category, coverImage, featured, author } =
    post;
  return { slug, url, title, description, date, updated, readingTime, tags, category, coverImage, featured, author };
}

const byNewest = (a: Blog, b: Blog) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();

/** All published posts, newest first. The single ordering used everywhere. */
export function getAllPosts(): Blog[] {
  return allBlogs.filter((post) => post.published).sort(byNewest);
}

export function getFeaturedPosts(): Blog[] {
  return getAllPosts().filter((post) => post.featured);
}

export function getPostBySlug(slug: string): Blog | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

/** Tags across all published posts with their frequency, most common first. */
export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/**
 * Posts most similar to the given one, scored by shared tags (+ a bonus for the
 * same category). Falls back to the newest other posts so the section is never empty.
 */
export function getRelatedPosts(post: Blog, limit = 3): Blog[] {
  const others = getAllPosts().filter((p) => p.slug !== post.slug);
  const tagSet = new Set(post.tags);

  const scored = others
    .map((candidate) => {
      const sharedTags = candidate.tags.filter((t) => tagSet.has(t)).length;
      const categoryBonus =
        candidate.category && candidate.category === post.category ? 1 : 0;
      return { post: candidate, score: sharedTags * 2 + categoryBonus };
    })
    .sort((a, b) => b.score - a.score);

  const related = scored.filter((s) => s.score > 0).map((s) => s.post);
  if (related.length >= limit) return related.slice(0, limit);

  // Top up with the newest remaining posts when there aren't enough matches.
  const remaining = others.filter((p) => !related.includes(p));
  return [...related, ...remaining].slice(0, limit);
}

/** Older ("previous") and newer ("next") neighbours in chronological order. */
export function getAdjacentPosts(slug: string): {
  previous: Blog | null;
  next: Blog | null;
} {
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) return { previous: null, next: null };
  return {
    next: index > 0 ? posts[index - 1] : null,
    previous: index < posts.length - 1 ? posts[index + 1] : null,
  };
}

/** Typed access to the computed `headings` JSON field. */
export function getPostHeadings(post: Blog): TocHeading[] {
  return (post.headings as TocHeading[] | undefined) ?? [];
}
