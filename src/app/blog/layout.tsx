import type { Metadata } from 'next';
import Link from 'next/link';
import { Facebook, Github, Linkedin, Rss } from 'lucide-react';

import Navigation from '@/widgets/Navigation';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  // Post/listing titles render as "<title> · RRG Tech".
  title: {
    default: 'Blog',
    template: '%s · RRG Tech',
  },
};

const FOOTER_SOCIALS = [
  { label: 'Facebook', href: siteConfig.social.facebook, Icon: Facebook },
  { label: 'LinkedIn', href: siteConfig.social.linkedin, Icon: Linkedin },
  { label: 'GitHub', href: siteConfig.social.github, Icon: Github },
];

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-bg-1">{children}</div>

      <footer className="border-t border-gray-1 bg-bg-1">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="text-lg font-bold text-text-1">{siteConfig.name}</p>
            <p className="mt-1 text-sm text-text-1/50">
              Notes on building for the web - from the team at {siteConfig.name}.
            </p>
          </div>

          <div className="flex items-center gap-5">
            <nav className="flex items-center gap-5 text-sm text-text-1/70">
              <Link href="/" className="transition-colors hover:text-text-1">
                Home
              </Link>
              <Link href="/blog" className="transition-colors hover:text-text-1">
                Blog
              </Link>
              <Link href="/book" className="transition-colors hover:text-text-1">
                Contact
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              {FOOTER_SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="text-text-1/60 transition-colors hover:text-text-1"
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
              <a
                href={siteConfig.feedPath}
                aria-label="RSS feed"
                className="text-text-1/60 transition-colors hover:text-primary"
              >
                <Rss className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-5 pb-8 text-xs text-text-1/40 sm:px-8">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
      </footer>
    </>
  );
}
