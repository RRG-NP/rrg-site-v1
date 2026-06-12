'use client';

import { FC } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Props {
  card: {
    title: string;
    description: string;
    services: string[][];
    number: string;
    classes?: string;
  };
  index?: number;
}

const Index: FC<Props> = ({ card: { title, description, services, number }, index = 0 }) => {
  const prefersReducedMotion = useReducedMotion();
  const tags = services.flat();
  // Ghost numeral rendered as outlined type (same treatment as the hero's "Tech")
  const numeral = number.replace('.', '');

  const reveal = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 36 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-60px' },
        transition: { duration: 0.85, delay: index * 0.08, ease: EASE },
      };

  return (
    <motion.div {...reveal}>
      <Link
        href="/book"
        className="group relative block border-t border-gray-1/60 px-[6vw] transition-colors duration-300 hover:bg-bg-2/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary md:px-6"
      >
        {/* Accent bar grows from the top edge on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 h-full w-[0.18vw] origin-top scale-y-0 bg-primary transition-transform duration-500 ease-out group-hover:scale-y-100 md:w-[2px]"
        />

        <div className="grid grid-cols-[5vw_1fr_24vw_auto] items-start gap-x-[3vw] py-[3.4vw] md:grid-cols-1 md:gap-y-4 md:py-7">
          {/* Outlined index numeral — fills lavender on hover */}
          <span
            aria-hidden="true"
            className="pt-[0.6vw] text-[2.6vw] font-extrabold leading-none tabular-nums tracking-tight text-transparent transition-colors duration-500 group-hover:text-primary/70 md:pt-0 md:text-[8vw] tab:pt-1 tab:text-2xl"
            style={{ WebkitTextStroke: '0.045em rgba(204, 194, 220, 0.4)' }}
          >
            {numeral}
          </span>

          {/* Title + tags */}
          <div>
            <h3 className="text-[3.4vw] font-light leading-[1.02] tracking-[-0.02em] text-text-1 transition-transform duration-500 ease-out group-hover:translate-x-[0.7vw] md:text-[8vw] md:group-hover:translate-x-0">
              {title}
            </h3>

            <ul className="mt-[1.4vw] flex flex-wrap gap-[0.7vw] md:mt-4 md:gap-2">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-stroke/60 px-[1.1vw] py-[0.4vw] text-[0.95vw] font-medium text-text-1/55 transition-colors duration-300 group-hover:border-primary/40 group-hover:text-text-1/85 md:px-3 md:py-1 md:text-[3vw] tab:px-3 tab:py-1 tab:text-[0.8rem]"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          {/* Description */}
          <p className="text-[1.05vw] font-light leading-[1.7] text-text-1/45 transition-colors duration-300 group-hover:text-text-1/80 md:text-balance md:text-[3.7vw] md:leading-[1.6] tab:text-[0.95rem]">
            {description}
          </p>

          {/* Circular arrow affordance (desktop / tablet) */}
          <span
            aria-hidden="true"
            className="grid h-[3.4vw] w-[3.4vw] place-items-center self-center justify-self-end rounded-full border border-stroke/70 transition-all duration-500 group-hover:border-primary group-hover:bg-primary md:hidden tab:h-10 tab:w-10"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-[1.2vw] w-[1.2vw] text-text-1/60 transition-all duration-500 group-hover:-translate-y-[2px] group-hover:translate-x-[2px] group-hover:text-bg-1 tab:h-4 tab:w-4"
            >
              <path
                d="M7 17L17 7M17 7H8m9 0v9"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          {/* Mobile-only affordance — the whole row is a link, make that visible */}
          <span className="hidden items-center gap-1.5 text-[3.4vw] font-semibold uppercase tracking-[0.12em] text-primary md:inline-flex">
            Start a project
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M7 17L17 7M17 7H8m9 0v9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  );
};
export default Index;
