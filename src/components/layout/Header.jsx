import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
} from 'motion/react';
import { RollingText } from '@animate-ui/react/primitives/texts/rolling';
import Icon from '../ui/Icon';
import { RippleButton, RippleButtonRipples } from '@animate-ui/react/primitives/buttons/ripple';
import NavLinks from './NavLinks';
import useScrollSpy from '../../hooks/useScrollSpy';
import { SECTION_TO_NAV } from '../../data/navigation';
import { SPRING } from '../../lib/motion';

const HIDE_AFTER = 120;   // px scrolled before the header may hide (phones only)
const SCROLL_DELTA = 6;   // ignore tiny scroll movements / rubber-banding
const MQ_PHONE = '(max-width: 767px)';
const MQ_DESKTOP_NAV = '(min-width: 1280px)'; // xl: inline nav replaces the hamburger

const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600';

export default function Header({ onResume, minimal = false }) {
  const active = useScrollSpy(SECTION_TO_NAV);
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [brandRoll, setBrandRoll] = useState(0);
  const wrapRef = useRef(null);
  const toggleRef = useRef(null);

  // Phones: hide on scroll down, reveal on scroll up
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => {
    const isPhone = window.matchMedia(MQ_PHONE).matches;
    if (!isPhone || open || y < HIDE_AFTER) return setHidden(false);
    const delta = y - (scrollY.getPrevious() ?? 0);
    if (Math.abs(delta) < SCROLL_DELTA) return;
    setHidden(delta > 0);
  });

  // Never leave the header hidden after growing past the phone breakpoint
  useEffect(() => {
    const mq = window.matchMedia(MQ_PHONE);
    const onChange = (e) => { if (!e.matches) setHidden(false); };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Mobile menu: close on Escape (and restore focus), outside tap, or when the desktop nav appears
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia(MQ_DESKTOP_NAV);
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onMq = (e) => e.matches && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    mq.addEventListener('change', onMq);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
      mq.removeEventListener('change', onMq);
    };
  }, [open]);

  const rollBrand = () => setBrandRoll((n) => n + 1);

  return (
    <motion.div
      ref={wrapRef}
      animate={{ y: hidden ? '-110%' : '0%' }}
      transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 40 }}
      onFocusCapture={() => setHidden(false)} // keyboard focus always reveals the header
      className="sticky top-0 z-50"
    >
      <header className="flex items-center justify-between border-b border-slate-100 bg-white/95 px-4 py-2.5 pt-[calc(0.625rem+env(safe-area-inset-top))] backdrop-blur sm:px-8 sm:py-3 sm:pt-[calc(0.75rem+env(safe-area-inset-top))] lg:px-12 dark:border-neutral-800 dark:bg-[#0D0F17]/95">
        <a
          href={minimal ? '/' : '#home'}
          data-app-route={minimal ? '' : undefined}
          className={`flex min-h-11 items-center gap-2 rounded-md font-bricolage ${FOCUS_RING}`}
          onPointerEnter={(e) => { if (!reduceMotion && e.pointerType === 'mouse') rollBrand(); }}
          aria-label="Sanjeevan, back to top"
        >
          <RollingText
            key={brandRoll}
            text="Sanjeevan."
            inView
            className="text-xl font-extrabold tracking-tight sm:text-2xl"
          />
        </a>

        {!minimal && (
          <nav
            className="relative hidden items-center gap-1 rounded-full bg-[#f4f4f6] p-1.5 shadow-inner xl:flex dark:bg-neutral-800"
            aria-label="Main"
          >
            <NavLinks active={active} />
          </nav>
        )}

        <div className="flex items-center gap-2">
          <RippleButton
            hoverScale={1.025}
            onClick={onResume}
            className={`hidden h-11 items-center gap-2 rounded-full bg-[#f4f4f6] px-5 text-[15px] font-semibold text-[#0D0F17] sm:flex dark:bg-neutral-800 dark:text-white ${FOCUS_RING}`}
          >
            <Icon name="file-text" className="ico !h-4 !w-4" />
            Resume
            <RippleButtonRipples color="rgba(124,58,237,0.2)" />
          </RippleButton>

          {!minimal && (
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((o) => !o)}
              className={`iconbtn grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#f4f4f6] motion-safe:transition-transform motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-95 xl:hidden dark:bg-neutral-800 ${FOCUS_RING}`}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls={open ? 'mobileMenu' : undefined}
            >
              <Icon name={open ? 'x' : 'menu'} />
            </button>
          )}
        </div>
      </header>

      {/* Absolutely positioned so opening it never pushes the page down */}
      <AnimatePresence>
        {open && !minimal && (
          <motion.nav
            id="mobileMenu"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={reduceMotion ? { duration: 0 } : SPRING}
            className="absolute left-4 right-4 top-full mt-2 flex max-h-[calc(100dvh-5rem)] flex-col gap-1 overflow-y-auto rounded-2xl border border-white/60 bg-[#f4f4f6] p-3 shadow-lg sm:left-auto sm:right-8 sm:w-80 lg:right-12 xl:hidden dark:border-neutral-800 dark:bg-neutral-900"
          >
            <NavLinks active={active} variant="mobile" onNavigate={() => setOpen(false)} />
            <RippleButton
              hoverScale={1.01}
              className={`navlink relative min-h-11 w-full justify-start rounded-xl bg-white px-3 sm:hidden dark:bg-neutral-800 ${FOCUS_RING}`}
              onClick={() => { setOpen(false); onResume(); }}
            >
              <Icon name="file-text" className="ico !h-4 !w-4" />
              Resume
              <RippleButtonRipples color="rgba(124,58,237,0.2)" />
            </RippleButton>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.div>
  );
}