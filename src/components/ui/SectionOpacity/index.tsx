import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

interface Props {
  children: ReactNode;
  classes?: string;
  offset?: any;
}

const Index: FC<Props> = ({ children, classes, offset }) => {
  const container = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    setEnabled(!isMobile && !prefersReducedMotion);
  }, [prefersReducedMotion]);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: offset || ['end 0.9', 'start 0.9'],
  });
  const fade = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div className={classes} ref={container} style={{ opacity: enabled ? fade : 1 }}>
      {children}
    </motion.div>
  );
};
export default Index;
