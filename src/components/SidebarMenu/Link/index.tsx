import { motion } from 'framer-motion';
import Link from 'next/link';
import { slide, scale } from '@/shared/utils/animations';

import { FC } from 'react';

interface Props {
  data: any;
  isActive: boolean;
  setSelectedIndicator: any;
  handleClick: () => void;
}

const linkClasses =
  'cursor-pointer pl-5 text-5xl sm:text-5xl md:text-[9vw] lg:text-[2.6vw] font-semibold tracking-tight leading-[1.15] transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] hover:translate-x-4 active:translate-x-2';

const Index: FC<Props> = ({ data, isActive, setSelectedIndicator, handleClick }) => {
  const { title, href, index, type } = data;
  const isRoute = type === 'route';

  return (
    <motion.div
      className="relative flex items-center"
      onMouseEnter={() => setSelectedIndicator(href)}
      custom={index}
      variants={slide}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <motion.div
        className="absolute left-0 inline-block h-2 w-2 rounded-full bg-white"
        variants={scale}
        animate={isActive ? 'open' : 'closed'}
      ></motion.div>
      {isRoute ? (
        <Link href={href} onClick={handleClick} className={linkClasses}>
          {title}
        </Link>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
          className={linkClasses}
        >
          {title}
        </div>
      )}
    </motion.div>
  );
};
export default Index;
