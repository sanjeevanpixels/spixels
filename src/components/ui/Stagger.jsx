import { motion } from 'motion/react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 180, damping: 22 } },
};

// Wrap a grid in <Stagger> and each child in <StaggerItem> for a reveal-on-scroll
export function Stagger(props) {
  return <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} {...props} />;
}
export function StaggerItem(props) {
  return <motion.div variants={item} {...props} />;
}
