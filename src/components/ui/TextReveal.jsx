import { motion, useReducedMotion } from 'motion/react';

const words = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045 } },
};
const word = {
  hidden: { opacity: 0, y: '0.55em', filter: 'blur(7px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 220, damping: 24 } },
};

export default function TextReveal({ text, className = '' }) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className}>{text}</span>;
  return (
    <>
      <span className="sr-only">{text}</span>
      <motion.span aria-hidden="true" variants={words} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.8 }} className={`block ${className}`}>
        {text.split(/\s+/).map((part, index) => <motion.span key={`${part}-${index}`} variants={word} className="mr-[0.22em] inline-block">{part}</motion.span>)}
      </motion.span>
    </>
  );
}
