'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
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

  // Seed the tag filter from a `?tag=` deep link (e.g. clicked from a post).
  useEffect(() => {
    const tag = new URLSearchParams(window.location.search).get('tag');
    if (tag && tags.includes(tag)) setActiveTags([tag]);
  }, [tags]);

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
            className="w-full rounded-full border border-gray-1 bg-bg-2/40 py-3 pl-12 pr-4 text-text-1 placeholder:text-text-1/40 transition-colors focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary"
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

      {/* Featured hero — only when browsing the full list */}
      {!isFiltering && featured && <FeaturedPost post={featured} />}

      {/* Results */}
      {filtered.length > 0 ? (
        <div>
          {isFiltering && (
            <p className="mb-5 text-sm text-text-1/50" role="status" aria-live="polite">
              {filtered.length} {filtered.length === 1 ? 'article' : 'articles'} found
            </p>
          )}
          <motion.div
            layout
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {visible.map((post) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
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
                className="rounded-full border border-stroke px-6 py-2.5 text-sm font-medium text-text-1 transition-colors hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
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
              className="mt-5 rounded-full border border-stroke px-5 py-2 text-sm font-medium text-text-1 transition-colors hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
