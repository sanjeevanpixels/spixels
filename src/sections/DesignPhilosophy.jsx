import { motion, useReducedMotion } from 'motion/react';
import Icon from '../components/ui/Icon';
import SectionHeading from '../components/ui/SectionHeading';
import { DESIGN_PRINCIPLES } from '../data/content';

export default function DesignPhilosophy() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="design-philosophy"
      aria-labelledby="design-philosophy-heading"
      className="sec overflow-hidden bg-white !py-12 dark:bg-[#0D0F17] sm:!py-16 lg:!py-20"
    >
      <div className="wrap">
        <SectionHeading
          title="Design Philosophy"
          headingId="design-philosophy-heading"
          subtitle="Curious by nature, thoughtful by choice. I design with people in mind and purpose in every detail."
          className="mb-8 sm:mb-10"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DESIGN_PRINCIPLES.map(({ title, description, icon }, index) => (
            <motion.article
              key={title}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: reduceMotion ? 0 : 0.45,
                delay: reduceMotion ? 0 : index * 0.08,
              }}
              className="rounded-2xl border border-black/5 bg-[#FBFBFB] p-6 dark:border-white/10 dark:bg-[#15171E] sm:rounded-[28px] sm:p-7"
            >
              <div className="grid size-12 place-items-center rounded-2xl bg-[#F5F000]/25 text-[#0D0F17] dark:bg-[#F5F000]/15 dark:text-[#F5F000]">
                <Icon name={icon} className="size-5" />
              </div>
              <h3 className="mt-5 font-bricolage text-xl font-semibold tracking-tight text-[#0D0F17] dark:text-white">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#666] dark:text-[#A3A3A3] sm:text-base">
                {description}
              </p>
            </motion.article>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed text-[#666] dark:text-[#A3A3A3] sm:mt-10 sm:text-base">
          I bring a calm, collaborative energy to the process: stay curious,
          listen closely, keep learning, and make the complicated feel simple.
        </p>
      </div>
    </section>
  );
}
