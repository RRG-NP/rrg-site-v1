import Link from 'next/link';
import type { AnchorHTMLAttributes, ImgHTMLAttributes } from 'react';

import BlogImage from './BlogImage';
import CodeBlock from './CodeBlock';
import Callout, { Note, Info_, Tip, Warning } from './Callout';

/** Links: internal -> next/link (prefetch), in-page (#) -> plain anchor, external -> safe new tab. */
function MdxLink({ href = '', children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }
  if (href.startsWith('#')) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

function MdxImage({ src = '', alt = '', width, height }: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <BlogImage
      src={String(src)}
      alt={alt ?? ''}
      width={width ? Number(width) : undefined}
      height={height ? Number(height) : undefined}
    />
  );
}

/**
 * Element + custom-component map passed to the compiled MDX. Block-level
 * typography (headings, paragraphs, lists, tables, blockquotes) is styled via
 * the `.prose-rrg` rules in blog.scss; here we only override elements that need
 * behaviour (links, images, code) plus the authoring components.
 */
export const mdxComponents = {
  a: MdxLink,
  img: MdxImage,
  pre: CodeBlock,
  // Authoring components usable directly inside MDX:
  Callout,
  Note,
  Info: Info_,
  Tip,
  Warning,
  BlogImage,
};
