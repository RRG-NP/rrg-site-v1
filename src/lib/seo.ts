import type { Metadata } from 'next';
import type { Blog } from 'contentlayer/generated';
import { siteConfig, absoluteUrl } from './site';

/**
 * Per-post metadata. The OG/Twitter image is supplied by the route's
 * `opengraph-image.tsx` (file convention), so we deliberately omit `images`
 * here to avoid emitting it twice. Twitter falls back to og:image.
 */
export function buildPostMetadata(post: Blog): Metadata {
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.description;
  const canonical = post.canonicalUrl || post.url;

  return {
    title,
    description,
    keywords: post.tags,
    authors: [{ name: post.author }],
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title,
      description,
      url: absoluteUrl(post.url),
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      publishedTime: new Date(post.date).toISOString(),
      modifiedTime: new Date(post.updated || post.date).toISOString(),
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

type JsonLd = Record<string, unknown>;

/** BlogPosting structured data for a single article. */
export function buildArticleJsonLd(post: Blog): JsonLd {
  const image = absoluteUrl(post.coverImage || siteConfig.ogImage);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.updated || post.date).toISOString(),
    author: { '@type': 'Person', name: post.author, url: siteConfig.blogAuthor.url },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: { '@type': 'ImageObject', url: absoluteUrl(siteConfig.logo) },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(post.url) },
    url: absoluteUrl(post.url),
    keywords: post.tags.join(', '),
    ...(post.category ? { articleSection: post.category } : {}),
  };
}

/** A question/answer pair (matches the `faq` computed field in contentlayer.config.ts). */
export type FaqItem = { question: string; answer: string };

/** FAQPage structured data from a post's FAQ section. Returns null when empty. */
export function buildFaqJsonLd(faqs: FaqItem[]): JsonLd | null {
  if (!faqs || faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

/** BreadcrumbList structured data from an ordered list of crumbs. */
export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}
