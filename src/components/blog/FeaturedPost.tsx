import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import PostMeta from './PostMeta';
import TagBadge from './TagBadge';
import type { PostSummary } from '@/lib/blog';

/** Large text-first hero card for the most prominent (featured) post. */
export default function FeaturedPost({ post }: { post: PostSummary }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-gray-1 bg-bg-2/30 transition-colors duration-300 hover:border-stroke">
      {/* Ambient glow sweeping in from the corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[15%] -top-[60%] h-[150%] w-[55%] rounded-full bg-primary/[0.07] blur-[100px]"
      />

      <Link
        href={post.url}
        className="relative flex flex-col gap-5 rounded-3xl p-7 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary sm:p-10 lg:p-12"
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Featured
          </span>
          {post.category && (
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-text-1/50">{post.category}</span>
          )}
        </div>

        <h2 className="max-w-3xl bg-gradient-to-b from-white via-white to-primary bg-clip-text text-3xl font-black leading-[1.08] tracking-tight text-transparent sm:text-4xl lg:text-5xl">
          {post.title}
        </h2>

        <p className="line-clamp-3 max-w-2xl text-base leading-relaxed text-text-1/60 sm:text-lg">{post.description}</p>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-1/60 pt-5">
          <PostMeta date={post.date} readingTime={post.readingTime} author={post.author} linkAuthor={false} />
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-primary">
            Read article
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </Link>
    </article>
  );
}
