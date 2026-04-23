'use client';

import { FC, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import SectionTitle from '@/components/ui/SectionTitle';
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

  // ── Measure rendered line positions from the dim paragraph ──────────────
  const measureLines = () => {
    const p = dimRef.current;
    if (!p) return;

    const textNode = p.firstChild;
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;

    const text = textNode.textContent ?? '';
    const pRect = p.getBoundingClientRect();
    const measured: LineData[] = [];

    let lineStart = 0;
    let prevTop: number | null = null;

    for (let i = 0; i <= text.length; i++) {
      const isEnd = i === text.length;
      let charTop = 0;

      if (!isEnd) {
        const r = document.createRange();
        r.setStart(textNode, i);
        r.setEnd(textNode, i + 1);
        charTop = r.getBoundingClientRect().top;
      }

      if (prevTop === null && !isEnd) {
        prevTop = charTop;
        lineStart = i;
        continue;
      }

      if (isEnd || Math.abs(charTop - prevTop!) > 2) {
        const lineRange = document.createRange();
        lineRange.setStart(textNode, lineStart);
        lineRange.setEnd(textNode, isEnd ? text.length : i);
        const rect = lineRange.getBoundingClientRect();

        measured.push({
          top: rect.top - pRect.top,
          height: rect.height,
          width: rect.width,
          left: rect.left - pRect.left,
        });

        if (!isEnd) {
          prevTop = charTop;
          lineStart = i;
        }
      }
    }

    setLines(measured);
  };

  useEffect(() => {
    // Wait for fonts/layout to settle before measuring
    const raf = requestAnimationFrame(() => {
      measureLines();
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Rebuild on resize
  useEffect(() => {
    const onResize = () => requestAnimationFrame(measureLines);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── GSAP: animate each line's clip-path sequentially ────────────────────
  useEffect(() => {
    if (!lines.length || !sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.innerWidth < 768;

    // On mobile: normalizeScroll prevents the browser address bar resize
    // from causing position jumps and glitches on reverse scroll
    if (isMobile) {
      ScrollTrigger.normalizeScroll(true);
    }

    const ctx = gsap.context(() => {
      const lineEls = sectionRef.current!.querySelectorAll<HTMLDivElement>('.bright-line');
      if (!lineEls.length) return;

      lineEls.forEach((el, i) => {
        // Desktop: start later (lower %) so text reveals further down the page
        // Mobile: start earlier since viewport is taller relative to content
        const startVh = isMobile
          ? 85 - i * 18   // mobile: line0: 85%, line1: 67%, line2: 49%
          : 65 - i * 15;  // desktop: line0: 65%, line1: 50%, line2: 35%

        const rangeVh = isMobile ? 20 : 18;
        const endVh = startVh - rangeVh;

        gsap.fromTo(
          el,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `top ${startVh}%`,
              end: `top ${endVh}%`,
              scrub: isMobile ? true : 2,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      if (isMobile) ScrollTrigger.normalizeScroll(false);
    };
  }, [lines]);

  const pClasses =
    'grow-[4] basis-0 text-[2.3vw] md:text-[4.2vw] md:leading-[1.5] md:text-balance md:text-center';

  return (
    <section id="about" className="relative bg-bg-1 py-[6vw] md:py-10 z-[2]">
      <SectionOpacity classes="z-2">
        <SectionTitle title="ABOUT." classes="px-[6vw] md:px-6 pt-[3vw] md:pt-8 z-10" />
        <div className="relative self-start px-[6vw] md:px-6 pb-[5vw] md:pb-10 pt-[3vw] md:pt-6">
          <div className="flex space-x-[5vw] md:space-x-0 md:flex-col md:gap-6 md:items-center">

            <div ref={sectionRef} className={`relative ${pClasses}`}>

              {/* Layer 1 — dim base text, drives layout */}
              <p ref={dimRef} className="text-white/25">
                {DESCRIPTION}
              </p>

              {/* Layer 2 — bright text, always rendered but fully clipped */}
              <p
                ref={brightRef}
                aria-hidden="true"
                className="absolute inset-0 text-white pointer-events-none select-none overflow-hidden"
                style={{ clipPath: 'inset(0 100% 0 0)' }}
              >
                {DESCRIPTION}
              </p>

              {/* Layer 3 — per-line bright clips, revealed sequentially by GSAP */}
              {lines.map((line, i) => (
                <div
                  key={i}
                  className="bright-line absolute text-white pointer-events-none select-none overflow-hidden"
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
                      width: dimRef.current?.offsetWidth ?? 'auto',
                      whiteSpace: 'normal',
                    }}
                  >
                    {DESCRIPTION}
                  </p>
                </div>
              ))}
            </div>

            <div className="relative h-[20vw] w-[30vw] md:h-[56vw] md:max-w-[92%] md:text-center grow-[3] md:w-full basis-0 md:basis-[initial] bg-bg-2">
              <Image
                src="/images/hands_v2.webp"
                alt="Team collaboration - hands working together"
                fill
                sizes="(max-width: 600px) 92vw, 30vw"
                className="object-cover rounded-[0.125vw] md:rounded-sm hover:brightness-110 transition"
                priority={false}
              />
            </div>
          </div>
        </div>
      </SectionOpacity>
    </section>
  );
};

export default Index;
