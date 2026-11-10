import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';
import { PROJECTS } from '../data/content';

const MAX_TAGS = 3;

export default function Projects() {
  const featured = PROJECTS.slice(0, 4);

  return (
    <section id="projects" aria-labelledby="projects-heading" className="scroll-mt-24 bg-[#FBFBFB] py-8 dark:bg-[#0D0F17] sm:py-10 lg:py-12">
      <div className="wrap">
        {/* Section Heading */}
        <SectionHeading id="projects-heading" title="Recent Projects" subtitle="A collection of ideas shaped into meaningful work."/>

        {/* Projects Grid */}
        <ul role="list" className="grid grid-cols-1 gap-4 mt-7 sm:mt-8 md:grid-cols-2 md:gap-5 lg:gap-6">
          {featured.map((p) => {
            const isCaseStudy = p.status === 'Case study';

            const ctaLabel = isCaseStudy
              ? 'View case study'
              : 'View project';

            const tags = p.tags || [];
            const shownTags = tags.slice(0, MAX_TAGS);
            return (
              <li key={p.slug} className="flex min-w-0">

                <article className="group relative flex w-full flex-col rounded-3xl border border-[#E8E8E8] bg-white p-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none dark:border-neutral-800 dark:bg-[#12141D]">

                  {/* Project Preview */}
                  <div className="relative aspect-video overflow-hidden rounded-[1.35rem]">

                    <img
                      src={p.image}
                      alt={p.alt || `${p.name} project preview`}
                      width="1200"
                      height="675"
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.035] motion-reduce:transition-none"
                    />

                  </div>

                  {/* Project Information */}
                  <div className="flex flex-1 flex-col px-2.5 pb-1 pt-4 sm:px-3">

                    {/* Category & Status */}
                    <div className="flex items-center justify-between gap-3">

                      <p className="min-w-0 text-xs font-medium tracking-wide truncate text-neutral-500 dark:text-neutral-400 sm:text-sm">
                        {p.category}
                      </p>

                    </div>

                    {/* Project Title */}
                    <h3 className="mt-3 text-xl font-bold leading-tight font-bricolage text-neutral-900 dark:text-white sm:text-2xl">
                      {p.name}
                    </h3>

                    {/* Project Description */}
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-[15px]">
                      {p.description}
                    </p>

                    {/* Project Tags */}
                    <ul role="list" className="mt-4 flex flex-wrap gap-1.5">
                      {shownTags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 sm:text-[13px]"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>

                    {/* Card Footer */}
                    <div className="pt-5 mt-auto">

                      <div className="flex items-center justify-between border-t border-[#EAEAEA] pt-3.5 dark:border-neutral-800">

                        {/* Project Year */}
                        <span className="text-xs font-medium tracking-wider text-neutral-500 dark:text-neutral-400 sm:text-sm">
                          {p.year}
                        </span>

                        {/* Clickable CTA */}
                        <a href={p.behanceUrl || '#'} target="_blank" rel="noopener noreferrer" aria-label={`${ctaLabel}: ${p.name} (opens in a new tab)`} className="inline-flex items-center gap-2 text-sm font-semibold transition-colors min-h-11 text-neutral-900 hover:text-[#FF2056] focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2056] dark:text-white dark:hover:text-indigo-400 motion-reduce:transition-none">
                          <span>{ctaLabel}</span>
                          
                          <svg viewBox="0 0 24 24" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" >
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        {/* View All Projects */}
        {PROJECTS.length > 4 && (
          <div className="flex justify-center mt-7 sm:mt-8">
            <Button as="a" variant="soft" href="/projectsdetails" data-app-route="" className="border border-[#E6E6E6] dark:border-neutral-800">
              View More Projects
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}