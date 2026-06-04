import type { Metadata } from 'next';

import BlogIndex from '@/components/blog/BlogIndex';
import { getAllPosts, getAllTags, getFeaturedPosts, toSummary } from '@/lib/blog';
import { siteConfig } from '@/lib/site';

const BLOG_TITLE = 'The RRG Tech Blog — Web & Mobile Development, AI, Performance';
const BLOG_DESCRIPTION =
  'Practical, opinionated writing on web and mobile development, React and React Native, AI for developers, performance on both web and mobile, design systems, and accessibility — from the RRG Tech team.';

export const metadata: Metadata = {
  // Set explicitly (the layout's title template only applies to child segments).
  title: BLOG_TITLE,
  description: BLOG_DESCRIPTION,
  keywords: [
    'RRG Tech blog',
    'web development blog',
    'mobile development',
    'React Native',
    'React',
    'Next.js',
    'AI for developers',
    'web performance',
    'mobile app performance',
    'system design',
    'software architecture',
    'design systems',
    'accessibility',
    'frontend engineering',
  ],
  alternates: {
    canonical: '/blog',
    types: {
      'application/rss+xml': [{ url: siteConfig.feedPath, title: 'RRG Tech Blog RSS Feed' }],
    },
  },
  openGraph: {
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    url: `${siteConfig.url}/blog`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: 'website',
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'The RRG Tech Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    images: [siteConfig.ogImage],
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
          Practical, opinionated writing on web and mobile development, AI for developers, performance enhancement, and
          system architecture — grounded in the work we ship.
        </p>
      </header>

      <BlogIndex posts={posts} featured={featured ? toSummary(featured) : null} tags={tags} />
    </div>
  );
}
