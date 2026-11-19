// ASCII Krishna Footer
// Adapted from "ASCII Art Hand Footer" by Made for Award (MIT):
// https://www.madeforaward.com/ui/interactions/ascii-hand-footer
'use client'

import {useEffect, useRef} from 'react'

/**
 * @typedef {Object} AsciiKrishnaFooterProps
 * @property {string} [src] optional transparent PNG of your own artwork (brightness picks each glyph).
 *   If omitted, Krishna is drawn procedurally, so no image asset is needed.
 * @property {[string, string]} [colors] glyph colours, from the shadows to the highlights
 * @property {string} [accent] the hover cells
 * @property {string} [background]
 * @property {number} [cellSize] one glyph cell, px
 * @property {number} [brushRadius] hover brush radius, in cells
 * @property {boolean} [twinkle] glyphs quietly change while the footer is idle
 * @property {string} [className]
 */

// darkest to brightest; each level picks at random from its own set
const RAMP = ['·', '·.', ':-', '-=+', '+*<>', '*/\\', '#%', '%@#']
const SCRAMBLE = '+*#%&@$/\\<>=?'
const FONT = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace'

const rgb = (c) => {
  let h = c.replace('#', '')
  if (h.length === 3) h = [...h].map((x) => x + x).join('')
  const n = parseInt(h.slice(0, 6), 16) || 0
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
const hash = (i) => {
  const s = Math.sin(i * 12.9898) * 43758.5453
  return s - Math.floor(s)
}
const pick = (s) => s[(Math.random() * s.length) | 0]

// ---------------------------------------------------------------------------
// Procedural Krishna. Painted in greyscale on a transparent canvas: the
// brightness of each pixel decides which ASCII glyph it becomes. Dark outlines
// keep every shape separate from the dim halo behind it.
//
// Composition: sunburst + halo (prabhamandala), a lotus pedestal, and Krishna
// in tribhanga (three-bend) pose, playing the flute, with a peacock feather
// in his crown, a flower garland (vaijayanti mala) and a dhoti.
// ---------------------------------------------------------------------------
const PW = 1000
const PH = 820

const grey = (l) => {
  const v = Math.round(l * 255)
  return `rgb(${v},${v},${v})`
}

function drawKrishna() {
  const cv = document.createElement('canvas')
  cv.width = PW
  cv.height = PH
  const c = cv.getContext('2d')
  c.lineJoin = 'round'
  c.lineCap = 'round'
  // all coordinates below are designed around x = 450; this centres them
  c.translate(50, 45)

  const cx = 450
  const hcy = 330 // halo centre

  const ell = (x, y, rx, ry, l, rot = 0) => {
    c.fillStyle = grey(l)
    c.beginPath()
    c.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2)
    c.fill()
  }
  const line = (pts, w, l) => {
    c.strokeStyle = grey(l)
    c.lineWidth = w
    c.beginPath()
    c.moveTo(pts[0][0], pts[0][1])
    for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1])
    c.stroke()
  }
  // a limb: dark outline, then the lit fill on top
  const limb = (pts, wOut, wIn, l) => {
    line(pts, wOut, 0.06)
    line(pts, wIn, l)
  }

  // --- sunburst rays, fading out with distance --------------------------
  const rays = c.createRadialGradient(cx, hcy, 290, cx, hcy, 540)
  rays.addColorStop(0, grey(0.36))
  rays.addColorStop(1, grey(0))
  c.fillStyle = rays
  for (let k = 0; k < 48; k++) {
    const a = (k / 48) * Math.PI * 2
    const r1 = k % 2 ? 430 : 540
    const w = 0.05
    c.beginPath()
    c.moveTo(cx + Math.cos(a - w) * 285, hcy + Math.sin(a - w) * 285)
    c.lineTo(cx + Math.cos(a) * r1, hcy + Math.sin(a) * r1)
    c.lineTo(cx + Math.cos(a + w) * 285, hcy + Math.sin(a + w) * 285)
    c.closePath()
    c.fill()
  }

  // --- halo ---------------------------------------------------------------
  const disc = c.createRadialGradient(cx, hcy, 0, cx, hcy, 270)
  disc.addColorStop(0, grey(0.32))
  disc.addColorStop(0.8, grey(0.14))
  disc.addColorStop(1, grey(0.2))
  c.fillStyle = disc
  c.beginPath()
  c.arc(cx, hcy, 270, 0, Math.PI * 2)
  c.fill()
  c.strokeStyle = grey(0.6)
  c.lineWidth = 8
  c.beginPath()
  c.arc(cx, hcy, 272, 0, Math.PI * 2)
  c.stroke()
  c.strokeStyle = grey(0.38)
  c.lineWidth = 2
  c.beginPath()
  c.arc(cx, hcy, 252, 0, Math.PI * 2)
  c.stroke()
  for (let k = 0; k < 72; k++) {
    const a = (k / 72) * Math.PI * 2
    ell(cx + Math.cos(a) * 236, hcy + Math.sin(a) * 236, 2.6, 2.6, 0.62)
  }

  // --- lotus pedestal (drawn before the figure so the feet stand on it) --
  const petalRow = (n, spread, rx, ry, l) => {
    const items = []
    for (let k = 0; k < n; k++) items.push((k / (n - 1) - 0.5) * spread)
    items.sort((p, q) => Math.abs(q) - Math.abs(p)) // outer petals first
    for (const a of items) {
      c.save()
      c.translate(cx + Math.sin(a) * 22, 745)
      c.rotate(a)
      ell(0, -ry, rx + 3, ry + 3, 0.06)
      ell(0, -ry, rx, ry, 0.9 * l)
      ell(0, -ry, rx - 7, ry - 9, 0.38 * l)
      line([[0, -8], [0, -ry * 1.7]], 2, 0.85 * l)
      c.restore()
    }
  }
  ell(cx, 752, 150, 14, 0.5)
  petalRow(9, 2.7, 24, 58, 0.8)
  petalRow(8, 2.2, 22, 50, 1)

  // --- legs (standing leg first, then the crossed leg in front) ----------
  limb([[441, 585], [446, 650], [452, 698]], 36, 28, 0.74)
  ell(460, 708, 27, 13, 0.06)
  ell(460, 708, 23, 9, 0.7)
  limb([[472, 585], [462, 640], [430, 692]], 34, 26, 0.8)
  ell(422, 701, 20, 12, 0.06)
  ell(422, 701, 16, 8, 0.78)
  // anklets
  c.strokeStyle = grey(1)
  c.lineWidth = 3
  c.beginPath()
  c.ellipse(449, 672, 15, 5, 0, 0, Math.PI * 2)
  c.stroke()
  c.beginPath()
  c.ellipse(441, 676, 14, 5, 0.5, 0, Math.PI * 2)
  c.stroke()

  // --- dhoti --------------------------------------------------------------
  const dhoti = () => {
    c.beginPath()
    c.moveTo(418, 398)
    c.lineTo(490, 398)
    c.quadraticCurveTo(516, 500, 502, 615)
    c.quadraticCurveTo(452, 634, 402, 615)
    c.quadraticCurveTo(394, 500, 418, 398)
    c.closePath()
  }
  dhoti()
  c.strokeStyle = grey(0.06)
  c.lineWidth = 7
  c.stroke()
  const dg = c.createLinearGradient(400, 0, 510, 0)
  dg.addColorStop(0, grey(0.9))
  dg.addColorStop(1, grey(0.5))
  c.fillStyle = dg
  dhoti()
  c.fill()
  // folds
  for (let k = 1; k <= 5; k++) {
    const x0 = 424 + k * 11
    const x1 = 410 + k * 17
    c.strokeStyle = grey(0.22)
    c.lineWidth = 2.5
    c.beginPath()
    c.moveTo(x0, 410)
    c.quadraticCurveTo((x0 + x1) / 2 + 8, 510, x1, 616)
    c.stroke()
  }
  // bright hem
  c.strokeStyle = grey(1)
  c.lineWidth = 6
  c.beginPath()
  c.moveTo(403, 612)
  c.quadraticCurveTo(452, 630, 501, 612)
  c.stroke()
  // sash
  c.fillStyle = grey(0.06)
  c.fillRect(412, 388, 84, 36)
  c.fillStyle = grey(1)
  c.fillRect(416, 392, 76, 28)
  for (let x = 424; x < 490; x += 11) ell(x, 406, 3, 3, 0.15)

  // --- torso --------------------------------------------------------------
  const torso = () => {
    c.beginPath()
    c.moveTo(392, 248)
    c.quadraticCurveTo(450, 226, 506, 246)
    c.quadraticCurveTo(514, 330, 488, 398)
    c.lineTo(420, 398)
    c.quadraticCurveTo(400, 330, 392, 248)
    c.closePath()
  }
  torso()
  c.strokeStyle = grey(0.06)
  c.lineWidth = 7
  c.stroke()
  const tg = c.createLinearGradient(392, 0, 508, 0)
  tg.addColorStop(0, grey(0.95))
  tg.addColorStop(1, grey(0.55))
  c.fillStyle = tg
  torso()
  c.fill()
  ell(452, 368, 4, 4, 0.2) // navel

  // neck
  c.fillStyle = grey(0.06)
  c.beginPath()
  c.moveTo(426, 205)
  c.lineTo(478, 205)
  c.lineTo(486, 256)
  c.lineTo(418, 256)
  c.closePath()
  c.fill()
  c.fillStyle = grey(0.72)
  c.beginPath()
  c.moveTo(431, 205)
  c.lineTo(473, 205)
  c.lineTo(479, 252)
  c.lineTo(425, 252)
  c.closePath()
  c.fill()

  // --- necklace + flower garland -----------------------------------------
  c.strokeStyle = grey(1)
  c.lineWidth = 5
  c.beginPath()
  c.moveTo(417, 254)
  c.quadraticCurveTo(452, 318, 490, 252)
  c.stroke()
  ell(453, 292, 9, 11, 0.08)
  ell(453, 292, 6, 8, 1)
  const garland = (t) => {
    const u = 1 - t
    return [u * u * 408 + 2 * u * t * 432 + t * t * 502, u * u * 254 + 2 * u * t * 445 + t * t * 318]
  }
  for (let k = 0; k <= 26; k++) {
    const [x, y] = garland(k / 26)
    ell(x, y, 9, 9, 0.08)
    ell(x, y, 6.5, 6.5, k % 2 ? 0.55 : 0.98)
    ell(x, y, 2.5, 2.5, k % 2 ? 0.98 : 0.2)
  }

  // --- hair + ears --------------------------------------------------------
  ell(405, 178, 20, 54, 0.06, 0.15)
  ell(405, 178, 16, 50, 0.22, 0.15)
  ell(497, 182, 20, 54, 0.06, -0.15)
  ell(497, 182, 16, 50, 0.22, -0.15)
  for (let k = 0; k < 5; k++) {
    ell(398 + k * 2, 214 + k * 7, 8, 8, 0.2)
    ell(504 - k * 2, 218 + k * 7, 8, 8, 0.2)
  }

  // --- right arm (viewer's right) ------------------------------------------
  limb([[500, 252], [552, 335], [570, 240]], 32, 24, 0.7)

  // --- head, crown, feathers ---------------------------------------------
  c.save()
  c.translate(450, 175)
  c.rotate(0.1)

  // peacock feathers behind the crown
  const featherAt = (len, shade, es) => {
    const g = c.createLinearGradient(0, 0, 0, -len)
    g.addColorStop(0, grey(0.25 * shade))
    g.addColorStop(1, grey(0.66 * shade))
    c.fillStyle = g
    c.beginPath()
    c.ellipse(0, -len * 0.5, len * 0.1, len * 0.5, 0, 0, Math.PI * 2)
    c.fill()
    line([[0, 0], [0, -len]], 3, 0.6 * shade)
    const ey = -len * 0.9
    ell(0, ey, len * 0.07 * es, len * 0.09 * es, 0.95 * shade)
    ell(0, ey, len * 0.05 * es, len * 0.066 * es, 0.16)
    ell(0, ey, len * 0.034 * es, len * 0.046 * es, 0.88 * shade)
    ell(0, ey, len * 0.016 * es, len * 0.024 * es, 0.1)
  }
  for (const [a, len] of [
    [-0.45, 105],
    [0.7, 100],
    [-0.12, 118],
  ]) {
    c.save()
    c.translate(4, -62)
    c.rotate(a)
    featherAt(len, 0.85, 1.4)
    c.restore()
  }
  c.save()
  c.translate(8, -62)
  c.rotate(0.2)
  featherAt(142, 1, 1.4)
  c.restore()

  // face
  ell(0, 0, 44, 52, 0.06)
  ell(0, 0, 40, 48, 0.9)
  ell(-22, 16, 11, 9, 1) // cheek highlights
  ell(22, 16, 11, 9, 1)
  // ears + earrings
  ell(-42, 8, 7, 12, 0.7)
  ell(42, 8, 7, 12, 0.7)
  ell(-42, 26, 6, 9, 0.08)
  ell(-42, 26, 4, 7, 1)
  ell(42, 26, 6, 9, 0.08)
  ell(42, 26, 4, 7, 1)
  // brows
  c.strokeStyle = grey(0.08)
  c.lineWidth = 4
  c.beginPath()
  c.moveTo(-27, -10)
  c.quadraticCurveTo(-16, -20, -5, -11)
  c.moveTo(27, -10)
  c.quadraticCurveTo(16, -20, 5, -11)
  c.stroke()
  // eyes
  ell(-15, -1, 9, 5, 0.04)
  ell(15, -1, 9, 5, 0.04)
  ell(-12, -2, 2.5, 2, 1)
  ell(18, -2, 2.5, 2, 1)
  // tilak
  ell(0, -22, 3.5, 11, 0.1)
  // nose + lips
  line([[0, 6], [-2, 13], [3, 14]], 2.5, 0.35)
  ell(8, 28, 8, 4.5, 0.25)

  // crown: band, body, jewels
  c.fillStyle = grey(0.06)
  c.beginPath()
  c.moveTo(-42, -26)
  c.lineTo(42, -26)
  c.lineTo(34, -52)
  c.lineTo(0, -76)
  c.lineTo(-34, -52)
  c.closePath()
  c.fill()
  c.fillStyle = grey(1)
  c.beginPath()
  c.moveTo(-37, -28)
  c.lineTo(37, -28)
  c.lineTo(30, -52)
  c.lineTo(0, -70)
  c.lineTo(-30, -52)
  c.closePath()
  c.fill()
  for (const [x, y] of [[-22, -40], [0, -50], [22, -40], [-12, -32], [12, -32]]) ell(x, y, 4.5, 4.5, 0.15)
  ell(0, -64, 6, 6, 0.08)
  c.restore()

  // --- flute --------------------------------------------------------------
  const f0 = [456, 202]
  const f1 = [650, 262]
  limb([f0, f1], 17, 11, 0.97)
  for (const t of [0.28, 0.45, 0.58, 0.7, 0.82]) {
    ell(f0[0] + (f1[0] - f0[0]) * t, f0[1] + (f1[1] - f0[1]) * t, 3, 3, 0.1)
  }
  // ribbon tassel at the end
  line([[650, 262], [668, 292], [662, 318]], 4, 0.9)
  ell(661, 324, 6, 6, 1)

  // --- left arm, crossing in front of the torso ----------------------------
  limb([[398, 252], [452, 332], [522, 224]], 32, 24, 0.82)

  // --- hands --------------------------------------------------------------
  for (const [hx, hy] of [[522, 224], [572, 240]]) {
    ell(hx, hy, 17, 15, 0.06)
    ell(hx, hy, 13, 11, 0.9)
    line([[hx - 6, hy - 9], [hx - 6, hy + 9]], 2, 0.3)
    line([[hx + 2, hy - 10], [hx + 2, hy + 10]], 2, 0.3)
  }
  // bangles
  for (const [bx, by, r] of [[540, 290, 0.4], [562, 290, 0.4]]) {
    c.strokeStyle = grey(1)
    c.lineWidth = 3
    c.beginPath()
    c.ellipse(bx, by, 14, 5, r, 0, Math.PI * 2)
    c.stroke()
  }

  return cv
}

// Krishna drawn in ASCII, for the back of a footer. The artwork is sampled onto
// a grid of square cells and every cell's brightness picks a glyph and a
// colour between the two `colors`. The resting glyphs are drawn once to an
// offscreen layer; each frame only blits the layer and paints the cells the
// cursor brushed, which flip to the accent with a scrambling glyph and fade
// back over half a second. The figure rises into view as the footer scrolls
// in and drifts a little with the pointer.
//
// One canvas, no dependencies. The loop runs only while the footer is on
// screen and the tab is visible; reduced motion drops the rise, drift and
// twinkle and keeps the hover.
/** @param {AsciiKrishnaFooterProps} props */
export default function AsciiKrishnaFooter({
  src,
  colors = ['#3b3bd6', '#ffd98a'],
  accent = '#5eead4',
  background = '#05060f',
  cellSize = 6,
  brushRadius = 2.8,
  twinkle = true,
  className = '',
}) {
  const [from, to] = colors
  const rootRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const c0 = rgb(from)
    const c1 = rgb(to)
    let source = null
    let figure = null
    let W = 0
    let H = 0
    let dpr = 1
    let cell = cellSize
    let raf = 0
    let inView = false
    let disposed = false
    // pointer: target and eased, -1..1 across the viewport
    const drift = {tx: 0, ty: 0, x: 0, y: 0}
    let last = null
    let prev = performance.now()

    const setFont = (c) => {
      c.font = `${cell * 0.82}px ${FONT}`
      c.textAlign = 'center'
      c.textBaseline = 'middle'
    }

    const drawGlyph = (c, fig, i, ch) => {
      const t = fig.level[i] / (RAMP.length - 1)
      const mix = (k) => Math.round(c0[k] + (c1[k] - c0[k]) * t)
      c.fillStyle = `rgba(${mix(0)},${mix(1)},${mix(2)},${0.45 + 0.55 * t})`
      c.fillText(ch, (i % fig.cols) * cell + cell / 2, Math.floor(i / fig.cols) * cell + cell / 2)
    }

    const build = (img) => {
      const iw = img.naturalWidth || img.width
      const ih = img.naturalHeight || img.height
      const aspect = iw / ih
      // fit the artwork inside the footer, as large as it can go
      const h = H * 0.94
      const w = Math.min(W * 0.98, h * aspect)
      const cols = Math.max(8, Math.round(w / cell))
      const rows = Math.max(4, Math.round(cols / aspect))

      const probe = document.createElement('canvas')
      probe.width = cols
      probe.height = rows
      const pctx = probe.getContext('2d', {willReadFrequently: true})
      pctx.drawImage(img, 0, 0, cols, rows)
      const data = pctx.getImageData(0, 0, cols, rows).data

      const level = new Int8Array(cols * rows).fill(-1)
      const lum = new Float32Array(cols * rows)
      let min = 1
      let max = 0
      for (let i = 0; i < lum.length; i++) {
        const a = data[i * 4 + 3] / 255
        if (a < 0.08) continue
        lum[i] = ((0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]) / 255) * a
        min = Math.min(min, lum[i])
        max = Math.max(max, lum[i])
      }
      for (let i = 0; i < lum.length; i++) {
        // stretched over the artwork's own range, so the shadows keep their shape
        if (lum[i] > 0) level[i] = Math.min(RAMP.length - 1, Math.floor(((lum[i] - min) / (max - min || 1)) ** 0.75 * RAMP.length))
      }

      const layer = document.createElement('canvas')
      layer.width = Math.ceil(cols * cell * dpr)
      layer.height = Math.ceil(rows * cell * dpr)
      const fig = {
        cols,
        rows,
        level,
        hit: new Float64Array(cols * rows),
        live: new Set(), // cells still fading out
        layer,
        // centred horizontally, standing on the bottom edge
        x: W / 2 - (cols * cell) / 2,
        y: H - rows * cell - 4,
        h: rows * cell,
      }
      const lctx = layer.getContext('2d')
      lctx.scale(dpr, dpr)
      setFont(lctx)
      for (let i = 0; i < level.length; i++) if (level[i] >= 0) drawGlyph(lctx, fig, i, pick(RAMP[level[i]]))
      return fig
    }

    const layout = () => {
      const r = root.getBoundingClientRect()
      dpr = Math.min(devicePixelRatio || 1, 2)
      W = r.width
      H = r.height
      // keep enough cells across the figure on small screens
      cell = Math.max(4, Math.min(cellSize, W / 110))
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      figure = build(source)
    }

    // where the figure sits this frame: risen by scroll, nudged by the pointer
    const offset = (fig, slide) => ({
      x: fig.x + drift.x * 14,
      y: fig.y + slide * fig.h * 0.55 - drift.y * 8,
    })

    const progress = () => {
      if (reduce) return 1
      const r = root.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (r.height * 0.85)))
      return 1 - (1 - p) ** 3
    }

    const frame = (now) => {
      raf = 0
      const dt = Math.min(0.05, (now - prev) / 1000)
      prev = now
      if (!reduce) {
        const k = 1 - Math.exp(-dt * 3)
        drift.x += (drift.tx - drift.x) * k
        drift.y += (drift.ty - drift.y) * k
      }
      const slide = 1 - progress()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)
      setFont(ctx)

      const fig = figure
      const o = offset(fig, slide)
      if (twinkle && !reduce) {
        const lctx = fig.layer.getContext('2d')
        for (let n = Math.ceil(fig.level.length * 0.0015); n > 0; n--) {
          const i = (Math.random() * fig.level.length) | 0
          if (fig.level[i] < 0) continue
          lctx.clearRect((i % fig.cols) * cell, Math.floor(i / fig.cols) * cell, cell, cell)
          drawGlyph(lctx, fig, i, pick(RAMP[fig.level[i]]))
        }
      }
      ctx.drawImage(fig.layer, o.x, o.y, fig.layer.width / dpr, fig.layer.height / dpr)
      for (const i of fig.live) {
        // each cell lingers 380–700ms, so the trail breaks up as it fades
        const age = (now - fig.hit[i]) / (380 + hash(i) * 320)
        if (age >= 1) {
          fig.live.delete(i)
          continue
        }
        const x = o.x + (i % fig.cols) * cell
        const y = o.y + Math.floor(i / fig.cols) * cell
        ctx.globalAlpha = (1 - age) ** 1.6
        ctx.fillStyle = accent
        ctx.fillRect(x + 0.5, y + 0.5, cell - 1, cell - 1)
        ctx.fillStyle = background
        ctx.fillText(pick(SCRAMBLE), x + cell / 2, y + cell / 2)
        ctx.globalAlpha = 1
      }
      if (inView && !document.hidden) raf = requestAnimationFrame(frame)
    }

    const start = () => {
      if (!raf && inView && !document.hidden && figure) {
        prev = performance.now()
        raf = requestAnimationFrame(frame)
      }
    }

    // stamp the brush at a point in footer px
    const stamp = (pointX, pointY, now) => {
      if (!figure) return
      const slide = 1 - progress()
      const fig = figure
      const o = offset(fig, slide)
      const cx = (pointX - o.x) / cell
      const cy = (pointY - o.y) / cell
      const reach = brushRadius + 1.5
      if (cx < -reach || cy < -reach || cx > fig.cols + reach || cy > fig.rows + reach) return
      for (let y = Math.max(0, Math.floor(cy - reach)); y <= Math.min(fig.rows - 1, Math.ceil(cy + reach)); y++) {
        for (let x = Math.max(0, Math.floor(cx - reach)); x <= Math.min(fig.cols - 1, Math.ceil(cx + reach)); x++) {
          const i = y * fig.cols + x
          if (fig.level[i] < 0) continue
          // a ragged edge, so the brush never reads as a circle
          const r = brushRadius + (hash(i + 7) - 0.5) * 3
          if ((x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2 < r * r) {
            fig.hit[i] = now
            fig.live.add(i)
          }
        }
      }
    }

    const onMove = (e) => {
      drift.tx = (e.clientX / innerWidth - 0.5) * 2
      drift.ty = (e.clientY / innerHeight - 0.5) * 2
      const r = root.getBoundingClientRect()
      const p = {x: e.clientX - r.left, y: e.clientY - r.top}
      if (p.x < 0 || p.y < 0 || p.x > W || p.y > H) {
        last = null
        return
      }
      const now = performance.now()
      // fill the gap since the last event so fast moves leave a full trail
      const prevP = last ?? p
      const steps = Math.max(1, Math.ceil(Math.hypot(p.x - prevP.x, p.y - prevP.y) / cell))
      for (let s = 1; s <= steps; s++) {
        stamp(prevP.x + ((p.x - prevP.x) * s) / steps, prevP.y + ((p.y - prevP.y) * s) / steps, now)
      }
      last = p
    }

    const load = (url) =>
      new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = url
      })

    // custom artwork if given, otherwise the procedural Krishna
    Promise.resolve(src ? load(src) : drawKrishna())
      .then((img) => {
        if (disposed) return
        source = img
        layout()
        start()
      })
      .catch(() => {})

    const ro = new ResizeObserver(() => {
      if (!source) return
      layout()
      start()
    })
    ro.observe(root)
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting
      start()
    })
    io.observe(root)
    const onVisibility = () => start()
    document.addEventListener('visibilitychange', onVisibility)
    addEventListener('pointermove', onMove, {passive: true})

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      removeEventListener('pointermove', onMove)
    }
  }, [src, from, to, accent, background, cellSize, brushRadius, twinkle])

  return (
    <footer ref={rootRef} className={`relative h-full min-h-[560px] w-full overflow-hidden ${className}`} style={{background}}>
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 size-full" />
    </footer>
  )
}