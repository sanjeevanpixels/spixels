import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import SectionHeading from '../components/ui/SectionHeading';
import { FAQS } from '../data/content';
import {
  faqAnswerVariants,
  faqItemVariants,
  faqListVariants,
} from '../lib/faqAnimations';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="sec bg-[#FBFBFB] !py-12 sm:!py-16 lg:!py-20"
    >
      <div className="wrap">
        <SectionHeading
          title="Frequently Asked Questions"
          headingId="faq-heading"
          subtitle="A few helpful details about working together."
          className="mb-8 sm:mb-10"
        />

        <motion.div
          variants={faqListVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mx-auto max-w-3xl divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-5 sm:rounded-[28px] sm:px-8"
        >
          {FAQS.map(({ question, answer }, index) => {
            const isOpen = openIndex === index;
            const answerId = `faq-answer-${index}`;

            return (
              <motion.div
                key={question}
                variants={faqItemVariants}
                className="py-1"
              >
                <h3>
                  <button
                    type="button"
                    id={`faq-question-${index}`}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="flex min-h-16 w-full items-center justify-between gap-5 py-4 text-left font-bricolage text-base font-semibold leading-snug text-[#0D0F17] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500 sm:text-lg"
                  >
                    {question}
                    <span
                      aria-hidden="true"
                      className="relative grid size-8 shrink-0 place-items-center rounded-full bg-[#F1F1F3] text-xl font-normal leading-none text-[#0D0F17]"
                    >
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.2 }}
                      >
                        +
                      </motion.span>
                    </span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      id={answerId}
                      role="region"
                      aria-labelledby={`faq-question-${index}`}
                      variants={faqAnswerVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : undefined
                      }
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-5 pr-10 text-sm leading-relaxed text-[#666] sm:pb-6 sm:text-base">
                        {answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
