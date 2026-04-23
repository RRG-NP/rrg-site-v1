'use client';
import { FC, useEffect, useRef, useState } from 'react';

import SidebarMenu from '@/components/SidebarMenu';
import { AnimatePresence, motion } from 'framer-motion';
import { LogoIcon } from '@/icons/ApproachIcons/LogoIcon';

interface Props {}

const Index: FC<Props> = () => {
  const [isActive, setIsActive] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const closeSidebar = () => setIsActive(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsActive(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      // Only hide after scrolling past 80px so the header doesn't vanish immediately
      if (currentY > 80 && currentY > lastScrollY.current) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keep header visible while sidebar is open
  const headerHidden = hidden && !isActive;

  return (
    <>
      <motion.header
        role="banner"
        initial={{ y: '-100%', opacity: 0 }}
        animate={{ y: headerHidden ? '-100%' : '0%', opacity: 1 }}
        transition={
          headerHidden
            ? { duration: 0.7, ease: [0.4, 0, 0.2, 1] }   // slow, smooth hide
            : { duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] } // entry drop-in
        }
        className="m-0 md:m-2 fixed top-0 left-0 right-0 z-[4000] flex items-center justify-between"
      >
        {/* Logo */}
        <motion.button
          title="rrg tech"
          aria-label="RRG Tech - Go to homepage"
          onClick={() => {
            const el = document.getElementById('main');
            el ? el.scrollIntoView({ behavior: 'smooth' }) : window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="p-[2vw] group cursor-pointer"
          whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <LogoIcon className="w-12 h-12 md:w-16 md:h-16 text-white transition-all duration-300 group-hover:text-white/90 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
          </motion.div>
        </motion.button>

      </motion.header>

      {/* Burger */}
      <motion.div
        className="fixed right-0 top-0 z-[4001] p-[2vw]"
        initial={{ y: '-100%', opacity: 0 }}
        animate={{ y: headerHidden ? '-100%' : '0%', opacity: 1 }}
        transition={
          headerHidden
            ? { duration: 0.7, ease: [0.4, 0, 0.2, 1] }
            : { duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }
        }
      >
        <button
          type="button"
          onClick={() => setIsActive(!isActive)}
          aria-label={isActive ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isActive}
          className="flex h-9 w-9 sm:h-11 sm:w-11 md:h-12 md:w-12 lg:h-16 lg:w-16 cursor-pointer items-center justify-center rounded-full bg-stone-400"
        >
          <div className={`burger ${isActive ? 'burgerActive' : ''}`} />
        </button>
      </motion.div>

      <AnimatePresence mode="wait">{isActive && (
        <SidebarMenu close={closeSidebar} />
      )}
      </AnimatePresence>
    </>
  );
};

export default Index;
