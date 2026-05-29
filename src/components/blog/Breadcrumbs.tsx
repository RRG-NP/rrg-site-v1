import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/shared/utils';

interface Crumb {
  name: string;
  href?: string;
}

/** Visual breadcrumb trail. The matching JSON-LD is emitted by the post page. */
export default function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-text-1/50">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.name} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="transition-colors hover:text-text-1">
                  {item.name}
                </Link>
              ) : (
                <span className={cn(isLast && 'truncate text-text-1/80')} aria-current={isLast ? 'page' : undefined}>
                  {item.name}
                </span>
              )}
              {!isLast && <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
