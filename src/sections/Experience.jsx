import SectionHeading from '../components/ui/SectionHeading';
import { Stagger, StaggerItem } from '../components/ui/Stagger';
import ExperienceCard from '../components/cards/ExperienceCard';
import { EXP } from '../data/content';

export default function Experience() {
  if (!EXP?.length) return null;

  return (
    <section
      id="experience"
      aria-label="Career experience"
      className="
        scroll-mt-20
        bg-[#FBFBFB] dark:bg-[#0D0F17]
        py-8 sm:py-10 md:py-12
        transition-colors duration-300
      "
    >
      <div className="wrap">

        <SectionHeading
          title="Career Experience"
          subtitle="Where I've worked and what I've built."
          className="mb-6 md:mb-8"
        />

        <Stagger
          className="grid items-stretch grid-cols-1 gap-4 md:grid-cols-2 md:gap-5"
        >
          {EXP.map((x, i) => (
            <StaggerItem
              key={`${x.co}-${x.role}-${i}`}
              className="h-full min-w-0"
            >
              <ExperienceCard {...x} />
            </StaggerItem>
          ))}
        </Stagger>

      </div>
    </section>
  );
}