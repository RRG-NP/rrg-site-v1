import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

// AI search / answer-engine crawlers we explicitly welcome (training + live retrieval).
// Listing them by name is an unambiguous opt-in signal beyond the catch-all `*` rule.
const AI_CRAWLERS = [
  'GPTBot', // OpenAI training
  'OAI-SearchBot', // ChatGPT search index
  'ChatGPT-User', // ChatGPT live browsing
  'ClaudeBot', // Anthropic training
  'Claude-Web', // Claude live browsing
  'anthropic-ai',
  'PerplexityBot', // Perplexity index
  'Perplexity-User', // Perplexity live fetch
  'Google-Extended', // Gemini / Vertex training opt-in
  'Applebot-Extended', // Apple Intelligence
  'Bingbot',
  'Amazonbot',
  'cohere-ai',
];

// Paths with no indexable value: the contact POST endpoint and the transient
// post-submit confirmation page.
const DISALLOW = ['/api/contact', '/book/success'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/', disallow: DISALLOW })),
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
