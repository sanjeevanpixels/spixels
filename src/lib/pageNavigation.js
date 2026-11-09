export function navigateToPage(path) {
  const target = new URL(path, window.location.origin);
  if (target.origin !== window.location.origin) return;
  window.history.pushState({}, '', `${target.pathname}${target.search}${target.hash}`);
  window.dispatchEvent(new Event('app:navigate'));
}
