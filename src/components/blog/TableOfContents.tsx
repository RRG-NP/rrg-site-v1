'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/shared/utils';
import type { TocHeading } from '@/lib/blog';

/** Sticky table of contents with scroll-spy highlighting of the current section. */
export default function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      // Activate a heading once it passes below the fixed header, until it's well above the fold.
      { rootMargin: '-80px 0px -70% 0px', threshold: [0, 1] },
    );

    const nodes = headings
      .map((h) => document.getElementById(h.slug))
      .filter((el): el is HTMLElement => el !== null);
    nodes.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-1/50">On this page</p>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li key={heading.slug}>
            <a
              href={`#${heading.slug}`}
              className={cn(
                'block border-l-2 py-1 pr-2 leading-snug transition-colors hover:text-text-1',
                heading.level === 3 ? 'pl-6' : 'pl-3',
                activeId === heading.slug
                  ? 'border-primary font-medium text-primary'
                  : 'border-gray-1 text-text-1/55',
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
