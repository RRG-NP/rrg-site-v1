import { FC } from 'react';
import Link from 'next/link';

interface Props {
  card: {
    title: string;
    description: string;
    services: string[][];
    number: string;
    classes?: string;
  };
}

const Index: FC<Props> = ({ card: { title, description, services, number } }) => {
  const tags = services.flat();

  return (
    <Link
      href="/book"
      className="group relative block border-t border-gray-1/60 px-[6vw] md:px-6 transition-colors duration-300 hover:bg-bg-2/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
    >
      {/* Accent bar grows from the top edge on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-full w-[0.18vw] md:w-[2px] origin-top scale-y-0 bg-primary transition-transform duration-500 ease-out group-hover:scale-y-100"
      />

      <div className="grid grid-cols-[3.5vw_1fr_26vw] md:grid-cols-1 items-start gap-x-[3vw] md:gap-y-4 py-[3.4vw] md:py-7">
        {/* Index */}
        <span className="pt-[1.2vw] tab:pt-1 md:pt-0 text-[1.2vw] tab:text-sm md:text-[3.4vw] font-semibold tabular-nums tracking-[0.15em] text-stroke transition-colors duration-300 group-hover:text-primary">
          {number}
        </span>

        {/* Title + tags */}
        <div className="md:order-2">
          <h3 className="flex items-baseline gap-[1vw] text-[3.4vw] md:text-[8vw] font-light leading-[1.02] tracking-[-0.02em] transition-transform duration-500 ease-out group-hover:translate-x-[0.7vw] md:group-hover:translate-x-0">
            {title}
            <span
              aria-hidden
              className="translate-x-[-0.6vw] text-[1.6vw] md:hidden text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
            >
              &#8599;
            </span>
          </h3>

          <ul className="mt-[1.4vw] md:mt-4 flex flex-wrap gap-[0.7vw] md:gap-2">
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-stroke/60 px-[1.1vw] tab:px-3 md:px-3 py-[0.4vw] tab:py-1 md:py-1 text-[0.95vw] tab:text-[0.8rem] md:text-[3vw] font-medium text-white/55 transition-colors duration-300 group-hover:border-stroke group-hover:text-white/80"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>

        {/* Description */}
        <p className="md:order-1 text-[1.1vw] tab:text-[0.95rem] md:text-[3.7vw] font-light leading-[1.7] md:leading-[1.6] text-white/45 transition-colors duration-300 group-hover:text-white/80 md:text-balance">
          {description}
        </p>
      </div>
    </Link>
  );
};
export default Index;
