import { siteConfig } from '@/lib/site';

/**
 * Site-wide structured data, emitted once from the root layout as a single
 * `@graph` so Organization, ProfessionalService, and WebSite are unified by
 * `@id` (no duplicated, conflicting entities). Empty fields are intentionally
 * omitted — partial addresses/phones are worse than absent ones.
 */
export default function OrganizationJsonLd() {
  const orgId = `${siteConfig.url}/#organization`;
  const siteId = `${siteConfig.url}/#website`;
  const logoUrl = `${siteConfig.url}${siteConfig.logo}`;

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'ProfessionalService'],
        '@id': orgId,
        name: siteConfig.name,
        url: siteConfig.url,
        logo: { '@type': 'ImageObject', url: logoUrl },
        image: logoUrl,
        description:
          'Creative digital agency in Kathmandu specializing in web development, mobile app development, UI/UX design, and branding.',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Kathmandu',
          addressRegion: 'Bagmati',
          addressCountry: 'NP',
        },
        geo: { '@type': 'GeoCoordinates', latitude: 27.7172, longitude: 85.324 },
        areaServed: { '@type': 'Country', name: 'Nepal' },
        knowsAbout: [
          'Web Development',
          'Mobile App Development',
          'React',
          'React Native',
          'Next.js',
          'UI/UX Design',
          'Branding',
        ],
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00',
        },
        priceRange: '$$',
        email: 'hi@rrg.com.np',
        sameAs: [siteConfig.social.facebook, siteConfig.social.linkedin, siteConfig.social.github],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'Customer Service',
          email: 'hi@rrg.com.np',
          availableLanguage: ['English', 'Nepali'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': siteId,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: 'en',
        publisher: { '@id': orgId },
      },
    ],
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
  );
}
