import { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Image as ImageIcon, Mail } from 'lucide-react';

export default function ProjectDetailsNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3 bg-white/90 backdrop-blur-md shadow-sm border-b border-neutral-200/80' : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Back to Portfolio Link */}
        <a
          href="/"
          data-app-route
          className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/95 px-4 py-2 text-xs sm:text-sm font-medium font-sans text-neutral-800 shadow-sm transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2056]"
          aria-label="Back to main portfolio page"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Portfolio</span>
        </a>

        {/* Quick Anchor Navigation */}
        <nav aria-label="Page sections navigation" className="flex items-center gap-1 sm:gap-2">
          <a
            href="#ux-case-studies"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium font-sans text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2056]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF2056]" />
            <span className="hidden xs:inline">Case Studies</span>
          </a>

          <a
            href="#visual-gallery"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium font-sans text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2056]"
          >
            <ImageIcon className="w-3.5 h-3.5 text-violet-600" />
            <span className="hidden xs:inline">Gallery</span>
          </a>

          <a
            href="#cta"
            className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-3.5 py-1.5 text-xs sm:text-sm font-medium font-sans text-white hover:bg-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2056]"
          >
            <Mail className="w-3.5 h-3.5 text-[#FF2056]" />
            <span>Contact</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
