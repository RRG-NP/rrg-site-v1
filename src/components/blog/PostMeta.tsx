import { format } from 'date-fns';
import { cn } from '@/shared/utils';

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
  return (
    <div className={cn('flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-text-1/55', className)}>
      {author && (
        <>
          <span>{author}</span>
          <Dot />
        </>
      )}
      <time dateTime={d.toISOString()}>{format(d, 'MMM d, yyyy')}</time>
      {readingTime && (
        <>
          <Dot />
          <span>{readingTime}</span>
        </>
      )}
    </div>
  );
}
