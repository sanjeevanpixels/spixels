import { ArrowUp, ArrowUpRight } from 'lucide-react';
import SocialIcon from './SocialIcon';
import { CFG } from '../../data/config';

export default function ProjectDetailsFooter() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      role="contentinfo"
      aria-label="Project details page footer"
      className="relative z-10 border-t border-neutral-200 bg-white text-neutral-900"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand & Mission Column (5 cols) */}
          <div className="lg:col-span-5">
            <a
              href="/"
              data-app-route
              className="inline-block font-bricolage text-2xl font-black tracking-tight text-neutral-900 transition hover:text-[#FF2056] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2056]"
              aria-label="Go to Sanjeevan's home portfolio"
            >
              Sanjeevan<span className="text-[#FF2056]">.</span>
            </a>
            <p className="mt-1 font-sans text-xs font-semibold tracking-wide uppercase text-neutral-500">
              UI/UX Designer & Software Developer • Sri Lanka
            </p>
            <p className="mt-4 max-w-sm font-sans text-sm leading-relaxed text-neutral-600">
              Bridging empathetic user research, clean design systems, and resilient frontend code
              to shape digital products that feel effortless, clear, and memorable.
            </p>

            {/* Availability Pill */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/70 px-3.5 py-1.5 text-xs font-medium text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
              <span>Available for full-time & freelance projects</span>
            </div>
          </div>

          {/* Quick Navigation (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="font-bricolage text-sm font-bold uppercase tracking-wider text-neutral-900">
              Explore
            </h3>
            <ul role="list" className="mt-4 space-y-2.5 font-sans text-sm">
              <li>
                <a
                  href="/"
                  data-app-route
                  className="min-h-[44px] inline-flex items-center text-neutral-600 transition hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2056]"
                >
                  Home Portfolio
                </a>
              </li>
              <li>
                <a
                  href="#ux-case-studies"
                  className="min-h-[44px] inline-flex items-center text-neutral-600 transition hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2056]"
                >
                  UX Case Studies
                </a>
              </li>
              <li>
                <a
                  href="#visual-gallery"
                  className="min-h-[44px] inline-flex items-center text-neutral-600 transition hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2056]"
                >
                  Visual Gallery
                </a>
              </li>
              <li>
                <a
                  href="#cta"
                  className="min-h-[44px] inline-flex items-center text-neutral-600 transition hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2056]"
                >
                  Start a Project
                </a>
              </li>
            </ul>
          </div>

          {/* Featured Works (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="font-bricolage text-sm font-bold uppercase tracking-wider text-neutral-900">
              Selected Works
            </h3>
            <ul role="list" className="mt-4 space-y-2.5 font-sans text-sm">
              <li>
                <a
                  href="https://www.behance.net/gallery/257581893/Flyra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] inline-flex items-center gap-1 text-neutral-600 transition hover:text-[#FF2056] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2056]"
                >
                  <span>Flyra App</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.behance.net/gallery/184801135/Guardian-Women-Safety-App"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] inline-flex items-center gap-1 text-neutral-600 transition hover:text-[#FF2056] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2056]"
                >
                  <span>Guardian SOS</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="#ux-case-studies"
                  className="min-h-[44px] inline-flex items-center text-neutral-600 transition hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2056]"
                >
                  TIC Teacher App
                </a>
              </li>
              <li>
                <a
                  href="#ux-case-studies"
                  className="min-h-[44px] inline-flex items-center text-neutral-600 transition hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2056]"
                >
                  Medora Health
                </a>
              </li>
            </ul>
          </div>

          {/* Connect Column (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="font-bricolage text-sm font-bold uppercase tracking-wider text-neutral-900">
              Connect
            </h3>
            <p className="mt-4 font-sans text-xs text-neutral-600">
              Direct inquiries and project collaborations:
            </p>
            <a
              href={`mailto:${CFG.email}`}
              className="mt-1 block font-sans text-sm font-semibold text-neutral-900 transition hover:text-[#FF2056] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2056]"
            >
              {CFG.email}
            </a>

            {/* Social Icons Strip */}
            <div className="mt-5 flex items-center gap-2">
              {CFG.social.map(([icon, name, url]) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${name} profile (opens in a new tab)`}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-700 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2056]"
                >
                  <SocialIcon name={icon} className="h-4 w-4" />
                </a>
              ))}

              {CFG.resume && (
                <a
                  href={CFG.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold font-sans text-neutral-800 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2056]"
                  aria-label="Download or view Sanjeevan's Resume (PDF opens in a new tab)"
                >
                  <span>Resume</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-200 pt-8 sm:flex-row">
          <p className="font-sans text-xs text-neutral-500 text-center sm:text-left">
            © {currentYear} Sanjeevan (Spixels). Crafted with care, accessibility & pulse.
          </p>

          {/* Back to Top Button */}
          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-xs font-medium font-sans text-neutral-700 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2056]"
            aria-label="Scroll back to top of the page"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
