import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Home } from 'lucide-react';

import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'The page you’re looking for doesn’t exist or may have moved.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-bg-1 px-5 py-24 text-center">
      {/* Ambient brand glows */}
      <div
        aria-hidden="true"
        className="animate-pulse-slow pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-primary/20 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="animate-pulse-slow pointer-events-none absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-stroke/50 blur-[130px]"
      />

      {/* Dot grid texture, faded toward the edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle,rgba(230,224,233,0.07)_1px,transparent_1px)] [background-size:34px_34px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]"
      />

      {/* Brand mark */}
      <Link
        href="/"
        className="absolute left-1/2 top-8 -translate-x-1/2 text-lg font-extrabold tracking-tight text-text-1 transition-colors hover:text-primary"
      >
        {siteConfig.name}
      </Link>

      <div className="relative z-10 flex flex-col items-center">
        <span className="mb-6 inline-flex items-center rounded-full border border-stroke bg-bg-2/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Error 404
        </span>

        <h1 className="bg-gradient-to-br from-text-1 via-primary to-stroke bg-clip-text text-[110px] font-extrabold leading-none tracking-tighter text-transparent drop-shadow-[0_0_40px_rgba(204,194,220,0.25)] sm:text-[180px]">
          404
        </h1>

        <h2 className="mt-2 text-2xl font-bold text-text-1 sm:text-3xl">This page took a wrong turn</h2>
        <p className="mt-4 max-w-md text-base text-text-1/60">
          The page you’re looking for doesn’t exist, may have moved, or the link was mistyped. Let’s get you back
          on track.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-bg-1 transition-transform hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-1"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Back home
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-stroke px-6 py-3 text-sm font-semibold text-text-1 transition-colors hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-1"
          >
            Explore the blog
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
