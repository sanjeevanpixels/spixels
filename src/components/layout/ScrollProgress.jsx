import { motion, useScroll, useSpring } from 'motion/react';

// Smooth reading-progress indicator
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.2,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="
        fixed left-0 top-0
        z-[100]
        h-[2px] sm:h-[3px]
        w-full
        origin-left
        pointer-events-none
        bg-gradient-to-r
        from-indigo-500
        via-violet-500
        to-indigo-400
        shadow-[0_0_8px_rgba(99,102,241,0.35)]
      "
    />
  );
}