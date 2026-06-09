'use client';

import { useMDXComponent } from 'next-contentlayer2/hooks';
import { mdxComponents } from './mdx-components';

/**
 * Renders compiled MDX. `useMDXComponent` evaluates the compiled code, so this
 * must be a Client Component - it's the only interactive island in the article.
 */
export default function MDXContent({ code }: { code: string }) {
  const MDX = useMDXComponent(code);
  return <MDX components={mdxComponents} />;
}
