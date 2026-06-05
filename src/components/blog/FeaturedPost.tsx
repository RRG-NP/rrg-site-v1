import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import CardImage from './CardImage';
import PostMeta from './PostMeta';
import TagBadge from './TagBadge';
import type { PostSummary } from '@/lib/blog';

/** Large hero card for the most prominent (featured) post. */
export default function FeaturedPost({ post }: { post: PostSummary }) {
  // Fall back to the auto-generated social card when no cover image is set.
  const cover = post.coverImage || `${post.url}/opengraph-image`;

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-gray-1 bg-bg-2/40 transition-colors hover:border-stroke">
      <Link
        href={post.url}
        className="grid rounded-3xl focus:outline-none focus-visible:ring-1 focus-visible:ring-primary lg:grid-cols-2"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden lg:aspect-auto lg:h-full">
          <CardImage src={cover} priority sizes="(max-width: 1024px) 100vw, 50vw" className="group-hover:scale-105" />
        </div>

        <div className="flex flex-col justify-center gap-4 p-6 sm:p-8 lg:p-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Featured
            </span>
            {post.category && (
              <span className="text-xs font-medium uppercase tracking-wider text-text-1/50">{post.category}</span>
            )}
          </div>

          <h2 className="text-2xl font-extrabold leading-tight text-text-1 transition-colors group-hover:text-primary sm:text-3xl">
            {post.title}
          </h2>
          <p className="line-clamp-3 text-text-1/65">{post.description}</p>

          <PostMeta date={post.date} readingTime={post.readingTime} author={post.author} linkAuthor={false} />

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          )}

          <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary">
            Read article
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </Link>
    </article>
  );
}
