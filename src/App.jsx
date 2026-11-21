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
import Process from "./sections/Process";
import Tools from "./sections/Tools";
import Testimonials from "./sections/Testimonials";
import FAQ from "./sections/FAQ";
import ProjectPage from "./sections/projectsdetails";
import { PLACEHOLDER_MSG } from "./data/config";
import useToast from "./hooks/useToast";
import { navigateToPage } from "./lib/pageNavigation";
import PeacockTrainPreloader from "./components/ui/PeacockTrainPreloader";

export default function App() {
  const toast = useToast();
  const [resumeOpen, setResumeOpen] = useState(false);
  const [pathname, setPathname] = useState(window.location.pathname);
  const [loading, setLoading] = useState(true);
  const reduceMotion = useReducedMotion();
  const openResume = useCallback(() => setResumeOpen(true), []);
  const closeResume = useCallback(() => setResumeOpen(false), []);

 const isProjectPage = pathname.replace(/\/+$/, '') === '/projectsdetails';

  useEffect(() => {
    const metadata = isProjectPage
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
  }, [isProjectPage]);

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
      <a href={isProjectPage ? '#top' : '#main'}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded-full focus:shadow-lg"
      >
        Skip to content
      </a>
      <ScrollProgress />
      {!isProjectPage && <Header onResume={openResume} />}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isProjectPage ? 'project-page' : 'portfolio-page'}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.22, 0.61, 0.36, 1] }}
        >

          {isProjectPage ? (
            <ProjectPage />
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
                <FAQ />
                <Contact />
              </main>
              <BackToTop />
            </>
          )}
        </motion.div>
      </AnimatePresence>
      <ResumeViewer open={resumeOpen} onClose={closeResume} />
      </div>
      {loading && (
        <div role="status" aria-label="Loading Sanjeevan's portfolio" className="fixed inset-0 z-[200]">
          <PeacockTrainPreloader
            preset="opal"
            durationMs={4200}
            height="100svh"
            hud
            onComplete={() => setLoading(false)}
          />
        </div>
      )}
    </>
  );
}