import { motion, useReducedMotion } from 'motion/react';
import Icon from '../components/ui/Icon';
import SectionHeading from '../components/ui/SectionHeading';
import { EDUCATION } from '../data/content';

export default function Education() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className="sec bg-white !py-12 dark:bg-[#0D0F17] sm:!py-16"
    >
      <div className="wrap">
        <SectionHeading
          title="Education & Learning"
          headingId="education-heading"
          subtitle="The foundation behind how I keep growing as a designer and developer."
          className="mb-8 sm:mb-10"
        />

        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
          {EDUCATION.map(({ title, focus, period, description, icon }, index) => (
            <motion.article
              key={title}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: reduceMotion ? 0 : 0.4,
                delay: reduceMotion ? 0 : index * 0.08,
              }}
              className="rounded-2xl border border-black/5 bg-[#FBFBFB] p-6 dark:border-white/10 dark:bg-[#15171E] sm:rounded-[28px] sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#F5F000]/25 text-[#0D0F17] dark:bg-[#F5F000]/15 dark:text-[#F5F000]">
                  <Icon name={icon} className="size-5" />
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#666] dark:bg-white/5 dark:text-[#A3A3A3]">
                  {period}
                </span>
              </div>
              <h3 className="mt-5 font-bricolage text-xl font-semibold text-[#0D0F17] dark:text-white">
                {title}
              </h3>
              <p className="mt-1 text-sm font-medium text-violet-700 dark:text-violet-300">
                {focus}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#666] dark:text-[#A3A3A3]">
                {description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
