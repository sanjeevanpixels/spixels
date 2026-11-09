import Marquee from '../components/ui/Marquee';
import Icon from '../components/ui/Icon';
import { WORDS } from '../data/content';

export default function WordMarquee() {
  return (
    <section className=" pt-16 bg-white dark:bg-[#0D0F17] select-none" aria-hidden="true">
      <Marquee className="border-y border-[#E6E6E6] dark:border-neutral-800 py-6" trackClassName="whitespace-nowrap">
        {WORDS.map((w) => (
          <span key={w} className="flex items-center gap-8 pr-8 font-bricolage text-2xl sm:text-3xl text-[#666] dark:text-[#A3A3A3]">
            {w}<Icon name="sparkles" className="w-6 h-6 text-[#FF2056] opacity-50" />
          </span>
        ))}
      </Marquee>
    </section>
  );
}
