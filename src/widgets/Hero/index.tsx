'use client';
import { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, motion, useSpring } from 'framer-motion';
import GridPattern from '@/components/ui/GridPattern';
import Logo3D from '@/components/ui/Logo3D';
import FloatingParticles from '@/components/ui/FloatingParticles';

const Hero = () => {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Smooth mouse tracking
  const springConfig = { damping: 25, stiffness: 150 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    if (isMobile) return; // Disable mouse tracking on mobile

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const x = (clientX / innerWidth - 0.5) * 2;
      const y = (clientY / innerHeight - 0.5) * 2;
      
      mouseX.set(x);
      mouseY.set(y);
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, isMobile]);

  // Scroll-based transforms
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  // 3D tilt effect based on mouse position (disabled on mobile)
  const rotateX = useTransform(mouseY, [-1, 1], isMobile ? [0, 0] : [5, -5]);
  const rotateY = useTransform(mouseX, [-1, 1], isMobile ? [0, 0] : [-5, 5]);

  return (
    <section 
      id="main" 
      ref={containerRef}
      className="relative bg-black overflow-hidden"
    >
      <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
        {/* Background layers */}
        <GridPattern />
        <Logo3D />
        <FloatingParticles />

        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60 pointer-events-none z-10" />

        {/* Main content with 3D perspective */}
        <motion.div
          style={{
            opacity,
            scale,
            y,
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
            perspective: 1000,
          }}
          className="relative z-20 flex flex-col items-center justify-center px-4 md:px-6 max-w-7xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 md:mb-8"
          >
            <div className="px-4 py-2 md:px-6 md:py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
              <span className="text-white/80 text-xs md:text-sm font-medium tracking-wider">
                rrg.com.np
              </span>
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative text-center text-[15vw] md:text-[18vw] lg:text-[10vw] font-black text-white leading-[0.9] mb-4 md:mb-6"
            style={{
              textShadow: '0 0 80px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 255, 255, 0.2)',
              transform: isMobile ? 'none' : 'translateZ(50px)',
            }}
          >
            RRG Tech
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-center text-[4.5vw] md:text-[5.5vw] lg:text-[2.5vw] font-medium text-white/70 max-w-4xl px-4 leading-relaxed"
            style={{
              transform: isMobile ? 'none' : 'translateZ(30px)',
            }}
          >
            Creative Digital Agency in Kathmandu, Nepal
          </motion.p>

          {/* Animated underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.8, ease: 'easeInOut' }}
            className="mt-6 md:mt-8 h-[2px] w-24 md:w-32 lg:w-48 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            style={{
              transform: isMobile ? 'none' : 'translateZ(20px)',
            }}
          />

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-white/50 text-xs uppercase tracking-widest">
                Scroll
              </span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="text-white/50 md:w-5 md:h-5"
              >
                <path
                  d="M12 5v14m0 0l-7-7m7 7l7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Ambient light effects - reduced on mobile */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-blue-500/10 rounded-full blur-[100px] md:blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-purple-500/10 rounded-full blur-[100px] md:blur-[120px] pointer-events-none" />
      </div>

      {/* Curved transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 lg:h-48 z-30">
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
    </section>
  );
};

export default Hero;
