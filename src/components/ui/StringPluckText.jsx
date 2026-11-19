// String Pluck Text by Made for Award: https://www.madeforaward.com/ui/text/string-pluck-text
// Free and open source (MIT). If it helped, a star means a lot: https://github.com/shivc868/madeforaward-ui
'use client'

// The plucked string (a sum of standing waves, each a damped oscillator solved
// exactly, with a line of letters riding on it) comes from Plucked Text by
// Kokonut UI, rewritten here. Its MIT licence text is at the foot of this file.

import {useEffect, useRef} from 'react'

/**
 * Props:
 * @param {string} text - one line of copy, balanced on the wire
 * @param {number} [tension=1] - tightness of the wire; tighter vibrates quicker and calms down sooner
 * @param {boolean} [strum=true] - let a fast pass of the cursor twang the wire, as well as dragging it
 * @param {string} [stringColor='#ff7a18'] - the string and its pins
 * @param {string} [className] - classes for the text: font, colour, weight
 */

const MAX_MODES = 24
// No mode may ring faster than this: a 60 Hz screen would alias it into jitter.
const MAX_MODE_HZ = 22
// Wave speed along the string at tension 1, px/s. A longer string rings lower.
const WAVE_SPEED = 1500
// Every mode loses energy and the high ones much faster, so a pluck starts
// sharp and rounds off into a slow sway, as a real string does.
const DAMP_BASE = 0.9
const DAMP_HIGH = 0.012
// Spacing of the points of the drawn string, px.
const STEP = 6
// Displacement flattens out past this share of the font size, so a hard pull
// bends the line without throwing letters off it.
const MAX_SWING = 0.6
const STRUM_GAIN = 0.55
const MAX_STRUM_SPEED = 2400
const REST_ENERGY = 0.02
// Letters tilt with the string, a little less than its full slope.
const TILT = 0.85

// A mode is shaped like: {q, v, omega, gamma, damped}

// One damped oscillator forward by `dt`, exactly: it can't blow up at any frame rate.
function stepMode(mode, dt) {
  const {q, v, omega, gamma, damped} = mode
  const decay = Math.exp(-gamma * dt)
  const c = Math.cos(damped * dt)
  const s = Math.sin(damped * dt)
  mode.q = decay * (q * c + ((v + gamma * q) / damped) * s)
  mode.v = decay * (v * c - ((omega * omega * q + gamma * v) / damped) * s)
}

// The string pulled into a V, written as standing waves. Cutting the series
// short is what rounds the corner.
function pullInto(modes, length, apex, height) {
  const d = Math.min(Math.max(apex, 1), length - 1)
  modes.forEach((mode, index) => {
    const n = index + 1
    mode.q = ((2 * height * length * length) / (n * n * Math.PI * Math.PI * d * (length - d))) * Math.sin((n * Math.PI * d) / length)
    mode.v = 0
  })
}

// A rubber band: grows like `x` near zero and never past `max`.
const soften = (x, max) => max * Math.tanh(x / max)

// A headline sitting on a string. Pull it and let go: it rings, and the letters
// ride the wave, leaning with it. A quick sweep of the cursor strums it. The
// loop sleeps at rest; reduced motion lets a pull ease back without ringing.
export default function StringPluckText({
  text,
  tension = 1,
  strum = true,
  stringColor = '#ff7a18',
  className = 'font-semibold tracking-tight',
}) {
  const stageRef = useRef(null)
  const lineRef = useRef(null)
  const baselineRef = useRef(null)
  const letterRefs = useRef([])
  const svgRef = useRef(null)
  const pathRef = useRef(null)
  const ghostRef = useRef(null)
  const chars = Array.from(text)

  useEffect(() => {
    const stage = stageRef.current
    const line = lineRef.current
    const baseline = baselineRef.current
    const svg = svgRef.current
    const path = pathRef.current
    const ghost = ghostRef.current
    if (!stage || !line || !baseline || !svg || !path || !ghost) return

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const letters = letterRefs.current.slice(0, Array.from(text).length).filter((l) => l !== null)
    let length = 0
    let swing = 0
    let modes = []
    // The sin and cos of every mode at every point and letter, worked out once.
    let pathBasis = []
    let letterBasis = []
    let raf = 0
    let last = 0
    let visible = true
    let lastPath = ''
    let grab = null
    let easing = null
    let previous = null

    const measure = () => {
      // The string sits on the baseline, found with an empty inline-block whose
      // bottom edge rests on it.
      stage.style.setProperty('--pluck-baseline', `${line.offsetTop + baseline.offsetTop + baseline.offsetHeight}px`)
      const svgBox = svg.getBoundingClientRect()
      const lineLeft = line.getBoundingClientRect().left - svgBox.left
      length = svgBox.width
      swing = Number.parseFloat(getComputedStyle(stage).fontSize) * MAX_SWING
      const f0 = (WAVE_SPEED * tension) / (2 * length)
      const count = Math.max(4, Math.min(MAX_MODES, Math.floor(MAX_MODE_HZ / f0)))
      const old = modes
      modes = Array.from({length: count}, (_, index) => {
        const n = index + 1
        const omega = 2 * Math.PI * f0 * n
        const gamma = (DAMP_BASE + DAMP_HIGH * n * n) * Math.sqrt(tension)
        return {q: old[index]?.q ?? 0, v: old[index]?.v ?? 0, omega, gamma, damped: Math.sqrt(Math.max(omega * omega - gamma * gamma, 1))}
      })
      pathBasis = Array.from({length: Math.ceil(length / STEP) + 1}, (_, i) => {
        const x = Math.min(i * STEP, length)
        return Float64Array.from(modes, (_m, index) => Math.sin(((index + 1) * Math.PI * x) / length))
      })
      letterBasis = letters.map((letter) => {
        // Offsets ignore the transform the loop applies.
        const x = lineLeft + letter.offsetLeft + letter.offsetWidth / 2
        const k = (index) => ((index + 1) * Math.PI) / length
        return {
          sin: Float64Array.from(modes, (_m, index) => Math.sin(k(index) * x)),
          cos: Float64Array.from(modes, (_m, index) => k(index) * Math.cos(k(index) * x)),
        }
      })
    }

    const sum = (basis) => {
      let y = 0
      for (let i = 0; i < modes.length; i++) y += modes[i].q * basis[i]
      return y
    }

    const draw = () => {
      let d = ''
      for (let i = 0; i < pathBasis.length; i++) {
        d += `${i ? 'L' : 'M'}${Math.min(i * STEP, length).toFixed(1)} ${soften(sum(pathBasis[i]), swing).toFixed(2)}`
      }
      // The previous frame stays behind faintly: a vibrating string blurs.
      ghost.setAttribute('d', lastPath || d)
      path.setAttribute('d', d)
      lastPath = d
      letters.forEach((letter, i) => {
        const {sin, cos} = letterBasis[i]
        const raw = sum(sin)
        // The slope of the softened curve, so the tilt eases off with the swing.
        const t = Math.tanh(raw / swing)
        const angle = Math.atan(sum(cos) * (1 - t * t)) * TILT
        letter.style.transform = `translate3d(0, ${soften(raw, swing).toFixed(2)}px, 0) rotate(${angle.toFixed(4)}rad)`
      })
    }

    const energy = () => modes.reduce((e, m) => e + m.v * m.v + m.omega * m.omega * m.q * m.q, 0)
    const hush = () => {
      for (const mode of modes) mode.q = mode.v = 0
    }

    const frame = (now) => {
      raf = 0
      if (!visible || document.hidden) return
      const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60
      last = now
      if (easing) {
        const t = Math.min((now - easing.start) / 260, 1)
        const from = easing.from
        modes.forEach((mode, index) => {
          mode.q = from[index] * (1 - t) ** 3
        })
        if (t >= 1) {
          easing = null
          hush()
        }
      } else if (!grab) {
        for (const mode of modes) stepMode(mode, dt)
      }
      draw()
      if (grab || easing || energy() > REST_ENERGY) {
        raf = requestAnimationFrame(frame)
        return
      }
      hush()
      draw()
      ghost.setAttribute('d', path.getAttribute('d') ?? '')
    }
    const start = () => {
      if (raf || !visible || document.hidden) return
      last = 0
      raf = requestAnimationFrame(frame)
    }

    const local = (event) => {
      const rect = svg.getBoundingClientRect()
      return {x: event.clientX - rect.left, y: event.clientY - rect.top}
    }
    const lineAt = (x) => {
      let y = 0
      for (let i = 0; i < modes.length; i++) y += modes[i].q * Math.sin(((i + 1) * Math.PI * x) / length)
      return soften(y, swing)
    }

    const onDown = (event) => {
      if (grab || event.button !== 0) return
      const point = local(event)
      if (point.x < 0 || point.x > length) return
      event.preventDefault()
      stage.setPointerCapture(event.pointerId)
      easing = null
      grab = {id: event.pointerId, x: point.x}
      stage.dataset.grabbing = ''
      pullInto(modes, length, point.x, lineAt(point.x))
      start()
    }
    const onMove = (event) => {
      const point = local(event)
      if (grab && event.pointerId === grab.id) {
        // Follow the hand along the string, against a pull that stiffens.
        grab.x = Math.min(Math.max(point.x, 0), length)
        pullInto(modes, length, grab.x, soften(point.y, swing * 1.6))
        start()
        return
      }
      if (!strum || event.pointerType !== 'mouse' || still) {
        previous = null
        return
      }
      if (previous && point.x >= 0 && point.x <= length) {
        // Did the cursor cross the line since the last move? Then it strums it
        // there, as hard as it was moving.
        const before = previous.y - lineAt(previous.x)
        const after = point.y - lineAt(point.x)
        if (before * after < 0) {
          const dt = Math.max(event.timeStamp - previous.time, 8) / 1000
          const speed = Math.max(-MAX_STRUM_SPEED, Math.min(MAX_STRUM_SPEED, (point.y - previous.y) / dt))
          const where = previous.x + (point.x - previous.x) * (before / (before - after))
          modes.forEach((mode, index) => {
            const n = index + 1
            mode.v += ((STRUM_GAIN * speed * 80) / length) * Math.sin((n * Math.PI * where) / length) * Math.exp(-((n / 14) ** 2))
          })
          start()
        }
      }
      previous = {x: point.x, y: point.y, time: event.timeStamp}
    }
    const onUp = (event) => {
      if (!grab || event.pointerId !== grab.id) return
      grab = null
      delete stage.dataset.grabbing
      if (still) easing = {from: Float64Array.from(modes, (mode) => mode.q), start: performance.now()}
      start()
    }
    const onLeave = () => {
      previous = null
    }

    measure()
    draw()
    const remeasure = () => {
      measure()
      draw()
    }
    const ro = new ResizeObserver(remeasure)
    ro.observe(stage)
    // Letter widths change when a web font arrives.
    let alive = true
    document.fonts?.ready.then(() => {
      if (alive) remeasure()
    })

    // One soft strum the first time it scrolls into view, to show it can move.
    let greeted = still
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (!visible) return
        if (!greeted && entry.intersectionRatio > 0.6) {
          greeted = true
          pullInto(modes, length, length * 0.3, -swing * 0.5)
        }
        start()
      },
      {threshold: [0, 0.6]},
    )
    io.observe(stage)
    document.addEventListener('visibilitychange', start)

    stage.addEventListener('pointerdown', onDown)
    stage.addEventListener('pointermove', onMove)
    stage.addEventListener('pointerup', onUp)
    stage.addEventListener('pointercancel', onUp)
    stage.addEventListener('pointerleave', onLeave)

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', start)
      stage.removeEventListener('pointerdown', onDown)
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerup', onUp)
      stage.removeEventListener('pointercancel', onUp)
      stage.removeEventListener('pointerleave', onLeave)
    }
  }, [text, tension, strum])

  const pin = {top: 'var(--pluck-baseline, 1.56em)', backgroundColor: stringColor}
  return (
    <div className="@container flex w-full justify-center">
      <div
        ref={stageRef}
        className={`relative cursor-grab touch-none px-[0.5em] py-[0.7em] text-[clamp(2rem,11cqi,7rem)] leading-none select-none data-[grabbing]:cursor-grabbing ${className}`}
      >
        <span className="sr-only">{text}</span>
        <span ref={lineRef} aria-hidden className="relative block whitespace-pre">
          {chars.map((char, i) => (
            <span
              key={i}
              ref={(el) => {
                letterRefs.current[i] = el
              }}
              className="inline-block origin-[50%_100%] will-change-transform"
            >
              {char}
            </span>
          ))}
          <span ref={baselineRef} className="inline-block h-0 w-0" />
        </span>
        <svg
          ref={svgRef}
          aria-hidden
          className="pointer-events-none absolute left-[0.25em] h-px w-[calc(100%-0.5em)] overflow-visible"
          style={{top: 'var(--pluck-baseline, 1.56em)', color: stringColor}}
        >
          <path ref={ghostRef} fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={1.5} opacity={0.3} />
          <path ref={pathRef} fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={1.5} />
        </svg>
        <span aria-hidden className="pointer-events-none absolute left-[0.25em] size-[0.12em] -translate-x-1/2 -translate-y-1/2 rounded-full" style={pin} />
        <span aria-hidden className="pointer-events-none absolute right-[0.25em] size-[0.12em] translate-x-1/2 -translate-y-1/2 rounded-full" style={pin} />
      </div>
    </div>
  )
}
