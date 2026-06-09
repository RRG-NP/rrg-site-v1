import type { Blog } from '@/lib/blog';
import { getAllPosts } from '@/lib/blog';
import { siteConfig, absoluteUrl } from '@/lib/site';

// Public, cacheable JSON - safe to expose cross-origin so other sites can fetch it.
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

/** Parse a positive-int query param, clamped to [min, max]; falls back when absent/invalid. */
function clampInt(raw: string | null, min: number, max: number, fallback: number): number {
  const n = Number.parseInt(raw ?? '', 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(Math.max(n, min), max);
}

/** Public, link-ready representation of a post for syndication. */
function serialize(post: Blog) {
  return {
    title: post.title,
    slug: post.slug,
    // Absolute link to the article on the RRG blog.
    url: absoluteUrl(post.url),
    description: post.seoDescription || post.description,
    date: new Date(post.date).toISOString(),
    updated: new Date(post.updated || post.date).toISOString(),
    readingTime: post.readingTime,
    tags: post.tags,
    category: post.category ?? null,
    author: post.author,
    featured: post.featured,
    // 1200x630 social card generated per post (always available).
    ogImage: absoluteUrl(`${post.url}/opengraph-image`),
    // Author-supplied cover image, when one is set; otherwise null.
    coverImage: post.coverImage ? absoluteUrl(post.coverImage) : null,
  };
}

/**
 * Public, paginated blog index for syndication on other sites (e.g. a personal
 * portfolio). Returns published posts newest first, with absolute URLs.
 *
 *   GET /api/blog                 → page 1, 12 per page
 *   GET /api/blog?page=2&limit=6  → second page of 6
 *
 * `limit` is clamped to 1–50; `page` is clamped to 1–totalPages.
 */
export function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const all = getAllPosts();
  const total = all.length;
  const perPage = clampInt(searchParams.get('limit'), 1, MAX_LIMIT, DEFAULT_LIMIT);
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const page = clampInt(searchParams.get('page'), 1, totalPages, 1);

  const start = (page - 1) * perPage;
  const posts = all.slice(start, start + perPage).map(serialize);

  const apiBase = `${siteConfig.url}/api/blog`;
  const pageUrl = (p: number) => `${apiBase}?page=${p}&limit=${perPage}`;
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return Response.json(
    {
      site: {
        name: siteConfig.name,
        url: siteConfig.url,
        blog: `${siteConfig.url}${siteConfig.blogPath}`,
      },
      pagination: {
        page,
        perPage,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null,
        next: hasNextPage ? pageUrl(page + 1) : null,
        prev: hasPrevPage ? pageUrl(page - 1) : null,
      },
      posts,
    },
    {
      headers: {
        ...CORS_HEADERS,
        // Each ?page/?limit variant is cached independently by the CDN.
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      },
    },
  );
}

/** CORS preflight (harmless for simple GETs, but lets stricter clients through). */
export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
