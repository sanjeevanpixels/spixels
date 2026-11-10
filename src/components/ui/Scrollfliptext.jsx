// Scroll Flip Text by Made for Award: https://www.madeforaward.com/ui/text/scroll-flip-text
// Free and open source (MIT). If it helped, a star means a lot: https://github.com/shivc868/madeforaward-ui
'use client'

import {useEffect, useRef, useState} from 'react'

// A tall section whose frame sticks while you scroll through it. Its
// statements sit stacked in one place; scroll progress picks the current
// one and the rest fan away from it in 3D: each is moved down by
// `travel × r` and tipped by `−tilt × r` degrees about its centre, fading by
// `fade × |r|`, where r is its distance from the current one. So the one
// you are on stands flat and sharp, the last one folds up and away, the
// next unfolds from below. Drop it in anywhere: it scrolls with the window
// unless you hand it a `scroller`, inherits the page font and sizes itself
// from the viewport. Plain scroll + rAF, no dependencies.

/**
 * @typedef {Object} FlipStatement
 * @property {string} text   first line
 * @property {string} accent second line, in the accent colour
 */

/**
 * @typedef {Object} ScrollFlipTextProps
 * @property {FlipStatement[]} [statements]
 * @property {string} [ink]
 * @property {string} [accent]
 * @property {string} [background]
 * @property {'center' | 'left'} [align]
 * @property {number} [travel]      px a statement moves per step away from the current one
 * @property {number} [tilt]        degrees a statement tips per step
 * @property {number} [fade]        how fast neighbours fade: 1 / fade steps to invisible
 * @property {number} [perspective] perspective in px
 * @property {string} [size]        font-size of the statements (any CSS length)
 * @property {number} [step]        scroll per statement, in viewport heights
 * @property {HTMLElement | null} [scroller] the scrolling element, when it isn't the window
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 */

const DEFAULTS = [
  {text: 'First, we built', accent: 'every site by hand.'},
  {text: 'Then, we turned', accent: 'motion into parts.'},
  {text: 'Now you ship', accent: 'the award-winner.'},
]

const clamp01 = (v) => Math.min(1, Math.max(0, v))

/** @param {ScrollFlipTextProps} props */
export default function ScrollFlipText({
  statements = DEFAULTS,
  ink = '#f2efe8',
  accent = '#ff6a1f',
  background = '#0d0d0f',
  align = 'center',
  travel = 210,
  tilt = 65,
  fade = 1.35,
  perspective = 900,
  size = 'clamp(40px, 6.8vw, 115px)',
  step = 0.65,
  scroller = null,
  className = '',
  style,
}) {
  const rootRef = useRef(null)
  const pRefs = useRef([])
  const [vh, setVh] = useState(0)
  const [reduced, setReduced] = useState(false)
  const n = statements.length

  // the frame is as tall as the scroller's viewport
  useEffect(() => {
    const measure = () => setVh(scroller ? scroller.clientHeight : window.innerHeight)
    measure()
    const ro = new ResizeObserver(measure)
    if (scroller) ro.observe(scroller)
    window.addEventListener('resize', measure)
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMq = () => setReduced(mq.matches)
    onMq()
    mq.addEventListener('change', onMq)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
      mq.removeEventListener('change', onMq)
    }
  }, [scroller])

  useEffect(() => {
    const root = rootRef.current
    if (!root || reduced || !vh) return
    const ps = pRefs.current.slice(0, n)
    let raf = 0
    const draw = () => {
      raf = 0
      const r = root.getBoundingClientRect()
      const top = scroller ? r.top - scroller.getBoundingClientRect().top : r.top
      if (r.bottom < -vh || top > 2 * vh) return
      const progress = (n - 1) * clamp01(-top / Math.max(1, r.height - vh))
      ps.forEach((p, i) => {
        const d = i - progress
        p.style.transform = `translate3d(0,${travel * d}px,0) rotateX(${-tilt * d}deg)`
        p.style.opacity = String(1 - clamp01(fade * Math.abs(d)))
      })
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(draw)
    }
    const target = scroller ?? window
    target.addEventListener('scroll', schedule, {passive: true})
    window.addEventListener('resize', schedule)
    schedule()
    return () => {
      cancelAnimationFrame(raf)
      target.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      ps.forEach((p) => {
        p.style.removeProperty('transform')
        p.style.removeProperty('opacity')
      })
    }
  }, [n, vh, reduced, scroller, travel, tilt, fade])

  const motion = !reduced && vh > 0

  return (
    <section
      ref={rootRef}
      className={`relative ${className}`}
      style={{background, color: ink, height: motion ? vh + (n - 1) * step * vh : undefined, ...style}}
    >
      <div
        className="flex flex-col justify-center px-[6%] py-[clamp(72px,14vh,150px)]"
        style={motion ? {position: 'sticky', top: 0, height: vh, boxSizing: 'border-box'} : undefined}
      >
        <div
          className="relative mx-auto w-full max-w-[16ch] leading-[1.03] tracking-[-0.055em]"
          style={{fontSize: size, textAlign: align, ...(motion ? {height: '2.5em', perspective, perspectiveOrigin: '50% 50%'} : {})}}
        >
          {statements.map((s, i) => (
            <p
              key={i}
              ref={(el) => {
                if (el) pRefs.current[i] = el
              }}
              className={motion ? 'absolute inset-x-0 top-0 m-0 will-change-[transform,opacity] backface-hidden' : 'mb-[0.65em]'}
              style={motion && i > 0 ? {opacity: 0} : undefined}
            >
              {s.text}
              <br />
              <span style={{color: accent}}>{s.accent}</span>
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}