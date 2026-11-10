import Button from '../components/ui/Button';
import { RippleButton, RippleButtonRipples } from '@animate-ui/react/primitives/buttons/ripple';
import SocialIcon from '../components/ui/SocialIcon';
import Lift from '../components/ui/Lift';
import IronFilingsBackground from '../components/ui/IronFilingsBackground';
import { CFG } from '../data/config';
import useCopyEmail from '../hooks/useCopyEmail';
import { externalProps } from '../lib/utils';

export default function Contact() {
  const copyEmail = useCopyEmail();
  return (
    <section id="contact" className="scroll-mt-16 bg-white py-12 dark:bg-[#0D0F17] sm:py-16 lg:py-20">
      
      <div className="mx-auto max-w-[1680px] px-4 sm:px-8">
        <div className="relative flex min-h-[520px] flex-col items-center justify-center overflow-hidden rounded-[30px] bg-[#0D0F17] px-5 py-14 text-center text-white shadow-2xl sm:min-h-[600px] sm:rounded-[52px] sm:px-10 sm:py-20">
          <IronFilingsBackground />
          <div className="relative z-10 w-full max-w-4xl mx-auto">
            <h2 className="font-bricolage text-[length:clamp(30px,5vw,58px)] font-bold leading-[1.08] tracking-[-0.04em]">Have a project in mind?</h2>
            <p className="max-w-xl mx-auto mt-4 text-base text-slate-200 sm:text-xl">Let's create something people love to use.</p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-9 sm:mt-14 sm:gap-5">
              
              <RippleButton asChild hoverScale={1.025} className="btn h-14 min-w-48 bg-white px-8 text-[#0D0F17] hover:bg-neutral-100">
                <a href={CFG.booking} {...externalProps(CFG.booking)}>Schedule a Meeting
                  <RippleButtonRipples color="rgba(124,58,237,0.22)" />
                </a> 
              </RippleButton>
              
              <Button onClick={copyEmail} className="border on-dark h-14 min-w-48 border-white/25 hover:border-white hover:bg-white/5">
                Copy Email
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-2.5 sm:gap-3">
              {CFG.social.map(([icon, name, url]) => (
                <Lift key={name} as="a" ia="wiggle" href={url} target={url === '#' ? undefined : '_blank'} rel={url === '#' ? undefined : 'noopener noreferrer'} aria-label={url === '#' ? `${name} profile (add link in src/data/config.js)` : `${name} (opens in a new tab)`} data-tooltip={name}
                  className="on-dark flex h-11 w-11 items-center justify-center rounded-full border border-white/50 transition-colors hover:bg-white hover:text-[#0D0F17] sm:h-[52px] sm:w-[52px]">
                  <SocialIcon name={icon} className="w-5 h-5" />
                </Lift>
              ))}
            </div>
            <div className="flex flex-wrap justify-center mt-12 text-xs gap-x-10 gap-y-2 text-white/70 sm:mt-14 sm:text-sm">
              <span>© {new Date().getFullYear()} Sanjeevan. All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
