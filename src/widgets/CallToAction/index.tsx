'use client';

import { FC } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

import SectionEyebrow from '@/components/ui/SectionEyebrow';
import SectionOpacity from '@/components/ui/SectionOpacity';
import { siteConfig } from '@/lib/site';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const SOCIAL_LINKS = [
  { title: 'Facebook', href: siteConfig.social.facebook },
  { title: 'LinkedIn', href: siteConfig.social.linkedin },
  { title: 'GitHub', href: siteConfig.social.github },
];

interface Props {}

const Index: FC<Props> = () => {
  const prefersReducedMotion = useReducedMotion();

  const reveal = (delay = 0) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 32 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-60px' },
          transition: { duration: 0.85, delay, ease: EASE },
        };

  return (
    <section id="cta" className="relative z-[2] overflow-hidden">
      {/* Ambient glow behind the closing statement */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[40vw] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-[130px] md:h-[90vw] md:w-[120vw]"
      />

      <SectionOpacity classes="flex flex-col justify-center h-screen">
        <div className="mx-auto flex w-full max-w-[60vw] flex-1 flex-col items-center justify-center px-4 text-center md:max-w-[90%]">
          <motion.div {...reveal()}>
            <SectionEyebrow label="Get in touch" classes="mb-[1.6vw] md:mb-5" />
          </motion.div>

          <motion.h2
            {...reveal(0.08)}
            className="text-[5.5vw] font-black leading-[1.02] tracking-tight md:text-[11.5vw]"
          >
            <span className="bg-gradient-to-b from-white via-white to-primary bg-clip-text text-transparent">
              LET&rsquo;S{' '}
            </span>
            <span className="text-transparent" style={{ WebkitTextStroke: '0.02em rgba(204, 194, 220, 0.6)' }}>
              CONNECT
            </span>
          </motion.h2>

          <motion.p
            {...reveal(0.16)}
            className="mt-[1vw] max-w-[34vw] text-[1.5vw] font-normal leading-[1.6] text-text-1/60 md:mt-4 md:max-w-full md:text-[4vw] md:leading-[1.5]"
          >
            Have a project in mind? Tell us about it — we reply within 24–48 hours.
          </motion.p>

          <motion.a
            {...reveal(0.24)}
            href="mailto:hi@rrg.com.np"
            className="group mt-[1.4vw] inline-flex items-center gap-[0.5vw] text-[1.4vw] font-medium text-primary transition-colors duration-300 hover:text-text-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary md:mt-5 md:gap-2 md:text-[4vw]"
          >
            <svg
              className="h-[1.4vw] w-[1.4vw] md:h-[4vw] md:w-[4vw]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            hi@rrg.com.np
          </motion.a>

          <motion.div {...reveal(0.32)}>
            <Link
              href="/book"
              className="mt-[2.2vw] inline-flex items-center justify-center rounded-full bg-primary px-[2.8em] py-[1em] text-[clamp(0.8rem,1vw,1rem)] font-semibold uppercase tracking-[0.12em] text-bg-1 transition duration-300 hover:-translate-y-[2px] hover:bg-text-1 hover:shadow-[0_0_50px_rgba(204,194,220,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-1 active:translate-y-0 md:mt-7 md:w-[80vw] md:text-[3.5vw]"
            >
              Start a project
            </Link>
          </motion.div>
        </div>

        <footer className="flex justify-between border-t border-gray-1/60 px-[5vw] py-[1.8vw] text-[1.1vw] text-text-1/60 md:flex-col md:gap-4 md:px-6 md:py-5 md:text-[3.2vw] tab:text-[0.85rem]">
          <div>
            © 2026.{' '}
            <a href="https://rrg.com.np/" target="_blank" rel="noreferrer" className="transition hover:text-primary">
              RRG Tech
            </a>
          </div>
          <ul className="flex space-x-[3vw] md:space-x-6">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.title}>
                <a href={link.href} target="_blank" rel="noreferrer" className="transition hover:text-primary">
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </footer>
      </SectionOpacity>
    </section>
  );
};
export default Index;
