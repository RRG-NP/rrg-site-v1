'use client';
import { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, motion, useSpring } from 'framer-motion';
import GridPattern from '@/components/ui/GridPattern';
import FloatingParticles from '@/components/ui/FloatingParticles';
import LogoLoader from '@/components/ui/LogoLoader';

interface HeroProps {
  ready?: boolean;
  showIntro?: boolean;
  onIntroComplete?: () => void;
}

const Hero = ({ ready = true, showIntro = false, onIntroComplete }: HeroProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const springConfig = { damping: 25, stiffness: 150 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    if (isMobile) return;
    const handle = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 2);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, [mouseX, mouseY, isMobile]);

  const scrollOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scrollScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const scrollY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const rotateX = useTransform(mouseY, [-1, 1], isMobile ? [0, 0] : [8, -8]);
  const rotateY = useTransform(mouseX, [-1, 1], isMobile ? [0, 0] : [-8, 8]);
  const gradientX = useTransform(mouseX, [-1, 1], [-100, 100]);
  const gradientY = useTransform(mouseY, [-1, 1], [-100, 100]);

  return (
    <section id="main" ref={containerRef} className="relative bg-black overflow-hidden">
      <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
        <GridPattern />
        <FloatingParticles />

        {!isMobile && (
          <motion.div
            style={{ x: gradientX, y: gradientY }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none z-[5]"
          >
            <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 via-purple-500/15 to-transparent rounded-full blur-[120px] mix-blend-screen" />
            <div className="absolute inset-0 bg-gradient-radial from-pink-500/15 via-blue-500/10 to-transparent rounded-full blur-[100px] mix-blend-screen animate-pulse-slow" />
          </motion.div>
        )}

        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/70 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60 pointer-events-none z-10" />

        {showIntro && onIntroComplete && (
          <LogoLoader onComplete={onIntroComplete} />
        )}

        <motion.div
          style={{
            opacity: scrollOpacity,
            scale: scrollScale,
            y: scrollY,
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
            perspective: 1000,
          }}
          className="relative z-20 flex flex-col items-center justify-center px-4 md:px-6 max-w-7xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="relative text-center text-[15vw] md:text-[22vw] lg:text-[10vw] font-black text-white leading-[0.9] mb-4 md:mb-5"
            style={{
              textShadow: '0 0 80px rgba(255,255,255,0.3), 0 0 40px rgba(255,255,255,0.2)',
              transform: isMobile ? 'none' : 'translateZ(50px)',
            }}
          >
            RRG Tech
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-center text-[4.5vw] md:text-[7vw] lg:text-[2.5vw] font-medium text-white/70 max-w-4xl px-6 leading-relaxed"
            style={{ transform: isMobile ? 'none' : 'translateZ(30px)' }}
          >
            Creative Digital Agency in Kathmandu, Nepal
          </motion.p>
        </motion.div>

        <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-blue-500/10 rounded-full blur-[100px] md:blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-purple-500/10 rounded-full blur-[100px] md:blur-[120px] pointer-events-none" />
      </div>

      <div className="absolute -bottom-2 left-0 right-0 h-24 md:h-32 lg:h-48 z-30">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0C240 40 480 60 720 60C960 60 1200 40 1440 0V120H0V0Z"
            className="fill-bg-1"
          />
        </svg>
      </div>

      <div
        className="absolute left-1/2 -translate-x-1/2 z-[50] flex flex-col items-center gap-2 pointer-events-none"
        style={{ bottom: 'clamp(5rem, 11vw, 9rem)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1.5"
          >
            <span className="text-white/40 text-[9px] uppercase tracking-[0.35em]">Scroll</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white/40">
              <path
                d="M12 5v14m0 0l-7-7m7 7l7-7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={ready ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 1.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-2 h-px w-16 md:w-24 lg:w-36 bg-gradient-to-r from-transparent via-white/45 to-transparent origin-center"
        />
      </div>
    </section>
  );
};

export default Hero;
