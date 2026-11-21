import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Calendar, Mail, Check, ArrowLeft, Sparkles, Clock, Globe, ShieldCheck } from 'lucide-react';
import { CFG } from '../../data/config';
import useCopyEmail from '../../hooks/useCopyEmail';

export default function ProjectDetailsCTA() {
  const [copied, setCopied] = useState(false);
  const copyEmail = useCopyEmail();
  const reduceMotion = useReducedMotion();

  const handleCopy = async () => {
    await copyEmail();
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <section
      id="cta"
      aria-labelledby="cta-heading"
      className="relative z-10 scroll-mt-20 border-t border-neutral-200/90 bg-[#F9FAFB] py-16 sm:py-24 lg:py-28 text-neutral-900"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-[32px] sm:rounded-[48px] border border-neutral-200/90 bg-white p-8 sm:p-14 md:p-20 text-center shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
        >
          {/* Subtle Background Accent Pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px]"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto max-w-3xl">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50/80 px-4 py-1.5 text-xs font-semibold tracking-wider text-rose-700 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-[#FF2056] animate-pulse" />
              <span>Available for New Projects • 2026</span>
            </div>

            {/* Main Headline */}
            <h2
              id="cta-heading"
              className="mt-6 font-bricolage text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl md:text-5xl lg:text-6xl leading-[1.08]"
            >
              Have a design challenge or project in mind?
            </h2>

            {/* Subtitle */}
            <p className="mx-auto mt-5 max-w-2xl font-sans text-base sm:text-lg lg:text-xl leading-relaxed text-neutral-600">
              Whether you need an end-to-end UX case study, a scalable mobile design system, or a
              complete frontend build — let’s collaborate to create something clear, useful, and
              memorable.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
              {/* Primary Booking CTA */}
              <a
                href={CFG.booking}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-full bg-neutral-900 px-7 py-3 text-sm sm:text-base font-semibold font-sans text-white shadow-md transition hover:bg-black hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2056] focus-visible:ring-offset-2"
                aria-label="Schedule a meeting with Sanjeevan (opens in a new tab)"
              >
                <Calendar className="h-4 w-4 text-[#FF2056]" />
                <span>Schedule a Meeting</span>
              </a>

              {/* Copy Email Button */}
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm sm:text-base font-medium font-sans text-neutral-800 shadow-sm transition hover:border-neutral-900 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2056] focus-visible:ring-offset-2"
                aria-label="Copy email address ssjeevan201@gmail.com"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Email Copied!</span>
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 text-neutral-600" />
                    <span>Copy My Email</span>
                  </>
                )}
              </button>

              {/* Back to Home Link */}
              <a
                href="/"
                data-app-route
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-5 py-3 text-xs sm:text-sm font-medium font-sans text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2056]"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Main Portfolio</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 sm:mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-neutral-100 pt-8">
              <div className="flex items-center justify-center gap-2 text-neutral-600">
                <Clock className="h-4 w-4 text-neutral-400" />
                <span className="font-sans text-xs sm:text-sm font-medium">24h Response</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-neutral-600">
                <Globe className="h-4 w-4 text-neutral-400" />
                <span className="font-sans text-xs sm:text-sm font-medium">Remote & Global</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-neutral-600">
                <ShieldCheck className="h-4 w-4 text-neutral-400" />
                <span className="font-sans text-xs sm:text-sm font-medium">WCAG Accessible</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-neutral-600">
                <Sparkles className="h-4 w-4 text-neutral-400" />
                <span className="font-sans text-xs sm:text-sm font-medium">Figma to React</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
