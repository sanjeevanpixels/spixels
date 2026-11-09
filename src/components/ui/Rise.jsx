import { motion } from 'motion/react';

// Hero entrance: fades/slides up, delayed by index `i`
export default function Rise({ as = 'div', i = 0, ...props }) {
  const Cmp = motion[as];
  return (
    <Cmp
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 170, damping: 22, delay: i * 0.09 }}
      {...props}
    />
  );
}
