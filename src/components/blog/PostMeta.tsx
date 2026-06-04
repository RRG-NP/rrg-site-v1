import { format } from 'date-fns';
import { cn } from '@/shared/utils';
import { siteConfig } from '@/lib/site';

interface PostMetaProps {
  date: string;
  readingTime?: string;
  author?: string;
  className?: string;
}

const Dot = () => <span aria-hidden="true">·</span>;

/** Byline row: author · date · reading time. */
export default function PostMeta({ date, readingTime, author, className }: PostMetaProps) {
  const d = new Date(date);
  const utcDay = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return (
    <div className={cn('flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-text-1/55', className)}>
      {author && (
        <>
          <a
            href={siteConfig.blogAuthor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-text-1"
          >
            {author}
          </a>
          <Dot />
        </>
      )}
      <time dateTime={d.toISOString()}>{format(utcDay, 'MMM d, yyyy')}</time>
      {readingTime && (
        <>
          <Dot />
          <span>{readingTime}</span>
        </>
      )}
    </div>
  );
}
