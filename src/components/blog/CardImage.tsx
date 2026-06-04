'use client';

import { useState } from 'react';
import Image from 'next/image';

import { cn } from '@/shared/utils';

interface CardImageProps {
  src: string;
  sizes: string;
  /** Eager-load for above-the-fold images (e.g. the featured hero). */
  priority?: boolean;
  /** Extra classes for the <Image> (e.g. group-hover zoom). */
  className?: string;
}

/**
 * Cover image with a built-in shimmer loader. The on-brand gradient pulses while
 * the image is fetched, then the image fades in over it once loaded.
 */
export default function CardImage({ src, sizes, priority, className }: CardImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-0 bg-gradient-to-br from-bg-2 via-stroke/30 to-primary/15 transition-opacity duration-700',
          loaded ? 'opacity-0' : 'animate-pulse opacity-100',
        )}
      />
      <Image
        src={src}
        alt=""
        fill
        priority={priority}
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        className={cn(
          'object-cover transition-[transform,opacity] duration-500',
          loaded ? 'opacity-100' : 'opacity-0',
          className,
        )}
      />
    </>
  );
}
