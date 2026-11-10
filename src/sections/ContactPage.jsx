import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import SocialIcon from '../components/ui/SocialIcon';
import Lift from '../components/ui/Lift';
import ContactForm from '../components/layout/ContactForm';
import { CFG } from '../data/config';
import useCopyEmail from '../hooks/useCopyEmail';

export default function ContactPage({ service, onServiceChange }) {
  const copyEmail = useCopyEmail();

  return (
    <main
      id="contact-page"
      className="min-h-[calc(100svh-76px)] bg-[#F7F7F7] py-5 dark:bg-[#0D0F17] sm:py-8 lg:py-10"
    >
      <div className="w-full max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">

        {/* Back Navigation */}
        <a
          href="/"
          data-app-route=""
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-[#0D0F17] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 dark:text-neutral-300 dark:hover:bg-[#1A1D26] dark:hover:text-white"
        >
          <Icon name="arrow-left" />
          Back to portfolio
        </a>

        {/* Page Heading */}
        <header className="max-w-3xl mx-auto mt-6 text-center mb-7 sm:mb-9 sm:mt-7">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300 sm:text-sm">
            Contact &amp; collaboration
          </p>

          <h1 className="font-bricolage text-[clamp(34px,5vw,64px)] font-bold leading-[1.05] tracking-[-0.05em] text-[#0D0F17] dark:text-white">
            Let’s make something meaningful.
          </h1>

          <p className="max-w-xl mx-auto mt-3 text-sm leading-6 sub sm:text-base sm:leading-7">
            Have an idea, a design challenge, or a project in mind?
            Share a little about it and I’ll get back to you.
          </p>
        </header>

        {/* Contact Card */}
        <div className="grid items-stretch overflow-hidden rounded-[24px] bg-white shadow-[0_16px_60px_rgba(24,24,38,0.07)] ring-1 ring-black/[0.04] dark:bg-[#15171E] dark:ring-white/[0.06] sm:rounded-[30px] lg:grid-cols-[0.85fr_1.15fr]">

          {/* Left Information Panel */}
          <aside className="relative flex flex-col justify-between overflow-hidden bg-[#0D0F17] p-6 text-white sm:p-8 lg:p-9">

            {/* Background Decoration */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-16 -right-5 select-none font-bricolage text-[220px] font-extrabold leading-none text-white/[0.035]"
            >
              S
            </div>

            {/* Introduction */}
            <div className="relative z-10">
              <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-indigo-300">
                <Icon name="message-circle" />
              </span>

              <h2 className="max-w-xs text-2xl font-bold leading-tight font-bricolage sm:text-3xl">
                Let’s start a conversation
              </h2>

              <p className="max-w-sm mt-3 text-sm leading-6 text-white/60 sm:text-base">
                Tell me what you’re working on, what you’re trying
                to solve, or simply say hello.
              </p>
            </div>

            {/* Contact Details */}
            <div className="relative z-10 pt-6 mt-10 border-t border-white/15 sm:mt-12">

              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                Email address
              </p>

              <a
                href={`mailto:${CFG.email}`}
                className="inline-block mt-2 text-base font-medium underline break-all transition decoration-white/30 underline-offset-4 hover:decoration-white sm:text-lg"
              >
                {CFG.email}
              </a>

              <div>
                <Button
                  onClick={copyEmail}
                  className="mt-4 border on-dark border-white/25 hover:border-white hover:bg-white/5"
                >
                  <Icon name="copy" />
                  Copy email
                </Button>
              </div>

              {/* Social Links */}
              <div className="mt-7">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                  Find me on
                </p>

                <div className="flex flex-wrap gap-2.5">
                  {CFG.social.map(([icon, name, url]) => (
                    <Lift
                      key={name}
                      as="a"
                      ia="wiggle"
                      href={url}
                      target={url === '#' ? undefined : '_blank'}
                      rel={url === '#' ? undefined : 'noopener noreferrer'}
                      data-tooltip={name}
                      aria-label={
                        url === '#'
                          ? `${name} profile (add link in src/data/config.js)`
                          : `${name} (opens in a new tab)`
                      }
                      className="on-dark flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-white hover:bg-white hover:text-[#0D0F17]"
                    >
                      <SocialIcon
                        name={icon}
                        className="h-[18px] w-[18px]"
                      />
                    </Lift>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Form Panel */}
          <section className="min-w-0 p-5 sm:p-8 lg:p-9">

            {/* Form Heading */}
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />

                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-600 dark:text-indigo-300">
                  Get in touch
                </span>
              </div>

              <h2 className="mt-2 font-bricolage text-2xl font-bold tracking-tight text-[#0D0F17] dark:text-white sm:text-3xl">
                Send a message
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-neutral-400">
                Share your project details and let's discuss how
                we can work together.
              </p>
            </div>

            {/* Contact Form */}
            <ContactForm
              service={service}
              onServiceChange={onServiceChange}
            />

          </section>
        </div>

        {/* Bottom Spacing */}
        <div className="h-2 sm:h-3" />

      </div>
    </main>
  );
}