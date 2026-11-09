import { cn } from '../../lib/utils';

// Infinite horizontal scroller. Content is rendered twice so the -50% loop is seamless.
// `fade` = gradient "from-*" classes for the edge fades (omit for none).
export default function Marquee({ children, fade, fadeWidth = 'w-20 sm:w-40', className, trackClassName, label, tabIndex, ...props }) {
  return (
    <div className={cn('marquee relative overflow-hidden', className)} role={label ? 'region' : undefined} aria-label={label} tabIndex={tabIndex} {...props}>
      {fade && (
        <>
          <div className={cn('absolute left-0 inset-y-0 z-10 pointer-events-none bg-gradient-to-r to-transparent', fadeWidth, fade)} />
          <div className={cn('absolute right-0 inset-y-0 z-10 pointer-events-none bg-gradient-to-l to-transparent', fadeWidth, fade)} />
        </>
      )}
      <div className={cn('flex w-max animate-marquee', trackClassName)}>
        {children}
        <div className="contents marquee-dup" aria-hidden="true" inert="">{children}</div>
      </div>
    </div>
  );
}
