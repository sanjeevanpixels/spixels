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
    <main id="contact-page" className="min-h-[calc(100svh-76px)] bg-[#F7F7F7] py-8 dark:bg-[#0D0F17] sm:py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <a href="/" data-app-route="" className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-[#0D0F17] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 dark:text-neutral-300 dark:hover:bg-[#1A1D26] dark:hover:text-white"><Icon name="arrow-left" />Back to portfolio</a>
        <header className="mx-auto mb-9 mt-8 max-w-3xl text-center sm:mb-12 sm:mt-10 lg:mb-14">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300">Contact &amp; collaboration</p>
          <h1 className="font-bricolage text-[length:clamp(36px,7vw,72px)] font-bold leading-[1.02] tracking-[-0.05em]">Let’s make something meaningful.</h1>
          <p className="sub mx-auto mt-5 max-w-2xl text-base leading-7 sm:text-lg">Have an idea, a design challenge, or a project in mind? Share a little about it and I’ll get back to you.</p>
        </header>

        <div className="grid overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(24,24,38,0.08)] ring-1 ring-black/[0.03] dark:bg-[#15171E] dark:ring-white/[0.06] sm:rounded-[36px] lg:grid-cols-[0.82fr_1.18fr]">
          <aside className="relative flex flex-col justify-between overflow-hidden bg-[#0D0F17] p-6 text-white sm:p-9 lg:p-11">
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-12 -right-8 font-bricolage text-[250px] font-extrabold leading-none text-white/[0.035]">S</div>
            <div className="relative z-10">
              <h2 className="font-bricolage text-2xl font-bold sm:text-3xl">Let’s start a conversation</h2>
              <p className="mt-3 max-w-sm leading-7 text-white/65">Tell me what you’re working on, what you’re trying to solve, or simply say hello.</p>
            </div>
            <div className="relative z-10 mt-10 border-t border-white/15 pt-7 sm:mt-12 sm:pt-8 lg:mt-20">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Email</p>
              <a href={`mailto:${CFG.email}`} className="mt-2 inline-block break-all text-lg font-medium underline decoration-white/30 underline-offset-4 hover:decoration-white sm:text-xl">{CFG.email}</a>
              <Button onClick={copyEmail} className="on-dark mt-4 border border-white/25 hover:border-white hover:bg-white/5"><Icon name="copy" />Copy email</Button>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {CFG.social.map(([icon, name, url]) => <Lift key={name} as="a" ia="wiggle" href={url} target={url === '#' ? undefined : '_blank'} rel={url === '#' ? undefined : 'noopener noreferrer'} data-tooltip={name} aria-label={url === '#' ? `${name} profile (add link in src/data/config.js)` : `${name} (opens in a new tab)`} className="on-dark flex h-11 w-11 items-center justify-center rounded-full border border-white/30 transition hover:bg-white hover:text-[#0D0F17]"><SocialIcon name={icon} className="h-5 w-5" /></Lift>)}
              </div>
            </div>
          </aside>
          <div className="p-5 sm:p-9 lg:p-11">
            <div className="mb-6">
              <h2 className="font-bricolage text-xl font-bold sm:text-2xl">Send a message</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-neutral-400">Share as much detail as you have so I can follow up.</p>
            </div>
            <ContactForm service={service} onServiceChange={onServiceChange} />
          </div>
        </div>
      </div>
    </main>
  );
}
