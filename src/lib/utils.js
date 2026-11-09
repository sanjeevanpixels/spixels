export const cn = (...a) => a.filter(Boolean).join(' ');

// Adds target/rel for absolute URLs
export const externalProps = (url) =>
  /^https?:/.test(url) ? { target: '_blank', rel: 'noopener' } : {};
