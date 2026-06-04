import Link from 'next/link';
import { cn } from '@/shared/utils';

interface TagBadgeProps {
  tag: string;
  href?: string;
  active?: boolean;
  className?: string;
}

/** Small pill for a tag. Renders as a link when `href` is provided, else a span. */
export default function TagBadge({ tag, href, active = false, className }: TagBadgeProps) {
  const base = cn(
    'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors',
    active
      ? 'border-primary bg-primary/15 text-primary'
      : 'border-stroke text-text-1/70 hover:border-primary/60 hover:text-text-1',
    className,
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn(base, 'focus:outline-none focus-visible:ring-1 focus-visible:ring-primary')}
      >
        {tag}
      </Link>
    );
  }
  return <span className={base}>{tag}</span>;
}
