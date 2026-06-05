import { cn } from '@/shared/utils';
import { siteConfig } from '@/lib/site';

// Locale-aware, UTC-pinned so server and client render identically (no hydration drift).
const dateFormatter = new Intl.DateTimeFormat(siteConfig.locale.replace('_', '-'), {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

interface PostMetaProps {
  date: string;
  readingTime?: string;
  author?: string;
  className?: string;
  linkAuthor?: boolean;
}

const Dot = () => <span aria-hidden="true">·</span>;

/** Byline row: author · date · reading time. */
export default function PostMeta({ date, readingTime, author, className, linkAuthor = true }: PostMetaProps) {
  const d = new Date(date);
  return (
    <div className={cn('flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-text-1/55', className)}>
      {author && (
        <>
          {linkAuthor ? (
            <a
              href={siteConfig.blogAuthor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-text-1"
            >
              {author}
            </a>
          ) : (
            <span>{author}</span>
          )}
          <Dot />
        </>
      )}
      <time dateTime={d.toISOString()}>{dateFormatter.format(d)}</time>
      {readingTime && (
        <>
          <Dot />
          <span>{readingTime}</span>
        </>
      )}
    </div>
  );
}
