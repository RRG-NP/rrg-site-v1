import { getAllPosts } from '@/lib/blog';
import { siteConfig } from '@/lib/site';

// Prerendered at build; refreshed by deploys (new posts ship via Git push).
export const dynamic = 'force-static';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** RSS 2.0 feed of all published posts. */
export function GET() {
  const posts = getAllPosts();
  const feedUrl = `${siteConfig.url}${siteConfig.feedPath}`;
  const lastBuildDate = posts[0] ? new Date(posts[0].date).toUTCString() : new Date().toUTCString();

  const items = posts
    .map((post) => {
      const link = `${siteConfig.url}${post.url}`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.category ? `<category>${escapeXml(post.category)}</category>` : ''}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)} Blog</title>
    <link>${siteConfig.url}/blog</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
