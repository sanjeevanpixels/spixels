// Scroll Scribble Path by Made for Award: https://www.madeforaward.com/ui/interactions/scroll-scribble-path
// Free and open source (MIT). If it helped, a star means a lot: https://github.com/shivc868/madeforaward-ui
'use client'

import {useRef} from 'react'
import gsap from 'gsap'
import {useGSAP} from '@gsap/react'
import {ScrollTrigger} from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

/**
 * Props (formerly ScrollScribblePathProps):
 *
 * children   - your sections; the line runs through them
 * colors     - the coats of paint, first to arrive to last; the last is what stays
 * backgrounds- the page colours it moves through as you scroll
 * width      - width of the line, px; it thins on narrow screens
 * trail      - how far behind each coat runs, as a share of the whole line
 * loops      - how often the line ties itself in a loop, 0–1
 * wander     - how far it swings from side to side, 0–1
 * untangle   - start tangled and end straight; off keeps it wild all the way
 * seed       - a different number draws a different line
 * blend      - 'multiply' | 'screen' | 'normal'
 * smooth     - seconds the line takes to catch up with the scroll
 * scroller   - the scrolling element, when it isn't the window
 * className  - extra classes for the wrapper
 */

// A small seeded random, so a seed always draws the same line.
function seeded(seed) {
  let s = seed >>> 0 || 1
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Plans the line for this exact box, so it fits any height and any screen. It's
// the path of a pen tip circling as it travels down the page: where the circling
// outruns the travel the line loops, like cursive, and as the circle shrinks the
// loops open into waves and then a straight run. One continuous curve, no joins.
function plan(width, height, tuning) {
  const random = seeded(tuning.seed)
  const span = Math.min(width, 900)
  const turns = Math.min(40, Math.round((tuning.loops * height) / (span * 0.3)))
  const steps = turns * 14 + 28
  const phase = random() * Math.PI * 2
  const sway = 1.1 + random() * 0.9
  // Each turn gets its own size, so no two loops match.
  const sizes = Array.from({length: turns + 2}, () => 0.62 + random() * 0.76)
  const points = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const calm = tuning.untangle ? (1 - t) ** 0.85 : 1
    const turn = t * turns
    const index = Math.floor(turn)
    const between = turn - index
    const size = sizes[index] + (sizes[index + 1] - sizes[index]) * between * between * (3 - 2 * between)
    const radius = Math.min(width, height) * 0.16 * size * calm
    const angle = turn * Math.PI * 2 + phase
    // It comes home to the middle over the last stretch, wherever it wandered.
    const home = tuning.untangle ? 1 - gsap.parseEase('power2.inOut')(gsap.utils.clamp(0, 1, (t - 0.8) / 0.2)) : 1
    const swing = Math.sin(t * sway * Math.PI * 2 + phase) * width * 0.3 * tuning.wander * (tuning.untangle ? 0.25 + 0.75 * calm : 1) * home
    points.push([width / 2 + swing + Math.sin(angle) * radius, -40 + (height + 80) * t + Math.cos(angle) * radius])
  }
  return points
}

// Catmull-Rom through the points, as cubic Béziers: smooth like a hand, no corners.
function toPath(points) {
  let d = `M${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(points.length - 1, i + 2)]
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += `C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d
}

const clamp = gsap.utils.clamp(0, 1)
// How far down the screen the tip of the line stays as you scroll.
const TIP_SPOT = 0.62

// A thick line that paints itself down the page as you scroll, in coats: the first
// colour leads and the others follow over it, so the tip is a run of stripes. By
// default it starts in tangles and straightens out, and the page shifts colour as
// it goes. Reduced motion shows the finished line and a single page colour.
export default function ScrollScribblePath({
  children,
  colors = ['#111111', '#1f3bff', '#ff2d95'],
  backgrounds = ['#ffd400', '#ff9ec4', '#9be3ff', '#c6f36b'],
  width = 46,
  trail = 0.035,
  loops = 0.8,
  wander = 1,
  untangle = true,
  seed = 7,
  blend = 'multiply',
  smooth = 0.9,
  scroller,
  className = '',
}) {
  const rootRef = useRef(null)
  const svgRef = useRef(null)
  const pathRefs = useRef([])
  const tipRef = useRef(null)

  useGSAP(
    () => {
      const root = rootRef.current
      const svg = svgRef.current
      const tip = tipRef.current
      if (!root || !svg || !tip) return
      const paths = pathRefs.current.slice(0, colors.length).filter((p) => p !== null)
      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const paintPage = gsap.utils.interpolate(backgrounds)
      // `drawn` is how much of the line is out, `page` how far down the page we are.
      const state = {drawn: 0, page: 0}
      let length = 0
      // How low the line has reached by each point along it. Loops double back, so
      // the line's length says little about where its tip is on the page: this
      // lets the scroll ask for a height instead, keeping the tip on screen.
      const SAMPLES = 600
      const lowest = new Float32Array(SAMPLES + 1)
      const drawnFor = (y) => {
        let low = 0
        let high = SAMPLES
        while (low < high) {
          const middle = (low + high) >> 1
          if (lowest[middle] < y) low = middle + 1
          else high = middle
        }
        return low / SAMPLES
      }

      const paint = () => {
        // Near the very end the later coats catch up, so the last one finishes.
        const finish = trail * (paths.length - 1) * gsap.utils.clamp(0, 1, (state.page - 0.9) / 0.1)
        const reach = state.drawn + finish
        paths.forEach((path, i) => {
          const share = clamp(reach - trail * i)
          // Hidden at zero: a round cap on an empty dash would still show as a dot.
          path.style.visibility = share <= 0.0005 ? 'hidden' : 'visible'
          path.style.strokeDashoffset = String(1 - share)
        })
        const lead = clamp(reach)
        const point = paths[0].getPointAtLength(lead * length)
        tip.setAttribute('cx', String(point.x))
        tip.setAttribute('cy', String(point.y))
        tip.style.visibility = lead <= 0.0005 || lead >= 0.9995 ? 'hidden' : 'visible'
        root.style.backgroundColor = paintPage(state.page)
      }

      const draw = () => {
        const boxWidth = root.clientWidth
        const boxHeight = root.clientHeight
        if (boxWidth < 2 || boxHeight < 2) return
        svg.setAttribute('viewBox', `0 0 ${boxWidth} ${boxHeight}`)
        const d = toPath(plan(boxWidth, boxHeight, {loops, wander, untangle, seed}))
        const stroke = Math.max(12, width * Math.min(1, boxWidth / 900))
        paths.forEach((path) => {
          path.setAttribute('d', d)
          path.setAttribute('stroke-width', String(stroke))
        })
        tip.setAttribute('r', String(stroke * 0.68))
        length = paths[0].getTotalLength()
        let low = -Infinity
        for (let i = 0; i <= SAMPLES; i++) {
          low = Math.max(low, paths[0].getPointAtLength((i / SAMPLES) * length).y)
          lowest[i] = low
        }
      }
      draw()

      let width0 = root.clientWidth
      let height0 = root.clientHeight
      const ro = new ResizeObserver(() => {
        if (root.clientWidth === width0 && root.clientHeight === height0) return
        width0 = root.clientWidth
        height0 = root.clientHeight
        draw()
        ScrollTrigger.refresh()
      })
      ro.observe(root)

      if (still) {
        state.drawn = state.page = 1
        paint()
        root.style.backgroundColor = backgrounds[0]
        return () => ro.disconnect()
      }

      // The tip holds a steady spot down the screen, so there's always line in
      // view, and the page opens with some of it already out. A loop is drawn in
      // one go as the tip reaches it, which is what the smoothing is for.
      const viewHeight = () => (scroller ? scroller.clientHeight : window.innerHeight)
      const drawnAt = (progress) => {
        const from = viewHeight() * TIP_SPOT
        return drawnFor(from + (root.clientHeight + 60 - from) * progress)
      }
      state.drawn = drawnAt(0)
      paint()
      const time = Math.max(smooth, 0.01)
      const toDrawn = gsap.quickTo(state, 'drawn', {duration: time, ease: 'power3.out', onUpdate: paint})
      const toPage = gsap.quickTo(state, 'page', {duration: time, ease: 'power3.out', onUpdate: paint})
      const aim = (progress) => {
        toDrawn(drawnAt(progress))
        toPage(progress)
      }
      ScrollTrigger.create({
        trigger: root,
        scroller: scroller ?? undefined,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => aim(self.progress),
        onRefresh: (self) => aim(self.progress),
      })
      return () => ro.disconnect()
    },
    {scope: rootRef, dependencies: [colors.join(), backgrounds.join(), width, trail, loops, wander, untangle, seed, smooth, scroller], revertOnUpdate: true},
  )

  return (
    <div ref={rootRef} className={`relative overflow-hidden ${className}`} style={{backgroundColor: backgrounds[0]}}>
      {children}
      <svg
        ref={svgRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{mixBlendMode: blend}}
        fill="none"
      >
        {colors.map((color, i) => (
          <path
            key={i}
            ref={(el) => {
              pathRefs.current[i] = el
            }}
            pathLength={1}
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1 1"
            strokeDashoffset={1}
          />
        ))}
        <circle ref={tipRef} fill={colors[0]} style={{visibility: 'hidden'}} />
      </svg>
    </div>
  )
}