'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Logo3D() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Transform values for 3D effect
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.15, 0.2, 0]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <motion.div
        style={{ y, scale, opacity }}
        className="absolute left-0 top-[10%] w-full h-full flex items-start justify-center"
      >
        {/* Large R Logo with 3D effect */}
        <svg
          viewBox="0 0 400 600"
          className="w-[120vw] md:w-[180vw] h-auto text-white/10"
          style={{
            filter: 'drop-shadow(0 0 80px rgba(255, 255, 255, 0.1))',
          }}
        >
          {/* Main R shape - bold and modern */}
          <path
            d="M 80 50 L 80 550 L 140 550 L 140 340 L 200 340 C 280 340 320 300 320 220 C 320 140 280 50 200 50 Z M 140 110 L 200 110 C 240 110 260 140 260 220 C 260 260 240 280 200 280 L 140 280 Z"
            fill="currentColor"
            className="animate-pulse-slow"
          />
          
          {/* Diagonal leg of R */}
          <path
            d="M 200 340 L 320 550 L 390 550 L 240 310 Z"
            fill="currentColor"
            className="animate-pulse-slow"
          />
          
          {/* Curved extension that flows into next section */}
          <motion.path
            d="M 200 340 Q 280 380 320 450 Q 360 520 380 600"
            stroke="currentColor"
            strokeWidth="50"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 2, delay: 0.5, ease: 'easeInOut' }}
          />
        </svg>
      </motion.div>
    </div>
  );
}
