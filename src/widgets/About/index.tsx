import { FC } from 'react';
import Image from 'next/image';

import SectionTitle from '@/components/ui/SectionTitle';
import SectionOpacity from '@/components/ui/SectionOpacity';

interface Props {}

const Index: FC<Props> = () => {
  return (
    <section id="about" className="relative bg-bg-1 py-[6vw] md:py-10 z-[2]">
      <SectionOpacity classes='z-2'>
        <SectionTitle title="ABOUT." classes="px-[6vw] md:px-6 pt-[3vw] md:pt-8 z-10" />
        <div className="relative self-start px-[6vw] md:px-6 pb-[5vw] md:pb-10 pt-[3vw] md:pt-6">
          <div className="flex space-x-[5vw] md:space-x-0 md:flex-col md:gap-6 md:items-center">
            <p className="flex grow-[4] basis-0 flex-wrap text-[2.3vw] md:text-[4.2vw] md:leading-[1.5] md:text-balance md:text-center">
              We are a young, close-knit team of like-minded people ready to help brands prosper in the digital world.
            </p>

            <div className="relative h-[20vw] w-[30vw] md:h-[56vw] md:max-w-[92%] md:text-center grow-[3] md:w-full basis-0 md:basis-[initial] bg-bg-2">
              <Image 
                src="/images/hands_v2.webp" 
                alt="Team collaboration - hands working together" 
                fill
                sizes="(max-width: 600px) 92vw, 30vw"
                className="object-cover rounded-[0.125vw] md:rounded-sm hover:brightness-110 transition"
                priority={false}
              />
            </div>
          </div>
        </div>
      </SectionOpacity>
    </section>
  );
};
export default Index;
