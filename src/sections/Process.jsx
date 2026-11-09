import SectionHeading from '../components/ui/SectionHeading';
import { Stagger, StaggerItem } from '../components/ui/Stagger';
import Lift from '../components/ui/Lift';
import { PROCESS } from '../data/content';

export default function Process() {
  return (
    <section
      id="process"
      className="sec bg-white !py-12 dark:bg-[#0D0F17] md:!py-16 lg:!py-20"
    >
      <div className="wrap">
        <SectionHeading
          title="How I Work"
          subtitle="A simple process from understanding to execution."
        />

        <Stagger className="grid grid-cols-1 gap-4 mt-8 sm:mt-10 md:grid-cols-3 md:gap-5 lg:gap-6">
          {PROCESS.map(([title, desc, gradient, image]) => (
            <StaggerItem key={title} className="h-full">
              <Lift
                className={`group relative isolate flex h-full min-h-[340px] transform-gpu flex-col justify-end overflow-hidden rounded-[24px] bg-gradient-to-br ${gradient} p-6 text-white sm:min-h-[380px] md:min-h-[400px] lg:min-h-[440px] lg:rounded-[32px] lg:p-8`}
              >
                {/* Background image */}
                <img
                  src={image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 object-cover w-full h-full transition-transform duration-500 ease-out -z-10 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />

                {/* Readability overlay */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 bg-gradient-to-t from-[#080910]/95 via-[#080910]/45 to-[#080910]/10"
                />
                {/* Text */}
                <div className="text-center">
                  <h3 className="text-2xl font-medium leading-tight sm:text-[26px] lg:text-[28px]">
                    {title}
                  </h3>
                  <p className="mx-auto mt-2 max-w-[320px] text-[15px] leading-relaxed text-white/85 sm:mt-3 sm:text-base">
                    {desc}
                  </p>
                </div>
              </Lift>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}