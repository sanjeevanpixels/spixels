import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import SectionHeading from '../components/ui/SectionHeading';
import { Stagger, StaggerItem } from '../components/ui/Stagger';
import Icon from '../components/ui/Icon';
import { CERTIFICATES, EDU } from '../data/content';

const NAV_BTN =
  'iconbtn flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 ' +
  'transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ' +
  'disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-white ' +
  'dark:border-neutral-700 dark:bg-[#15171E] dark:text-neutral-200 dark:hover:bg-neutral-800 dark:disabled:hover:bg-[#15171E] ' +
  'motion-safe:active:scale-95';

export default function Academic() {
  const rail = useRef(null);
  const closeBtn = useRef(null);
  const reduceMotion = useReducedMotion();

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [progress, setProgress] = useState({ left: 0, width: 100 });
  const [preview, setPreview] = useState(null);

  const hasOverflow = canPrev || canNext;

  /* Keep arrows + progress bar in sync with the rail */
  const sync = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanPrev(scrollLeft > 4);
    setCanNext(scrollLeft + clientWidth < scrollWidth - 4);
    setProgress({
      left: (scrollLeft / scrollWidth) * 100,
      width: Math.min(100, (clientWidth / scrollWidth) * 100),
    });
  }, []);

  useEffect(() => {
    const el = rail.current;
    if (!el) return undefined;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    };
    sync();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [sync]);

  const move = (direction) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const onRailKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); move(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1); }
  };

  /* Lightbox: Esc to close, lock page scroll, focus the close button */
  useEffect(() => {
    if (!preview) return undefined;
    const onKey = (e) => e.key === 'Escape' && setPreview(null);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    closeBtn.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [preview]);

  return (
    <section id="academic" className="sec !py-12 sm:!py-16">
      <div className="wrap">
        <SectionHeading title="Academic journey" subtitle="The foundation behind how I learn and think." />

        {/* Education */}
        <Stagger className="grid max-w-5xl grid-cols-1 gap-8 mx-auto mt-8 sm:mt-10 md:grid-cols-3 md:gap-10">
          {EDU.map(([school, degree, years, logo]) => (
            <StaggerItem key={school} className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_10px_28px_rgba(13,15,23,0.10)] ring-1 ring-black/5 dark:bg-[#15171E] dark:ring-white/10 sm:h-24 sm:w-24">
                {logo ? (
                  <img src={logo} alt={`${school} logo`} loading="lazy" className="object-contain w-full h-full p-2" />
                ) : (
                  <span aria-hidden="true" className="font-bricolage text-xl font-bold text-[#0D0F17] dark:text-white">
                    {school.replace(/^Your\s+/, '').split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-base font-semibold sm:text-lg">{school}</h3>
              <p className="mt-1 text-sm text-[#666] dark:text-[#A3A3A3] sm:text-base">
                {degree} ·{' '}
                <span className="inline-flex items-center gap-1 align-middle">
                  <Icon name="calendar" className="ico !h-3.5 !w-3.5" />
                  {years}
                </span>
              </p>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Certificates */}
        <section
          aria-labelledby="certificate-heading"
          className="max-w-6xl pt-8 mx-auto mt-10 border-t border-slate-200 dark:border-neutral-800 sm:mt-12 sm:pt-10"
        >
          <div className="flex items-end justify-between gap-4 mb-5 sm:mb-6">
            <div className="min-w-0">
              <h3 id="certificate-heading" className="text-2xl font-bold tracking-tight font-bricolage sm:text-3xl">
                Certificates
              </h3>
              <p className="sub mt-1.5">Courses and credentials I’ve completed.</p>
            </div>

            {hasOverflow && (
              <div className="flex gap-2 shrink-0">
                <button type="button" onClick={() => move(-1)} disabled={!canPrev} aria-label="Previous certificates" className={NAV_BTN}>
                  <Icon name="arrow-left" />
                </button>
                <button type="button" onClick={() => move(1)} disabled={!canNext} aria-label="Next certificates" className={NAV_BTN}>
                  <Icon name="arrow-right" />
                </button>
              </div>
            )}
          </div>

          {CERTIFICATES.length ? (
            <div role="region" aria-roledescription="carousel" aria-label="Certificates">
              <div
                ref={rail}
                tabIndex={0}
                onKeyDown={onRailKey}
                className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:ring-offset-[#0D0F17] [&::-webkit-scrollbar]:hidden motion-reduce:scroll-auto"
              >
                {CERTIFICATES.map((c, i) => (
                  <article
                    key={`${c.title}-${c.issuer}-${i}`}
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${CERTIFICATES.length}`}
                    className="w-[85%] shrink-0 snap-start overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-[#15171E] sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]"
                  >
                    <button
                      type="button"
                      onClick={() => setPreview(c)}
                      aria-label={`View ${c.title} larger`}
                      className="group relative block aspect-[1.414/1] w-full bg-white p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500 dark:bg-neutral-100"
                    >
                      <img
                        src={c.image}
                        alt={`${c.title}${c.issuer ? ` from ${c.issuer}` : ''}`}
                        loading="lazy"
                        draggable="false"
                        className="object-contain w-full h-full"
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white transition opacity-0 pointer-events-none bg-black/0 group-hover:bg-black/45 group-hover:opacity-100 group-focus-visible:bg-black/45 group-focus-visible:opacity-100">
                        View larger
                      </span>
                    </button>
                    <div className="px-4 py-3.5 sm:px-5 sm:py-4">
                      <h4 className="text-base font-semibold leading-snug line-clamp-2 font-bricolage sm:text-lg">{c.title}</h4>
                      {(c.issuer || c.date) && (
                        <p className="mt-1 text-sm text-slate-500 dark:text-neutral-400">
                          {[c.issuer, c.date].filter(Boolean).join(' · ')}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>

              {hasOverflow && (
                <div className="h-1 mt-4 overflow-hidden rounded-full bg-slate-200 dark:bg-neutral-800" aria-hidden="true">
                  <div
                    className="h-full rounded-full bg-violet-600 transition-[margin,width] duration-150 dark:bg-violet-400"
                    style={{ marginLeft: `${progress.left}%`, width: `${progress.width}%` }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-[#15171E] md:grid-cols-[1.15fr_0.85fr]">
              <div className="flex flex-col items-center justify-center border-b border-dashed border-slate-200 bg-[#F7F7F7] px-6 py-10 text-center dark:border-neutral-700 dark:bg-[#1A1D26] md:border-b-0 md:border-r">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-violet-700 shadow-sm dark:bg-[#242631] dark:text-violet-300">
                  <Icon name="file-text" className="w-6 h-6" />
                </span>
                <p className="mt-3 text-lg font-semibold font-bricolage">No certificates yet</p>
                <p className="max-w-sm mt-1 text-sm text-slate-500 dark:text-neutral-400">
                  Add images and they’ll show up here as a swipeable carousel.
                </p>
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-8">
                <p className="text-sm font-semibold">How to add them</p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-neutral-300">
                  Put your image files in <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-[#242631]">public/certificates</code>, then add each title and path to{' '}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-[#242631]">CERTIFICATES</code> in{' '}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-[#242631]">src/data/content.js</code>.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Lightbox */}
      {preview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={preview.title}
          onClick={() => setPreview(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 sm:p-8"
        >
          <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-4xl">
            <button
              ref={closeBtn}
              type="button"
              onClick={() => setPreview(null)}
              aria-label="Close preview"
              className="absolute right-0 flex items-center justify-center text-white transition-colors rounded-full -top-11 h-9 w-9 bg-white/15 hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <img
              src={preview.image}
              alt={`${preview.title}${preview.issuer ? ` from ${preview.issuer}` : ''}`}
              className="max-h-[80vh] w-full rounded-xl bg-white object-contain"
            />
            <p className="mt-3 text-sm text-center text-white/80">
              {[preview.title, preview.issuer, preview.date].filter(Boolean).join(' · ')}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}