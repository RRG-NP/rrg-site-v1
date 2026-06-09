import { getAllPosts } from '@/lib/blog';
import { siteConfig, absoluteUrl } from '@/lib/site';

/**
 * `/llms.txt` - a machine-readable site overview for LLMs and AI search/retrieval
 * systems (llmstxt.org convention). Lists the canonical entry points and every
 * published post so an agent can map the site without crawling/JS execution.
 *
 * Prerendered at build and refreshed by deploys (same cadence as the RSS feed).
 */
export const dynamic = 'force-static';

function formatDate(value: string | Date): string {
  return new Date(value).toISOString().slice(0, 10);
}

export function GET() {
  const posts = getAllPosts();

  const postLines = posts
    .map((post) => {
      const meta = [post.category, formatDate(post.date)].filter(Boolean).join(', ');
      return `- [${post.title}](${absoluteUrl(post.url)})${meta ? ` (${meta})` : ''}: ${post.description}`;
    })
    .join('\n');

  const body = `# ${siteConfig.title}

> ${siteConfig.description}

RRG Tech is a creative digital agency based in Kathmandu, Nepal. We build web applications,
mobile apps (React & React Native), and design systems, with deep focus on performance,
accessibility, and modern engineering practices.

## Key pages

- [Home](${siteConfig.url}): Agency overview, services, and approach.
- [Blog](${absoluteUrl('/blog')}): Practical, opinionated engineering writing from the RRG Tech team.
- [Start a Project](${absoluteUrl('/book')}): Contact form to book a free consultation.

## Blog posts

${postLines || '- (No published posts yet.)'}

## Machine-readable resources

- [RSS feed](${absoluteUrl(siteConfig.feedPath)}): RSS 2.0 of all published posts.
- [JSON API](${absoluteUrl('/api/blog')}): Public, CORS-enabled, paginated JSON feed of posts.
- [Sitemap](${absoluteUrl('/sitemap.xml')}): Full list of indexable URLs.

## Contact

- Email: hi@rrg.com.np
- LinkedIn: ${siteConfig.social.linkedin}
- GitHub: ${siteConfig.social.github}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
