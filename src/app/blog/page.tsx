import type { Metadata } from 'next';

import BlogIndex from '@/components/blog/BlogIndex';
import { getAllPosts, getAllTags, getFeaturedPosts, toSummary } from '@/lib/blog';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  // Set explicitly (the layout's title template only applies to child segments).
  title: 'The RRG Tech Blog — Web Development, Design & Performance',
  description:
    'Practical writing on web development, design systems, performance, and accessibility from the RRG Tech team.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: `Blog · ${siteConfig.name}`,
    description:
      'Practical writing on web development, design systems, performance, and accessibility from the RRG Tech team.',
    url: `${siteConfig.url}/blog`,
    type: 'website',
  },
};

export default function BlogPage() {
  const all = getAllPosts();
  const featured = getFeaturedPosts()[0] ?? null;
  const posts = all.filter((post) => post.slug !== featured?.slug).map(toSummary);
  const tags = getAllTags().map((t) => t.tag);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-28 sm:px-8 lg:pt-32">
      <header className="mb-12 max-w-2xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">The RRG Tech Blog</p>
        <h1 className="text-4xl font-extrabold leading-tight text-text-1 sm:text-5xl">Insights & ideas</h1>
        <p className="mt-4 text-lg text-text-1/60">
          Practical, opinionated writing on web development, design systems, performance, and accessibility —
          grounded in the work we ship.
        </p>
      </header>

      <BlogIndex posts={posts} featured={featured ? toSummary(featured) : null} tags={tags} />
    </div>
  );
}
