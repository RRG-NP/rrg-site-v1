'use client';
import { FC, useEffect, useState } from 'react';

import SidebarMenu from '@/components/SidebarMenu';
import { AnimatePresence, motion } from 'framer-motion';
import { LogoIcon } from '@/icons/ApproachIcons/LogoIcon';

interface Props {}

const Index: FC<Props> = () => {
  const [isActive, setIsActive] = useState(false);
  const closeSidebar = () => setIsActive(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsActive(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);
  return (
    <div >
      <div className="fixed right-0 z-[4001] p-[2vw]">
        <button
          type="button"
          onClick={() => setIsActive(!isActive)}
          aria-label={isActive ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isActive}
          className="flex h-14 w-14 md:h-16 md:w-16 cursor-pointer items-center justify-center rounded-full bg-stone-400">
          <div className={`burger ${isActive && 'burgerActive'}`}></div>
        </button>
      </div>
      <motion.button 
        title="rrg tech" 
        aria-label="RRG Tech - Go to homepage"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="p-[2vw] fixed z-[100] top-0 left-0 group cursor-pointer"
        initial={{ opacity: 0, y: -50, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
        }}
        transition={{ 
          duration: 1,
          delay: 0.3,
          ease: [0.16, 1, 0.3, 1], // Smooth professional easing
        }}
        whileHover={{ 
          scale: 1.1,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ 
            duration: 1.2,
            delay: 0.3,
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          <LogoIcon 
            className="w-12 h-12 md:w-16 md:h-16 text-white transition-all duration-300 group-hover:text-white/90 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]" 
          />
        </motion.div>
      </motion.button>
      <AnimatePresence mode="wait">{isActive && (
        <SidebarMenu close={closeSidebar} />
      )}
      </AnimatePresence>
    </div>
  );
};
export default Index;
