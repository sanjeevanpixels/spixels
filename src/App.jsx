import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Header from "./components/layout/Header";
import ScrollProgress from "./components/layout/ScrollProgress";
import BackToTop from "./components/layout/BackToTop";
import ResumeViewer from "./components/layout/ResumeViewer";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Services from "./sections/Services";
import WordMarquee from "./sections/WordMarquee";
import Contact from "./sections/Contact";
import ContactPage from "./sections/ContactPage";
import Process from "./sections/Process";
import Tools from "./sections/Tools";
import Testimonials from "./sections/Testimonials";
import ProjectPage from "./sections/projectsdetails";
import { PLACEHOLDER_MSG } from "./data/config";
import useToast from "./hooks/useToast";
import { navigateToPage } from "./lib/pageNavigation";

export default function App() {
  const toast = useToast();
  const [resumeOpen, setResumeOpen] = useState(false);
  const [service, setService] = useState("General enquiry");
  const [pathname, setPathname] = useState(window.location.pathname);
  const [loading, setLoading] = useState(true);
  const reduceMotion = useReducedMotion();
  const openResume = useCallback(() => setResumeOpen(true), []);
  const closeResume = useCallback(() => setResumeOpen(false), []);
  const isContactPage = pathname.replace(/\/$/, '') === '/contact';
  const isProjectPage = pathname.replace(/\/$/, '') === '/projects';

  useEffect(() => {
    const metadata = isContactPage
      ? {
          title: "Contact Sanjeevan | Design & Development Projects",
          description: "Get in touch with Sanjeevan about UI/UX design, web development, branding, or a digital product project.",
        }
      : isProjectPage
      ? {
          title: "Selected Projects | Sanjeevan",
          description: "Explore Sanjeevan's visual design work, logo identities, and UI/UX case study.",
        }
      : {
          title: "Sanjeevan | UI/UX Designer & Software Developer",
          description: "Sanjeevan is a UI/UX designer and software developer in Sri Lanka, creating clear digital products and responsive web experiences.",
        };
    document.title = metadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', metadata.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', metadata.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', metadata.description);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', metadata.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', metadata.description);
    const canonicalUrl = new URL(window.location.pathname, window.location.origin).href;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.append(canonical);
    }
    canonical.href = canonicalUrl;
    let socialUrl = document.querySelector('meta[property="og:url"]');
    if (!socialUrl) {
      socialUrl = document.createElement('meta');
      socialUrl.setAttribute('property', 'og:url');
      document.head.append(socialUrl);
    }
    socialUrl.content = canonicalUrl;
  }, [isContactPage, isProjectPage]);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), reduceMotion ? 80 : 850);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  useEffect(() => {
    // Links still set to "#" show a hint instead of jumping to the top
    const onClick = (e) => {
      const routeLink = e.target.closest?.('a[data-app-route]');
      if (routeLink && !e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
        e.preventDefault();
        navigateToPage(routeLink.getAttribute('href'));
        return;
      }
      const a = e.target.closest?.('a[href="#"]');
      if (a) {
        e.preventDefault();
        toast(PLACEHOLDER_MSG);
      }
    };
    const updatePath = () => {
      setPathname(window.location.pathname);
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    document.addEventListener("click", onClick);
    addEventListener('popstate', updatePath);
    addEventListener('app:navigate', updatePath);
    return () => {
      document.removeEventListener("click", onClick);
      removeEventListener('popstate', updatePath);
      removeEventListener('app:navigate', updatePath);
    };
  }, [toast]);

  return (
    <>
      <div aria-hidden={loading || undefined} aria-busy={loading} inert={loading}>
      <a
        href={isContactPage ? '#contact-page' : isProjectPage ? '#top' : '#main'}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded-full focus:shadow-lg"
      >
        Skip to content
      </a>
      <ScrollProgress />
      {!isProjectPage && <Header minimal={isContactPage} onResume={openResume} />}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isProjectPage ? 'project-page' : isContactPage ? 'contact-page' : 'portfolio-page'}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.22, 0.61, 0.36, 1] }}
        >
          {isProjectPage ? (
            <ProjectPage />
          ) : isContactPage ? (
            <ContactPage service={service} onServiceChange={setService} />
          ) : (
            <>
              <main id="main" tabIndex={-1} className="outline-none">
                <Hero />
                <WordMarquee />
                <Projects />
                <Services />
                <About />
                <Experience />
                <Process />
                <Tools />
                <Testimonials />
                <Contact />
              </main>
              <BackToTop />
            </>
          )}
        </motion.div>
      </AnimatePresence>
      <ResumeViewer open={resumeOpen} onClose={closeResume} />
      </div>
      <AnimatePresence>
        {loading && (
          <motion.div key="site-loader" role="status" aria-label="Loading Sanjeevan's portfolio" className="fixed inset-0 z-[200] isolate flex flex-col items-center justify-center overflow-hidden bg-[#100B1C] text-white" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.4, ease: [0.22, 0.61, 0.36, 1] } }}>
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_42%,rgba(120,65,190,0.25),transparent_48%),radial-gradient(ellipse_at_15%_85%,rgba(245,111,43,0.12),transparent_38%)]" />
            <div aria-hidden="true" className="absolute left-[12%] top-[17%] h-24 w-24 rounded-full bg-[#FFF2C6] shadow-[0_0_80px_rgba(255,242,198,0.16)] sm:left-[19%] sm:top-[16%] sm:h-32 sm:w-32" />
            <div aria-hidden="true" className="absolute left-[calc(12%+28px)] top-[calc(17%-8px)] h-24 w-24 rounded-full bg-[#100B1C] sm:left-[calc(19%+38px)] sm:top-[calc(16%-12px)] sm:h-32 sm:w-32" />
            {[['24%', '24%', 0], ['78%', '21%', 0.8], ['82%', '68%', 0.35], ['17%', '72%', 1.1], ['67%', '82%', 0.55]].map(([left, top, delay], index) => (
              <motion.span key={index} aria-hidden="true" className="absolute h-1.5 w-1.5 rounded-full bg-[#FFD18A]" style={{ left, top }} animate={reduceMotion ? undefined : { opacity: [0.25, 1, 0.25], scale: [0.75, 1.2, 0.75] }} transition={{ duration: 2.4, delay, repeat: Infinity, ease: 'easeInOut' }} />
            ))}
            <div className="relative flex items-center justify-center w-48 h-48 mb-7 sm:mb-8 sm:h-56 sm:w-56">
              {!reduceMotion && <motion.svg aria-hidden="true" viewBox="0 0 100 100" className="absolute -right-2 top-0 h-12 w-12 text-[#E8D6FF] sm:-right-4 sm:h-14 sm:w-14" animate={{ y: [0, -8, 0], rotate: [8, 15, 8] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}><path fill="currentColor" d="M50 4c-8 15-22 19-36 20 9 7 15 16 16 27 7-5 13-12 20-24 7 12 13 19 20 24 1-11 7-20 16-27C72 23 58 19 50 4Z" /></motion.svg>}
              <motion.svg aria-hidden="true" viewBox="0 0 180 190" className="h-full w-full drop-shadow-[0_18px_30px_rgba(0,0,0,0.35)]" initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.88 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: reduceMotion ? 0 : 0.55, type: 'spring', stiffness: 170, damping: 18 }}>
                <path d="M85 30c-7-12-5-21 2-28 6 10 15 13 25 13-1 9-8 16-18 19" fill="#83A85A" />
                <path d="M87 37C68 25 47 34 36 49 15 52 8 74 15 100c5 22 22 40 39 43 10 12 29 15 41 2 20-3 37-21 42-45 5-23-2-43-21-50-9-12-18-16-29-13Z" fill="#F47A32" />
                <path d="M87 37c-12 7-17 23-16 47 1 26 7 46 17 60 10-13 16-34 17-60 1-23-5-40-18-47Z" fill="#FF9A43" />
                <path d="M36 49c-8 14-9 34-3 53 5 17 13 30 22 37-7-18-10-36-10-55 0-18 3-34 10-48-7 1-13 5-19 13Z" fill="#E9672D" />
                <path d="m49 78 15-10-2 20 13 9-18 1-8 16-4-18-15-7 18-3 1-8Zm48-1 12-8 1 17 14 7-15 4-6 16-5-16-13-5 13-6-1-9Z" fill="#24142E" />
                <path d="M57 119c10 4 19 4 29 0 9 4 17 4 26 0-4 12-13 19-27 19-13 0-23-7-28-19Z" fill="#24142E" />
                <path d="M63 121h42l-5 8H68l-5-8Z" fill="#FFF0C8" />
              </motion.svg>
              {!reduceMotion && <motion.span aria-hidden="true" className="absolute -bottom-1 left-1/2 h-2 w-28 -translate-x-1/2 rounded-full bg-[#F47A32]/35 blur-md" animate={{ scaleX: [0.8, 1.12, 0.8], opacity: [0.5, 0.85, 0.5] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }} />}
            </div>
            <p className="font-bricolage text-2xl font-semibold tracking-tight sm:text-[28px]">Sanjeevan<span className="text-[#FF9A43]">.</span></p>
            <p className="mt-2 text-sm text-white/65 sm:text-base">A little magic is loading<span aria-hidden="true">…</span></p>
            <div aria-hidden="true" className="w-40 h-1 mt-6 overflow-hidden rounded-full bg-white/10">
              <motion.span className="block h-full origin-left rounded-full bg-gradient-to-r from-[#A879F5] via-[#F47A32] to-[#FFD18A]" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: reduceMotion ? 0 : 0.75, ease: 'easeInOut' }} />
            </div>
            <span className="sr-only">Preparing the portfolio</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
