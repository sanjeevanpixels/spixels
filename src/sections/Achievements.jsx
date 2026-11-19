import { motion, useReducedMotion } from 'motion/react';
import Icon from '../components/ui/Icon';
import SectionHeading from '../components/ui/SectionHeading';
import { ACHIEVEMENTS } from '../data/content';

export default function Achievements() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="achievements"
      aria-labelledby="achievements-heading"
      className="sec bg-[#FBFBFB] !py-12 dark:bg-[#11131B] sm:!py-16"
    >
      <div className="wrap">
        <SectionHeading
          title="Achievements"
          headingId="achievements-heading"
          subtitle="A few milestones from the work, teams, and ideas I’ve been part of."
          className="mb-8 sm:mb-10"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENTS.map(({ value, title, description, icon }, index) => (
            <motion.article
              key={title}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: reduceMotion ? 0 : 0.4,
                delay: reduceMotion ? 0 : index * 0.07,
              }}
              className="rounded-2xl border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-[#15171E] sm:rounded-[28px] sm:p-7"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-bricolage text-4xl font-bold tracking-tight text-[#0D0F17] dark:text-white sm:text-5xl">
                  {value}
                </p>
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#F5F000]/25 text-[#0D0F17] dark:bg-[#F5F000]/15 dark:text-[#F5F000]">
                  <Icon name={icon} className="size-5" />
                </span>
              </div>
              <h3 className="mt-5 font-bricolage text-lg font-semibold text-[#0D0F17] dark:text-white">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#666] dark:text-[#A3A3A3]">
                {description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
