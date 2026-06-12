'use client';
import { useRef, useEffect, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { useScroll, useTransform, motion, useSpring, useReducedMotion, type Variants } from 'framer-motion';
import GridPattern from '@/components/ui/GridPattern';
import FloatingParticles from '@/components/ui/FloatingParticles';
import { MOBILE_BREAKPOINT } from '@/shared/utils';

interface HeroProps {
  ready?: boolean;
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Headline words: "RRG" renders solid (white -> lavender gradient), "Tech" renders as outlined type.
const HEADLINE_WORDS = [
  { text: 'RRG', outline: false },
  { text: 'Tech', outline: true },
];

const scrollToSection = (e: ReactMouseEvent<HTMLAnchorElement>, id: string) => {
  e.preventDefault();
  const el = document.getElementById(id);
  el ? el.scrollIntoView({ behavior: 'smooth' }) : window.location.assign(`#${id}`);
};

const Hero = ({ ready = true }: HeroProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const springConfig = { damping: 25, stiffness: 150 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;
    const handle = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 2);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, [mouseX, mouseY, isMobile, prefersReducedMotion]);

  const scrollOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scrollScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const scrollY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const rotateX = useTransform(mouseY, [-1, 1], isMobile ? [0, 0] : [6, -6]);
  const rotateY = useTransform(mouseX, [-1, 1], isMobile ? [0, 0] : [-6, 6]);
  const gradientX = useTransform(mouseX, [-1, 1], [-100, 100]);
  const gradientY = useTransform(mouseY, [-1, 1], [-100, 100]);

  // Masked per-letter rise; collapses to a plain fade when the user prefers reduced motion.
  const letterVariants: Variants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { y: '115%' },
    visible: (i: number) =>
      prefersReducedMotion
        ? { opacity: 1, transition: { duration: 0.35 } }
        : { y: '0%', transition: { duration: 1.05, delay: 0.18 + i * 0.05, ease: EASE } },
  };

  // Shared entrance for the eyebrow / tagline / CTA blocks, staggered by delay.
  const fadeUp = (delay: number) => ({
    initial: false as const,
    animate: ready ? { opacity: 1, y: 0 } : prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 28 },
    transition: { duration: prefersReducedMotion ? 0.35 : 0.95, delay: prefersReducedMotion ? 0 : delay, ease: EASE },
  });

  // Static depth offsets so the mouse tilt reads as layered parallax (disabled on touch / reduced motion).
  const depth = (z: number) => (isMobile || prefersReducedMotion ? undefined : { transform: `translateZ(${z}px)` });

  let letterIndex = 0;

  return (
    <section id="main" ref={containerRef} className="relative overflow-hidden bg-black">
      <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
        <GridPattern />
        <FloatingParticles />

        {!isMobile && (
          <motion.div
            style={{ x: gradientX, y: gradientY }}
            className="pointer-events-none absolute left-1/2 top-1/2 z-[5] h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-radial from-primary/[0.16] via-stroke/30 to-transparent mix-blend-screen blur-[120px]" />
            <div className="absolute inset-0 animate-pulse-slow rounded-full bg-gradient-radial from-primary/10 via-stroke/20 to-transparent mix-blend-screen blur-[100px]" />
          </motion.div>
        )}

        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-radial from-transparent via-transparent to-black/70" />
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-transparent to-black/80" />

        <motion.div
          style={{
            opacity: scrollOpacity,
            scale: scrollScale,
            y: scrollY,
            ...(isMobile ? {} : { rotateX, rotateY, transformStyle: 'preserve-3d' as const, perspective: 1000 }),
          }}
          className="relative z-20 mx-auto flex max-w-7xl flex-col items-center justify-center px-4 md:px-6"
        >
          {/* Soft halo behind the headline (replaces per-letter text-shadow, which the reveal masks would clip) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[42%] -z-10 h-[26vw] w-[58vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.08] blur-[110px] md:h-[64vw] md:w-[92vw]"
          />

          <div style={depth(40)}>
            <motion.div
              {...fadeUp(0.05)}
              className="mb-[2.4vw] flex items-center gap-2.5 rounded-full border border-stroke/60 bg-white/[0.04] px-[clamp(1rem,1.3vw,1.5rem)] py-[clamp(0.45rem,0.6vw,0.7rem)] backdrop-blur-md md:mb-7"
            >
              <span className="-mr-[0.28em] text-[clamp(0.6rem,0.8vw,0.75rem)] font-semibold uppercase tracking-[0.28em] text-text-1/70">
                Creative Digital Agency in Kathmandu
              </span>
            </motion.div>
          </div>

          <div style={depth(70)}>
            <h1
              aria-label="RRG Tech"
              className="mb-[1.8vw] flex flex-wrap justify-center gap-x-[0.18em] text-center text-[14vw] font-black leading-[0.95] tracking-tight md:mb-5 md:text-[23vw] lg:text-[11vw]"
            >
              {HEADLINE_WORDS.map((word) => (
                <span
                  key={word.text}
                  aria-hidden="true"
                  className={`-mx-[0.04em] -my-[0.12em] inline-block overflow-hidden px-[0.04em] py-[0.12em] ${
                    word.outline ? 'group/outline' : ''
                  }`}
                >
                  {Array.from(word.text).map((letter, i) => (
                    <motion.span
                      key={`${word.text}-${i}`}
                      custom={letterIndex++}
                      variants={letterVariants}
                      initial={false}
                      animate={ready ? 'visible' : 'hidden'}
                      className={`inline-block will-change-transform ${
                        word.outline
                          ? 'text-transparent transition-colors duration-700 group-hover/outline:text-primary/80'
                          : 'bg-gradient-to-b from-white via-white to-primary bg-clip-text text-transparent'
                      }`}
                      style={word.outline ? { WebkitTextStroke: '0.02em rgba(204, 194, 220, 0.6)' } : undefined}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              ))}
            </h1>
          </div>

          <div style={depth(35)}>
            <motion.p
              {...fadeUp(0.55)}
              className="mx-auto mb-[3vw] max-w-3xl px-6 text-center text-[2vw] font-medium leading-[1.65] text-text-1/60 md:mb-9 md:text-[4.4vw] lg:text-[1.35vw]"
            >
              We craft websites, apps, and brands that people <span className="text-primary">remember</span>.
            </motion.p>
          </div>

          <div style={depth(25)}>
            <motion.div
              {...fadeUp(0.72)}
              className="flex flex-wrap items-center justify-center gap-[1.2vw] md:w-full md:flex-col md:items-stretch md:gap-3 md:px-6"
            >
              <a
                href="#cta"
                onClick={(e) => scrollToSection(e, 'cta')}
                className="inline-flex items-center justify-center rounded-full bg-primary px-[2.4em] py-[1em] text-[clamp(0.8rem,1vw,1rem)] font-semibold uppercase tracking-[0.12em] text-bg-1 transition duration-300 hover:-translate-y-[2px] hover:bg-text-1 hover:shadow-[0_0_50px_rgba(204,194,220,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black active:translate-y-0 md:text-[3.4vw]"
              >
                Start a project
              </a>
              <a
                href="#services"
                onClick={(e) => scrollToSection(e, 'services')}
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-stroke px-[2.4em] py-[1em] text-[clamp(0.8rem,1vw,1rem)] font-medium uppercase tracking-[0.12em] text-text-1/80 transition duration-300 hover:border-primary/70 hover:text-text-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black md:text-[3.4vw]"
              >
                See what we do
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path
                    d="M5 12h14m0 0l-6-6m6 6l-6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </motion.div>
          </div>
        </motion.div>

        <div className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/[0.06] blur-[120px] md:hidden" />
        <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-stroke/30 blur-[120px] md:hidden" />
      </div>

      {/* Horizon glow peeking over the section divider */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 z-[25] h-[24vw] w-[90vw] -translate-x-1/2 translate-y-1/2 rounded-full bg-primary/[0.07] blur-[100px]" />

      <div className="absolute -bottom-2 left-0 right-0 z-30 h-24 md:h-32 lg:h-48">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 h-full w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 0C240 40 480 60 720 60C960 60 1200 40 1440 0V120H0V0Z" className="fill-bg-1" />
        </svg>
      </div>

      <div
        className="pointer-events-none absolute left-1/2 z-[50] flex -translate-x-1/2 flex-col items-center gap-2"
        style={{ bottom: 'clamp(5rem, 11vw, 9rem)' }}
      >
        <motion.div
          initial={false}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.7, delay: 1.0, ease: EASE }}
        >
          <motion.div
            animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1.5"
          >
            <span className="text-[9px] uppercase tracking-[0.35em] text-text-1/40">Scroll</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-text-1/40" aria-hidden="true">
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
          initial={false}
          animate={ready ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 1.9, delay: 1.05, ease: EASE }}
          className="mt-2 h-px w-16 origin-center bg-gradient-to-r from-transparent via-primary/40 to-transparent md:w-24 lg:w-36"
        />
      </div>
    </section>
  );
};

export default Hero;
