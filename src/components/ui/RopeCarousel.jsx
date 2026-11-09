import { useEffect, useMemo, useRef, useState } from 'react';

// Rope carousel interaction adapted for local project and company logo assets.
export default function RopeCarousel({
  items = [],
  cardWidth = 190,
  gap = 34,
  sag = 58,
  speed = 18,
  ropeColor = '#887A9E',
  clipColor = '#A78BFA',
  background = 'transparent',
  className = '',
}) {
  const rootRef = useRef(null);
  const ropeRef = useRef(null);
  const ropeShadowRef = useRef(null);
  const ropeHighlightRef = useRef(null);
  const cardsRef = useRef([]);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const step = cardWidth + gap;
  const totalCards = useMemo(() => {
    if (!items.length || !size.width) return 0;
    const repeats = Math.max(2, Math.ceil((size.width + step * 4) / (items.length * step)));
    return items.length * repeats;
  }, [items.length, size.width, step]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const measure = () => setSize({ width: root.clientWidth, height: root.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !size.width || !size.height || !items.length || !totalCards) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const width = size.width;
    const height = size.height;
    const fit = Math.min(1, Math.max(0.72, width / 950));
    const card = cardWidth * fit;
    const cardStep = step * fit;
    const lineSag = sag * Math.min(1, width / 900);
    const total = totalCards * cardStep;
    const top = Math.max(18, (height - lineSag - card * 0.9 - 36) / 2);
    const center = width / 2;
    const shape = 1.05;
    const denominator = Math.cosh(shape) - 1;
    const ropeY = (x) => {
      const u = Math.max(-1.35, Math.min(1.35, (x - center) / (width / 2)));
      return top + lineSag * (1 - (Math.cosh(shape * u) - 1) / denominator);
    };
    const ropeAngle = (x) => {
      const u = Math.max(-1.35, Math.min(1.35, (x - center) / (width / 2)));
      return Math.atan((lineSag * -shape * Math.sinh(shape * u)) / denominator / (width / 2)) * 180 / Math.PI * 0.48;
    };
    const drawRope = () => {
      let path = '';
      for (let point = 0; point <= 60; point += 1) {
        const x = width * point / 60;
        path += `${point ? 'L' : 'M'}${x.toFixed(1)} ${ropeY(x).toFixed(1)} `;
      }
      ropeRef.current?.setAttribute('d', path);
      ropeShadowRef.current?.setAttribute('d', path);
      ropeHighlightRef.current?.setAttribute('d', path);
    };

    let position = 0;
    let velocity = reduced ? 0 : -speed;
    let pending = 0;
    let hover = false;
    let visible = false;
    let frame = 0;
    let last = 0;
    let drag = null;
    const paint = () => {
      for (let index = 0; index < totalCards; index += 1) {
        const element = cardsRef.current[index];
        if (!element) continue;
        const offset = ((index * cardStep + position + total / 2) % total + total) % total;
        const x = center + offset - total / 2;
        element.style.transform = `translate3d(${(x - card / 2).toFixed(2)}px,${ropeY(x).toFixed(2)}px,0) rotate(${ropeAngle(x).toFixed(2)}deg)`;
        element.style.width = `${card}px`;
      }
      drawRope();
    };
    const tick = (time) => {
      frame = 0;
      const dt = last ? Math.min((time - last) / 1000, 0.05) : 0;
      last = time;
      const target = hover ? 0 : (reduced ? 0 : -speed);
      velocity += (target - velocity) * (1 - Math.exp(-dt * 2.4));
      if (!drag) position += velocity * dt;
      if (pending) {
        const shift = pending * (1 - Math.exp(-dt * 12));
        position += shift;
        pending = Math.abs(pending - shift) < 0.2 ? 0 : pending - shift;
      }
      position = total ? ((position % total) + total) % total : position;
      paint();
      const active = Boolean(drag || pending || Math.abs(velocity - target) > 0.08 || Math.abs(target) > 0.01);
      if (active && visible) frame = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!visible || frame) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };
    const onDown = (event) => {
      if (event.button !== 0) return;
      drag = { id: event.pointerId, x: event.clientX, time: event.timeStamp, moved: 0, samples: [{ x: event.clientX, time: event.timeStamp }] };
      velocity = 0;
      root.setPointerCapture?.(event.pointerId);
      wake();
    };
    const onMove = (event) => {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.x;
      drag.x = event.clientX;
      drag.moved += Math.abs(dx);
      if (drag.moved > 4) position += dx;
      drag.time = event.timeStamp;
      drag.samples.push({ x: event.clientX, time: event.timeStamp });
      while (drag.samples.length > 2 && event.timeStamp - drag.samples[0].time > 100) drag.samples.shift();
      paint();
      wake();
    };
    const onUp = (event) => {
      if (!drag || event.pointerId !== drag.id) return;
      const released = drag;
      drag = null;
      if (root.hasPointerCapture?.(event.pointerId)) root.releasePointerCapture(event.pointerId);
      const firstSample = released.samples[0];
      const lastSample = released.samples[released.samples.length - 1];
      const elapsed = lastSample.time - firstSample.time;
      const fresh = event.timeStamp - lastSample.time < 60;
      velocity = !reduced && fresh && elapsed > 0 ? Math.max(-950, Math.min(950, (lastSample.x - firstSample.x) / elapsed * 1000)) : 0;
      wake();
    };
    const onWheel = (event) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        event.preventDefault();
        pending -= event.deltaX;
        wake();
      }
    };
    const onKey = (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      pending += event.key === 'ArrowLeft' ? cardStep : -cardStep;
      wake();
    };
    const onEnter = (event) => { if (event.pointerType === 'mouse') { hover = true; wake(); } };
    const onLeave = (event) => { if (!drag || event.pointerId === drag.id) { hover = false; wake(); } };
    const onVisibility = () => {
      visible = !document.hidden && root.getBoundingClientRect().bottom > 0 && root.getBoundingClientRect().top < innerHeight;
      if (visible) wake();
      else { cancelAnimationFrame(frame); frame = 0; }
    };
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !document.hidden;
      if (visible) wake();
      else { cancelAnimationFrame(frame); frame = 0; }
    }, { rootMargin: '80px' });

    paint();
    intersection.observe(root);
    document.addEventListener('visibilitychange', onVisibility);
    root.addEventListener('pointerdown', onDown);
    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerup', onUp);
    root.addEventListener('pointercancel', onUp);
    root.addEventListener('pointerenter', onEnter);
    root.addEventListener('pointerleave', onLeave);
    root.addEventListener('wheel', onWheel, { passive: false });
    root.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(frame);
      intersection.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      root.removeEventListener('pointerdown', onDown);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerup', onUp);
      root.removeEventListener('pointercancel', onUp);
      root.removeEventListener('pointerenter', onEnter);
      root.removeEventListener('pointerleave', onLeave);
      root.removeEventListener('wheel', onWheel);
      root.removeEventListener('keydown', onKey);
    };
  }, [cardWidth, items, sag, size, speed, step, totalCards]);

  return (
    <div ref={rootRef} role="region" aria-label="Selected company logos carousel" aria-roledescription="carousel" tabIndex={0} className={`relative h-full w-full cursor-grab touch-pan-y overflow-hidden outline-none active:cursor-grabbing ${className}`} style={{ background }}>
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible">
        <path ref={ropeShadowRef} fill="none" stroke="rgba(0,0,0,.35)" strokeWidth="4" transform="translate(0 4)" />
        <path ref={ropeRef} fill="none" stroke={ropeColor} strokeWidth="2" strokeLinecap="round" />
        <path ref={ropeHighlightRef} fill="none" stroke="rgba(255,255,255,.24)" strokeWidth="1" strokeDasharray="3 4" />
      </svg>
      {size.width > 0 && items.length > 0 && Array.from({ length: totalCards }, (_, index) => {
        const item = items[index % items.length];
        return (
          <div key={`${item.title}-${index}`} aria-hidden={index >= items.length || undefined} ref={(node) => { cardsRef.current[index] = node; }} className="absolute left-0 top-0 z-[1] origin-top will-change-transform">
            <div className="absolute left-1/2 top-0 h-5 w-4 -translate-x-1/2" aria-hidden="true">
              <svg viewBox="0 0 20 34" className="h-7 w-4 drop-shadow-sm"><path d="M4.5 14 8.2 4.6Q10 2.6 11.8 4.6L15.5 14" fill="none" stroke="#ddd9e2" strokeWidth="1.8"/><path d="M3.5 12h13L18 30q0 2-1.5 2h-13Q2 32 2 30z" fill={clipColor}/></svg>
            </div>
            <div className="relative mt-4 overflow-hidden rounded-[18px] border border-black/5 bg-white p-4 text-[#0D0F17] shadow-[0_16px_38px_rgba(0,0,0,.22)] sm:rounded-[22px] sm:p-5">
              <div className="flex h-24 items-center justify-center rounded-xl bg-[#F7F7F7] px-4 sm:h-28">
                <img src={item.src} alt={index < items.length ? item.title : ''} draggable="false" loading="lazy" className="h-full max-w-full select-none object-contain" />
              </div>
              <p className="mt-3 truncate font-bricolage text-sm font-semibold sm:text-base">{item.title}</p>
              {item.caption && <p className="truncate text-xs text-[#666] sm:text-sm">{item.caption}</p>}
            </div>
          </div>
        );
      })}
      <span className="sr-only">Drag, use the arrow keys, or scroll horizontally to browse.</span>
    </div>
  );
}
