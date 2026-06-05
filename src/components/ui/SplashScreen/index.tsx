'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

/** Session flag so the splash only plays once per browser session. */
export const STORAGE_KEY = 'rrg_loader_shown';

const LOGO_SRC = '/images/rrg-white.png';
const FILL_DURATION = 2800; // ms for the 0 -> 100 fill
const GREY = '#6b6b75'; // unfilled (grey) logo colour
const WHITE = '#ffffff'; // fill colour

interface Props {
  /** Fired when the fill completes and the reveal begins (cue the page to fade in behind). */
  onReveal: () => void;
  /** Fired once the splash has fully animated out and can be unmounted. */
  onDone: () => void;
}

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function SplashScreen({ onReveal, onDone }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number>();
  const startRef = useRef<number | null>(null);

  const [count, setCount] = useState(0);
  const [revealing, setRevealing] = useState(false);

  const overlayControls = useAnimationControls();
  const logoControls = useAnimationControls();

  /**
   * Paint one frame: a grey logo with a white "liquid" filled to `progress`,
   * its surface rippling via two summed sine waves. Compositing keeps the
   * grey base and the white fill clipped to the logo's silhouette.
   */
  const draw = useCallback((progress: number, timeMs: number) => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // 1. White logo establishes the silhouette (alpha mask).
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(img, 0, 0, w, h);

    // 2. Grey base, clipped to the silhouette.
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = GREY;
    ctx.fillRect(0, 0, w, h);

    // 3. White wave fill, clipped on top of the grey.
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = WHITE;

    const baseLine = h * (1 - progress);
    const amp = (1 - progress) * h * 0.06 + h * 0.012; // ripple flattens as it fills
    const k = (Math.PI * 2) / (w * 0.5);
    const t = timeMs / 1000;
    const step = Math.max(2, Math.floor(w / 160));

    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, baseLine);
    for (let x = 0; x <= w; x += step) {
      const y =
        baseLine +
        Math.sin(x * k + t * 3.2) * amp +
        Math.sin(x * k * 0.5 + t * 1.9) * amp * 0.6 +
        Math.sin(x * k * 1.7 - t * 2.4) * amp * 0.22;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    ctx.globalCompositeOperation = 'source-over';
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    if (!isMobile) html.style.overflow = 'hidden';

    // Size: ~46% of the smaller viewport edge, capped; backing store oversampled
    // so the logo stays crisp when it scales up during the reveal.
    const cssSize = Math.round(Math.min(260, Math.min(window.innerWidth, window.innerHeight) * 0.46));
    const backScale = Math.min(window.devicePixelRatio || 1, 2) * 2;
    canvas.style.width = `${cssSize}px`;
    canvas.style.height = `${cssSize}px`;
    canvas.width = Math.round(cssSize * backScale);
    canvas.height = Math.round(cssSize * backScale);

    let cancelled = false;
    let lastCount = -1;
    const duration = reducedMotion ? 600 : isMobile ? 1500 : FILL_DURATION;

    const startReveal = async () => {
      if (cancelled) return;
      setRevealing(true);
      onReveal();
      try {
        if (reducedMotion) {
          await overlayControls.start({ opacity: 0, transition: { duration: 0.45 } });
        } else {
          // Subtle dissolve — a gentle "breath" + fade that hands off to the
          // home screen fading in behind. No jarring zoom.
          await Promise.all([
            logoControls.start({
              scale: 1.05,
              opacity: 0,
              transition: { duration: 0.8, delay: 0.25, ease: [0.4, 0, 0.2, 1] },
            }),
            overlayControls.start({
              opacity: 0,
              transition: { duration: 0.9, delay: 0.35, ease: [0.4, 0, 0.2, 1] },
            }),
          ]);
        }
      } finally {
        if (!cancelled) onDone();
      }
    };

    const loop = (now: number) => {
      if (cancelled) return;
      if (startRef.current == null) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(t);

      draw(eased, elapsed);

      const c = Math.max(t > 0 ? 1 : 0, Math.round(eased * 100));
      if (c !== lastCount) {
        lastCount = c;
        setCount(c);
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        draw(1, elapsed);
        startReveal();
      }
    };

    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      rafRef.current = requestAnimationFrame(loop);
    };
    img.onerror = () => {
      // If the asset can't load, don't trap the user behind the splash.
      onReveal();
      onDone();
    };
    img.src = LOGO_SRC;

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (!isMobile) html.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={overlayControls}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black"
      role="progressbar"
      aria-label="Loading site"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={count}
    >
      {/* Soft radial glow for depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial from-white/[0.05] via-transparent to-transparent" />

      <motion.div initial={{ scale: 1 }} animate={logoControls} className="will-change-transform">
        <canvas ref={canvasRef} aria-hidden="true" />
      </motion.div>

      {/* Bottom caption: LOADING + counter + thin progress line */}
      <div
        className="absolute inset-x-0 flex flex-col items-center gap-3"
        style={{ bottom: 'clamp(3rem, 10vh, 6rem)', opacity: revealing ? 0 : 1, transition: 'opacity 300ms' }}
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-white/40">Loading</span>
        <span className="text-3xl font-light tabular-nums text-white/90">
          {String(count).padStart(2, '0')}
          <span className="align-top text-base text-white/30">%</span>
        </span>
        {/* <div className="mt-1 h-px w-40 overflow-hidden bg-white/10">
          <div className="h-full bg-white/60" style={{ width: `${count}%`, transition: 'width 120ms linear' }} />
        </div> */}
      </div>
    </motion.div>
  );
}
