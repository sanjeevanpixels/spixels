import { motion } from 'motion/react';
import { NAV } from '../../data/navigation';
import { cn } from '../../lib/utils';

// variant="desktop": sliding pill (shared layoutId) · variant="mobile": plain highlight
export default function NavLinks({ active, variant = 'desktop', onNavigate }) {
  const mobile = variant === 'mobile';
  return NAV.map(([id, label]) => {
    const on = active === id;
    return (
      <a
        key={id}
        href={`#${id}`}
        onClick={onNavigate}
        aria-current={on ? 'location' : undefined}
        className={cn('navlink', on && 'on', mobile && '[&.on]:bg-white dark:[&.on]:bg-neutral-800')}
      >
        {!mobile && on && (
          <motion.span
            layoutId="nav-pill"
            aria-hidden="true"
            className="absolute inset-0 bg-white rounded-full shadow-sm -z-10 dark:bg-neutral-700"
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          />
        )}
        <span>{label}</span>
      </a>
    );
  });
}
