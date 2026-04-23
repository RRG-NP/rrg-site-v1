import { FC } from 'react';

import SectionTitle from '@/components/ui/SectionTitle';
import SectionOpacity from '@/components/ui/SectionOpacity';
import HoverCards from '@/components/ui/HoverCards';

import { APPROACH_CARDS } from '@/data';

interface Props {}

const Index: FC<Props> = () => {
  return (
    <section id="approach" className="border-t border-gray-1 bg-bg-1 py-[6vw] md:py-10 pb-[12vw] md:pb-16 relative z-[2]">
      <SectionOpacity>
        <SectionTitle title="APPROACH." classes="px-[6vw] md:px-6 pt-[2.5vw] md:pt-8 top-0 z-20" />
        <div className="px-[6vw] md:px-6 pt-[2.5vw] md:pt-6">
          <HoverCards cards={APPROACH_CARDS} />
        </div>
      </SectionOpacity>
    </section>
  );
};
export default Index;
