import type { Viewport } from 'next';
import { Montserrat } from 'next/font/google';

import SmoothScroll from '@/components/SmoothScroll';
import OrganizationJsonLd from '@/components/StructuredData/OrganizationJsonLd';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';
import { SPLASH_STORAGE_KEY } from '@/shared/utils';

import '@/shared/styles/globals.scss';

const montserrat = Montserrat({ subsets: ['latin'] });

export { metadata } from './metadata';

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className} suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{sessionStorage.getItem('${SPLASH_STORAGE_KEY}')||document.documentElement.setAttribute('data-splash-init','')}catch(e){document.documentElement.setAttribute('data-splash-init','')}`,
          }}
        />
        <SmoothScroll>
          <main className="relative">{children}</main>
        </SmoothScroll>
        <OrganizationJsonLd />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
