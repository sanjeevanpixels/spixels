import { useEffect, useRef } from 'react';

const hash = (x, y, seed = 1) => {
  const value = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return value - Math.floor(value);
};
const angleDelta = (target, current) => Math.atan2(Math.sin(target - current), Math.cos(target - current));

export default function IronFilingsBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const surface = canvas?.parentElement;
    const context = canvas?.getContext('2d');
    if (!canvas || !surface || !context) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const spacing = 18;
    const radius = 190;
    const filings = [];
    const pointer = { x: 0, y: 0, active: false };
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastTime = 0;
    let pulse = -1;
    let visible = true;

    const draw = (time = 0) => {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 1 / 30) : 0;
      lastTime = time;
      context.clearRect(0, 0, width, height);
      let moving = pulse >= 0;
      if (pulse >= 0) {
        pulse += dt;
        if (pulse > 0.72) pulse = -1;
      }

      for (const filing of filings) {
        let target = filing.rest;
        const dx = pointer.x - filing.x;
        const dy = pointer.y - filing.y;
        const distance = Math.hypot(dx, dy);
        const influence = pointer.active && !reduceMotion
          ? 0.72 * Math.exp(-(distance * distance) / (radius * radius))
          : 0;
        if (influence > 0.002) {
          const cursorAngle = Math.atan2(dy, dx);
          const x = Math.cos(target) * (1 - influence) + Math.cos(cursorAngle) * influence;
          const y = Math.sin(target) * (1 - influence) + Math.sin(cursorAngle) * influence;
          target = Math.atan2(y, x);
        }

        const difference = angleDelta(target, filing.angle);
        filing.velocity += (190 * difference - 22 * filing.velocity) * dt;
        filing.angle += filing.velocity * dt;
        if (Math.abs(difference) > 0.002 || Math.abs(filing.velocity) > 0.02) moving = true;

        const wave = pulse < 0 ? 0 : Math.exp(-((filing.distanceFromCenter - pulse * 430) ** 2) / 1250) * (1 - pulse / 0.72);
        const pointerHeat = influence * Math.exp(-(distance * distance) / (radius * radius));
        const alpha = Math.min(0.8, filing.alpha + pointerHeat * 0.62 + wave * 0.55);
        const length = filing.length + pointerHeat * 2 + wave * 2;
        const halfX = Math.cos(filing.angle) * length / 2;
        const halfY = Math.sin(filing.angle) * length / 2;

        context.strokeStyle = pointerHeat > 0.08 || wave > 0.12 ? '#FF2056' : '#FFB900';
        context.globalAlpha = alpha;
        context.lineWidth = 1.15;
        context.beginPath();
        context.moveTo(filing.x - halfX, filing.y - halfY);
        context.lineTo(filing.x + halfX, filing.y + halfY);
        context.stroke();
      }
      context.globalAlpha = 1;

      if (moving && visible) frame = requestAnimationFrame(draw);
      else frame = 0;
    };

    const layout = () => {
      width = surface.clientWidth;
      height = surface.clientHeight;
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      filings.length = 0;
      const centerX = width / 2;
      const centerY = height / 2;
      const poleOffset = Math.max(width * 0.16, 72);
      for (let row = 0; row <= Math.ceil(height / spacing); row += 1) {
        for (let col = 0; col <= Math.ceil(width / spacing); col += 1) {
          const x = col * spacing + (hash(col, row, 2) - 0.5) * 5;
          const y = row * spacing + (hash(col, row, 3) - 0.5) * 5;
          const leftX = x - (centerX - poleOffset);
          const rightX = x - (centerX + poleOffset);
          const dy = y - centerY;
          const leftD = Math.max(Math.hypot(leftX, dy) ** 3, 1);
          const rightD = Math.max(Math.hypot(rightX, dy) ** 3, 1);
          const fieldX = leftX / leftD - rightX / rightD;
          const fieldY = dy / leftD - dy / rightD;
          const angle = Math.atan2(fieldY, fieldX) + (hash(col, row, 4) - 0.5) * 0.18;
          const centerDistance = Math.hypot(x - centerX, y - centerY);
          filings.push({
            x, y, rest: angle, angle, velocity: 0,
            distanceFromCenter: centerDistance,
            alpha: 0.12 + hash(col, row, 5) * 0.12,
            length: 5 + hash(col, row, 6) * 3,
          });
        }
      }
      if (visible && !frame) draw(performance.now());
    };

    const onPointerMove = (event) => {
      if (reduceMotion || event.pointerType === 'touch') return;
      const rect = surface.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= width && pointer.y <= height;
      if (pointer.active && visible && !frame) {
        lastTime = performance.now();
        frame = requestAnimationFrame(draw);
      }
    };
    const onPointerLeave = () => {
      pointer.active = false;
      if (visible && !frame) {
        lastTime = performance.now();
        frame = requestAnimationFrame(draw);
      }
    };
    const onPress = (event) => {
      if (reduceMotion) return;
      const rect = surface.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pulse = 0;
      if (visible && !frame) {
        lastTime = performance.now();
        frame = requestAnimationFrame(draw);
      }
    };

    const resizeObserver = new ResizeObserver(layout);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else if (!frame) {
        draw(performance.now());
      }
    });
    resizeObserver.observe(surface);
    intersectionObserver.observe(surface);
    surface.addEventListener('pointermove', onPointerMove, { passive: true });
    surface.addEventListener('pointerleave', onPointerLeave);
    surface.addEventListener('pointerdown', onPress, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      surface.removeEventListener('pointermove', onPointerMove);
      surface.removeEventListener('pointerleave', onPointerLeave);
      surface.removeEventListener('pointerdown', onPress);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 z-0 w-full h-full pointer-events-none" />;
}
