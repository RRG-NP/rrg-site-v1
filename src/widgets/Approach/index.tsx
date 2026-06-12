'use client';

import { FC } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import SectionTitle from '@/components/ui/SectionTitle';
import SectionEyebrow from '@/components/ui/SectionEyebrow';
import SectionOpacity from '@/components/ui/SectionOpacity';
import ProcessTimeline from '@/components/ui/ProcessTimeline';

import { APPROACH_CARDS } from '@/data';

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
    <section id="approach" className="relative z-[2] bg-bg-1 py-[6vw] pb-[12vw] md:py-10 md:pb-16">
      <SectionOpacity>
        <div className="flex items-end justify-between gap-[6vw] px-[6vw] pt-[2.5vw] md:flex-col md:items-start md:gap-5 md:px-6 md:pt-8">
          <motion.div {...reveal()} className="shrink-0">
            <SectionTitle title="APPROACH." />
          </motion.div>
          <motion.div {...reveal(0.1)} className="mb-2 max-w-[26vw] text-right md:max-w-full md:text-left">
            <SectionEyebrow label="How we work" classes="mb-[1.2vw] md:mb-3" />
            <p className="text-[1.1vw] font-light leading-[1.7] text-text-1/50 md:text-[3.6vw] tab:text-[0.95rem]">
              Five steps from the <span className="text-primary">first conversation</span> to a product in your
              users&apos; hands
            </p>
          </motion.div>
        </div>

        <div className="px-[6vw] pt-[5vw] md:px-6 md:pt-10 tab:pt-12">
          <ProcessTimeline steps={APPROACH_CARDS} />
        </div>
      </SectionOpacity>
    </section>
  );
};
export default Index;
