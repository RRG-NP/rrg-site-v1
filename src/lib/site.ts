/** Single source of truth for site-wide identity used across SEO, feeds, and JSON-LD. */
export const siteConfig = {
  name: 'RRG Tech',
  title: 'RRG Tech — Creative Digital Agency in Kathmandu',
  description:
    'RRG Tech is a creative digital agency in Kathmandu specializing in web development, mobile apps, UI/UX design, and branding.',
  url: 'https://rrg.com.np',
  ogImage: '/images/og-image.jpg',
  logo: '/images/logo.png',
  locale: 'en_US',
  blogPath: '/blog',
  feedPath: '/feed.xml',
  author: { name: 'RRG Tech', url: 'https://rrg.com.np' },
  // Byline author for blog posts (links to the author's personal site).
  blogAuthor: { name: 'Rohan Gautam', url: 'https://www.rohanrajgautam.com.np/' },
  social: {
    facebook: 'https://www.facebook.com/rrg.com.np',
    linkedin: 'https://www.linkedin.com/company/rrgnepal/',
    github: 'https://github.com/orgs/RRG-NP',
  },
} as const;

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = ''): string {
  const base = siteConfig.url.replace(/\/$/, '');
  if (!path) return base;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
