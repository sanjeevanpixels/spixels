import TextReveal from './TextReveal';
import { cn } from '../../lib/utils';

export default function SectionHeading({
  title,
  subtitle,
  className,
  subClassName,
  ...props
}) {
  return (
    <div
      className={cn(
        'mx-auto mb-12 w-full max-w-3xl px-4 text-center sm:mb-14 lg:mb-16',
        className
      )}
      {...props}
    >
      <h2
        className={cn(
          'h2 text-balance leading-[1.1] tracking-tight'
        )}
      >
        <TextReveal text={title} />
      </h2>

      {subtitle && (
        <p
          className={cn(
            'sub mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed sm:mt-5 sm:text-lg',
            subClassName
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}