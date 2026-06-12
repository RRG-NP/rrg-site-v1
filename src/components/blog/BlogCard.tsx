import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import PostMeta from './PostMeta';
import { cn } from '@/shared/utils';
import type { PostSummary } from '@/lib/blog';

/**
 * Text-first article card. Covers are intentionally omitted: most posts fall back
 * to the auto-generated OG image, which already contains the title.
 */
export default function BlogCard({ post, className }: { post: PostSummary; className?: string }) {
  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-gray-1 bg-bg-2/30 transition-colors duration-300 hover:border-stroke hover:bg-bg-2/60',
        className,
      )}
    >
      {/* Accent bar grows from the top edge on hover - same motif as the service rows */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-[1] h-full w-[2px] origin-top scale-y-0 bg-primary transition-transform duration-500 ease-out group-hover:scale-y-100"
      />

      <Link
        href={post.url}
        className="flex h-full flex-col gap-3.5 rounded-2xl p-6 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
      >
        <div className="flex items-start justify-between gap-4">
          <span className="pt-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {post.category || 'Article'}
          </span>
          <span
            aria-hidden
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-stroke/70 text-text-1/60 transition-all duration-500 group-hover:border-primary group-hover:bg-primary group-hover:text-bg-1"
          >
            <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-[1px] group-hover:translate-x-[1px]" />
          </span>
        </div>

        <h3 className="text-xl font-bold leading-snug tracking-tight text-text-1 transition-colors duration-300 group-hover:text-primary">
          {post.title}
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-text-1/55">{post.description}</p>

        <PostMeta date={post.date} readingTime={post.readingTime} className="mt-auto border-t border-gray-1/60 pt-4" />
      </Link>
    </article>
  );
}
