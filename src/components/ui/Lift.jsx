import { motion } from 'motion/react';
import { SPRING } from '../../lib/motion';
import useIconEnter from '../../hooks/useIconEnter';

// Springs up 6px on hover. Pass as="a" | "span" | "div" and optionally ia="wiggle" etc.
export default function Lift({ as = 'div', ia, onPointerEnter, ...props }) {
  const Cmp = motion[as];
  const onEnter = useIconEnter(ia);
  return (
    <Cmp
      whileHover={{ y: -6 }}
      transition={SPRING}
      onPointerEnter={(e) => { onEnter(e); onPointerEnter?.(e); }}
      {...props}
    />
  );
}
