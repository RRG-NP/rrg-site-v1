'use client';

import { FC, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { LogoIcon } from '@/icons/ApproachIcons/LogoIcon';

export const STORAGE_KEY = 'rrg_loader_shown';

interface Props {
  onComplete: () => void;
}

const LogoLoader: FC<Props> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'enter' | 'travel' | 'done'>('enter');
  const [navTarget, setNavTarget] = useState<{ x: number; y: number; logoScale: number } | null>(null);
  const hasFired = useRef(false);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t1 = setTimeout(() => {
      const navEl = document.querySelector('[data-nav-logo]') as HTMLElement | null;
      if (navEl) {
        const navRect = navEl.getBoundingClientRect();
        const loaderSize = iconRef.current?.getBoundingClientRect().width ?? 100;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        
        // Responsive offsets based on screen size
        const isMobile = vw < 1024; // lg breakpoint
        const offsetX = isMobile ? -10 : -42;
        const offsetY = isMobile ? -20 : -22;
        
        setNavTarget({
          x: navRect.left + navRect.width / 2 - vw / 2 + offsetX,
          y: navRect.top + navRect.height / 2 - vh / 2 + offsetY,
          logoScale: navRect.width / loaderSize,
        });
      }
      setPhase('travel');
    }, 800);

    const t2 = setTimeout(() => {
      if (!hasFired.current) {
        hasFired.current = true;
        onComplete();
      }
    }, 1300);

    const t3 = setTimeout(() => {
      setPhase('done');
    }, 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  const isTravel = phase === 'travel';

  return (
    <div className="absolute inset-0 z-[50] flex items-center justify-center pointer-events-none">
      <motion.div
        className="relative flex items-center justify-center will-change-transform"
        initial={{ opacity: 0, scale: 0.55, y: 20 }}
        animate={
          phase === 'enter'
            ? { opacity: 1, scale: 1, y: 0 }
            : isTravel && navTarget
              ? { opacity: 0, scale: navTarget.logoScale, x: navTarget.x, y: navTarget.y }
              : {}
        }
        transition={
          phase === 'enter'
            ? { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
            : isTravel
              ? {
                  x: { duration: 0.7, ease: [0.4, 0, 0.15, 1] },
                  y: { duration: 0.7, ease: [0.4, 0, 0.15, 1] },
                  scale: { duration: 0.7, ease: [0.4, 0, 0.15, 1] },
                  opacity: { duration: 0.2, delay: 0.5, ease: 'easeIn' },
                }
              : {}
        }
      >
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 160,
            height: 160,
            background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 55%, transparent 70%)',
            filter: 'blur(14px)',
          }}
          animate={isTravel ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          ref={iconRef}
          animate={
            phase === 'enter'
              ? {
                  filter: [
                    'drop-shadow(0 0 0px rgba(255,255,255,0))',
                    'drop-shadow(0 0 24px rgba(255,255,255,0.55))',
                    'drop-shadow(0 0 6px rgba(255,255,255,0.1))',
                  ],
                }
              : { filter: 'drop-shadow(0 0 0px rgba(255,255,255,0))' }
          }
          transition={phase === 'enter' ? { duration: 0.6, ease: 'easeOut' } : { duration: 0.25 }}
        >
          <LogoIcon className="text-white" style={{ width: 100, height: 100 }} aria-hidden="true" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LogoLoader;
