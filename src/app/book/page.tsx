import type { Metadata } from 'next';

import BookForm from '@/widgets/BookForm';
import { siteConfig } from '@/lib/site';

const BOOK_TITLE = 'Start a Project — RRG Tech';
const BOOK_DESCRIPTION =
  'Tell us about your project. Book a free consultation with RRG Tech for web development, mobile apps, UI/UX design, or branding in Kathmandu — we reply within 24–48 hours.';

// Without an explicit metadata export this page would inherit the root canonical
// ("/") and the homepage title/OG card. Set them so /book stands on its own.
export const metadata: Metadata = {
  title: BOOK_TITLE,
  description: BOOK_DESCRIPTION,
  alternates: { canonical: '/book' },
  openGraph: {
    title: BOOK_TITLE,
    description: BOOK_DESCRIPTION,
    url: `${siteConfig.url}/book`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: 'website',
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: BOOK_TITLE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: BOOK_TITLE,
    description: BOOK_DESCRIPTION,
    images: [siteConfig.ogImage],
  },
};

const Index = () => {
  return (
    <section className="z-[5000] min-h-screen w-full bg-bg-1 py-[5vw] opacity-100 md:py-12">
      <BookForm />
    </section>
  );
};
export default Index;
