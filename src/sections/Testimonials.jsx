import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Icon from '../components/ui/Icon';
import { TESTIMONIALS } from '../data/content';

const EASE = [0.22, 1, 0.36, 1];
const SWIPE_THRESHOLD = 44;

// Keep only valid, unique testimonials.
const seenIds = new Set();

const PEOPLE = (Array.isArray(TESTIMONIALS) ? TESTIMONIALS : []).filter((entry) => {
  const valid =
    entry &&
    typeof entry.id === 'string' &&
    entry.id.trim() &&
    typeof entry.name === 'string' &&
    entry.name.trim() &&
    typeof entry.quote === 'string' &&
    entry.quote.trim();

  if (!valid || seenIds.has(entry.id)) return false;

  seenIds.add(entry.id);
  return true;
});

const initialsOf = (name) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

/* Portrait with initials fallback. */
function Portrait({ person, initialsClass = 'text-sm' }) {
  const [failed, setFailed] = useState(false);

  return person.portrait && !failed ? (
    <img
      src={person.portrait}
      alt=""
      draggable="false"
      loading="lazy"
      onError={() => setFailed(true)}
      className="object-cover w-full h-full"
    />
  ) : (
    <span
      aria-hidden="true"
      className={`grid h-full w-full place-items-center bg-gradient-to-br from-violet-500 to-fuchsia-500 font-semibold text-white ${initialsClass}`}
    >
      {initialsOf(person.name)}
    </span>
  );
}

/* Quote and author content. */
function QuoteContent({ person }) {
  const meta = [person.role, person.company].filter(Boolean).join(', ');

  return (
    <>
      <span
        aria-hidden="true"
        className="mb-2 block h-9 select-none font-bricolage text-7xl leading-[0.9] text-zinc-500 dark:text-zinc-300"
      >
        &ldquo;
      </span>

      <blockquote className="m-0 font-bricolage text-[length:clamp(21px,2.5vw,34px)] font-medium leading-[1.3] tracking-[-0.02em] text-slate-900 [text-wrap:pretty] dark:text-white">
        {person.quote.trim()}
      </blockquote>

      <figcaption className="mt-6 text-base">
        <span className="block font-semibold text-slate-900 dark:text-white">
          {person.name}
        </span>

        {meta && (
          <span className="block mt-1 text-sm text-slate-500 dark:text-white/55">
            {meta}
          </span>
        )}
      </figcaption>
    </>
  );
}

const arrowClass =
  'grid h-11 w-11 shrink-0 place-items-center rounded-full border border-slate-900/10 bg-white text-slate-900 transition duration-200 hover:bg-slate-900 hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white dark:hover:text-slate-900 dark:focus-visible:ring-violet-300';

export default function Testimonials() {
  const count = PEOPLE.length;

 const [{ index, dir }, setView] = useState(() => ({
  index: 0,
  dir: 1,
}));
  const reduceMotion = useReducedMotion();
  const touch = useRef(null);

  const active = PEOPLE[index] ?? null;

  const go = (delta) => {
    if (count > 1) {
      setView((current) => ({
        index: (current.index + delta + count) % count,
        dir: delta > 0 ? 1 : -1,
      }));
    }
  };

  const pick = (i) => {
    setView((current) =>
      i === current.index
        ? current
        : {
            index: i,
            dir: i > current.index ? 1 : -1,
          }
    );
  };

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      go(event.key === 'ArrowRight' ? 1 : -1);
    }
  };

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

    // Only horizontal swipes navigate.
    if (
      Math.abs(dx) > SWIPE_THRESHOLD &&
      Math.abs(dx) > Math.abs(dy)
    ) {
      go(dx < 0 ? 1 : -1);
    }
  };

  const quoteVariants = useMemo(
    () => ({
      enter: (d) =>
        reduceMotion
          ? { opacity: 0 }
          : {
              opacity: 0,
              x: d * 28,
              filter: 'blur(6px)',
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
              duration: 0.5,
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
              x: d * -28,
              filter: 'blur(6px)',
              transition: {
                duration: 0.25,
                ease: EASE,
              },
            },
    }),
    [reduceMotion]
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
        className="mx-auto flex w-full max-w-[1680px] flex-col gap-8 rounded-[28px] bg-white p-4 text-slate-900 outline-none ring- ring-black/5 [touch-action:pan-y] focus-visible:ring-2 focus-visible:ring-violet-500/70 dark:bg-[#12141F] dark:text-white dark:shadow-none dark:ring-white/10 dark:focus-visible:ring-violet-300/70 sm:gap-10 sm:rounded-[40px] sm:p-8 lg:p-10"
      >
        {/* Header */}
        <div className="flex items-end justify-between gap-4 sm:gap-6">
          <h2
            id="testimonials-title"
            className="max-w-xl font-bricolage text-[length:clamp(28px,3.6vw,46px)] font-bold leading-[1.05] tracking-[-0.04em] [text-wrap:balance]"
          >
            Words from the people I work with.
          </h2>

          {count > 1 && (
            <div className="flex items-center gap-2 shrink-0 sm:gap-3">
              <span
                aria-hidden="true"
                className="hidden text-sm tabular-nums text-slate-500 dark:text-white/55 sm:block"
              >
                {index + 1} of {count}
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

        {active ? (
          <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">

            {/* Portrait Stage */}
<div
  aria-hidden="true"
  className="relative isolate aspect-[4/3] overflow-hidden rounded-[22px] border-2 border-[#E9E5F0] bg-[#F8F7FA] sm:aspect-[16/10] sm:rounded-[20px] lg:aspect-auto lg:min-h-[30rem] dark:border-white/10 dark:bg-white/[0.03]"
>
  <AnimatePresence initial={false}>
    <motion.div
      key={active.id}
      initial={{
        opacity: 0,
        scale: reduceMotion ? 1 : 1.03,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: {
          duration: reduceMotion ? 0.2 : 0.6,
          ease: EASE,
        },
      }}
      exit={{
        opacity: 0,
        transition: { duration: 0.3 },
      }}
      className="absolute inset-[2px] overflow-hidden rounded-[17px] sm:rounded-[17px]"
    >
      <Portrait
        key={`${active.id}-${active.portrait}`}
        person={active}
        initialsClass="text-5xl"
      />
    </motion.div>
  </AnimatePresence>
</div>

            {/* Quote and Roster */}
            <div className="flex flex-col justify-between min-w-0 gap-10">

              {/* Quote */}
              <div className="relative">
                {/* Invisible quotes reserve the height of the tallest testimonial. */}
                <div
                  aria-hidden="true"
                  className="grid invisible select-none"
                >
                  {PEOPLE.map((person) => (
                    <figure
                      key={person.id}
                      className="col-start-1 row-start-1 m-0"
                    >
                      <QuoteContent person={person} />
                    </figure>
                  ))}
                </div>

                <div
                  className="absolute inset-0"
                  aria-live="polite"
                  aria-atomic="true"
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

              {/* Testimonial Navigation */}
              {count > 1 && (
                <div
                  role="group"
                  aria-label="Choose a testimonial"
                  className="flex flex-wrap items-center gap-3 p-1"
                >
                  {PEOPLE.map((person, i) => {
                    const isActive = i === index;

                    return (
                      <button
                        key={person.id}
                        type="button"
                        onClick={() => pick(i)}
                        aria-label={`Show testimonial from ${person.name}`}
                        aria-pressed={isActive}
                        data-tooltip={person.name}
                        className={`h-12 w-12 shrink-0 overflow-hidden rounded-full transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 motion-reduce:transition-none dark:focus-visible:ring-violet-300 ${
                          isActive
                            ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-white dark:ring-violet-300 dark:ring-offset-[#12141F]'
                            : 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0'
                        }`}
                      >
                        <Portrait
                          key={`${person.id}-${person.portrait}`}
                          person={person}
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="max-w-xl rounded-3xl border border-slate-900/10 bg-slate-50 px-6 py-8 dark:border-white/10 dark:bg-white/[0.04] sm:px-10">
            <p className="text-base text-slate-800 dark:text-white/80 sm:text-lg">
              Client testimonials will appear here.
            </p>

            <p className="mt-2 text-sm text-slate-500 dark:text-white/50">
              Add quotes and portraits in{' '}
              <code className="text-slate-700 dark:text-white/70">
                src/data/content.js
              </code>{' '}
              to enable the slider.
            </p>

            <a
              href="/contact"
              data-app-route=""
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-600 dark:bg-white dark:text-[#0D0F17] dark:hover:bg-violet-200"
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