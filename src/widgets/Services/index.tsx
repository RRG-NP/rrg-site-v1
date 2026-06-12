'use client';

import { FC } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

import SectionTitle from '@/components/ui/SectionTitle';
import SectionEyebrow from '@/components/ui/SectionEyebrow';
import ServiceCard from '@/components/ServiceCard';

import { CARDS } from '@/data';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

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
    <section id="services" className="relative z-[2] bg-bg-1 py-[6vw] md:py-10">
      <div className="flex items-end justify-between gap-[6vw] px-[6vw] pt-[3vw] md:flex-col-reverse md:items-start md:gap-5 md:px-6 md:pt-8">
        <motion.div {...reveal(0.1)} className="max-w-[26vw] md:max-w-full">
          <SectionEyebrow label="What we do" classes="mb-[1.2vw] md:mb-3" />
          <p className="text-[1.1vw] font-light leading-[1.7] text-text-1/50 md:text-[3.6vw] tab:text-[0.95rem]">
            Three disciplines, handled <span className="text-primary">end to end</span> — from the first sketch to a
            product in production.
          </p>
        </motion.div>
        <motion.div {...reveal()} className="shrink-0">
          <SectionTitle title="SERVICES." classes="text-right" />
        </motion.div>
      </div>

      <div className="mt-[4vw] md:mt-8">
        {CARDS.map((card, i) => (
          <ServiceCard key={card.title} card={card} index={i} />
        ))}
      </div>

      <motion.div
        {...reveal(0.1)}
        className="flex items-center justify-between gap-4 border-t border-gray-1/60 px-[6vw] pt-[2.6vw] md:flex-col md:items-start md:gap-3 md:px-6 md:pt-7"
      >
        <p className="text-[1.05vw] font-light text-text-1/40 md:text-[3.6vw] tab:text-[0.9rem]">
          Have something different in mind?
        </p>
        <Link
          href="/book"
          className="group inline-flex items-center gap-2 text-[0.95vw] font-semibold uppercase tracking-[0.14em] text-primary transition-colors duration-300 hover:text-text-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary md:text-[3.4vw] tab:text-[0.8rem]"
        >
          Start a project
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            <path
              d="M5 12h14m0 0l-6-6m6 6l-6 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </motion.div>
    </section>
  );
};
export default Index;
