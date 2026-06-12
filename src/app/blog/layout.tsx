import type { Metadata } from 'next';

import Navigation from '@/widgets/Navigation';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  // Post/listing titles render as "<title> · RRG Tech".
  title: {
    default: 'Blog',
    template: '%s · RRG Tech',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg-1">
      <Navigation />
      <div className="grow">{children}</div>
      <SiteFooter />
    </div>
  );
}
