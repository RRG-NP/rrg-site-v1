import Image from 'next/image';
import Link from 'next/link';

import PostMeta from './PostMeta';
import { cn } from '@/shared/utils';
import type { PostSummary } from '@/lib/blog';

/** Cover image, or an on-brand gradient placeholder when none is set. */
function Cover({ src, title }: { src?: string; title: string }) {
  if (!src) {
    return (
      <div className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-bg-2 via-stroke/40 to-primary/20 p-6">
        <span className="text-center text-sm font-semibold uppercase tracking-widest text-text-1/40">{title}</span>
      </div>
    );
  }
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden">
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
}

export default function BlogCard({ post, className }: { post: PostSummary; className?: string }) {
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
        <Cover src={post.coverImage} title={post.title} />
        <div className="flex flex-1 flex-col gap-3 p-5">
          {post.category && (
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">{post.category}</span>
          )}
          <h3 className="text-lg font-bold leading-snug text-text-1 transition-colors group-hover:text-primary">
            {post.title}
          </h3>
          <p className="line-clamp-2 text-sm text-text-1/60">{post.description}</p>
          <PostMeta date={post.date} readingTime={post.readingTime} className="mt-auto pt-2" />
        </div>
      </Link>
    </article>
  );
}
