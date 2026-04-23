'use client';

import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Montserrat } from 'next/font/google';
import { useEffect } from 'react';

const montserrat = Montserrat({ subsets: ['latin'] });

import '@/shared/styles/globals.scss';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Disable Lenis on mobile — native momentum scroll is smoother
    // and avoids ScrollTrigger conflicts on iOS/Android
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    let rafId: number;

    if (!isMobile) {
      const lenis = new Lenis({
        wrapper: window,
        content: document.documentElement,
      });

      // Connect Lenis to ScrollTrigger so they share the same scroll position
      lenis.on('scroll', ScrollTrigger.update);

      const raf = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };

      rafId = requestAnimationFrame(raf);

      return () => {
        lenis.destroy();
        cancelAnimationFrame(rafId);
      };
    }
    // On mobile: just let native scroll drive ScrollTrigger directly
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="msvalidate.01" content="FC160AC750D5E6D051F295C8ACD13670" />
        
        {/* Primary Meta Tags */}
        <title>RRG Tech - Creative Digital Agency in Kathmandu</title>
        <meta name="title" content="RRG Tech - Creative Digital Agency in Kathmandu" />
        <meta name="description" content="RRG Tech is a leading creative digital agency in Kathmandu, specializing in web development, mobile app development, UI/UX design, and branding. Transform your digital presence with our expert team." />
        <meta name="keywords" content="RRG, RRG Tech, RRG Kathmandu, RRG Nepal, digital agency Nepal, web development Kathmandu, mobile app development Nepal, UI/UX design Kathmandu, branding agency Nepal, creative agency Kathmandu, software development Nepal, fullstack development, React development Nepal, Next.js development" />
        <meta name="author" content="RRG Tech" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://rrg.com.np" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rrg.com.np" />
        <meta property="og:title" content="RRG Tech - Creative Digital Agency in Kathmandu" />
        <meta property="og:description" content="Leading creative digital agency in Kathmandu specializing in web development, mobile apps, and design. Transform your digital presence with RRG Tech." />
        <meta property="og:image" content="https://rrg.com.np/images/og-image.jpg" />
        <meta property="og:site_name" content="RRG Tech" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://rrg.com.np" />
        <meta property="twitter:title" content="RRG Tech - Creative Digital Agency in Kathmandu" />
        <meta property="twitter:description" content="Leading creative digital agency in Kathmandu specializing in web development, mobile apps, and design." />
        <meta property="twitter:image" content="https://rrg.com.np/images/og-image.jpg" />
        
        {/* Favicons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'RRG Tech',
              url: 'https://rrg.com.np',
              logo: 'https://rrg.com.np/images/logo.png',
              description: 'Creative digital agency in Kathmandu specializing in web development, mobile app development, and design.',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Kathmandu',
                addressCountry: 'NP',
              },
              sameAs: [
                'https://www.facebook.com/rrg.com.np',
                'https://www.linkedin.com/company/rrgnepal/',
                'https://github.com/orgs/RRG-NP',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                availableLanguage: ['English', 'Nepali'],
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfessionalService',
              name: 'RRG Tech',
              image: 'https://rrg.com.np/images/logo.png',
              '@id': 'https://rrg.com.np',
              url: 'https://rrg.com.np',
              telephone: '',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '',
                addressLocality: 'Kathmandu',
                addressRegion: 'Bagmati',
                postalCode: '',
                addressCountry: 'NP',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 27.7172,
                longitude: 85.324,
              },
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '09:00',
                closes: '18:00',
              },
              priceRange: '$$',
            }),
          }}
        />
      </head>
      <body className={montserrat.className} suppressHydrationWarning>
        <main className="relative">
          {children}
        </main>
      </body>
    </html>
  );
}
