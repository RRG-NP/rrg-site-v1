import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';
import { siteConfig } from '@/lib/site';

/** Dynamic sitemap — automatically includes every published post. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${siteConfig.url}${post.url}`,
    lastModified: new Date(post.updated || post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    { url: siteConfig.url, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteConfig.url}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteConfig.url}/book`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    ...posts,
  ];
}
