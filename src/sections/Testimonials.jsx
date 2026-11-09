import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Icon from '../components/ui/Icon';
import MeshGradient from '../components/ui/MeshGradient';
import { TESTIMONIALS } from '../data/content';

const EASE = [0.22, 1, 0.36, 1];
const SWIPE_THRESHOLD = 44;

// Keep only valid, unique testimonials (scoped in a function so nothing leaks at module level).
const PEOPLE = (() => {
  const seen = new Set();
  return TESTIMONIALS.filter((entry) => {
    const valid =
      entry &&
      typeof entry.id === 'string' && entry.id.trim() &&
      typeof entry.name === 'string' && entry.name.trim() &&
      typeof entry.quote === 'string' && entry.quote.trim();
    if (!valid || seen.has(entry.id)) return false;
    seen.add(entry.id);
    return true;
  });
})();

const initialsOf = (name) =>
  name.trim().split(/\s+/).filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase();

/* Portrait with an initials fallback if the image is missing or fails to load. */
function Portrait({
  person,
  initialsClass = 'text-sm',
  fallbackClass = 'bg-gradient-to-br from-violet-500 to-fuchsia-500',
  eager = false,
}) {
  const [failed, setFailed] = useState(false);
  return person.portrait && !failed ? (
    <img
      src={person.portrait}
      alt=""
      draggable="false"
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      // object-top keeps faces in frame when the box is wider than the photo.
      className="h-full w-full select-none object-cover object-[50%_25%]"
    />
  ) : (
    <span
      aria-hidden="true"
      className={`grid h-full w-full place-items-center font-semibold text-white ${fallbackClass} ${initialsClass}`}
    >
      {initialsOf(person.name)}
    </span>
  );
}

/* Quote + author. Rendered once animated (visible) and once static (invisible sizer). */
function QuoteContent({ person }) {
  const meta = [person.role, person.company].filter(Boolean).join(', ');
  return (
    <>
      <span
        aria-hidden="true"
        className="mb-2 block h-9 select-none font-bricolage text-7xl leading-[0.9] text-violet-500 dark:text-violet-300"
      >
        &ldquo;
      </span>
      <blockquote className="m-0 font-bricolage text-[length:clamp(20px,2.4vw,32px)] font-medium leading-[1.3] tracking-[-0.02em] text-slate-900 [text-wrap:pretty] dark:text-white">
        {person.quote.trim()}
      </blockquote>
      <figcaption className="mt-6">
        <span className="block text-base font-semibold text-slate-900 dark:text-white">{person.name}</span>
        {meta && <span className="mt-0.5 block text-sm text-slate-500 dark:text-white/60">{meta}</span>}
      </figcaption>
    </>
  );
}

// 44px touch target, hover styles only on devices that actually hover (no "stuck" hover on phones).
const arrowClass =
  'grid h-11 w-11 shrink-0 place-items-center rounded-full border border-slate-900/10 bg-white text-slate-900 transition duration-200 active:scale-95 [@media(hover:hover)]:hover:bg-slate-900 [@media(hover:hover)]:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 motion-reduce:transition-none dark:border-white/15 dark:bg-white/5 dark:text-white dark:[@media(hover:hover)]:hover:bg-white dark:[@media(hover:hover)]:hover:text-slate-900 dark:focus-visible:ring-violet-300 dark:focus-visible:ring-offset-[#12141F]';

export default function Testimonials() {
  const count = PEOPLE.length;
  const [{ index, dir }, setView] = useState({ index: 0, dir: 1 });
  const reduceMotion = useReducedMotion();
  const touch = useRef(null);
  const active = PEOPLE[index] ?? null;

  const go = useCallback(
    (delta) => {
      if (count > 1) {
        setView((v) => ({ index: (v.index + delta + count) % count, dir: delta > 0 ? 1 : -1 }));
      }
    },
    [count],
  );

  const pick = (i) => setView((v) => (i === v.index ? v : { index: i, dir: i > v.index ? 1 : -1 }));

  // Preload the neighbouring portraits so slides never pop in late.
  useEffect(() => {
    if (count < 2) return;
    [index + 1, index - 1].forEach((i) => {
      const src = PEOPLE[(i + count) % count]?.portrait;
      if (src) new Image().src = src;
    });
  }, [index, count]);

  const onKeyDown = (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      go(event.key === 'ArrowRight' ? 1 : -1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      pick(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      pick(count - 1);
    }
  };

  const onTouchStart = (event) => {
    const t = event.touches[0];
    touch.current = t ? { x: t.clientX, y: t.clientY } : null;
  };

  const onTouchEnd = (event) => {
    const start = touch.current;
    const t = event.changedTouches[0];
    touch.current = null;
    if (!start || !t) return;
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    // Only clearly horizontal swipes navigate, so vertical scrolling is untouched.
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
  };

  // The quote slides in from the direction you're travelling.
  const quoteVariants = useMemo(
    () => ({
      enter: (d) => (reduceMotion ? { opacity: 0 } : { opacity: 0, x: d * 28, filter: 'blur(6px)' }),
      center: reduceMotion
        ? { opacity: 1, transition: { duration: 0.2 } }
        : { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: EASE } },
      exit: (d) =>
        reduceMotion
          ? { opacity: 0, transition: { duration: 0.1 } }
          : { opacity: 0, x: d * -28, filter: 'blur(6px)', transition: { duration: 0.25, ease: EASE } },
    }),
    [reduceMotion],
  );

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="bg-white px-3 py-4 dark:bg-[#0D0F17] sm:px-6 sm:py-6"
    >
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="Client testimonials"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={() => (touch.current = null)}
        className="mx-auto flex w-full max-w-[1680px] flex-col gap-6 rounded-[24px] bg-slate-50 p-4 text-slate-900 outline-none ring-1 ring-black/5 [touch-action:pan-y] focus-visible:ring-2 focus-visible:ring-violet-500/70 dark:bg-[#12141F] dark:text-white dark:ring-white/10 dark:focus-visible:ring-violet-300/70 sm:gap-8 sm:rounded-[32px] sm:p-6 lg:gap-10 lg:rounded-[40px] lg:p-10"
      >
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <h2
            id="testimonials-title"
            className="max-w-xl font-bricolage text-[length:clamp(28px,3.6vw,46px)] font-bold leading-[1.05] tracking-[-0.04em] [text-wrap:balance]"
          >
            Words from the people I work with.
          </h2>

          {count > 1 && (
            <div className="flex items-center justify-between w-full gap-3 sm:w-auto sm:justify-end">
              <span aria-hidden="true" className="min-w-[3.5rem] text-sm tabular-nums text-slate-500 dark:text-white/60 sm:text-right">
                {index + 1} of {count}
              </span>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => go(-1)} aria-label="Previous testimonial" data-tooltip="Previous testimonial" className={arrowClass}>
                  <Icon name="arrow-left" />
                </button>
                <button type="button" onClick={() => go(1)} aria-label="Next testimonial" data-tooltip="Next testimonial" className={arrowClass}>
                  <Icon name="arrow-right" />
                </button>
              </div>
            </div>
          )}
        </div>

        {active ? (
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
            {/* Portrait stage: full-bleed photo, no frame. The mesh gradient shows during crossfades and as the fallback. */}
            <div
              aria-hidden="true"
              className="relative isolate aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-cyan-400 sm:aspect-[16/10] sm:rounded-3xl lg:aspect-auto lg:min-h-[30rem]"
            >
              <div className="absolute inset-0 overflow-hidden">
                <MeshGradient />
              </div>
              <AnimatePresence initial={false}>
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.05 }}
                  animate={{ opacity: 1, scale: 1, transition: { duration: reduceMotion ? 0.2 : 0.6, ease: EASE } }}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                  className="absolute inset-0"
                >
                  <Portrait
                    key={`${active.id}-${active.portrait}`}
                    person={active}
                    eager
                    initialsClass="text-5xl sm:text-6xl"
                    fallbackClass="bg-white/10 backdrop-blur-sm"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Quote + roster */}
            <div className="flex flex-col justify-between min-w-0 gap-8 lg:gap-10">
              <div className="relative">
                {/* Invisible copies of every quote reserve the height of the tallest one, so nothing jumps. */}
                <div aria-hidden="true" className="grid invisible pointer-events-none select-none">
                  {PEOPLE.map((person) => (
                    <figure key={person.id} className="col-start-1 row-start-1 m-0">
                      <QuoteContent person={person} />
                    </figure>
                  ))}
                </div>

                <div
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${count}`}
                  aria-live="polite"
                  aria-atomic="true"
                  className="absolute inset-0"
                >
                  <AnimatePresence initial={false} custom={dir}>
                    <motion.figure
                      key={active.id}
                      custom={dir}
                      variants={quoteVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="absolute inset-0 m-0"
                    >
                      <QuoteContent person={active} />
                    </motion.figure>
                  </AnimatePresence>
                </div>
              </div>

              {count > 1 && (
                <div role="group" aria-label="Choose a testimonial" className="flex flex-wrap items-center gap-3 p-1">
                  {PEOPLE.map((person, i) => {
                    const isActive = i === index;
                    return (
                      <button
                        key={person.id}
                        type="button"
                        onClick={() => pick(i)}
                        aria-label={`Show testimonial from ${person.name}`}
                        aria-current={isActive ? 'true' : undefined}
                        data-tooltip={person.name}
                        className={`h-12 w-12 shrink-0 overflow-hidden rounded-full transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 motion-reduce:transition-none dark:focus-visible:ring-violet-300 dark:focus-visible:ring-offset-[#12141F] ${
                          isActive
                            ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-slate-50 dark:ring-violet-300 dark:ring-offset-[#12141F]'
                            : 'opacity-60 grayscale [@media(hover:hover)]:hover:opacity-100 [@media(hover:hover)]:hover:grayscale-0'
                        }`}
                      >
                        <Portrait key={`${person.id}-${person.portrait}`} person={person} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-xl rounded-3xl border border-slate-900/10 bg-white px-6 py-8 dark:border-white/10 dark:bg-white/[0.04] sm:px-10">
            <p className="text-base text-slate-800 dark:text-white/80 sm:text-lg">Client testimonials are coming soon.</p>
            {/* Developer hint only shows during development, never to visitors. */}
            {import.meta.env?.DEV && (
              <p className="mt-2 text-sm text-slate-500 dark:text-white/50">
                Add quotes and portraits in <code className="text-slate-700 dark:text-white/70">src/data/content.js</code> to enable the slider.
              </p>
            )}
            <a
              href="/contact"
              data-app-route=""
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-slate-900 px-5 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:bg-white dark:text-[#0D0F17] dark:focus-visible:ring-violet-300 dark:focus-visible:ring-offset-[#12141F]"
            >
              Start a conversation <Icon name="arrow-right" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}