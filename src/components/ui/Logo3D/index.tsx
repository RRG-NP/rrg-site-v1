'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { LogoIcon } from '@/icons/ApproachIcons/LogoIcon';

export default function Logo3D() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Transform values for 3D effect with parallax
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.15, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.1, 0.15, 0.12, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 15]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        style={{ y, scale, opacity, rotate }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center"
      >
        {/* Large RRG Logo with subtle glow */}
        <div className="relative w-[150vw] md:w-[120vw] lg:w-[100vw] h-auto">
          <LogoIcon 
            className="w-full h-auto text-white/10"
            style={{
              filter: 'drop-shadow(0 0 100px rgba(255, 255, 255, 0.08)) drop-shadow(0 0 50px rgba(255, 255, 255, 0.05))',
            }}
          />
          
          {/* Duplicate for enhanced glow effect */}
          <LogoIcon 
            className="absolute inset-0 w-full h-auto text-white/5 animate-pulse-slow"
            style={{
              filter: 'blur(40px)',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
