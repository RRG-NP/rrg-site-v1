import { FC } from 'react';

import { cn } from '@/shared/utils';

interface Props {
  label: string;
  classes?: string;
}

/** Small uppercase pill used above section headings — mirrors the hero's eyebrow. */
const Index: FC<Props> = ({ label, classes }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-stroke/60 bg-white/[0.04] px-[clamp(0.9rem,1.2vw,1.4rem)] py-[clamp(0.4rem,0.55vw,0.65rem)] backdrop-blur-md md:backdrop-blur-none',
        classes,
      )}
    >
      <span className="-mr-[0.28em] text-[clamp(0.55rem,0.75vw,0.7rem)] font-semibold uppercase tracking-[0.28em] text-text-1/60">
        {label}
      </span>
    </span>
  );
};
export default Index;
