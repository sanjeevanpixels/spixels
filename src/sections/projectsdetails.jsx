import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { RollingText } from "@animate-ui/react/primitives/texts/rolling";
import RopeCarousel from "../components/ui/RopeCarousel";
import { EXP } from "../data/content";

/* ------------------------------------------------------------------
   Project page: selected work, collaboration logos and interactive poster wall
   Stack: React + Tailwind CSS (core utilities only)
   Fonts: Bricolage Grotesque (display) + Instrument Sans (body)
------------------------------------------------------------------- */

const C = {
  paper: "#F7F7F7",
  ink: "#0D0F17",
  cobalt: "#7C3AED",
  lemon: "#C4B5FD",
  pink: "#FF8FB1",
  orange: "#FF6A3D",
};

const display = { fontFamily: "'Bricolage Grotesque', sans-serif" };
const body = { fontFamily: "'Instrument Sans', sans-serif" };

/* ------------------------------ POSTERS ------------------------------ */

const posters = [
  { id: "quiet", title: "Quiet Hours", type: "Event poster", year: "2026", note: "Concentric rings for a late-night ambient music series." },
  { id: "grid", title: "Grid Ritual", type: "Typographic study", year: "2025", note: "A 6ÃƒÆ’Ã¢â‚¬â€8 grid, one rule: every square must earn its colour." },
  { id: "market", title: "Night Market", type: "Festival poster", year: "2025", note: "Stacked lantern arcs in a warm, limited palette." },
  { id: "tremor", title: "Type Tremor", type: "Type specimen", year: "2025", note: "Offset layers that make a heavy weight feel like it's vibrating." },
  { id: "tide", title: "Slow Tide", type: "Album art", year: "2024", note: "Hand-tuned wave lines, 14 strokes, no two alike." },
  { id: "signal", title: "Signal", type: "Conference poster", year: "2024", note: "Bars of different heights read as a signal and as a skyline." },
];

function PosterArt({ id }) {
  const t = { fontFamily: "'Bricolage Grotesque', sans-serif" };
  switch (id) {
    case "quiet":
      return (
        <svg viewBox="0 0 300 400" className="w-full h-full">
          <rect width="300" height="400" fill={C.lemon} />
          {[130, 100, 70, 40, 14].map((r, i) => (
            <circle key={r} cx="150" cy="170" r={r} fill={i % 2 ? C.lemon : C.cobalt} />
          ))}
          <text x="24" y="345" fontSize="44" fontWeight="800" fill={C.ink} style={t}>Quiet</text>
          <text x="24" y="382" fontSize="44" fontWeight="800" fill={C.ink} style={t}>Hours</text>
        </svg>
      );
    case "grid":
      return (
        <svg viewBox="0 0 300 400" className="w-full h-full">
          <rect width="300" height="400" fill={C.ink} />
          {Array.from({ length: 48 }).map((_, i) => {
            const x = (i % 6) * 46 + 12;
            const y = Math.floor(i / 6) * 46 + 12;
            const fills = [C.pink, C.cobalt, "transparent", C.lemon, "transparent", C.orange];
            const f = fills[(i * 7 + Math.floor(i / 6)) % fills.length];
            return <rect key={i} x={x} y={y} width="40" height="40" fill={f} stroke={f === "transparent" ? "#3a3a5c" : "none"} />;
          })}
        </svg>
      );
    case "market":
      return (
        <svg viewBox="0 0 300 400" className="w-full h-full">
          <rect width="300" height="400" fill={C.ink} />
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={`M ${20 + i * 12} ${330 - i * 52} A ${130 - i * 12} ${130 - i * 12} 0 0 1 ${280 - i * 12} ${330 - i * 52}`} fill="none" stroke={[C.orange, C.pink, C.lemon, C.orange, C.pink][i]} strokeWidth="18" />
          ))}
          <text x="24" y="372" fontSize="30" fontWeight="700" fill="#fff" style={t}>Night Market</text>
        </svg>
      );
    case "tremor":
      return (
        <svg viewBox="0 0 300 400" className="w-full h-full">
          <rect width="300" height="400" fill={C.pink} />
          {[[10, 10, C.cobalt], [5, 5, C.lemon], [0, 0, C.ink]].map(([dx, dy, fill], i) => (
            <text key={i} x={18 + dx} y={250 + dy} fontSize="230" fontWeight="800" fill={fill} style={t}>Aa</text>
          ))}
          <text x="24" y="370" fontSize="18" fontWeight="500" fill={C.ink} style={{ fontFamily: "'Instrument Sans', sans-serif" }}>Bricolage Grotesque, 800</text>
        </svg>
      );
    case "tide":
      return (
        <svg viewBox="0 0 300 400" className="w-full h-full">
          <rect width="300" height="400" fill={C.cobalt} />
          {Array.from({ length: 14 }).map((_, i) => {
            const y = 40 + i * 24;
            const a = 10 + (i % 5) * 4;
            return <path key={i} d={`M 0 ${y} C 60 ${y - a}, 90 ${y + a}, 150 ${y} S 240 ${y - a}, 300 ${y}`} fill="none" stroke={i % 3 === 0 ? C.lemon : "#fff"} strokeWidth="2.5" />;
          })}
          <text x="24" y="385" fontSize="26" fontWeight="700" fill="#fff" style={t}>Slow Tide</text>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 300 400" className="w-full h-full">
          <rect width="300" height="400" fill={C.orange} />
          {[120, 200, 90, 260, 160, 230, 70].map((h, i) => (
            <rect key={i} x={20 + i * 38} y={330 - h} width="28" height={h} fill={i % 2 ? C.ink : C.lemon} />
          ))}
          <text x="24" y="372" fontSize="32" fontWeight="800" fill={C.ink} style={t}>Signal</text>
        </svg>
      );
  }
}

// Flip Card Dock by Made for Award (MIT): https://www.madeforaward.com/ui/galleries/flip-card-dock
const POSTER_CELL = 116;
const POSTER_POOL = 8;
const POSTER_EASE = 0.16;
const POSTER_PUSH = 0.45;
const POSTER_POP = 1.25;
const posterFly = { min: 0.38, max: 0.7, pace: 2.4 };

function buildPosterWall(width, height, count) {
  const cols = Math.max(5, Math.round(width / POSTER_CELL));
  const rows = Math.max(5, Math.round(height / POSTER_CELL));
  const holeCols = Math.min(cols - 2, Math.max(3, Math.round(cols * (width < 640 ? 0.6 : 0.36))));
  const holeRows = Math.min(rows - 2, Math.max(3, Math.round(rows * 0.7)));
  const colStart = Math.floor((cols - holeCols) / 2);
  const rowStart = Math.floor((rows - holeRows) / 2);
  const tiles = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (row < rowStart || row >= rowStart + holeRows || col < colStart || col >= colStart + holeCols) {
        tiles.push({ row, col, poster: (row * 7 + col * 3) % count });
      }
    }
  }
  return { cols, rows, tiles, hole: { colStart, rowStart, cols: holeCols, rows: holeRows } };
}

function PosterWall() {
  const [active, setActive] = useState(0);
  const [pool, setPool] = useState(() => Array(POSTER_POOL).fill(0));
  const [size, setSize] = useState({ width: 0, height: 0 });
  const rootRef = useRef(null);
  const wallRef = useRef(null);
  const stageRef = useRef(null);
  const textRefs = useRef([]);
  const tileRefs = useRef([]);
  const cardRefs = useRef([]);
  const selectRef = useRef(() => {});
  const wall = useMemo(() => size.width ? buildPosterWall(size.width, size.height, posters.length) : null, [size]);
  const poster = posters[active] ?? posters[0];
  const activeRef = useRef(active);

  useEffect(() => { activeRef.current = active; }, [active]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) gsap.set(textRefs.current, { yPercent: 0 });
    else gsap.fromTo(textRefs.current, { yPercent: 110 }, { yPercent: 0, duration: 0.58, ease: 'expo.out', stagger: 0.05 });
  }, [active]);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const wallElement = wallRef.current;
    if (!wall || !root || !stage || !wallElement) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tiles = tileRefs.current.slice(0, wall.tiles.length);
    const cards = cardRefs.current;
    const centerX = size.width / 2;
    const centerY = size.height / 2;
    const cellWidth = size.width / wall.cols;
    const cellHeight = size.height / wall.rows;
    const centers = wall.tiles.map(({ row, col }) => ({ x: (col + 0.5) * cellWidth, y: (row + 0.5) * cellHeight }));
    const states = wall.tiles.map(() => ({ scale: 1, x: 0, y: 0, opacity: 0.68 }));
    const order = Array.from({ length: POSTER_POOL }, (_, index) => (index + 1) % POSTER_POOL);
    const flights = new Map();
    const pendingFrames = new Set();
    const popTimers = new Set();
    let z = POSTER_POOL;
    let lastFlight = 0;
    let pointer = null;
    let popTile = -1;
    let wallX = 0;
    let wallY = 0;
    let frame = 0;
    let clock = 0;
    let currentPoster = activeRef.current;
    let visible = true;

    cards.forEach((card, index) => {
      if (!card) return;
      card.style.zIndex = String(index === 0 ? POSTER_POOL : index);
      gsap.set(card, { opacity: index === 0 ? 1 : 0, x: 0, y: 0, scaleX: 1, scaleY: 1 });
    });

    const fly = (posterIndex, fromTile) => {
      const slot = order.shift();
      order.push(slot);
      setPool((previous) => previous.map((value, index) => index === slot ? posterIndex : value));
      const frameId = requestAnimationFrame(() => {
        pendingFrames.delete(frameId);
        const card = cards[slot];
        if (!card) return;
        card.style.zIndex = String(++z);
        flights.get(card)?.kill();
        flights.delete(card);
        gsap.killTweensOf(card);
        const stageBox = stage.getBoundingClientRect();
        const tileBox = fromTile?.getBoundingClientRect();
        if (reduceMotion || !stageBox.width || !tileBox?.width) {
          gsap.set(card, { opacity: 1, x: 0, y: 0, scaleX: 1, scaleY: 1 });
          return;
        }
        const now = performance.now();
        const duration = gsap.utils.clamp(posterFly.min, posterFly.max, ((lastFlight ? now - lastFlight : 240) / 1000) * posterFly.pace);
        lastFlight = now;
        for (const timeline of flights.values()) {
          const remaining = timeline.duration() - timeline.time();
          if (remaining / timeline.timeScale() > duration * 0.85) timeline.timeScale(remaining / (duration * 0.85));
        }
        gsap.set(card, {
          opacity: 1,
          x: tileBox.left + tileBox.width / 2 - (stageBox.left + stageBox.width / 2),
          y: tileBox.top + tileBox.height / 2 - (stageBox.top + stageBox.height / 2),
          scaleX: tileBox.width / stageBox.width,
          scaleY: tileBox.height / stageBox.height,
        });
        const timeline = gsap.timeline({ onComplete: () => flights.delete(card) });
        flights.set(card, timeline);
        timeline.to(card, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration, ease: 'expo.out' });
      });
      pendingFrames.add(frameId);
    };

    const select = (tileIndex) => {
      const selected = wall.tiles[tileIndex]?.poster;
      if (selected === undefined || selected === currentPoster) return;
      currentPoster = selected;
      activeRef.current = selected;
      setActive(selected);
      fly(selected, tiles[tileIndex]);
    };

    const render = () => {
      frame = 0;
      const now = performance.now();
      const dt = Math.min(clock ? (now - clock) / 16.667 : 1, 4);
      clock = now;
      const ease = 1 - (1 - POSTER_EASE) ** dt;
      const reach = Math.min(cellWidth, cellHeight) * 2.2;
      const targetX = pointer ? -(pointer.x - centerX) * 0.02 : 0;
      const targetY = pointer ? -(pointer.y - centerY) * 0.02 : 0;
      wallX += (targetX - wallX) * ease;
      wallY += (targetY - wallY) * ease;
      let moving = Math.abs(targetX - wallX) + Math.abs(targetY - wallY) > 0.05;
      wallElement.style.transform = `translate3d(${wallX.toFixed(2)}px,${wallY.toFixed(2)}px,0)`;
      let nearest = -1;
      let closest = Infinity;

      tiles.forEach((tile, index) => {
        if (!tile) return;
        const state = states[index];
        let scale = index === popTile ? POSTER_POP : 1;
        let x = 0;
        let y = 0;
        let opacity = index === popTile ? 1 : 0.68;
        if (pointer) {
          const dx = centers[index].x - pointer.x;
          const dy = centers[index].y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < closest) { closest = distance; nearest = index; }
          const influence = distance >= reach ? 0 : 0.5 * (1 + Math.cos(Math.PI * distance / reach));
          scale = 0.84 + (1.4 - 0.84) * influence;
          opacity = 0.3 + 0.7 * influence;
          const push = distance ? (influence * (1 - influence) * 4 * POSTER_PUSH * Math.min(cellWidth, cellHeight)) / distance : 0;
          x = dx * push;
          y = dy * push;
        }
        const diff = Math.abs(scale - state.scale) + Math.abs(x - state.x) / 100 + Math.abs(y - state.y) / 100 + Math.abs(opacity - state.opacity);
        if (diff < 0.001) Object.assign(state, { scale, x, y, opacity });
        else {
          state.scale += (scale - state.scale) * ease;
          state.x += (x - state.x) * ease;
          state.y += (y - state.y) * ease;
          state.opacity += (opacity - state.opacity) * ease;
          moving = true;
        }
        tile.style.transform = `translate3d(${state.x.toFixed(2)}px,${state.y.toFixed(2)}px,0) scale(${state.scale.toFixed(4)})`;
        tile.style.opacity = state.opacity.toFixed(3);
        tile.style.zIndex = String(Math.round(state.scale * 100));
      });
      if (pointer && nearest >= 0 && closest < Math.max(cellWidth, cellHeight) * 0.75) select(nearest);
      if (moving && visible) frame = requestAnimationFrame(render);
    };
    const wake = () => {
      if (frame || !visible) return;
      clock = 0;
      frame = requestAnimationFrame(render);
    };
    selectRef.current = (tileIndex) => {
      select(tileIndex);
      if (reduceMotion) return;
      popTile = tileIndex;
      wake();
      const timerId = window.setTimeout(() => { popTimers.delete(timerId); if (popTile === tileIndex) popTile = -1; wake(); }, 550);
      popTimers.add(timerId);
    };
    const onMove = (event) => {
      if (event.pointerType !== 'mouse' || reduceMotion) return;
      const bounds = root.getBoundingClientRect();
      pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
      popTile = -1;
      wake();
    };
    const onLeave = () => { pointer = null; wake(); };
    const onVisibility = () => { visible = !document.hidden; if (visible) wake(); else { cancelAnimationFrame(frame); frame = 0; } };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !document.hidden;
      if (visible) wake(); else { cancelAnimationFrame(frame); frame = 0; }
    }, { rootMargin: '60px' });

    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVisibility);
    observer.observe(root);
    wake();
    const timer = !reduceMotion ? window.setInterval(() => {
      if (!pointer && !document.hidden && wall.tiles.length) selectRef.current(Math.floor(Math.random() * wall.tiles.length));
    }, 4600) : 0;

    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(timer);
      pendingFrames.forEach((id) => cancelAnimationFrame(id));
      popTimers.forEach((id) => window.clearTimeout(id));
      observer.disconnect();
      flights.forEach((timeline) => timeline.kill());
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      selectRef.current = () => {};
    };
  }, [wall, size]);

  return (
    <section id="posters" className="px-4 py-16 sm:px-6 sm:py-20 md:px-12 md:py-24">
      <div className="max-w-6xl mx-auto">
        <h2 style={display} className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">The poster wall</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#0D0F17]/70 sm:text-lg">Explore selected poster studies. Move across the wall or select any poster to bring it into focus.</p>
        <div ref={rootRef} role="region" aria-label="Interactive poster wall" className="relative mt-8 h-[570px] w-full overflow-hidden rounded-[28px] bg-[#0D0F17] text-white shadow-2xl sm:mt-10 sm:h-[680px] sm:rounded-[40px]">
          {wall && <div ref={wallRef} className="absolute inset-0 will-change-transform">
            {wall.tiles.map((tile, index) => {
              const item = posters[tile.poster];
              const firstTile = wall.tiles.findIndex((entry) => entry.poster === tile.poster) === index;
              return (
                <button key={`${tile.row}-${tile.col}`} ref={(node) => { if (node) tileRefs.current[index] = node; }} type="button" aria-label={`View ${item.title} poster`} aria-pressed={tile.poster === active} tabIndex={firstTile ? 0 : -1} onClick={() => selectRef.current(index)} className="absolute cursor-pointer p-1 opacity-70 will-change-transform focus-visible:z-[150] focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-300 sm:p-[5px]" style={{ left: `${tile.col / wall.cols * 100}%`, top: `${tile.row / wall.rows * 100}%`, width: `${100 / wall.cols}%`, height: `${100 / wall.rows}%` }}>
                  <span className={`block h-full w-full overflow-hidden rounded-md transition-[filter] duration-300 sm:rounded-lg ${tile.poster === active ? '' : 'grayscale-[0.55]'}`}><PosterArt id={item.id} /></span>
                </button>
              );
            })}
          </div>}
          {wall && <div className="pointer-events-none absolute z-[200] flex flex-col items-center justify-center gap-3 p-3 [container-type:size]" style={{ left: `${wall.hole.colStart / wall.cols * 100}%`, top: `${wall.hole.rowStart / wall.rows * 100}%`, width: `${wall.hole.cols / wall.cols * 100}%`, height: `${wall.hole.rows / wall.rows * 100}%` }}>
            <div className="flex flex-col items-center max-w-full text-center" aria-live="polite">
              <h3 style={display} className="overflow-hidden text-[clamp(20px,8cqw,40px)] font-bold leading-[1.05] tracking-[-0.04em]"><span ref={(node) => { if (node) textRefs.current[0] = node; }} className="block">{poster.title}</span></h3>
              <p className="mt-1 overflow-hidden text-[clamp(10px,2.7cqw,13px)] uppercase tracking-[0.16em] text-white/65"><span ref={(node) => { if (node) textRefs.current[1] = node; }} className="block">{poster.type} Â· {poster.year}</span></p>
            </div>
            <div ref={stageRef} aria-hidden="true" className="relative aspect-[3/4] w-[min(88cqw,38cqh)] overflow-hidden rounded-xl shadow-[0_18px_55px_rgba(0,0,0,.45)] sm:rounded-2xl">
              {pool.map((posterIndex, slot) => <div key={slot} ref={(node) => { if (node) cardRefs.current[slot] = node; }} className={`absolute inset-0 overflow-hidden rounded-xl will-change-transform sm:rounded-2xl ${slot === 0 ? '' : 'opacity-0'}`}><PosterArt id={posters[posterIndex]?.id ?? posters[0].id} /></div>)}
            </div>
            <p className="max-w-[34ch] text-center text-[clamp(10px,2.6cqw,13px)] leading-snug text-white/65">{poster.note}</p>
          </div>}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- LOGOS ------------------------------- */

const logos = EXP.filter(({ logo }) => logo).map(({ co, logo, role }) => ({ src: logo, title: co, caption: role }));

function ProjectCards() {
  const projects = EXP.filter(({ logo }) => logo).map(({ co, logo, role }) => ({
    src: logo,
    alt: `${co} project`,
    label: co,
    description: role,
    fit: "contain",
  }));

  return (
    <section
      id="project-work"
      className="px-4 py-16 sm:px-6 sm:py-20 md:px-12 md:py-24"
    >
      <div className="max-w-6xl mx-auto">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-700">
          Selected work
        </p>

        <div className="flex flex-col gap-4 mt-3 sm:flex-row sm:items-end sm:justify-between">
          <h2
            style={display}
            className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl"
          >
            Projects shaped around people.
          </h2>

          <p className="max-w-md text-base leading-relaxed text-[#0D0F17]/65 sm:text-lg">
            A selection of product interfaces and visual work from my portfolio.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-8 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {projects.map((project, index) => (
            <figure
              key={`${project.label}-${index}`}
              className="group overflow-hidden rounded-[24px] border border-black/[0.06] bg-white p-2 shadow-[0_12px_36px_rgba(13,15,23,0.06)] transition-shadow duration-300 hover:shadow-[0_20px_48px_rgba(13,15,23,0.12)] sm:rounded-[28px] sm:p-3"
            >
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[18px] bg-[#F1F1F3] sm:rounded-[20px]">
                <img
                  src={project.src}
                  alt={project.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                />

                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#0D0F17] shadow-sm backdrop-blur">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <figcaption className="px-2 pt-4 pb-2 sm:px-3 sm:pb-3">
                <h3
                  style={display}
                  className="text-lg font-bold tracking-tight sm:text-xl"
                >
                  {project.label}
                </h3>

                <p className="mt-1 text-sm text-[#0D0F17]/55">
                  {project.description || "Portfolio project"}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
function LogoSection() {
  return (
    <section id="logos" className="bg-[#0D0F17] px-6 py-20 text-white sm:py-24 md:px-12">
      <div className="max-w-6xl mx-auto">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-300">Selected collaborations</p>
        <div className="flex flex-col gap-4 mt-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 style={display} className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">People and teams IÃ¢â‚¬â„¢ve worked with</h2>
          <p className="max-w-md text-base leading-relaxed text-white/65 sm:text-lg">A few of the teams behind the work. Drag the cards or use the arrow keys to browse.</p>
        </div>
        <div className="mt-10 h-[330px] overflow-hidden rounded-[28px] border border-white/10 bg-[#11131D] sm:mt-12 sm:h-[390px] sm:rounded-[36px]">
          <RopeCarousel items={logos} cardWidth={184} gap={32} sag={42} speed={16} ropeColor="#756A88" clipColor="#A78BFA" />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- PAGE -------------------------------- */

export default function ProjectPage() {
  const [brandRoll, setBrandRoll] = useState(0);

  return (
    <div style={{ ...body, background: C.paper, color: C.ink }} className="min-h-screen antialiased">
      <header className="sticky top-0 z-20 border-b border-[#0D0F17]/10 bg-[#F7F7F7]/90 backdrop-blur">
        <nav aria-label="Project page navigation" className="flex flex-col max-w-6xl gap-3 px-4 py-3 mx-auto sm:flex-row sm:items-center sm:justify-between sm:px-8 md:px-12">
          <a href="/" data-app-route="" style={display} className="text-lg font-bold" aria-label="Sanjeevan, return to portfolio" onPointerEnter={() => setBrandRoll((count) => count + 1)} onFocus={() => setBrandRoll((count) => count + 1)}>
            <RollingText key={brandRoll} text="Sanjeevan" inView />
          </a>
          <ul className="flex max-w-full gap-1 overflow-x-auto text-sm font-medium sm:gap-2">
            {[["Projects", "#project-work"], ["Collaborations", "#logos"], ["Posters", "#posters"]].map(([l, h]) => (
              <li key={h}>
                <a href={h} className="block whitespace-nowrap rounded-full px-3 py-2 hover:bg-[#0D0F17]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] sm:px-4">{l}</a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-[#0D0F17] px-6 py-20 text-white sm:py-24 md:px-12 md:py-28">
          <div className="relative z-10 max-w-6xl mx-auto">
            <p className="text-base text-white/70 sm:text-lg">Sanjeevan, associate UI/UX designer and software developer</p>
            <h1 style={display} className="mt-4 max-w-4xl text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl md:text-8xl">
              I design interfaces, posters and logos, then code them.
            </h1>
            <div className="flex flex-wrap gap-3 mt-8">
              <a href="#project-work" className="rounded-full bg-[#7C3AED] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#6D28D9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0D0F17] focus-visible:ring-offset-2">Explore projects</a>
              <a href="#posters" className="rounded-full bg-white px-6 py-3 font-semibold transition-colors hover:bg-[#0D0F17]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]">Jump to poster wall</a>
            </div>
          </div>
        </section>

        <ProjectCards />
        <LogoSection />
        <PosterWall />
      </main>

      <footer className="px-6 py-12 md:px-12">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 border-t border-[#0D0F17]/15 pt-6 text-sm text-[#0D0F17]/60 md:flex-row">
          <p>Designed and built by Sanjeevan.</p>
          <p>Set in Bricolage Grotesque and Instrument Sans.</p>
        </div>
      </footer>
    </div>
  );
}
