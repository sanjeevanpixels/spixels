const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export const go = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' });

export const toTop = () => scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
