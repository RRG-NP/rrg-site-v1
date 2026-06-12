'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Search, X } from 'lucide-react';

import BlogCard from './BlogCard';
import FeaturedPost from './FeaturedPost';
import { cn } from '@/shared/utils';
import type { PostSummary } from '@/lib/blog';

const PAGE_SIZE = 6;

interface BlogIndexProps {
  /** All published posts except the featured hero, newest first. */
  posts: PostSummary[];
  /** The featured post shown as a hero (when not searching/filtering). */
  featured: PostSummary | null;
  tags: string[];
}

function matches(post: PostSummary, query: string, activeTags: string[]): boolean {
  if (activeTags.length > 0 && !activeTags.every((t) => post.tags.includes(t))) return false;
  if (!query) return true;
  const haystack = [post.title, post.description, post.category ?? '', post.tags.join(' ')]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

export default function BlogIndex({ posts, featured, tags }: BlogIndexProps) {
  const [query, setQuery] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') ?? '';
    const tagParam = params.get('tag');
    const urlTags = tagParam ? tagParam.split(',').filter((t) => tags.includes(t)) : [];
    if (q) setQuery(q);
    if (urlTags.length > 0) setActiveTags(urlTags);
  }, [tags]);

  const didMount = useRef(false);
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    const params = new URLSearchParams();
    const q = query.trim();
    if (q) params.set('q', q);
    if (activeTags.length > 0) params.set('tag', activeTags.join(','));
    const qs = params.toString();
    window.history.replaceState(null, '', qs ? `${window.location.pathname}?${qs}` : window.location.pathname);
  }, [query, activeTags]);

  const isFiltering = query.trim().length > 0 || activeTags.length > 0;

  const filtered = useMemo(
    () => posts.filter((post) => matches(post, query.trim(), activeTags)),
    [posts, query, activeTags],
  );

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const toggleTag = (tag: string) => {
    setVisibleCount(PAGE_SIZE);
    setActiveTags((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag],
    );
  };

  const clearFilters = () => {
    setQuery('');
    setActiveTags([]);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Search + tag filters */}
      <div className="flex flex-col gap-5">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-1/40"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder="Search articles…"
            aria-label="Search articles"
            className="w-full rounded-full border border-stroke/60 bg-white/[0.03] py-3 pl-12 pr-4 text-text-1 transition-colors placeholder:text-text-1/30 hover:border-stroke focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => {
              const active = activeTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  aria-pressed={active}
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-primary',
                    active
                      ? 'border-primary bg-primary/15 text-primary'
                      : 'border-stroke text-text-1/70 hover:border-primary/60 hover:text-text-1',
                  )}
                >
                  {tag}
                </button>
              );
            })}
            {isFiltering && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-text-1/50 transition-colors hover:text-text-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Featured hero - only when browsing the full list */}
      {!isFiltering && featured && <FeaturedPost post={featured} />}

      {/* Results */}
      {filtered.length > 0 ? (
        <div>
          {isFiltering && (
            <p className="mb-5 text-sm text-text-1/50" role="status" aria-live="polite">
              {filtered.length} {filtered.length === 1 ? 'article' : 'articles'} found
            </p>
          )}
          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((post) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
              >
                <BlogCard post={post} className="h-full" />
              </motion.div>
            ))}
          </motion.div>

          {hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="rounded-full border border-stroke px-7 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-text-1/80 transition-colors duration-300 hover:border-primary/70 hover:text-text-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-1 py-16 text-center">
          <p className="text-lg font-semibold text-text-1">No articles found</p>
          <p className="mt-1 text-sm text-text-1/50">Try a different search term or clear your filters.</p>
          {isFiltering && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-full border border-stroke px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-text-1/80 transition-colors duration-300 hover:border-primary/70 hover:text-text-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
