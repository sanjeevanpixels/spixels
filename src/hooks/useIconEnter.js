import { useCallback } from 'react';
import { animate } from 'motion';
import { ICON_ANIMS } from '../lib/motion';

// Returns a pointer-enter handler that plays a micro-animation on the element's <svg>
export default function useIconEnter(kind) {
  return useCallback(
    (e) => {
      const anim = ICON_ANIMS[kind];
      if (!anim || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const svg = e.currentTarget.querySelector('svg');
      if (svg) animate(svg, anim[0], { duration: anim[1], ease: 'easeOut' });
    },
    [kind]
  );
}
