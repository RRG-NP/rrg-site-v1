'use client';

import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect } from 'react';

/**
 * Client-side smooth scrolling. Extracted from the root layout so that
 * `app/layout.tsx` can remain a Server Component (and export metadata).
 * Behaviour is unchanged: Lenis drives ScrollTrigger on pointer devices,
 * and is skipped on mobile where native momentum scroll is smoother.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    let rafId: number;

    if (!isMobile) {
      const lenis = new Lenis({
        wrapper: window,
        content: document.documentElement,
      });

      // Connect Lenis to ScrollTrigger so they share the same scroll position
      lenis.on('scroll', ScrollTrigger.update);

      const raf = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };

      rafId = requestAnimationFrame(raf);

      return () => {
        lenis.destroy();
        cancelAnimationFrame(rafId);
      };
    }

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return <>{children}</>;
}
