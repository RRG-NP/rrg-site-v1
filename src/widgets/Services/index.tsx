import { FC } from 'react';

import SectionTitle from '@/components/ui/SectionTitle';
import ServiceCard from '@/components/ServiceCard';

import { CARDS } from '@/data';

interface Props {}

const Index: FC<Props> = () => {
  return (
    <section id="services" className="relative border-t border-gray-1 py-[6vw] md:py-10 z-[2]">
      <SectionTitle title="SERVICES." classes="text-right px-[6vw] md:px-6 pt-[3vw] md:pt-8" />
        {CARDS.map((card) => (
          <ServiceCard key={card.title} card={card} />
        ))}
    </section>
  );
};
export default Index;
