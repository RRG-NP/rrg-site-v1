import { FC } from 'react';

import SectionTitle from '@/components/ui/SectionTitle';
import ServiceCard from '@/components/ServiceCard';

import { CARDS } from '@/data';

interface Props {}

const Index: FC<Props> = () => {
  return (
    <section id="services" className="relative z-[2] border-t border-gray-1 bg-bg-1 py-[6vw] md:py-10">
      <div className="flex items-end justify-between gap-[6vw] px-[6vw] pt-[3vw] md:flex-col md:items-start md:gap-4 md:px-6 md:pt-8">
        <p className="max-w-[24vw] text-[1.1vw] font-light leading-[1.6] text-white/40 md:max-w-full md:text-[3.6vw] tab:text-[0.95rem]">
          {/* Three disciplines, handled end to end — from the first sketch through to a product in production. */}
        </p>
        <SectionTitle title="SERVICES." classes="text-right shrink-0" />
      </div>

      <div className="mt-[4vw] md:mt-8">
        {CARDS.map((card) => (
          <ServiceCard key={card.title} card={card} />
        ))}
      </div>
    </section>
  );
};
export default Index;
