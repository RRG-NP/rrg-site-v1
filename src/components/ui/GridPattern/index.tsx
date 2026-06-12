'use client';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { MOBILE_BREAKPOINT } from '@/shared/utils';

export default function GridPattern() {
  const containerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);
  // On mobile, the scroll-linked scale/opacity promotes a full-screen GPU layer
  // that contributes to iOS dropping the page to black mid-scroll. Render it
  // static there; keep the parallax fade on desktop.
  const style = prefersReducedMotion || isMobile ? { opacity: 0.3 } : { opacity, scale };

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <motion.div
        style={style}
        className="absolute inset-0"
      >
        {/* Dot grid pattern */}
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="dot-pattern"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="rgba(255, 255, 255, 0.15)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-pattern)" />
        </svg>
      </motion.div>
    </div>
  );
}
