'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/** Thin progress bar at the top of the viewport tracking read position. */
export default function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.2 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[3000] h-[3px] origin-left bg-primary"
    />
  );
}
