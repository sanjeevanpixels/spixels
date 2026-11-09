import SectionHeading from '../components/ui/SectionHeading';
import { Stagger, StaggerItem } from '../components/ui/Stagger';
import Lift from '../components/ui/Lift';
import Icon from '../components/ui/Icon';
import { SERVICES } from '../data/content';

export default function Services() {
  return (
    <section id="services" className="sec !py-12 sm:!py-16 lg:!py-20">
      <div className="wrap">
        <SectionHeading
          title="Ways to Work Together"
          subtitle="From first sketch to shipped product, here's how I can help."
        />

        <Stagger className="grid grid-cols-1 gap-4 mt-8 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {SERVICES.map(([title, desc, icon]) => (
            <StaggerItem key={title} className="h-full">
              <Lift className="card flex h-full flex-col rounded-2xl border border-black/5 bg-[#FBFBFB] p-6 text-left dark:border-white/10 dark:bg-[#141722] sm:p-7">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-[#0D0F17]">
                    <Icon name={icon} className="w-6 h-6" />
                  </div>
                </div>

                <h3 className="mt-5 text-xl font-medium sm:text-[22px] sm:leading-snug">
                  {title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#666] dark:text-[#A3A3A3]">
                  {desc}
                </p>
              </Lift>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}