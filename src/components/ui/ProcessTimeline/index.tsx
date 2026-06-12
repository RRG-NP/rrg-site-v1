'use client';

import { FC, SVGProps } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Step {
  icon: FC<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

interface Props {
  steps: Step[];
}

const ProcessTimeline: FC<Props> = ({ steps }) => {
  const prefersReducedMotion = useReducedMotion();

  const reveal = (i: number) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 32 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-50px' },
          transition: { duration: 0.8, delay: Math.min(i * 0.06, 0.24), ease: EASE },
        };

  return (
    <ol className="relative mx-auto max-w-[78vw] tab:max-w-full">
      {steps.map((step, i) => {
        const n = String(i + 1).padStart(2, '0');
        const isLast = i === steps.length - 1;

        return (
          <motion.li
            key={step.title}
            {...reveal(i)}
            className="group relative flex items-start gap-[2.5vw] pb-[3.2vw] last:pb-0 md:gap-[5vw] md:pb-[10vw] tab:gap-7 tab:pb-11"
          >
            {/* Connecting spine to the next badge */}
            {!isLast && (
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-0 left-[1.85vw] top-[3.7vw] w-px -translate-x-1/2 bg-gradient-to-b from-primary/35 via-stroke/50 to-stroke/10 md:left-[6.5vw] md:top-[13vw] tab:left-7 tab:top-14"
              />
            )}

            {/* Number badge - sits on the spine */}
            <span className="relative z-[1] grid h-[3.7vw] w-[3.7vw] shrink-0 place-items-center rounded-full border-[0.1vw] border-stroke bg-bg-1 text-[1.2vw] font-semibold tabular-nums tracking-tight text-text-1/80 transition-all duration-300 group-hover:border-primary group-hover:bg-primary/5 group-hover:text-primary group-hover:shadow-[0_0_0_0.35vw_rgba(204,194,220,0.12)] md:h-[13vw] md:w-[13vw] md:border-[1.5px] md:text-[3.6vw] tab:h-14 tab:w-14 tab:border-2 tab:text-base tab:group-hover:shadow-[0_0_0_5px_rgba(204,194,220,0.12)]">
              {n}
            </span>

            {/* Content */}
            <div className="flex flex-1 items-start justify-between gap-[3vw] pt-[0.5vw] md:pt-[1vw] tab:pt-1.5">
              <div className="max-w-[46vw] md:max-w-full tab:max-w-[46ch]">
                <h4 className="text-[1.75vw] font-semibold leading-[1.1] tracking-tight transition-transform duration-300 group-hover:translate-x-[0.3vw] md:text-[5vw] md:group-hover:translate-x-0 tab:text-xl">
                  {step.title}
                </h4>
                <p className="mt-[0.7vw] text-balance text-[1vw] font-light leading-[1.65] text-white/45 transition-colors duration-300 group-hover:text-white/75 md:mt-[1.5vw] md:text-[3.6vw] tab:mt-2 tab:text-[0.95rem]">
                  {step.description}
                </p>
              </div>

              {/* Muted icon accent (hidden on phone to avoid clutter) */}
              <span
                aria-hidden
                className="shrink-0 pt-[0.4vw] opacity-25 transition-opacity duration-300 group-hover:opacity-90 md:hidden tab:pt-1"
              >
                <step.icon className="h-[2.4vw] w-[2.4vw] tab:h-7 tab:w-7" />
              </span>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
};
export default ProcessTimeline;
