import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import Rise from '../components/ui/Rise';

const HIGHLIGHTS = [
  { value: 2, suffix: '+', label: 'Years of Experience' },
  { value: 34, suffix: '+', label: 'Projects Completed' },
  { value: 5, suffix: '', label: 'Happy Clients' },
];

function CountUp({ value, suffix = '' }) {
  const ref = useRef(null);

  const inView = useInView(ref, {
    once: true,
    margin: '0px 0px -10% 0px',
  });

  const reduceMotion = useReducedMotion();

  const [count, setCount] = useState(
    reduceMotion ? value : 0
  );

  useEffect(() => {
    if (reduceMotion) {
      setCount(value);
      return;
    }

    if (!inView) return;

    let frame;
    const duration = 1000;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min(
        (now - start) / duration,
        1
      );

      const eased = 1 - Math.pow(1 - progress, 3);

      setCount(Math.round(value * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);

  }, [inView, reduceMotion, value]);

  return (
    <span ref={ref} aria-hidden="true">
      {String(count).padStart(2, '0')}
      {suffix}
    </span>
  );
}


export default function About() {
  return (
   <section
  id="about"
  aria-labelledby="about-heading"
  className="scroll-mt-20 bg-white py-0 dark:bg-[#0D0F17]"
>
  <div className="relative isolate w-full overflow-hidden bg-[#0D0F17] py-12 text-white ring-1 ring-black/5 dark:ring-white/10 sm:py-16 lg:py-20">

        {/* Background decoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_40%,rgba(124,58,237,0.19),transparent_48%),radial-gradient(ellipse_at_12%_90%,rgba(79,70,229,0.09),transparent_38%)]"
        />

        <div className="wrap">
          {/* Section label */}
          <p className="mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-[violet]-200/75 sm:mb-10">
            About Me
          </p>

          {/* Main content */}
          <div className="grid items-center gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-12 xl:gap-16">

            {/* Text content (z-10 keeps it above the oversized image) */}
            <div className="relative z-10 max-w-3xl">
              <Rise
                as="h2"
                i={0}
                id="about-heading"
                className="font-bricolage text-[length:clamp(44px,6.7vw,88px)] font-bold leading-[0.95] tracking-[-0.055em]"
              >
                <span className="block">Usually I'm designer.</span>
                <span className="block">Don't make me a</span>
                <span className="mt-2 block font-extrabold leading-[1.1] tracking-[0.015em] text-[#F5F000] sm:mt-4">
                  CODING PUYAL !
                </span>
              </Rise>

              <Rise
                as="p"
                i={1}
                className="max-w-2xl mt-6 text-base leading-7 text-white/70 sm:mt-7 sm:text-lg sm:leading-8"
              >
                Hi, I'm Sanjeevan. I bring product thinking and visual
                craft together to make digital experiences clear,
                useful, and memorable.
              </Rise>

              <Rise
                as="p"
                i={2}
                className="max-w-2xl mt-3 text-base leading-7 text-white/70 sm:text-lg sm:leading-8"
              >
                From shaping an interface to building it for the web,
                I enjoy connecting every detail to a real user need.
              </Rise>

              {/* Highlights */}
              <div
                className="grid max-w-2xl grid-cols-3 pt-6 mt-8 border-t border-white/15 sm:mt-10 sm:pt-7"
                aria-label="Professional highlights"
              >
                {HIGHLIGHTS.map(({ value, suffix, label }) => (
                  <div key={label} className="pr-2 sm:pr-5">
                    <p className="font-bricolage text-3xl font-bold leading-none text-[#F5F000] sm:text-5xl">
                      <CountUp value={value} suffix={suffix} />
                      <span className="sr-only">{value}{suffix}</span>
                    </p>
                    <p className="mt-2 max-w-[110px] text-xs leading-5 text-white/55 sm:max-w-none sm:text-sm">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile image */}
            <Rise
              i={2}
              className="relative z-0 mx-auto -mb-12 w-full max-w-[520px] sm:-mb-16 lg:-mb-20 lg:ml-auto lg:mr-0 lg:self-end"
            >
              <img
                src="/images/avatar.png"
                alt="Sanjeevan, UI/UX designer and software developer"
                loading="lazy"
                decoding="async"
                draggable="false"
                className="pointer-events-none block h-auto w-full max-w-none select-none lg:-ml-[25%] lg:w-[135%]"
              />
            </Rise>

          </div>
        </div>
      </div>
    </section>
  );
}