import { useState } from 'react';
import { useMotionValueEvent, useScroll } from 'motion/react';
import Icon from '../ui/Icon';
import { toTop } from '../../lib/scroll';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (value) => setVisible(value > 900));
  if (!visible) return null;
  return (
    <button type="button" onClick={toTop} aria-label="Back to top" data-tooltip="Back to top" className="fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom))] right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md dark:border-neutral-700 dark:bg-[#1A1D26]">
      <Icon name="arrow-up" />
    </button>
  );
}
