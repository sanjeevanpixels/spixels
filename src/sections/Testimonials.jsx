import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Icon from '../components/ui/Icon';
import { TESTIMONIALS } from '../data/content';

const EASE = [0.22, 1, 0.36, 1];
const SWIPE_THRESHOLD = 44;
const AUTOPLAY_MS = 7000;

/* Validate and remove duplicate testimonials */
const PEOPLE = (() => {
  const seen = new Set();

  return TESTIMONIALS.filter((entry) => {
    const valid =
      entry &&
      typeof entry.id === 'string' &&
      entry.id.trim() &&
      typeof entry.name === 'string' &&
      entry.name.trim() &&
      typeof entry.quote === 'string' &&
      entry.quote.trim();

    if (!valid || seen.has(entry.id)) return false;

    seen.add(entry.id);
    return true;
  });
})();

/* Generate initials */
const initialsOf = (name) =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

/* Profile image with fallback */
function Portrait({ person }) {
  const [failed, setFailed] = useState(false);

  return person.portrait && !failed ? (
    <img
      src={person.portrait}
      alt=""
      draggable="false"
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="h-full w-full select-none object-cover object-[50%_25%]"
    />
  ) : (
    <span className="grid w-full h-full text-sm font-semibold text-white place-items-center bg-gradient-to-br from-gray-500 to-fuchsia-500">
      {initialsOf(person.name)}
    </span>
  );
}

/* Testimonial quote and author */
function QuoteContent({ person, sizer = false }) {
  const meta = [person.role, person.company].filter(Boolean).join(', ');

  return (
    <>
      <blockquote className="m-0 max-w-[700px] font-bricolage text-[length:clamp(23px,2.8vw,38px)] font-medium leading-[1.25] tracking-[-0.035em] text-slate-900 [text-wrap:pretty] dark:text-white">
        {person.quote.trim()}
      </blockquote>

      <figcaption className="flex items-center gap-4 mt-9 min-h-12">
        <span
          className={`h-12 w-12 shrink-0 overflow-hidden rounded-full bg-slate-200 ${
            sizer
              ? 'invisible'
              : 'ring-2 ring-gray-500/80 ring-offset-2 ring-offset-white dark:ring-gray-300/80 dark:ring-offset-[#12152A]'
          }`}
        >
          <Portrait person={person} />
        </span>

        <span className="min-w-0">
          <span className="block text-base font-semibold leading-6 truncate text-slate-900 dark:text-white">
            {person.name}
          </span>

          {meta && (
            <span className="mt-0.5 block truncate text-sm leading-5 text-slate-500 dark:text-white/60">
              {meta}
            </span>
          )}
        </span>
      </figcaption>
    </>
  );
}

/* Navigation button styles */
const arrowClass =
  'grid h-11 w-11 shrink-0 place-items-center rounded-full border border-slate-900/10 bg-white text-slate-900 transition duration-200 active:scale-95 [@media(hover:hover)]:hover:bg-slate-900 [@media(hover:hover)]:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-white/15 dark:bg-white/5 dark:text-white dark:[@media(hover:hover)]:hover:bg-white dark:[@media(hover:hover)]:hover:text-slate-900 dark:focus-visible:ring-pink-300 dark:focus-visible:ring-offset-[#12152A]';

export default function Testimonials() {
  const count = PEOPLE.length;

  const [{ index, dir }, setView] = useState({
    index: 0,
    dir: 1,
  });

  const [paused, setPaused] = useState(false);

  const reduceMotion = useReducedMotion();

  const touch = useRef(null);
  const itemRefs = useRef([]);
  const firstRender = useRef(true);

  const active = PEOPLE[index] ?? null;

  const autoplay = count > 1 && !reduceMotion;

  /* Navigate between testimonials */
  const go = useCallback(
    (delta) => {
      if (count > 1) {
        setView((v) => ({
          index: (v.index + delta + count) % count,
          dir: delta > 0 ? 1 : -1,
        }));
      }
    },
    [count],
  );

  const pick = (i) => {
    setView((v) =>
      i === v.index
        ? v
        : {
            index: i,
            dir: i > v.index ? 1 : -1,
          },
    );
  };

  /* Keep selected profile visible */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    itemRefs.current[index]?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [index, reduceMotion]);

  /* Keyboard navigation */
  const onKeyDown = (event) => {
    if (
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    ) {
      return;
    }

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

  /* Touch navigation */
  const onTouchStart = (event) => {
    const t = event.touches[0];

    touch.current = t
      ? {
          x: t.clientX,
          y: t.clientY,
        }
      : null;
  };

  const onTouchEnd = (event) => {
    const start = touch.current;
    const t = event.changedTouches[0];

    touch.current = null;

    if (!start || !t) return;

    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;

    if (
      Math.abs(dx) > SWIPE_THRESHOLD &&
      Math.abs(dx) > Math.abs(dy)
    ) {
      go(dx < 0 ? 1 : -1);
    }
  };

  /* Quote animation */
  const quoteVariants = useMemo(
    () => ({
      enter: (d) =>
        reduceMotion
          ? { opacity: 0 }
          : {
              opacity: 0,
              x: d * 32,
              filter: 'blur(8px)',
            },

      center: reduceMotion
        ? {
            opacity: 1,
            transition: { duration: 0.2 },
          }
        : {
            opacity: 1,
            x: 0,
            filter: 'blur(0px)',
            transition: {
              duration: 0.55,
              ease: EASE,
            },
          },

      exit: (d) =>
        reduceMotion
          ? {
              opacity: 0,
              transition: { duration: 0.1 },
            }
          : {
              opacity: 0,
              x: d * -32,
              filter: 'blur(8px)',
              transition: {
                duration: 0.25,
                ease: EASE,
              },
            },
    }),
    [reduceMotion],
  );

  /* Autoplay progress */
  const progressStyle = {
    animation: `tst-progress-x ${AUTOPLAY_MS}ms linear forwards`,
    animationPlayState: paused ? 'paused' : 'running',
  };

  const progressStyleY = {
    ...progressStyle,
    animationName: 'tst-progress-y',
  };

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="relative flex items-center px-6 py-20 overflow-hidden isolate text-slate-900 dark:text-white sm:px-10 sm:py-24 lg:px-12 lg:py-28"
    >
      {/* Progress animations */}
      <style>{`
        @keyframes tst-progress-x {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        @keyframes tst-progress-y {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
      `}</style>

      {/* Main container */}
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="Client testimonials"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={() => (touch.current = null)}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className="mx-auto w-full max-w-[1160px] min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-pink-500/70"
      >
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h2
            id="testimonials-title"
            className="max-w-[580px] font-bricolage text-[length:clamp(30px,3.2vw,44px)] font-bold leading-[1.08] tracking-[-0.04em] [text-wrap:balance]"
          >
            Words from the people I work with.
          </h2>

          {/* Navigation controls */}
          {count > 1 && (
            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden mr-1 text-sm tabular-nums text-slate-500 dark:text-white/60 sm:block">
                {index + 1} / {count}
              </span>

              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous testimonial"
                data-tooltip="Previous testimonial"
                className={arrowClass}
              >
                <Icon name="arrow-left" />
              </button>

              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next testimonial"
                data-tooltip="Next testimonial"
                className={arrowClass}
              >
                <Icon name="arrow-right" />
              </button>
            </div>
          )}
        </div>

        {/* Main testimonial content */}
        {active ? (
          <div className="mt-14 grid w-full min-w-0 grid-cols-1 items-center gap-12 sm:mt-16 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-20">
            {/* Left: Testimonial quote */}
            <div className="relative min-w-0">
              {/* Decorative quotation mark */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-10 left-0 select-none bg-gradient-to-br from-gray-500 to-fuchsia-500 bg-clip-text font-bricolage text-[8rem] font-bold leading-none text-transparent opacity-30 sm:-top-12 sm:text-[10rem]"
              >
                &ldquo;
              </span>

              <div className="relative">
                {/* Invisible height reservation */}
                <div
                  aria-hidden="true"
                  className="grid invisible pointer-events-none select-none"
                >
                  {PEOPLE.map((person) => (
                    <figure
                      key={person.id}
                      className="col-start-1 row-start-1 m-0"
                    >
                      <QuoteContent person={person} sizer />
                    </figure>
                  ))}
                </div>

                {/* Active quote */}
                <div
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${count}`}
                  aria-live={paused || !autoplay ? 'polite' : 'off'}
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
            </div>

            {/* Right: Profile navigation */}
            {count > 1 && (
              <div
                role="group"
                aria-label="Choose a testimonial"
                className="flex w-full min-w-0 snap-x gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:snap-none lg:flex-col lg:gap-2 lg:overflow-visible lg:pb-0"
              >
                {PEOPLE.map((person, i) => {
                  const isActive = i === index;

                  const meta = [
                    person.role,
                    person.company,
                  ]
                    .filter(Boolean)
                    .join(', ');

                  return (
                    <button
                      key={person.id}
                      ref={(el) => (itemRefs.current[i] = el)}
                      type="button"
                      onClick={() => pick(i)}
                      aria-label={`Show testimonial from ${person.name}`}
                      aria-current={isActive ? 'true' : undefined}
                      className={`group relative flex w-[230px] shrink-0 snap-center items-center gap-4 rounded-xl px-3 py-3.5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 dark:focus-visible:ring-pink-300 lg:w-full lg:px-4 lg:py-4 ${
                        isActive
                          ? 'bg-pink-500/[0.07] dark:bg-white/[0.06]'
                          : '[@media(hover:hover)]:hover:bg-slate-900/[0.03] dark:[@media(hover:hover)]:hover:bg-white/[0.04]'
                      }`}
                    >
                      {/* Progress track */}
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 h-px inset-x-3 bg-slate-900/10 dark:bg-white/15 lg:inset-y-3 lg:left-0 lg:right-auto lg:h-auto lg:w-px"
                      />

                      {/* Active progress indicator */}
                      {isActive && (
                        <>
                          <span
                            aria-hidden="true"
                            key={`x-${index}`}
                            onAnimationEnd={
                              autoplay ? () => go(1) : undefined
                            }
                            style={
                              autoplay
                                ? progressStyle
                                : { transform: 'scaleX(1)' }
                            }
                            className="absolute inset-x-3 bottom-0 h-0.5 origin-left rounded-full bg-pink-500 dark:bg-pink-300 lg:hidden"
                          />

                          <span
                            aria-hidden="true"
                            key={`y-${index}`}
                            onAnimationEnd={
                              autoplay ? () => go(1) : undefined
                            }
                            style={
                              autoplay
                                ? progressStyleY
                                : { transform: 'scaleY(1)' }
                            }
                            className="absolute inset-y-3 left-0 hidden w-0.5 origin-top rounded-full bg-pink-500 dark:bg-pink-300 lg:block"
                          />
                        </>
                      )}

                      {/* Profile image */}
                      <span
                        className={`h-11 w-11 shrink-0 overflow-hidden rounded-full bg-slate-200 transition duration-300 dark:bg-white/10 ${
                          isActive
                            ? ''
                            : 'opacity-60 grayscale [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:grayscale-0'
                        }`}
                      >
                        <Portrait person={person} />
                      </span>

                      {/* Profile information */}
                      <span className="flex-1 min-w-0">
                        <span
                          className={`block truncate text-sm font-semibold leading-5 ${
                            isActive
                              ? 'text-slate-900 dark:text-white'
                              : 'text-slate-600 dark:text-white/70'
                          }`}
                        >
                          {person.name}
                        </span>

                        {meta && (
                          <span className="block mt-1 text-xs leading-5 truncate text-slate-500 dark:text-white/50">
                            {meta}
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Empty state */
          <div className="max-w-xl mt-14">
            <p className="text-base text-slate-800 dark:text-white/80 sm:text-lg">
              Client testimonials are coming soon.
            </p>

            {import.meta.env?.DEV && (
              <p className="mt-2 text-sm text-slate-500 dark:text-white/50">
                Add quotes and portraits in{' '}
                <code className="text-slate-700 dark:text-white/70">
                  src/data/content.js
                </code>{' '}
                to enable the slider.
              </p>
            )}

            <a
              href="/contact"
              data-app-route=""
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-slate-900 px-5 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-white dark:text-[#12152A] dark:focus-visible:ring-pink-300 dark:focus-visible:ring-offset-[#12152A]"
            >
              Start a conversation
              <Icon name="arrow-right" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}