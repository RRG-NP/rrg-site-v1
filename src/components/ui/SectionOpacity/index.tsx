import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import { cn, MOBILE_MEDIA_QUERY } from '@/shared/utils';

interface Props {
  children: ReactNode;
  classes?: string;
  offset?: any;
}

const AnimatedSection: FC<Props> = ({ children, classes, offset }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: offset || ['end 0.9', 'start 0.9'],
  });
  const fade = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div className={cn('relative', classes)} ref={container} style={{ opacity: fade }}>
      {children}
    </motion.div>
  );
};

const Index: FC<Props> = ({ children, classes, offset }) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isMobile = window.matchMedia(MOBILE_MEDIA_QUERY).matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnabled(!isMobile && !prefersReducedMotion);
  }, []);

  if (!enabled) {
    return <div className={classes}>{children}</div>;
  }

  return (
    <AnimatedSection classes={classes} offset={offset}>
      {children}
    </AnimatedSection>
  );
};
export default Index;
