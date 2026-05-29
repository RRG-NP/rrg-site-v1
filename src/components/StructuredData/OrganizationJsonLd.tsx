import { siteConfig } from '@/lib/site';

/**
 * Site-wide Organization + ProfessionalService structured data.
 * Rendered server-side in the root layout (replaces the old hand-written
 * <script> tags that lived in the client layout's <head>).
 */
export default function OrganizationJsonLd() {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    description:
      'Creative digital agency in Kathmandu specializing in web development, mobile app development, and design.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kathmandu',
      addressCountry: 'NP',
    },
    sameAs: [siteConfig.social.facebook, siteConfig.social.linkedin, siteConfig.social.github],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['English', 'Nepali'],
    },
  };

  const professionalService = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: siteConfig.name,
    image: `${siteConfig.url}/images/logo.png`,
    '@id': siteConfig.url,
    url: siteConfig.url,
    telephone: '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '',
      addressLocality: 'Kathmandu',
      addressRegion: 'Bagmati',
      postalCode: '',
      addressCountry: 'NP',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 27.7172, longitude: 85.324 },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    priceRange: '$$',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalService) }}
      />
    </>
  );
}
