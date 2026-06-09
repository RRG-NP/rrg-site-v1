import { FC } from 'react';

import SectionTitle from '@/components/ui/SectionTitle';
import SectionOpacity from '@/components/ui/SectionOpacity';
import ProcessTimeline from '@/components/ui/ProcessTimeline';

import { APPROACH_CARDS } from '@/data';

interface Props {}

const Index: FC<Props> = () => {
  return (
    <section id="approach" className="relative z-[2] bg-bg-1 py-[6vw] pb-[12vw] md:py-10 md:pb-16">
      <SectionOpacity>
        <div className="flex items-end justify-between gap-[6vw] px-[6vw] pt-[2.5vw] md:flex-col md:items-start md:gap-4 md:px-6 md:pt-8">
          <SectionTitle title="APPROACH." classes="shrink-0" />
          <p className="mb-2 max-w-[24vw] text-right text-[1.1vw] font-light leading-[1.6] text-white/40 md:max-w-full md:text-left md:text-[3.6vw] tab:text-[0.95rem]">
            {/* Five steps from a first conversation to a product we hand over. */}
          </p>
        </div>

        <div className="px-[6vw] pt-[5vw] md:px-6 md:pt-10 tab:pt-12">
          <ProcessTimeline steps={APPROACH_CARDS} />
        </div>
      </SectionOpacity>
    </section>
  );
};
export default Index;
