import type { Metadata } from 'next';
import Link from 'next/link';

import BookForm from '@/widgets/BookForm';
import SectionEyebrow from '@/components/ui/SectionEyebrow';
import { siteConfig } from '@/lib/site';

const BOOK_TITLE = 'Start a Project - RRG Tech';
const BOOK_DESCRIPTION =
  'Tell us about your project. Book a free consultation with RRG Tech for web development, mobile apps, UI/UX design, or branding in Kathmandu - we reply within 24–48 hours.';

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

const NEXT_STEPS = [
  { n: '01', text: 'We review your request and reply within 24-48 hours.' },
  { n: '02', text: 'A short call to understand your goals and scope.' },
  { n: '03', text: 'You get a clear proposal - timeline, team, and cost.' },
];

const Index = () => {
  return (
    <section className="relative z-[5000] min-h-screen w-full overflow-hidden bg-bg-1 py-[5vw] md:py-12">
      {/* Ambient glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[8vw] right-[8vw] h-[30vw] w-[30vw] rounded-full bg-primary/[0.05] blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-[26vw] w-[26vw] rounded-full bg-stroke/20 blur-[120px]"
      />

      <div className="relative mx-auto grid max-w-[86vw] grid-cols-[34vw_minmax(0,1fr)] gap-[5vw] md:max-w-full md:gap-10 md:px-5 tab:max-w-[92vw] tab:grid-cols-1 tab:gap-12">
        <aside className="h-fit self-start lg:sticky lg:top-[5vw]">
          <div className="mb-[2.5vw] md:mb-7 tab:mb-8">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-[0.85vw] font-semibold uppercase tracking-[0.2em] text-text-1/50 transition-colors duration-300 hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary md:text-xs tab:text-xs"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-x-1"
              >
                <path
                  d="M19 12H5m0 0l6-6m-6 6l6 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back
            </Link>
          </div>

          <SectionEyebrow label="Start a project" classes="mb-[1.2vw] md:mb-3" />
          <h1 className="text-[3.4vw] font-black leading-[1.05] tracking-tight md:text-[8.5vw] tab:text-4xl">
            Tell us about your{' '}
            <span className="bg-gradient-to-b from-white via-white to-primary bg-clip-text text-transparent">
              project
            </span>
            .
          </h1>
          <p className="mt-[1vw] max-w-[28vw] text-[1.1vw] font-light leading-[1.7] text-text-1/55 md:mt-3 md:max-w-full md:text-[3.8vw] tab:max-w-[52ch] tab:text-[0.95rem]">
            A few quick questions so we come prepared. The more you share, the better our first answer.
          </p>
          <p className="mt-[1vw] text-[1.1vw] font-light text-text-1/55 md:mt-3 md:text-[3.8vw] tab:text-[0.95rem]">
            Prefer email?{' '}
            <a
              href="mailto:hi@rrg.com.np"
              className="font-medium text-primary transition-colors duration-300 hover:text-text-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              hi@rrg.com.np
            </a>
          </p>

          <div className="mt-[2.5vw] border-t border-gray-1/60 pt-[2vw] md:mt-8 md:pt-6 tab:mt-9 tab:pt-7">
            <h2 className="text-[0.8vw] font-semibold uppercase tracking-[0.28em] text-text-1/40 md:text-[2.8vw] tab:text-[0.65rem]">
              What happens next
            </h2>
            <ol className="mt-[1.4vw] space-y-[1.1vw] md:mt-4 md:space-y-3.5 tab:mt-5 tab:space-y-4">
              {NEXT_STEPS.map((step) => (
                <li key={step.n} className="flex items-baseline gap-[1vw] md:gap-3 tab:gap-3">
                  <span className="text-[0.9vw] font-semibold tabular-nums text-primary md:text-xs tab:text-xs">
                    {step.n}
                  </span>
                  <span className="text-[1vw] font-light leading-[1.6] text-text-1/55 md:text-sm tab:text-[0.9rem]">
                    {step.text}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        <BookForm />
      </div>
    </section>
  );
};
export default Index;
