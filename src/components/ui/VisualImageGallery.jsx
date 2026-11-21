import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Image as ImageIcon,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Smartphone,
  Layers,
  Palette,
} from 'lucide-react';

const GALLERY_ITEMS = [
  {
    id: 1,
    title: 'Flyra Country Discovery Flow',
    category: 'Mobile Interfaces',
    categoryIcon: Smartphone,
    year: '2026',
    image: '/images/projects/flyra.webp',
    alt: 'Flyra mobile app interface showcasing country details, demographics, and flags',
    description:
      'Curated overview screens showing demographics, currencies, national flags, and interactive country comparison cards.',
    tags: ['Figma', 'Mobile App', 'Design System'],
  },
  {
    id: 2,
    title: 'Guardian Emergency SOS Trigger',
    category: 'Mobile Interfaces',
    categoryIcon: Smartphone,
    year: '2023',
    image: '/images/projects/guardian.webp',
    alt: 'Guardian safety mobile application showing emergency SOS and live tracking interface',
    description:
      'Sub-3-second emergency SOS activation flow with high-contrast emergency HUD and quick contact dispatch.',
    tags: ['Safety Tech', 'Tactile UX', 'Figma'],
  },
  {
    id: 3,
    title: 'Guardian Live Geofence System',
    category: 'Mobile Interfaces',
    categoryIcon: Smartphone,
    year: '2023',
    image: '/images/projects/guardian2.webp',
    alt: 'Guardian emergency mobile app live location sharing and geofencing interface',
    description:
      'Real-time automated geofencing alerts, route departure detection, and silent trusted circle notifications.',
    tags: ['Geolocation', 'Crisis UX', 'Mobile UI'],
  },
  {
    id: 4,
    title: 'Medora Healthcare Scheduling',
    category: 'Mobile Interfaces',
    categoryIcon: Smartphone,
    year: '2026',
    image: '/images/projects/medora.webp',
    alt: 'Medora healthcare application showing patient records, doctor appointment scheduling, and care timeline',
    description:
      'Accessible, stress-free appointment booking flow with visual doctor profiles and prescription timelines.',
    tags: ['Healthcare', 'WCAG AAA', 'Mobile UI'],
  },
  {
    id: 5,
    title: 'TIC Teacher Activity Dashboard',
    category: 'Mobile Interfaces',
    categoryIcon: Smartphone,
    year: '2021',
    image: '/images/projects/tic.webp',
    alt: 'TIC teacher performance app interface displaying attendance reports and classroom analytics',
    description:
      'High-efficiency mobile dashboard for rapid student attendance logging and curriculum completion audits.',
    tags: ['EdTech', 'Enterprise UX', 'Mobile App'],
  },
  {
    id: 6,
    title: 'UI/UX Design Systems & Patterns',
    category: 'Design Systems',
    categoryIcon: Layers,
    year: '2026',
    image: '/images/roles/uiux-designer.webp',
    alt: 'UI/UX Design Systems diagram showing atomic components and layout tokens',
    description:
      'Architecting resilient design systems with modular components, typographic hierarchy, and tokenized variables.',
    tags: ['Atomic Design', 'Design Tokens', 'Accessibility'],
  },
  {
    id: 7,
    title: 'Frontend Engineering & Interactions',
    category: 'Design Systems',
    categoryIcon: Layers,
    year: '2026',
    image: '/images/roles/software-developer.webp',
    alt: 'Software development graphic illustrating responsive code and UI interaction',
    description:
      'Bridging thoughtful design thinking with clean, accessible React, Tailwind CSS, and Framer Motion code.',
    tags: ['React', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    id: 8,
    title: 'Vector Brand Identity Systems',
    category: 'Brand Identities',
    categoryIcon: Palette,
    year: '2026',
    image: '/images/roles/logo-designer.webp',
    alt: 'Logo designer graphic illustrating geometric grid construction and brand marks',
    description:
      'Constructing distinct, versatile logo marks crafted with mathematical proportions and timeless legibility.',
    tags: ['Identity', 'Geometric Grids', 'Vector Craft'],
  },
  {
    id: 9,
    title: 'Devsha Creator Identity',
    category: 'Brand Identities',
    categoryIcon: Palette,
    year: '2026',
    image: '/logos/devsha.webp',
    alt: 'Devsha brand logo mark',
    description:
      'Minimalist geometric mark developed for digital creator communities and modern web identity.',
    tags: ['Brand Identity', 'Logomark', 'Vector'],
  },
  {
    id: 10,
    title: 'Misscode Digital Mark',
    category: 'Brand Identities',
    categoryIcon: Palette,
    year: '2026',
    image: '/logos/misscode.webp',
    alt: 'Misscode brand identity logo',
    description:
      'Custom brand identity kit and vector icon system created for software development agency.',
    tags: ['Brand Identity', 'Agency Branding'],
  },
  {
    id: 11,
    title: 'Orderista Quick Commerce',
    category: 'Brand Identities',
    categoryIcon: Palette,
    year: '2025',
    image: '/logos/orderista.webp',
    alt: 'Orderista on-demand food delivery logo mark',
    description:
      'Energetic, modern typographic logomark built for fast food delivery and on-demand commerce.',
    tags: ['Food Tech', 'Brand Identity', 'Vector'],
  },
  {
    id: 12,
    title: 'Veggies Fresh Market',
    category: 'Brand Identities',
    categoryIcon: Palette,
    year: '2025',
    image: '/logos/veggies.webp',
    alt: 'Veggies organic produce brand identity logo',
    description:
      'Organic curve-inspired identity capturing sustainable produce, eco-friendly goods, and clean living.',
    tags: ['Eco Brand', 'Identity Design'],
  },
];

const CATEGORIES = ['All Artifacts', 'Mobile Interfaces', 'Design Systems', 'Brand Identities'];

export default function VisualImageGallery() {
  const [selectedCategory, setSelectedCategory] = useState('All Artifacts');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null);
  const reduceMotion = useReducedMotion();
  const lightboxCloseRef = useRef(null);

  const filteredItems =
    selectedCategory === 'All Artifacts'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (activeLightboxIndex === null) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';
    lightboxCloseRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveLightboxIndex((prev) => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveLightboxIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeLightboxIndex, filteredItems.length]);

  const activeItem = activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

  return (
    <section
      id="visual-gallery"
      aria-labelledby="visual-gallery-heading"
      className="relative z-10 scroll-mt-20 border-b border-neutral-200/90 bg-[#FAFAFA] py-16 sm:py-24 lg:py-28 text-neutral-900"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-violet-600" />
              <span>Visual Showcase & Artifacts</span>
            </div>
            <h2
              id="visual-gallery-heading"
              className="mt-4 font-bricolage text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl md:text-5xl"
            >
              Design Gallery & Visual Artifacts
            </h2>
            <p className="mt-3 font-sans text-base text-neutral-600 sm:text-lg">
              A curated collection of production-ready mobile screens, component libraries,
              interactive architectures, and brand marks crafted with precision.
            </p>
          </div>

          {/* Quick Counter Badge */}
          <div className="flex items-center gap-2.5 rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 shadow-sm">
            <ImageIcon className="h-4 w-4 text-violet-600" />
            <span className="font-sans text-xs sm:text-sm font-medium text-neutral-700">
              {filteredItems.length} Visual Artifacts
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-8 flex flex-wrap gap-2 sm:gap-2.5">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setActiveLightboxIndex(null);
                }}
                aria-pressed={isActive}
                className={`min-h-[44px] rounded-full px-4 py-2 text-xs sm:text-sm font-medium font-sans transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => {
              const CategoryIcon = item.categoryIcon || ImageIcon;
              return (
                <motion.article
                  key={item.id}
                  layout
                  initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-neutral-200/90 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-xl sm:p-5"
                >
                  <div>
                    {/* Visual Preview Container */}
                    <div
                      className="relative aspect-video w-full cursor-pointer overflow-hidden rounded-2xl bg-neutral-100"
                      onClick={() => setActiveLightboxIndex(idx)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveLightboxIndex(idx);
                        }
                      }}
                      aria-label={`Open fullscreen preview for ${item.title}`}
                    >
                      <img
                        src={item.image}
                        alt={item.alt}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none"
                      />

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-900 shadow-md">
                          <Maximize2 className="h-3.5 w-3.5" />
                          <span>Expand</span>
                        </span>
                      </div>

                      {/* Year badge */}
                      <span className="absolute right-3 top-3 rounded-full bg-neutral-900/80 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                        {item.year}
                      </span>
                    </div>

                    {/* Metadata Header */}
                    <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-violet-700">
                      <CategoryIcon className="h-3.5 w-3.5" />
                      <span>{item.category}</span>
                    </div>

                    {/* Title */}
                    <h3 className="mt-1.5 font-bricolage text-lg sm:text-xl font-bold tracking-tight text-neutral-900">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 font-sans text-xs sm:text-sm leading-relaxed text-neutral-600 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Tags and CTA */}
                  <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveLightboxIndex(idx)}
                      className="inline-flex min-h-[44px] items-center gap-1 text-xs font-semibold text-neutral-900 hover:text-violet-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 rounded px-1"
                      aria-label={`View ${item.title} image in full resolution`}
                    >
                      <span>Preview</span>
                      <Maximize2 className="h-3 w-3" />
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeItem && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Image Preview Lightbox"
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveLightboxIndex(null)}
              className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md"
              aria-hidden="true"
            />

            {/* Lightbox Content Container */}
            <motion.div
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3.5 bg-white/95">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-violet-700 font-sans">
                    {activeItem.category} • {activeItem.year}
                  </span>
                  <h3 className="font-bricolage text-xl font-bold text-neutral-900">
                    {activeItem.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-neutral-500 font-sans">
                    {activeLightboxIndex + 1} of {filteredItems.length}
                  </span>
                  <button
                    ref={lightboxCloseRef}
                    type="button"
                    onClick={() => setActiveLightboxIndex(null)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-700 transition hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600"
                    aria-label="Close image preview"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Main Image Display with Navigation Arrows */}
              <div className="relative flex flex-1 items-center justify-center bg-neutral-950 p-2 sm:p-6 overflow-hidden max-h-[65vh]">
                <img
                  src={activeItem.image}
                  alt={activeItem.alt}
                  className="max-h-[60vh] max-w-full rounded-lg object-contain shadow-2xl"
                />

                {/* Left Arrow */}
                <button
                  type="button"
                  onClick={() =>
                    setActiveLightboxIndex(
                      (prev) => (prev - 1 + filteredItems.length) % filteredItems.length
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-neutral-900 shadow-lg backdrop-blur-md transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label="Previous image in gallery"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                {/* Right Arrow */}
                <button
                  type="button"
                  onClick={() =>
                    setActiveLightboxIndex((prev) => (prev + 1) % filteredItems.length)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-neutral-900 shadow-lg backdrop-blur-md transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label="Next image in gallery"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>

              {/* Footer Details */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-neutral-200 px-5 py-3.5 bg-neutral-50">
                <p className="font-sans text-xs sm:text-sm text-neutral-600 max-w-xl">
                  {activeItem.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {activeItem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
