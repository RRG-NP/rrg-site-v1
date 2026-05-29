import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import type { PostSummary } from '@/lib/blog';

interface PrevNextNavProps {
  previous: PostSummary | null;
  next: PostSummary | null;
}

/** Older/newer article navigation shown at the foot of a post. */
export default function PrevNextNav({ previous, next }: PrevNextNavProps) {
  if (!previous && !next) return null;

  return (
    <nav aria-label="More articles" className="grid gap-4 sm:grid-cols-2">
      {previous ? (
        <Link
          href={previous.url}
          className="group flex flex-col gap-1 rounded-2xl border border-gray-1 p-5 transition-colors hover:border-stroke focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
        >
          <span className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-text-1/50">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Previous
          </span>
          <span className="font-semibold text-text-1 transition-colors group-hover:text-primary">{previous.title}</span>
        </Link>
      ) : (
        <span aria-hidden="true" className="hidden sm:block" />
      )}

      {next && (
        <Link
          href={next.url}
          className="group flex flex-col items-end gap-1 rounded-2xl border border-gray-1 p-5 text-right transition-colors hover:border-stroke focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
        >
          <span className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-text-1/50">
            Next
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span className="font-semibold text-text-1 transition-colors group-hover:text-primary">{next.title}</span>
        </Link>
      )}
    </nav>
  );
}
