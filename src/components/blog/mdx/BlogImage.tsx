import Image from 'next/image';
import { cn } from '@/shared/utils';

interface BlogImageProps {
  src: string;
  /** Required: describe the image's purpose. Use "" only for decorative images. */
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Optimized image for MDX content. When intrinsic dimensions are known they are
 * used directly; otherwise the image fills a 16:9 frame (object-cover) so layout
 * stays stable and there's no CLS. Lazy-loaded by default via next/image.
 */
export default function BlogImage({ src, alt, width, height, className }: BlogImageProps) {
  if (width && height) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 768px) 100vw, 768px"
        className={cn('my-7 h-auto w-full rounded-2xl border border-gray-1', className)}
      />
    );
  }

  return (
    <span className={cn('my-7 block overflow-hidden rounded-2xl border border-gray-1', className)}>
      <span className="relative block aspect-video">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
      </span>
    </span>
  );
}
