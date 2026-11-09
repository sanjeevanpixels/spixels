import { useEffect, useState } from 'react';

// `map` = { sectionId: navId | null }. Returns the nav id for the section in the middle of the viewport.
export default function useScrollSpy(map) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(map[e.target.id] ?? null)),
      { rootMargin: '-40% 0px -55% 0px' }
    );
    Object.keys(map).forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [map]);
  return active;
}
