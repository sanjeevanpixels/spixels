import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../lib/utils';

const MotionButton = motion.button;
const MotionAnchor = motion.a;

const VARIANTS = {
  dark: 'btn-dark',
  soft: 'btn-soft',
};

// Reusable, accessible pill button.
// Use as="a" for navigation links.
export default function Button({
  as: Tag = 'button',
  variant = 'dark',
  className,
  children,
  disabled = false,
  type,
  ...props
}) {
  const reduceMotion = useReducedMotion();
  const isAnchor = Tag === 'a';

  const MotionTag = isAnchor ? MotionAnchor : MotionButton;

  const isDisabled = disabled || (isAnchor && props['aria-disabled'] === true);

  return (
    <MotionTag
      className={cn(
        'btn',
        VARIANTS[variant] || VARIANTS.dark,
        'inline-flex items-center justify-center gap-2',
        'min-h-[44px] px-5 py-2.5',
        'whitespace-nowrap select-none',
        'text-sm font-medium leading-none',
        'rounded-full',
        'transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-violet-500 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        isDisabled && 'pointer-events-none opacity-50',
        className
      )}
      whileHover={
        !reduceMotion && !isDisabled
          ? { y: -2 }
          : undefined
      }
      whileTap={
        !reduceMotion && !isDisabled
          ? { scale: 0.97 }
          : undefined
      }
      transition={{
        type: 'spring',
        stiffness: 440,
        damping: 28,
      }}
      {...(!isAnchor && {
        type: type || 'button',
        disabled: isDisabled,
      })}
      {...props}
    >
      {children}
    </MotionTag>
  );
}