import { SERVICES } from '../data/content';

export default function Services() {
  return (
    <section id="services" className="sec !py-12 sm:!py-16 lg:!py-20">
      <div className="wrap">
        <header className="mx-auto max-w-3xl text-center">
          <h2 className="h2 mb-0 max-w-2xl mx-auto text-center">
            Ways to Work Together
          </h2>
          <p className="sub mt-4 mx-auto max-w-2xl text-center">
            From first sketch to shipped product, here's how I can help.
          </p>
        </header>

        <ul className="mt-10 divide-y border-y border-black/10 sm:mt-14 dark:border-white/10">
          {SERVICES.map(([title, description]) => (
            <li key={title}>
              <a
                href="#contact"
                className="group grid grid-cols-1 gap-4 py-8 transition-colors sm:grid-cols-[1fr_auto] sm:gap-6 lg:grid-cols-[1fr_1.5fr_auto] lg:gap-10"
              >
                <div>
                  <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    {title}
                  </h3>
                </div>

                <p className="text-sm leading-6 text-[#666] dark:text-neutral-400">
                  {description}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}