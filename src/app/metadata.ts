import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RRG Tech - Creative Digital Agency in Kathmandu',
  description: 'RRG Tech is a leading creative digital agency in Kathmandu, specializing in web development, mobile app development, UI/UX design, and branding. Transform your digital presence with our expert team.',
  keywords: [
    'RRG',
    'RRG Tech',
    'RRG Kathmandu',
    'RRG Nepal',
    'digital agency Nepal',
    'web development Kathmandu',
    'mobile app development Nepal',
    'UI/UX design Kathmandu',
    'branding agency Nepal',
    'creative agency Kathmandu',
    'software development Nepal',
    'fullstack development',
    'React development Nepal',
    'Next.js development',
  ],
  authors: [{ name: 'RRG Tech', url: 'https://rrg.com.np' }],
  creator: 'RRG Tech',
  publisher: 'RRG Tech',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://rrg.com.np'),
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': [{ url: '/feed.xml', title: 'RRG Tech Blog RSS Feed' }],
    },
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'RRG Tech',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: {
    title: 'RRG Tech - Creative Digital Agency in Kathmandu',
    description: 'Leading creative digital agency in Kathmandu specializing in web development, mobile apps, and design. Transform your digital presence with RRG Tech.',
    url: 'https://rrg.com.np',
    siteName: 'RRG Tech',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RRG Tech - Creative Digital Agency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RRG Tech - Creative Digital Agency in Kathmandu',
    description: 'Leading creative digital agency in Kathmandu specializing in web development, mobile apps, and design.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Google Search Console is already verified out-of-band; emit a meta tag only
    // if a code is supplied via env (avoids shipping an invalid placeholder tag).
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
    other: {
      'msvalidate.01': 'FC160AC750D5E6D051F295C8ACD13670',
    },
  },
};
