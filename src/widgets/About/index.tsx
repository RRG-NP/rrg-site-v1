'use client';

import { FC, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import SectionTitle from '@/components/ui/SectionTitle';
import SectionEyebrow from '@/components/ui/SectionEyebrow';
import SectionOpacity from '@/components/ui/SectionOpacity';

const DESCRIPTION =
  'We are a young, close-knit team of like-minded people ready to help brands prosper in the digital world.';

interface LineData {
  top: number;
  height: number;
  width: number;
  left: number;
}

interface Props {}

const Index: FC<Props> = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLParagraphElement>(null);
  const brightRef = useRef<HTMLParagraphElement>(null);
  const [lines, setLines] = useState<LineData[]>([]);
  const [wrapWidth, setWrapWidth] = useState<number | null>(null);
  const [staticReveal, setStaticReveal] = useState(false);

  const shouldReveal = () =>
    !window.matchMedia('(max-width: 768px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const measureLines = () => {
    const p = dimRef.current;
    if (!p) return;

    const textNode = p.firstChild;
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;

    const pRect = p.getBoundingClientRect();
    setWrapWidth(p.offsetWidth);
    const range = document.createRange();
    range.selectNodeContents(textNode);

    const measured: LineData[] = Array.from(range.getClientRects())
      .filter((rect) => rect.width > 0)
      .map((rect) => ({
        top: rect.top - pRect.top,
        height: rect.height,
        width: rect.width,
        left: rect.left - pRect.left,
      }));

    setLines(measured);
  };

  useEffect(() => {
    if (!shouldReveal()) {
      setStaticReveal(true);
      return;
    }

    // Wait for fonts/layout to settle before measuring
    const raf = requestAnimationFrame(() => {
      measureLines();
    });
    let cancelled = false;
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        if (!cancelled) measureLines();
      });
    }
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, []);


  useEffect(() => {
    if (!shouldReveal()) return;
    let lastWidth = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      requestAnimationFrame(measureLines);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── GSAP: animate each line's clip-path sequentially ────────────────────
  useEffect(() => {
    if (!lines.length || !sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const lineEls = Array.from(sectionRef.current!.querySelectorAll<HTMLDivElement>('.bright-line'));
      if (!lineEls.length) return;

      // Reduced motion: reveal the bright text immediately, no scroll-driven animation.
      if (prefersReducedMotion) {
        gsap.set(lineEls, { clipPath: 'inset(0 0% 0 0)' });
        return;
      }

      // Reset all lines to hidden
      gsap.set(lineEls, { clipPath: 'inset(0 100% 0 0)' });

      // Single timeline - lines are strictly sequential, line N cannot
      // start until line N-1 is 100% done, regardless of scrub lag.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: isMobile ? 'top 80%' : 'top 75%',
          end: isMobile ? '+=80%' : '+=65%',
          scrub: isMobile ? true : 0.5,
          invalidateOnRefresh: true,
        },
      });

      lineEls.forEach((el) => {
        tl.fromTo(el, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', ease: 'none', duration: 1 });
        // No overlap - next line starts at the exact end of this one
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [lines]);

  const pClasses =
    'grow-[4] basis-0 text-[2.3vw] md:text-[4.2vw] md:leading-[1.5] md:text-balance md:text-center';

  return (
    <section id="about" className="relative z-[2] bg-bg-1 py-[6vw] md:py-10">
      <SectionOpacity classes="z-2">
        <div className="px-[6vw] pt-[3vw] md:px-6 md:pt-8 md:text-center">
          <SectionEyebrow label="Who we are" classes="mb-[1.2vw] md:mb-3" />
          <SectionTitle title="ABOUT." classes="z-10" />
        </div>
        <div className="relative self-start px-[6vw] pb-[5vw] pt-[3vw] md:px-6 md:pb-10 md:pt-6">
          <div className="flex space-x-[5vw] md:flex-col md:items-center md:gap-6 md:space-x-0">
            <div ref={sectionRef} className={`relative ${pClasses}`}>
              {/* Layer 1 - dim base text, drives layout */}
              <p ref={dimRef} className="text-white/25">
                {DESCRIPTION}
              </p>

              <p
                ref={brightRef}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 select-none overflow-hidden text-white"
                style={{ clipPath: staticReveal ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
              >
                {DESCRIPTION}
              </p>

              {/* Layer 3 - per-line bright clips, revealed sequentially by GSAP */}
              {lines.map((line, i) => (
                <div
                  key={i}
                  className="bright-line pointer-events-none absolute select-none overflow-hidden text-white"
                  style={{
                    top: line.top,
                    left: line.left,
                    width: line.width,
                    height: line.height + 4,
                    clipPath: 'inset(0 100% 0 0)',
                    // Clip the bright paragraph to only show this line's slice
                    WebkitMaskImage: 'none',
                  }}
                >
                  {/* Inner paragraph mirrors the base exactly, offset so only this line shows */}
                  <p
                    className={`absolute text-white ${pClasses}`}
                    style={{
                      top: -line.top,
                      left: -line.left,
                      width: wrapWidth ?? 'auto',
                      whiteSpace: 'normal',
                    }}
                  >
                    {DESCRIPTION}
                  </p>
                </div>
              ))}
            </div>

            <div className="group/img relative h-[20vw] w-[30vw] grow-[3] basis-0 md:h-[56vw] md:w-full md:max-w-[92%] md:basis-[initial]">
              {/* Offset frame — echoes the outlined type treatment used across sections */}
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-[0.8vw] rounded-[0.4vw] border border-stroke/40 transition-colors duration-500 group-hover/img:border-primary/40 md:-inset-2 md:rounded-md"
              />
              <div className="relative h-full w-full overflow-hidden rounded-[0.25vw] bg-bg-2 md:rounded-sm">
                <Image
                  src="/images/hands_v2.webp"
                  alt="Team collaboration - hands working together"
                  fill
                  sizes="(max-width: 600px) 92vw, 30vw"
                  className="object-cover transition duration-700 ease-out group-hover/img:scale-[1.04] group-hover/img:brightness-110"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </SectionOpacity>
    </section>
  );
};

export default Index;
