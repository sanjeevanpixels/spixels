import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  ExternalLink,
  Layers,
  ArrowRight,
  X,
  Target,
  Compass,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Smartphone,
  Shield,
  Heart,
  GraduationCap
} from 'lucide-react';

const CASE_STUDIES = [
  {
    id: 'flyra',
    name: 'Flyra',
    category: 'Mobile App',
    categoryIcon: Smartphone,
    year: '2026',
    role: 'Lead UI/UX Designer',
    duration: '6 Weeks',
    badge: 'Country Explorer & Geography App',
    description:
      'A streamlined mobile experience that transforms how curious travelers and students explore countries, currencies, cultures, and geography through card-based architecture.',
    image: '/images/projects/flyra.webp',
    alt: 'Flyra mobile app interface showcasing country details, demographics, and flags',
    behanceUrl: 'https://www.behance.net/gallery/257581893/Flyra',
    tags: ['UX Research', 'Figma', 'Design System', 'Micro-interactions'],
    metrics: [
      { label: 'Task Success Rate', value: '94%' },
      { label: 'Faster Search Time', value: '40%' },
      { label: 'Usability Participants', value: '25+' },
    ],
    challenge:
      'Existing country reference applications and encyclopedias suffer from severe cognitive overload. Critical data like currencies, emergency contacts, languages, and visa rules are scattered across cluttered tables, overwhelming users on mobile devices.',
    research:
      'Conducted contextual interviews and card-sorting exercises with 25 frequent travelers and students. Key finding: users needed rapid comparative scanning without losing contextual geography or cultural nuances.',
    solution:
      'Architected a modular card system with quick-tap filters, high-legibility typographic scale, offline caching flows, and tactile gesture feedback for seamless country comparisons.',
    deliverables: [
      'Interactive Figma Prototype',
      'Atomic Design System',
      'User Personas & Scenarios',
      'Comparative Flow Blueprints',
    ],
  },
  {
    id: 'guardian',
    name: 'Guardian',
    category: 'Safety Tech',
    categoryIcon: Shield,
    year: '2023',
    role: 'Product Designer (UI/UX)',
    duration: '8 Weeks',
    badge: 'Women’s Emergency Response App',
    description:
      'A life-critical women’s safety application designed for high-stress scenarios, featuring a sub-3-second emergency SOS gesture, live geofencing, and discreet alerts.',
    image: '/images/projects/guardian.webp',
    alt: 'Guardian safety mobile application showing emergency SOS and live tracking interface',
    behanceUrl: 'https://www.behance.net/gallery/184801135/Guardian-Women-Safety-App',
    tags: ['Crisis UX', 'Figma', 'Safety Tech', 'Accessibility'],
    metrics: [
      { label: 'SOS Trigger Latency', value: '< 2.2s' },
      { label: 'Stress Usability Score', value: '87%' },
      { label: 'Location Precision', value: '100%' },
    ],
    challenge:
      'In high-anxiety emergency moments, traditional smartphone navigation fails. Victims experience adrenaline rushes, trembling hands, and tunnel vision, making small buttons or multi-screen flows unusable.',
    research:
      'Studied trauma-informed interaction design and consulted safety advocates. Established that emergency triggers must be physical or macro-gesture based, requiring zero ocular focus.',
    solution:
      'Designed a full-screen tactile SOS trigger, high-contrast dark emergency HUD, automated live GPS beacon broadcast to trusted circles, and an instant decoy fake-call mode to defuse suspicious situations.',
    deliverables: [
      'Crisis User Journey Maps',
      'Tactile SOS Architecture',
      'Night-Vision High Contrast Mode',
      'Geofencing Status Dashboard',
    ],
  },
  {
    id: 'tic',
    name: 'TIC',
    category: 'Education',
    categoryIcon: GraduationCap,
    year: '2021',
    role: 'UI/UX & Interaction Designer',
    duration: '5 Weeks',
    badge: 'Teacher Performance & Activity Management',
    description:
      'An educational performance management portal simplifying classroom attendance, syllabus progress tracking, and administrative accountability across regional schools.',
    image: '/images/projects/tic.webp',
    alt: 'TIC teacher performance app interface displaying attendance reports and classroom analytics',
    tags: ['EdTech', 'Information Architecture', 'Dashboard UX', 'Mobile App'],
    metrics: [
      { label: 'Admin Overhead Reduced', value: '65%' },
      { label: 'Active Educators', value: '40+' },
      { label: 'Paper Log Elimination', value: '100%' },
    ],
    challenge:
      'Paper-based lesson journals and manual attendance rosters caused severe delays in teacher reviews, loss of physical documents, and a lack of real-time visibility for school administrators.',
    research:
      'Shadowed regional teachers during morning check-ins and lesson switchovers. Discovered that teachers needed to record 30+ students in under 45 seconds without reliable internet connectivity.',
    solution:
      'Created an offline-first mobile app featuring batch status toggles, smart syllabus completion checklists, and visual summary widgets for school principals.',
    deliverables: [
      'Field Research Syntheses',
      'Offline Sync UX Patterns',
      'Low-fidelity to High-fidelity Wireframes',
      'Administrative Analytics Kit',
    ],
  },
  {
    id: 'medora',
    name: 'Medora',
    category: 'Healthcare',
    categoryIcon: Heart,
    year: '2026',
    role: 'UI/UX Designer',
    duration: '4 Weeks',
    badge: 'Patient Care & Appointment Booking',
    description:
      'A calm, human-centric mobile healthcare application making medical record retrieval, specialist consultations, and prescription schedules stress-free.',
    image: '/images/projects/medora.webp',
    alt: 'Medora healthcare application showing patient records, doctor appointment scheduling, and care timeline',
    tags: ['Healthcare UX', 'WCAG AAA', 'Service Design', 'Prototyping'],
    metrics: [
      { label: 'Booking Drop-off', value: '-30%' },
      { label: 'Patient Satisfaction', value: '85%' },
      { label: 'Booking Steps', value: '3 Steps' },
    ],
    challenge:
      'Patients experiencing health issues or chronic illnesses were overwhelmed by confusing medical terminology, opaque provider calendars, and multi-step clinic booking procedures.',
    research:
      'Conducted accessibility audits and user sessions with diverse age groups. Over 70% of participants requested larger touch targets, softer color palettes, and immediate doctor confirmation summaries.',
    solution:
      'Engineered a frictionless 3-step scheduling funnel, clear timeline view for prescriptions, and an accessible layout meeting WCAG AAA color contrast standards for readability.',
    deliverables: [
      'Patient Empathy Maps',
      '3-Step Appointment Funnel',
      'Accessible Form Components',
      'Usability Test Validation Reports',
    ],
  },
];

const CATEGORIES = ['All Studies', 'Mobile App', 'Safety Tech', 'Education', 'Healthcare'];

export default function UXCaseStudiesSection() {
  const [selectedCategory, setSelectedCategory] = useState('All Studies');
  const [activeModal, setActiveModal] = useState(null);
  const modalCloseBtnRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const filteredStudies =
    selectedCategory === 'All Studies'
      ? CASE_STUDIES
      : CASE_STUDIES.filter((item) => item.category === selectedCategory);

  // Close modal on Escape key and manage focus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeModal) {
        setActiveModal(null);
      }
    };
    if (activeModal) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => modalCloseBtnRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModal]);

  return (
    <section
      id="ux-case-studies"
      aria-labelledby="ux-case-studies-heading"
      className="relative z-10 scroll-mt-20 border-b border-neutral-200/90 bg-[#FBFBFB] py-16 sm:py-24 lg:py-28 text-neutral-900"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header Block */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#FF2056]" />
              <span>In-Depth Case Studies</span>
            </div>
            <h2
              id="ux-case-studies-heading"
              className="mt-4 font-bricolage text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl md:text-5xl"
            >
              UX Case Studies & Product Architecture
            </h2>
            <p className="mt-3 font-sans text-base text-neutral-600 sm:text-lg">
              Translating real human problems into clear, resilient digital products through
              rigorous user research, thoughtful information architecture, and rapid prototyping.
            </p>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 shadow-sm">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
            <span className="font-sans text-xs sm:text-sm font-medium text-neutral-700">
              {CASE_STUDIES.length} Documented Studies
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-8 flex flex-wrap gap-2 sm:gap-2.5">
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                aria-pressed={isActive}
                className={`relative min-h-[44px] rounded-full px-4 py-2 text-xs sm:text-sm font-medium font-sans transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2056] ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-100'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Case Studies Grid */}
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
          <AnimatePresence mode="popLayout">
            {filteredStudies.map((study, idx) => {
              const CategoryIcon = study.categoryIcon || Smartphone;
              return (
                <motion.article
                  key={study.id}
                  layout
                  initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, delay: idx * 0.08 }}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-neutral-200/90 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-xl sm:p-7"
                >
                  <div>
                    {/* Visual Preview */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-neutral-100">
                      <img
                        src={study.image}
                        alt={study.alt}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none"
                      />

                      {/* Floating Category Badge */}
                      <div className="absolute left-3.5 top-3.5 flex items-center gap-1.5 rounded-full border border-neutral-200/80 bg-white/95 px-3 py-1 shadow-sm backdrop-blur-md">
                        <CategoryIcon className="h-3.5 w-3.5 text-[#FF2056]" />
                        <span className="font-sans text-xs font-semibold text-neutral-800">
                          {study.category}
                        </span>
                      </div>

                      {/* Year Chip */}
                      <div className="absolute right-3.5 top-3.5 rounded-full bg-neutral-900/85 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                        {study.year}
                      </div>
                    </div>

                    {/* Metadata Header */}
                    <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-medium text-neutral-500">
                      <span>{study.role}</span>
                      <span>•</span>
                      <span>{study.duration}</span>
                    </div>

                    {/* Title */}
                    <h3 className="mt-2 font-bricolage text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
                      {study.name}
                    </h3>
                    <p className="mt-1 font-sans text-xs font-semibold tracking-wide uppercase text-violet-700">
                      {study.badge}
                    </p>

                    {/* Description */}
                    <p className="mt-3 font-sans text-sm sm:text-[15px] leading-relaxed text-neutral-600 line-clamp-3">
                      {study.description}
                    </p>

                    {/* Key Metrics Strip */}
                    <div className="mt-5 grid grid-cols-3 gap-2 border-y border-neutral-100 py-3.5 bg-neutral-50/70 rounded-xl px-3">
                      {study.metrics.map((metric, i) => (
                        <div key={i} className="text-center">
                          <p className="font-bricolage text-base sm:text-lg font-bold text-neutral-900">
                            {metric.value}
                          </p>
                          <p className="font-sans text-[11px] text-neutral-500 leading-tight">
                            {metric.label}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Tags List */}
                    <ul
                      role="list"
                      className="mt-4 flex flex-wrap gap-1.5 font-sans text-xs text-neutral-600"
                    >
                      {study.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full bg-neutral-100 px-3 py-1 font-medium text-neutral-700"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-6 flex items-center justify-between gap-3 border-t border-neutral-100 pt-4">
                    <button
                      type="button"
                      onClick={() => setActiveModal(study)}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-neutral-900 px-5 py-2 text-xs sm:text-sm font-semibold font-sans text-white transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2056]"
                      aria-label={`Read deep dive UX case study for ${study.name}`}
                    >
                      <span>Read Case Study</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>

                    {study.behanceUrl && (
                      <a
                        href={study.behanceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs sm:text-sm font-medium font-sans text-neutral-700 transition hover:border-[#FF2056] hover:text-[#FF2056] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2056]"
                        aria-label={`View ${study.name} case study on Behance (opens in a new tab)`}
                      >
                        <span>Behance</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* In-Depth Case Study Modal */}
      <AnimatePresence>
        {activeModal && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Modal Card */}
            <motion.div
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[30px] border border-neutral-200 bg-white shadow-2xl text-neutral-900"
            >
              {/* Modal Sticky Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 bg-white/95 backdrop-blur-md">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-violet-700 font-sans">
                    {activeModal.category} • {activeModal.year}
                  </span>
                  <h3
                    id="modal-title"
                    className="font-bricolage text-2xl font-bold tracking-tight text-neutral-900"
                  >
                    {activeModal.name} Case Study
                  </h3>
                </div>

                <button
                  ref={modalCloseBtnRef}
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-600 transition hover:bg-neutral-200 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2056]"
                  aria-label="Close case study details"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto p-6 sm:p-8 space-y-7">
                {/* Visual Preview in Modal */}
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
                  <img
                    src={activeModal.image}
                    alt={activeModal.alt}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Meta details */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
                  <div>
                    <p className="text-xs text-neutral-500 font-sans">Role</p>
                    <p className="text-sm font-semibold font-sans text-neutral-900">{activeModal.role}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-sans">Timeline</p>
                    <p className="text-sm font-semibold font-sans text-neutral-900">{activeModal.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-sans">Focus</p>
                    <p className="text-sm font-semibold font-sans text-neutral-900">{activeModal.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-sans">Status</p>
                    <p className="text-sm font-semibold font-sans text-emerald-600">Complete</p>
                  </div>
                </div>

                {/* Challenge Section */}
                <div>
                  <div className="flex items-center gap-2 text-rose-600">
                    <Target className="h-4 w-4" />
                    <h4 className="font-bricolage text-lg font-bold text-neutral-900">
                      The Problem & Challenge
                    </h4>
                  </div>
                  <p className="mt-2 font-sans text-sm sm:text-base leading-relaxed text-neutral-700">
                    {activeModal.challenge}
                  </p>
                </div>

                {/* Research Section */}
                <div>
                  <div className="flex items-center gap-2 text-violet-600">
                    <Compass className="h-4 w-4" />
                    <h4 className="font-bricolage text-lg font-bold text-neutral-900">
                      User Research & Discovery
                    </h4>
                  </div>
                  <p className="mt-2 font-sans text-sm sm:text-base leading-relaxed text-neutral-700">
                    {activeModal.research}
                  </p>
                </div>

                {/* Solution Section */}
                <div>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <h4 className="font-bricolage text-lg font-bold text-neutral-900">
                      UX Architecture & Solution
                    </h4>
                  </div>
                  <p className="mt-2 font-sans text-sm sm:text-base leading-relaxed text-neutral-700">
                    {activeModal.solution}
                  </p>
                </div>

                {/* Key Deliverables */}
                <div>
                  <div className="flex items-center gap-2 text-amber-600">
                    <Layers className="h-4 w-4" />
                    <h4 className="font-bricolage text-lg font-bold text-neutral-900">
                      UX Deliverables Produced
                    </h4>
                  </div>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeModal.deliverables.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs sm:text-sm font-sans font-medium text-neutral-800"
                      >
                        <span className="flex h-1.5 w-1.5 rounded-full bg-[#FF2056]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Measurable Results */}
                <div>
                  <div className="flex items-center gap-2 text-sky-600">
                    <TrendingUp className="h-4 w-4" />
                    <h4 className="font-bricolage text-lg font-bold text-neutral-900">
                      Validated Results & Metrics
                    </h4>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {activeModal.metrics.map((metric, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-neutral-200 bg-neutral-50/80 p-3.5 text-center"
                      >
                        <p className="font-bricolage text-xl font-extrabold text-neutral-900">
                          {metric.value}
                        </p>
                        <p className="mt-1 font-sans text-xs text-neutral-600">
                          {metric.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between border-t border-neutral-200 px-6 py-4 bg-neutral-50">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="rounded-full border border-neutral-300 bg-white px-5 py-2 text-xs sm:text-sm font-medium font-sans text-neutral-700 hover:bg-neutral-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2056]"
                >
                  Close Case Study
                </button>

                {activeModal.behanceUrl && (
                  <a
                    href={activeModal.behanceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2 text-xs sm:text-sm font-semibold font-sans text-white hover:bg-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2056]"
                  >
                    <span>Full Behance Case Study</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
