import { FC } from 'react';
import { useInView } from 'react-intersection-observer';

interface Props {
  card: any;
}

const Index: FC<Props> = ({ card: { title, services, description, number, classes } }) => {
  const { ref } = useInView({
    triggerOnce: true,
    threshold: 0.6,
  });
  return (
    <div ref={ref} key={number} className="px-[6vw] md:px-6 pb-[9.5vw] md:pb-14 last:pb-[13vw] md:last:pb-20">
      <h4 className="text-[3.7vw] md:text-[9vw] md:mt-6 font-light">{title}</h4>
      <div className={`flex items-start space-x-[3vw] md:space-x-0 pt-[3vw] md:pt-5 first:border-none md:flex-col ${classes}`}>
        <div className="flex-1 md:mb-5">
          <div className="flex flex-wrap space-y-[2vw] md:space-y-3">
            {services.map((service: string[], i: number) => {
              return (
                <ul key={i} className="flex items-center space-x-[5vw] md:space-x-8 text-[1.7vw] md:text-[4vw] font-semibold">
                  {service.map((s) => (
                    <li key={s} className="flex items-center space-x-[0.6vw] md:space-x-2">
                      <div className="h-[1.2vw] w-[1.2vw] md:h-4 md:w-4 rounded-full bg-[#fff]/40"></div>
                      <p>{s}</p>
                    </li>
                  ))}
                </ul>
              );
            })}
          </div>
        </div>

        <div className="relative flex-1">
          <p className="relative z-[2000] line-clamp-4 text-[1.5vw] md:text-[3.8vw] font-medium leading-[1.7] md:text-balance md:leading-[1.6] md:mt-4">{description}</p>
          <div className="absolute right-[6vw] md:right-0 top-[1.8vw] md:top-0 z-[1] text-right text-[16vw] font-extrabold tracking-[5%] text-gray-1 md:text-[32vw]">
            {number}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Index;
