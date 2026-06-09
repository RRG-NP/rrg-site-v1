import Link from 'next/link';

import CardImage from './CardImage';
import PostMeta from './PostMeta';
import { cn } from '@/shared/utils';
import type { PostSummary } from '@/lib/blog';

export default function BlogCard({ post, className }: { post: PostSummary; className?: string }) {
  // Fall back to the auto-generated social card when no cover image is set.
  const cover = post.coverImage || `${post.url}/opengraph-image`;

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-gray-1 bg-bg-2/40 transition-colors hover:border-stroke',
        className,
      )}
    >
      <Link
        href={post.url}
        className="flex flex-1 flex-col rounded-2xl focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <CardImage
            src={cover}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
            className="object-fill group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          {post.category && (
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">{post.category}</span>
          )}
          {/* <h3 className="text-lg font-bold leading-snug text-text-1 transition-colors group-hover:text-primary">
            {post.title}
          </h3> */}
          <p className="line-clamp-2 text-sm text-text-1/60">{post.description}</p>
          <PostMeta date={post.date} readingTime={post.readingTime} className="mt-auto pt-2" />
        </div>
      </Link>
    </article>
  );
}
