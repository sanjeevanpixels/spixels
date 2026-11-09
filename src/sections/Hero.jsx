import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from 'motion/react';
import Icon from '../components/ui/Icon';
import { RippleButton, RippleButtonRipples } from '@animate-ui/react/primitives/buttons/ripple';
import Rise from '../components/ui/Rise';
import { ROLES } from '../data/content';
import { CFG } from '../data/config';
import { externalProps } from '../lib/utils';
import useToast from '../hooks/useToast';

// Shared keyboard focus ring (works in light + dark, matches the page background for the offset).
const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D0F17] focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-[#0D0F17]';

// Eyes follow the pointer, re-aim on scroll, and blink on click / keyboard activation.
function Eyes() {
  const blinkTimer = useRef(null);
  const blinkFrame = useRef(0);
  const eyesRef = useRef(null);
  const frameRef = useRef(0);
  const pointerRef = useRef(null);
  const [blinking, setBlinking] = useState(false);

  const blink = () => {
    clearTimeout(blinkTimer.current);
    cancelAnimationFrame(blinkFrame.current);
    setBlinking(false);
    // Wait one frame so the class is removed first and the CSS animation can restart.
    blinkFrame.current = requestAnimationFrame(() => setBlinking(true));
    blinkTimer.current = setTimeout(() => setBlinking(false), 260);
  };

  useEffect(() => {
    return () => {
      clearTimeout(blinkTimer.current);
      cancelAnimationFrame(blinkFrame.current);
    };
  }, []);

  useEffect(() => {
    const sockets = () => eyesRef.current?.querySelectorAll('.eye-socket') ?? [];

    const centerGaze = () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
      pointerRef.current = null;
      sockets().forEach((socket) => {
        socket.style.setProperty('--pupil-x', '0px');
        socket.style.setProperty('--pupil-y', '0px');
      });
    };

    const updateGaze = () => {
      frameRef.current = 0;
      const pointer = pointerRef.current;
      if (!pointer) return;
      sockets().forEach((socket) => {
        const eye = socket.getBoundingClientRect();
        const pupil = socket.querySelector('.pupil')?.getBoundingClientRect();
        if (!pupil) return;
        const dx = pointer.x - (eye.left + eye.width / 2);
        const dy = pointer.y - (eye.top + eye.height / 2);
        const distance = Math.hypot(dx, dy);
        const travel = Math.max(0, Math.min((eye.width - pupil.width) / 2, (eye.height - pupil.height) / 2) - 3);
        const amount = distance ? Math.min(distance, travel) / distance : 0;
        socket.style.setProperty('--pupil-x', `${dx * amount}px`);
        socket.style.setProperty('--pupil-y', `${dy * amount}px`);
      });
    };

    const schedule = () => {
      if (!frameRef.current) frameRef.current = requestAnimationFrame(updateGaze);
    };

    const followPointer = (event) => {
      if (event.pointerType === 'touch') return;
      pointerRef.current = { x: event.clientX, y: event.clientY };
      schedule();
    };
    const onPointerOut = (event) => {
      if (!event.relatedTarget) centerGaze();
    };

    window.addEventListener('pointermove', followPointer, { passive: true });
    // The eyes move relative to the pointer while scrolling, so re-aim then too.
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('blur', centerGaze);
    document.addEventListener('pointerout', onPointerOut);
    return () => {
      window.removeEventListener('pointermove', followPointer);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('blur', centerGaze);
      document.removeEventListener('pointerout', onPointerOut);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <Rise
      as="button"
      ref={eyesRef}
      type="button"
      i={5}
      onClick={blink}
      aria-label="Move the pointer to look around, or click to blink"
      className={`mt-8 flex shrink-0 select-none justify-center gap-4 rounded-full sm:mt-10 sm:gap-6 ${FOCUS} ${blinking ? 'is-blinking' : ''}`}
    >
      {[0, 1].map((i) => (
        <span
          key={i}
          className="eye-socket flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-[3px] border-[#0d1117] bg-white shadow-[inset_0_2px_8px_rgba(15,23,42,0.1)] dark:border-[#3a4150] sm:size-36"
          aria-hidden="true"
        >
          {/* Pupil is ~61% of the socket at both sizes so the proportions stay identical. */}
          <span className="pupil -mb-1 flex size-[4.25rem] items-center justify-center rounded-full bg-[#0d1117] sm:size-[5.5rem]">
            <span className="eye-rotation">
              <span className="eye-glint" />
            </span>
          </span>
        </span>
      ))}
    </Rise>
  );
}

const ROLE_EMPHASIS = ['people love to use', 'a little delightful', 'people remember'];

function RoleDescription({ role, text, reduceMotion }) {
  const emphasis = ROLE_EMPHASIS[role];
  const start = emphasis ? text.indexOf(emphasis) : -1;
  const end = start + (emphasis?.length ?? 0);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={role}
        aria-hidden="true"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
        // Exit is faster than enter so swapping roles feels snappy, not sluggish.
        transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <p className="font-bricolage text-lg font-semibold text-[#0D0F17] dark:text-white sm:text-xl">{ROLES[role].label}</p>
        <p className="mt-1 text-[15px] leading-6 text-[#666] dark:text-[#A3A3A3] sm:text-base sm:leading-7">
          {start < 0 ? (
            text
          ) : (
            <>
              {text.slice(0, start)}
              <strong className="font-bold text-[#0D0F17] dark:text-white">{emphasis}</strong>
              {text.slice(end)}
            </>
          )}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Hero() {
  const toast = useToast();
  const [role, setRole] = useState(1);
  const nameAnimation = useAnimationControls();
  const reduceMotion = useReducedMotion();

  const wiggleName = () => {
    if (reduceMotion) return;
    nameAnimation.start({ scale: [1, 1.08, 1], rotate: [0, -2, 2, 0], transition: { duration: 0.58, ease: 'easeInOut' } });
  };

  return (
    <section
      id="home"
      className="flex flex-col items-center overflow-hidden bg-white pt-6 text-[#0D0F17] dark:bg-[#0D0F17] dark:text-white sm:pt-8 lg:min-h-[calc(100svh-4.5rem)] lg:justify-between"
    >
      <div className="my-auto max-w-[860px] px-4 text-center">
        <Rise as="button" type="button" i={0} onClick={() => toast('Hi there! 👋')} className={`group mb-3 inline-flex cursor-pointer items-center gap-2 rounded-full px-2 py-1 ${FOCUS}`}>
          <span className="inline-block origin-[75%_75%] text-xl group-hover:animate-wave motion-reduce:group-hover:animate-none" role="img" aria-label="Waving hand">
            👋
          </span>
          <span className="font-bricolage text-[17px] text-[#666] transition-colors group-hover:text-black dark:text-[#A3A3A3] dark:group-hover:text-white">
            Greetings, everyone
          </span>
        </Rise>

        <Rise as="h1" i={1} className="mb-6 font-bricolage tracking-[-0.05em] sm:mb-7" style={{ fontSize: 'clamp(36px, 9vw, 104px)', lineHeight: 1.05 }}>
          <span className="font-medium">I'm </span>
          <motion.button
            type="button"
            onClick={wiggleName}
            animate={nameAnimation}
            className={`inline-block cursor-pointer rounded-xl px-1 font-bold ${FOCUS}`}
          >
            Sanjeevan
          </motion.button>
        </Rise>

        <Rise i={2} role="group" aria-label="Focus areas" className="flex items-center justify-center gap-3 sm:gap-4">
          {ROLES.map((r, i) => {
            const active = i === role;
            return (
              <motion.button
                key={r.label}
                type="button"
                aria-pressed={active}
                aria-label={r.label}
                onClick={() => setRole(i)}
                whileHover={!reduceMotion ? { y: -2 } : undefined}
                whileTap={!reduceMotion ? { scale: 0.94 } : undefined}
                transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                className={`relative flex size-12 flex-none items-center justify-center rounded-full transition-[box-shadow,opacity] duration-300 sm:size-14 ${FOCUS} ${r.bg} ${
                  active ? 'opacity-100 ring-2 ring-[#0D0F17] ring-offset-2 dark:ring-white dark:ring-offset-[#0D0F17]' : 'opacity-60 hover:opacity-100 focus-visible:opacity-100'
                }`}
              >
                <Icon name={r.icon} className="w-5 h-5 sm:h-6 sm:w-6" />
              </motion.button>
            );
          })}
        </Rise>

        {/* Reserved height stops the CTA from jumping when the description length changes. */}
        <Rise i={3} className="mx-auto mt-5 min-h-[104px] max-w-xl px-2 sm:mt-6 sm:min-h-[92px]">
          <span className="sr-only" aria-live="polite">
            {ROLES[role].label}. {ROLES[role].text}
          </span>
          <RoleDescription role={role} text={ROLES[role].text} reduceMotion={reduceMotion} />
        </Rise>

        <Rise i={4} className="mt-6 sm:mt-7">
          <RippleButton asChild hoverScale={reduceMotion ? 1 : 1.025} className={`btn btn-dark h-[52px] px-8 ${FOCUS}`}>
            <a href={CFG.booking} {...externalProps(CFG.booking)}>
              Book a Free Meeting
              <RippleButtonRipples color="rgba(255,255,255,0.22)" />
            </a>
          </RippleButton>
        </Rise>
      </div>
      <Eyes />
    </section>
  );
}