'use client';
import { FC, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LogoIcon } from '@/icons/ApproachIcons/LogoIcon';
import SidebarMenu from '@/components/SidebarMenu';

interface Props {
  logoVisible?: boolean;
  burgerVisible?: boolean;
}

const Navigation: FC<Props> = ({ logoVisible = true, burgerVisible = true }) => {
  const [isActive, setIsActive] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => e.key === 'Escape' && setIsActive(false);
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setHidden(y > 80 && y > lastScrollY.current);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerHidden = hidden && !isActive;

  return (
    <>
      <motion.header
        role="banner"
        initial={{ opacity: 0 }}
        animate={{ opacity: headerHidden ? 0 : 1 }}
        transition={
          headerHidden
            ? { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
            : { duration: 0.3, ease: 'easeOut' }
        }
        className="fixed top-0 left-0 right-0 z-[4000] flex items-center justify-between"
      >
        <motion.button
          title="rrg tech"
          aria-label="RRG Tech - Go to homepage"
          onClick={() => {
            const el = document.getElementById('main');
            el ? el.scrollIntoView({ behavior: 'smooth' }) : window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="p-[4vw] lg:p-[2vw] group cursor-pointer"
          whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.95 }}
        >
          <div data-nav-logo>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: logoVisible ? 1 : 0 }}
              transition={{ duration: 0.4, ease: 'linear' }}
            >
              <LogoIcon
                className="text-white transition-all duration-300 group-hover:text-white/90 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                style={{ width: 'clamp(32px, 5vw, 56px)', height: 'clamp(32px, 5vw, 56px)' }}
              />
            </motion.div>
          </div>
        </motion.button>
      </motion.header>

      <motion.div
        className="fixed right-0 top-0 z-[4001] p-[4vw] lg:p-[2vw]"
        initial={{ opacity: 0 }}
        animate={{ opacity: headerHidden || !burgerVisible ? 0 : 1 }}
        transition={
          headerHidden
            ? { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
            : { duration: 0.4, delay: burgerVisible ? 0.1 : 0, ease: 'easeOut' }
        }
      >
        <button
          type="button"
          onClick={() => setIsActive(!isActive)}
          aria-label={isActive ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isActive}
          className="flex h-9 w-9 sm:h-11 sm:w-11 md:h-10 md:w-10 lg:h-16 lg:w-16 cursor-pointer items-center justify-center rounded-full bg-stone-400"
        >
          <div className={`burger ${isActive ? 'burgerActive' : ''}`} />
        </button>
      </motion.div>

      <AnimatePresence mode="wait">
        {isActive && <SidebarMenu close={() => setIsActive(false)} />}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
