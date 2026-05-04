'use client';

import { FC, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { LogoIcon } from '@/icons/ApproachIcons/LogoIcon';

export const STORAGE_KEY = 'rrg_loader_shown';

interface Props {
  onComplete: () => void;
}

const LogoLoader: FC<Props> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'enter' | 'travel' | 'landed' | 'done'>('enter');
  const [navTarget, setNavTarget] = useState<{ x: number; y: number; scale: number } | null>(null);
  const hasFired = useRef(false);

  useEffect(() => {
    // Start travel after enter animation completes
    const t1 = setTimeout(() => {
      const navEl = document.querySelector('[data-nav-logo]') as HTMLElement | null;
      if (navEl) {
        const rect = navEl.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        // nav logo target size is clamp(32px, 5vw, 56px) — compute actual rendered size
        const targetSize = rect.width;
        setNavTarget({
          x: rect.left + rect.width / 2 - vw / 2,
          y: rect.top + rect.height / 2 - vh / 2,
          scale: targetSize / 100,
        });
      }
      setPhase('travel');
    }, 800);

    // Signal hero to appear — fires as the icon is landing
    const t2 = setTimeout(() => {
      if (!hasFired.current) {
        hasFired.current = true;
        onComplete();
      }
    }, 1350);

    // Icon has landed — mark as landed so glow/radial fades
    const t3 = setTimeout(() => {
      setPhase('landed');
    }, 1550);

    // Remove from DOM after nav logo has faded in and taken over
    const t4 = setTimeout(() => {
      setPhase('done');
    }, 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  const isTravel = phase === 'travel';
  const isLanded = phase === 'landed';

  return (
    <div className="absolute inset-0 z-[50] flex items-center justify-center pointer-events-none">
      <motion.div
        className="relative flex items-center justify-center will-change-transform"
        initial={{ opacity: 0, scale: 0.55, y: 20 }}
        animate={
          phase === 'enter'
            ? { opacity: 1, scale: 1, x: 0, y: 0 }
            : (isTravel || isLanded) && navTarget
              ? {
                  opacity: isLanded ? 0 : 1,
                  scale: navTarget.scale,
                  x: navTarget.x,
                  y: navTarget.y,
                }
              : {}
        }
        transition={
          phase === 'enter'
            ? { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
            : isTravel
              ? {
                  x: { duration: 0.65, ease: [0.4, 0, 0.15, 1] },
                  y: { duration: 0.65, ease: [0.4, 0, 0.15, 1] },
                  scale: { duration: 0.65, ease: [0.4, 0, 0.15, 1] },
                  opacity: { duration: 0.01 },
                }
              : { opacity: { duration: 0.3, ease: 'easeIn' } }
        }
      >
        {/* Radial glow — fades out during travel */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 160,
            height: 160,
            background:
              'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 55%, transparent 70%)',
            filter: 'blur(14px)',
          }}
          animate={isTravel || isLanded ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Logo with glow pulse on enter */}
        <motion.div
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
