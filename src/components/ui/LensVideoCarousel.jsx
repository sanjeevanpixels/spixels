// Lens Video Carousel by Made for Award: https://www.madeforaward.com/ui/galleries/lens-video-carousel
// Free and open source (MIT). If it helped, a star means a lot: https://github.com/shivc868/madeforaward-ui
'use client'

import {useLayoutEffect, useRef} from 'react'
import gsap from 'gsap'

/**
 * @typedef {Object} LensVideoItem
 * @property {string} [video] a video to play in the card
 * @property {string} [src] an image: the card itself, or what shows until its video has a frame
 * @property {string} alt describes the card for screen readers
 * @property {string} [title] shown on the label that follows the pointer
 * @property {string} [href] clicking the card goes here
 */

/**
 * Props (all optional except `items`):
 * items: LensVideoItem[]            title, highlight, kicker: string       children: ReactNode
 * cardHeight, cardRatio, radius, spacing, rowGap, bend, focus, grow, follow, slant: number
 * counterRows, reverse, playVideos, cursorLabel: boolean
 * bulgeX, bulgeY, speedWarp, blur, blurStart, blurRamp, shutter, fringe, edgeFade, grain: number
 * speed, hoverSlow, intro, dragPower, throwPower, settle, videoFps, maxDpr: number
 * accent, titleColor, kickerColor, background, placeholder: string (colours)
 * ring, hoverScale, titleSize, startIndex: number
 * onSelect: (item, index) => void    label, className: string
 */

const VERTEX = `#version 300 es
in vec2 aUv;
uniform vec2 uView, uCentre, uAxis, uSize, uBulge;
uniform float uMiddle, uBlurStart, uBlurRamp, uBlur, uShutter, uEdgeFade;
out vec2 vUv;
out float vBlur;
out float vFade;
void main() {
  vUv = aUv;
  vec2 p = aUv - 0.5;
  // The corners stay put and each edge swells toward its middle, like glass held in front of the card.
  vec2 s = p * (1.0 + uBulge * (1.0 - 4.0 * p.yx * p.yx)) * uSize;
  vec2 world = uCentre + vec2(s.x * uAxis.x - s.y * uAxis.y, s.x * uAxis.y + s.y * uAxis.x);
  float away = smoothstep(uBlurStart, uBlurStart + uBlurRamp, abs(world.x - uMiddle) / uView.y);
  vBlur = max(away * uBlur, uShutter);
  vFade = 1.0 - away * uEdgeFade;
  vec2 clip = world / uView * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}`

const FRAGMENT = `#version 300 es
precision highp float;
in vec2 vUv;
in float vBlur;
in float vFade;
uniform sampler2D uTex;
uniform vec2 uSize, uFit, uFitOff;
uniform vec3 uPlaceholder, uAccent;
uniform float uRadius, uReady, uHover, uRing, uStreak, uFringe, uGrain, uFrame;
out vec4 color;
const int TAPS = 12;

float noise(vec2 p) {
  return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715))));
}

void main() {
  vec2 q = abs((vUv - 0.5) * uSize) - (0.5 * uSize - uRadius);
  float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadius;
  // The edge softens inward so it reaches nothing right at the mesh, with no hard line left behind.
  float soft = max(fwidth(d) * 1.2, vBlur * uSize.y * 0.6);
  float mask = 1.0 - smoothstep(-soft, 0.0, d);

  vec2 t = uFitOff + vUv * uFit;
  vec2 gx = dFdx(t);
  vec2 gy = dFdy(t);
  vec3 c;
  if (vBlur < 0.0012) {
    c = textureGrad(uTex, t, gx, gy).rgb;
  } else {
    // A spiral of samples, turned per pixel to hide its pattern. Inner samples lean red and
    // outer ones blue, which is what splits soft edges into colour for free.
    vec2 reach = vec2(vBlur * (1.0 + uStreak) * uSize.y / uSize.x, vBlur) * uFit;
    float turn = noise(gl_FragCoord.xy) * 6.2831853;
    vec3 sum = vec3(0.0);
    vec3 weight = vec3(0.0);
    for (int i = 0; i < TAPS; i++) {
      float f = (float(i) + 0.5) / float(TAPS);
      float a = float(i) * 2.3999632 + turn;
      vec3 w = 1.0 + uFringe * vec3(1.0 - 2.0 * f, 0.0, 2.0 * f - 1.0);
      sum += textureGrad(uTex, t + vec2(cos(a), sin(a)) * sqrt(f) * reach, gx, gy).rgb * w;
      weight += w;
    }
    c = sum / weight;
  }
  c = mix(uPlaceholder, c, uReady);
  c += (noise(gl_FragCoord.xy + uFrame * 5.588238) - 0.5) * uGrain;
  c = mix(c, uAccent, smoothstep(-uRing - 1.0, -uRing, d) * uHover);
  float a = mask * vFade;
  color = vec4(c * a, a);
}`

const UNIFORMS = ['uView', 'uCentre', 'uAxis', 'uSize', 'uBulge', 'uMiddle', 'uBlurStart', 'uBlurRamp', 'uBlur', 'uShutter', 'uEdgeFade', 'uTex', 'uFit', 'uFitOff', 'uPlaceholder', 'uAccent', 'uRadius', 'uReady', 'uHover', 'uRing', 'uStreak', 'uFringe', 'uGrain', 'uFrame']

const COLS = 14
const ROWS = 12
const UPLOADS_PER_TICK = 3

const mod = (n, m) => ((n % m) + m) % m
const rgb = (color) => gsap.utils.splitColor(color).slice(0, 3).map((n) => Number(n) / 255)

export default function LensVideoCarousel({
  items,
  title = '',
  highlight = '',
  kicker = '',
  children,
  cardHeight = 0.28,
  cardRatio = 1.12,
  radius = 20,
  spacing = 0.18,
  rowGap = 0.31,
  bend = 0.46,
  focus = 0.5,
  grow = 0.12,
  follow = 1,
  slant = 0,
  counterRows = false,
  bulgeX = 0.06,
  bulgeY = 0.2,
  speedWarp = 0.6,
  blur = 0.05,
  blurStart = 0.34,
  blurRamp = 0.5,
  shutter = 0.0016,
  fringe = 0.7,
  edgeFade = 0.35,
  grain = 0.05,
  speed = 0.22,
  reverse = false,
  hoverSlow = 0.25,
  intro = 6,
  dragPower = 0.7,
  throwPower = 1,
  settle = 2.2,
  playVideos = true,
  videoFps = 24,
  maxDpr = 1.5,
  accent = '#ff5a1f',
  ring = 3,
  hoverScale = 1.03,
  cursorLabel = true,
  titleSize = 0.14,
  titleColor = '#f5f1ea',
  kickerColor = 'rgba(245, 241, 234, 0.66)',
  background = '#0b0b0c',
  placeholder = '#1c1c1f',
  startIndex = 0,
  onSelect,
  label = 'Video carousel',
  className = '',
}) {
  const rootRef = useRef(null)
  const canvasRef = useRef(null)
  const chipRef = useRef(null)
  const chipTextRef = useRef(null)
  const engine = useRef({sync: () => {}, show: () => {}, step: () => {}})

  const settings = {items, cardHeight, cardRatio, radius, spacing, rowGap, bend, focus, grow, follow, slant, counterRows, bulgeX, bulgeY, speedWarp, blur, blurStart, blurRamp, shutter, fringe, edgeFade, grain, speed, reverse, hoverSlow, intro, dragPower, throwPower, settle, playVideos, videoFps, maxDpr, accent, ring, hoverScale, cursorLabel, placeholder, startIndex, onSelect}
  const live = useRef(settings)

  useLayoutEffect(() => {
    live.current = settings
    engine.current.sync()
  })

  useLayoutEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const chip = chipRef.current
    const chipText = chipTextRef.current
    if (!root || !canvas || !chip || !chipText) return
    const context = canvas.getContext('webgl2', {alpha: true, premultipliedAlpha: true, antialias: false})
    if (!context) {
      root.dataset.fallback = 'true'
      return
    }
    const gl = context
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let program = null
    let vao = null
    let buffers = []
    const u = {}
    const indexCount = COLS * ROWS * 6

    // Everything the GPU forgets when a context is lost, so it can be made again.
    const build = () => {
      const compile = (type, source) => {
        const shader = gl.createShader(type)
        if (!shader) return null
        gl.shaderSource(shader, source)
        gl.compileShader(shader)
        return shader
      }
      const vs = compile(gl.VERTEX_SHADER, VERTEX)
      const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT)
      program = gl.createProgram()
      if (!vs || !fs || !program) return false
      gl.attachShader(program, vs)
      gl.attachShader(program, fs)
      gl.linkProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false
      gl.useProgram(program)
      for (const name of UNIFORMS) u[name] = gl.getUniformLocation(program, name)

      const uv = new Float32Array((COLS + 1) * (ROWS + 1) * 2)
      const index = new Uint16Array(indexCount)
      let n = 0
      for (let row = 0; row <= ROWS; row++) {
        for (let col = 0; col <= COLS; col++) {
          uv[n++] = col / COLS
          uv[n++] = row / ROWS
        }
      }
      n = 0
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const a = row * (COLS + 1) + col
          const b = a + COLS + 1
          index.set([a, a + 1, b, a + 1, b + 1, b], n)
          n += 6
        }
      }
      vao = gl.createVertexArray()
      gl.bindVertexArray(vao)
      const vertexBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, uv, gl.STATIC_DRAW)
      const location = gl.getAttribLocation(program, 'aUv')
      gl.enableVertexAttribArray(location)
      gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0)
      const indexBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index, gl.STATIC_DRAW)
      buffers = [vertexBuffer, indexBuffer]

      gl.enable(gl.BLEND)
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
      gl.activeTexture(gl.TEXTURE0)
      gl.uniform1i(u.uTex, 0)
      return true
    }

    const makeTexture = () => {
      const tex = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      // Nothing to show yet: the shader shows the placeholder until ready climbs.
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4))
      return tex
    }

    const upload = (m, source, width, height) => {
      const isImage = source instanceof HTMLImageElement
      gl.bindTexture(gl.TEXTURE_2D, m.tex)
      try {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)
      } catch {
        // Another site's file without CORS headers: the card keeps its placeholder.
        return
      }
      if (isImage) {
        gl.generateMipmap(gl.TEXTURE_2D)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
      } else if (m.mipped) {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      }
      m.mipped = isImage
      m.width = width
      m.height = height
      m.loaded = true
    }

    let media = []

    const dropMedia = () => {
      for (const m of media) {
        gl.deleteTexture(m.tex)
        if (m.image) m.image.onload = null
        if (m.video) {
          m.video.pause()
          m.video.removeAttribute('src')
          m.video.load()
        }
      }
      media = []
    }

    const loadMedia = (list) => {
      dropMedia()
      media = list.map((item) => {
        const m = {tex: makeTexture(), image: null, video: null, width: 0, height: 0, ready: 0, loaded: false, mipped: false, seen: false, lastSeen: 0, lastTime: -1, lastUpload: 0, starting: false, refused: false}
        if (item.src) {
          const image = new Image()
          image.crossOrigin = 'anonymous'
          image.onload = () => {
            // A video that got there first keeps the card.
            if (!m.loaded) upload(m, image, image.naturalWidth, image.naturalHeight)
          }
          image.src = item.src
          m.image = image
        }
        if (item.video) {
          const video = document.createElement('video')
          video.muted = true
          video.loop = true
          video.playsInline = true
          video.setAttribute('playsinline', '')
          video.crossOrigin = 'anonymous'
          video.preload = still ? (item.src ? 'none' : 'auto') : 'metadata'
          video.src = item.video
          m.video = video
        }
        return m
      })
    }

    let W = 1
    let H = 1
    let visible = true
    let filmClock = 0
    let needsDraw = true
    let drawnAt = Number.NaN
    let chipShown = false
    const start = live.current
    let position = start.startIndex - (still ? 0 : start.intro / Math.max(0.1, start.settle))
    let velocity = still ? 0 : start.intro
    let goal = null
    let hoveredKey = null
    let pointer = null
    let held = null
    const hovers = new Map()
    const slots = []
    const order = []
    let used = 0

    const fit = () => {
      W = Math.max(1, root.clientWidth)
      H = Math.max(1, root.clientHeight)
      const dpr = Math.min(window.devicePixelRatio || 1, live.current.maxDpr)
      const width = Math.round(W * dpr)
      const height = Math.round(H * dpr)
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }
      root.style.setProperty('--lens-h', `${H}px`)
      root.style.setProperty('--lens-w', `${W}px`)
      needsDraw = true
    }

    // Where every card is this frame. The pointer test reads the same list as the drawing.
    const layout = () => {
      const c = live.current
      const count = media.length
      used = 0
      order.length = 0
      if (!count) return
      const cardH = H * c.cardHeight
      const cardW = cardH * c.cardRatio
      const step = Math.max(1, H * c.spacing)
      const middleX = W * c.focus
      const angle = (c.slant * Math.PI) / 180
      const slantCos = Math.cos(angle)
      const slantSin = Math.sin(angle)
      const warp = 1 + c.speedWarp * Math.min(1, Math.abs(velocity) / 10)
      const swell = 1 + Math.max(c.bulgeX, c.bulgeY) * warp
      const reach = Math.max(middleX, W - middleX) + Math.abs(slantSin) * H * 0.5 + cardW * 1.6
      const span = Math.min(90, Math.ceil(reach / step))
      for (let row = 0; row < 2; row++) {
        const run = row === 1 && c.counterRows ? -position : position
        const whole = Math.floor(run)
        for (let k = whole - span; k <= whole + span + 1; k++) {
          if (mod(k, 2) !== row) continue
          const flatX = middleX + (k - run) * step
          const e = (flatX - middleX) / H
          const side = row === 0 ? -1 : 1
          const flatY = H / 2 + side * H * (c.rowGap + c.bend * e * e)
          const hover = hovers.get(k) ?? 0
          const size = 1 + c.grow * e * e + hover * (c.hoverScale - 1)
          const w = cardW * size
          const h = cardH * size
          const fromX = flatX - W / 2
          const fromY = flatY - H / 2
          const x = W / 2 + fromX * slantCos - fromY * slantSin
          const y = H / 2 + fromX * slantSin + fromY * slantCos
          const r = Math.hypot(w, h) * 0.5 * swell
          if (x < -r || x > W + r || y < -r || y > H + r) continue
          const turn = Math.atan(side * 2 * c.bend * e * c.follow) + angle
          const slot = slots[used] ?? (slots[used] = {k: 0, index: 0, x: 0, y: 0, w: 0, h: 0, cos: 1, sin: 0, away: 0, hover: 0})
          slot.k = k
          slot.index = mod(k, count)
          slot.x = x
          slot.y = y
          slot.w = w
          slot.h = h
          slot.cos = Math.cos(turn)
          slot.sin = Math.sin(turn)
          slot.away = Math.abs(e)
          slot.hover = hover
          order.push(used)
          used++
        }
      }
      // Far cards first, so nearer ones land on top if the spacing makes them overlap.
      order.sort((a, b) => slots[b].away - slots[a].away)
    }

    const hitTest = (px, py) => {
      const c = live.current
      for (let i = used - 1; i >= 0; i--) {
        const s = slots[order[i]]
        const dx = px - s.x
        const dy = py - s.y
        const nx = (dx * s.cos + dy * s.sin) / s.w
        const ny = (-dx * s.sin + dy * s.cos) / s.h
        if (Math.abs(nx) <= 0.5 * (1 + c.bulgeX * (1 - 4 * ny * ny)) && Math.abs(ny) <= 0.5 * (1 + c.bulgeY * (1 - 4 * nx * nx))) return s
      }
      return null
    }

    const updateHover = (dt) => {
      const c = live.current
      const hoveredSlot = pointer && !held?.moved ? hitTest(pointer.x, pointer.y) : null
      const key = hoveredSlot ? hoveredSlot.k : null
      if (key !== hoveredKey) {
        hoveredKey = key
        const item = hoveredSlot ? c.items[hoveredSlot.index] : null
        if (!held?.moved) root.style.cursor = item?.href || (item && c.onSelect) ? 'pointer' : 'grab'
        if (item?.title && pointer?.mouse && c.cursorLabel) {
          chipText.textContent = item.title
          chipShown = true
          gsap.to(chip, {autoAlpha: 1, scale: 1, duration: 0.22, ease: 'power3.out', overwrite: 'auto'})
        } else {
          chipShown = false
          gsap.to(chip, {autoAlpha: 0, scale: 0.86, duration: 0.16, ease: 'power2.in', overwrite: 'auto'})
        }
      }
      if (key !== null && !hovers.has(key)) hovers.set(key, 0)
      const ease = 1 - Math.exp(-dt * 12)
      for (const [k, amount] of hovers) {
        const next = amount + ((k === key ? 1 : 0) - amount) * ease
        if (k !== key && next < 0.002) hovers.delete(k)
        else hovers.set(k, next)
      }
    }

    const updateVideos = () => {
      const c = live.current
      const now = performance.now()
      const gap = 1000 / Math.max(1, c.videoFps)
      const playing = c.playVideos && !still
      let budget = UPLOADS_PER_TICK
      let uploads = 0
      for (const m of media) m.seen = false
      for (let i = 0; i < used; i++) media[slots[i].index].seen = true
      for (const m of media) {
        const video = m.video
        if (!video) continue
        if (m.seen) {
          m.lastSeen = now
          if (playing && video.paused && !m.starting && !m.refused) {
            m.starting = true
            video
              .play()
              .catch(() => {
                // Low power mode and the like: it holds a still until a press allows it.
                m.refused = true
              })
              .finally(() => {
                m.starting = false
              })
          }
        }
        if (!video.paused && (!playing || now - m.lastSeen > 800)) video.pause()
        if (m.seen && (playing || !m.image) && budget > 0 && video.readyState >= 2 && video.currentTime !== m.lastTime && now - m.lastUpload >= gap) {
          upload(m, video, video.videoWidth, video.videoHeight)
          m.lastTime = video.currentTime
          m.lastUpload = now
          budget--
          uploads++
        }
      }
      return uploads
    }

    const draw = () => {
      const c = live.current
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      if (!used) return
      gl.useProgram(program)
      gl.bindVertexArray(vao)
      const pace = Math.abs(velocity)
      const warp = 1 + c.speedWarp * Math.min(1, pace / 10)
      gl.uniform2f(u.uView, W, H)
      gl.uniform2f(u.uBulge, c.bulgeX * warp, c.bulgeY * warp)
      gl.uniform1f(u.uMiddle, W / 2)
      gl.uniform1f(u.uBlurStart, c.blurStart)
      gl.uniform1f(u.uBlurRamp, Math.max(0.01, c.blurRamp))
      gl.uniform1f(u.uBlur, c.blur)
      gl.uniform1f(u.uShutter, Math.min(0.03, pace * c.shutter))
      gl.uniform1f(u.uEdgeFade, c.edgeFade)
      gl.uniform1f(u.uStreak, Math.min(1.5, 0.3 + pace * 0.15))
      gl.uniform1f(u.uFringe, c.fringe)
      gl.uniform1f(u.uGrain, c.grain)
      gl.uniform1f(u.uFrame, still ? 0 : Math.floor(filmClock * 24) % 64)
      gl.uniform1f(u.uRing, c.ring)
      gl.uniform3fv(u.uPlaceholder, rgb(c.placeholder))
      gl.uniform3fv(u.uAccent, rgb(c.accent))
      for (let i = 0; i < used; i++) {
        const s = slots[order[i]]
        const m = media[s.index]
        const textureRatio = m.width && m.height ? m.width / m.height : s.w / s.h
        const cardRatioNow = s.w / s.h
        const fitX = textureRatio > cardRatioNow ? cardRatioNow / textureRatio : 1
        const fitY = textureRatio > cardRatioNow ? 1 : textureRatio / cardRatioNow
        gl.bindTexture(gl.TEXTURE_2D, m.tex)
        gl.uniform2f(u.uCentre, s.x, s.y)
        gl.uniform2f(u.uAxis, s.cos, s.sin)
        gl.uniform2f(u.uSize, s.w, s.h)
        gl.uniform2f(u.uFit, fitX, fitY)
        gl.uniform2f(u.uFitOff, (1 - fitX) / 2, (1 - fitY) / 2)
        gl.uniform1f(u.uRadius, Math.min(c.radius * (s.h / (H * c.cardHeight)), s.w / 2, s.h / 2))
        gl.uniform1f(u.uReady, m.ready)
        gl.uniform1f(u.uHover, c.ring > 0 ? s.hover : 0)
        gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0)
      }
    }

    let alive = build()
    if (!alive) {
      root.dataset.fallback = 'true'
      return
    }
    const keyOf = (list) => list.map((item) => `${item.video}|${item.src}`).join()
    let mediaKey = keyOf(live.current.items)
    loadMedia(live.current.items)
    fit()

    const tick = (_time, delta) => {
      if (!alive || !visible) return
      const c = live.current
      const dt = Math.min(delta, 100) / 1000
      filmClock += dt
      updateHover(dt)
      const before = position
      if (held?.moved) {
        position += (held.target - position) * (1 - Math.exp(-dt * 26))
        velocity = dt ? (position - before) / dt : 0
      } else if (goal !== null) {
        position += (goal - position) * (1 - Math.exp(-dt * 7))
        velocity = dt ? (position - before) / dt : 0
        if (Math.abs(goal - position) < 0.004) goal = null
      } else {
        const aim = still ? 0 : (c.reverse ? -1 : 1) * c.speed * (hoveredKey !== null ? c.hoverSlow : 1)
        velocity += (aim - velocity) * (1 - Math.exp(-dt * c.settle))
        position += velocity * dt
      }
      let changing = needsDraw || hovers.size > 0 || position !== drawnAt
      for (const m of media) {
        if (m.loaded && m.ready < 1) {
          m.ready = Math.min(1, m.ready + dt * 3)
          changing = true
        }
      }
      layout()
      // Holding still with nothing new to show draws nothing.
      if (updateVideos() === 0 && !changing) return
      needsDraw = false
      drawnAt = position
      draw()
    }

    const chipX = gsap.quickTo(chip, 'x', {duration: 0.32, ease: 'power3.out'})
    const chipY = gsap.quickTo(chip, 'y', {duration: 0.32, ease: 'power3.out'})

    const local = (event) => {
      const box = root.getBoundingClientRect()
      return {x: event.clientX - box.left, y: event.clientY - box.top, mouse: event.pointerType !== 'touch'}
    }

    const onMove = (event) => {
      pointer = local(event)
      if (pointer.mouse) {
        const side = pointer.x > W * 0.72 ? -100 : 0
        gsap.set(chip, {xPercent: side})
        const x = pointer.x + (side ? -14 : 14)
        const y = pointer.y + 14
        // A hidden label jumps straight to the pointer instead of flying in from where it was left.
        if (chipShown) {
          chipX(x)
          chipY(y)
        } else {
          chipX(x, x)
          chipY(y, y)
        }
      }
      if (!held || event.pointerId !== held.id) return
      const dx = event.clientX - held.startX
      if (!held.moved && Math.abs(dx) > 5) {
        held.moved = true
        goal = null
        root.setPointerCapture(event.pointerId)
        root.style.cursor = 'grabbing'
      }
      if (held.moved) {
        const c = live.current
        held.target = held.from - (dx * c.dragPower) / Math.max(1, H * c.spacing)
        const now = performance.now()
        held.trail.push([now, event.clientX])
        if (held.trail.length > 24) held.trail.shift()
      }
    }

    const onDown = (event) => {
      if (event.button !== 0 || event.target.closest?.('a, button')) return
      for (const m of media) m.refused = false
      pointer = local(event)
      held = {id: event.pointerId, startX: event.clientX, from: position, target: position, moved: false, trail: [[performance.now(), event.clientX]]}
    }

    const onUp = (event) => {
      if (!held || event.pointerId !== held.id) return
      const c = live.current
      const was = held
      held = null
      if (!was.moved) {
        const s = pointer ? hitTest(pointer.x, pointer.y) : null
        if (s) {
          const item = c.items[s.index]
          c.onSelect?.(item, s.index)
          if (item.href) window.location.assign(item.href)
        }
      } else {
        root.style.cursor = 'grab'
        // Speed over the last 100ms of the drag. A pointer that stopped before letting go throws nothing.
        const now = performance.now()
        const last = was.trail[was.trail.length - 1]
        let first = last
        for (let i = was.trail.length - 1; i >= 0; i--) {
          first = was.trail[i]
          if (last[0] - first[0] >= 100) break
        }
        const span = (last[0] - first[0]) / 1000
        const rate = span > 0 && now - last[0] < 150 ? (last[1] - first[1]) / span : 0
        const thrown = (-rate * c.dragPower) / Math.max(1, H * c.spacing)
        velocity = still ? 0 : gsap.utils.clamp(-14, 14, thrown * c.throwPower)
      }
      if (event.pointerType === 'touch') pointer = null
    }

    const onCancel = (event) => {
      if (held && event.pointerId === held.id) {
        held = null
        root.style.cursor = 'grab'
      }
      if (event.pointerType === 'touch') pointer = null
    }

    const onLeave = () => {
      if (!held) pointer = null
    }

    const onLost = (event) => {
      event.preventDefault()
      alive = false
    }

    const onRestored = () => {
      alive = build()
      needsDraw = true
      for (const m of media) {
        m.tex = makeTexture()
        m.loaded = false
        m.mipped = false
        m.lastTime = -1
        if (m.image?.complete && m.image.naturalWidth) upload(m, m.image, m.image.naturalWidth, m.image.naturalHeight)
      }
    }

    root.addEventListener('pointerdown', onDown)
    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerup', onUp)
    root.addEventListener('pointercancel', onCancel)
    root.addEventListener('pointerleave', onLeave)
    canvas.addEventListener('webglcontextlost', onLost)
    canvas.addEventListener('webglcontextrestored', onRestored)
    const resize = new ResizeObserver(fit)
    resize.observe(root)
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (!visible) for (const m of media) m.video?.pause()
    })
    seen.observe(root)
    gsap.ticker.add(tick)

    engine.current = {
      sync: () => {
        const c = live.current
        const key = keyOf(c.items)
        if (key !== mediaKey) {
          mediaKey = key
          loadMedia(c.items)
        }
        fit()
      },
      show: (index) => {
        const count = media.length
        if (!count) return
        goal = index + count * Math.round((position - index) / count)
      },
      step: (direction) => {
        goal = (goal ?? position) + direction
      },
    }

    return () => {
      engine.current = {sync: () => {}, show: () => {}, step: () => {}}
      gsap.ticker.remove(tick)
      gsap.killTweensOf(chip)
      resize.disconnect()
      seen.disconnect()
      root.removeEventListener('pointerdown', onDown)
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerup', onUp)
      root.removeEventListener('pointercancel', onCancel)
      root.removeEventListener('pointerleave', onLeave)
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
      dropMedia()
      for (const buffer of buffers) gl.deleteBuffer(buffer)
      gl.deleteVertexArray(vao)
      gl.deleteProgram(program)
    }
  }, [])

  const accented = highlight && title.includes(highlight) ? title.split(highlight) : null

  return (
    <div
      ref={rootRef}
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault()
          engine.current.step(event.key === 'ArrowRight' ? 1 : -1)
        }
      }}
      style={{background, outlineColor: accent, cursor: 'grab'}}
      className={`group relative h-full w-full touch-pan-y overflow-clip outline-offset-[-3px] select-none focus-visible:outline-[3px] ${className}`}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block h-full w-full group-data-[fallback=true]:hidden" />

      {/* No WebGL2: the same media in a plain row that scrolls. */}
      <div className="absolute inset-x-0 bottom-6 hidden gap-3 overflow-x-auto px-4 group-data-[fallback=true]:flex">
        {items.map((item, index) => (
          <div key={index} className="aspect-[1.12] h-[30vh] max-h-64 shrink-0 overflow-hidden" style={{borderRadius: radius, background: placeholder}}>
            {item.src ? (
              <img src={item.src} alt={item.alt} loading="lazy" draggable={false} className="object-cover w-full h-full" />
            ) : (
              <video src={item.video} aria-label={item.alt} muted loop playsInline autoPlay preload="none" className="object-cover w-full h-full" />
            )}
          </div>
        ))}
      </div>

      {(title || kicker || children) && (
        <div
          className="absolute inset-y-0 z-10 flex flex-col items-center justify-center w-full px-4 text-center pointer-events-none"
          style={{left: `${(Math.min(0.62, Math.max(0.38, focus)) - 0.5) * 100}%`}}
        >
          {kicker && (
            <p className="mb-2 text-sm font-medium tracking-[0.14em] uppercase text-balance" style={{color: kickerColor}}>
              {kicker}
            </p>
          )}
          {title && (
            <h2
              className="max-w-full leading-[0.92] font-black tracking-[-0.01em] uppercase text-balance"
              style={{color: titleColor, fontSize: `min(calc(var(--lens-h, 800px) * ${titleSize}), calc(var(--lens-w, 1200px) * ${titleSize * 1.1}))`}}
            >
              {accented ? (
                <>
                  {accented[0]}
                  <span style={{color: accent}}>{highlight}</span>
                  {accented.slice(1).join(highlight)}
                </>
              ) : (
                title
              )}
            </h2>
          )}
          {children && <div className="mt-5 pointer-events-auto">{children}</div>}
        </div>
      )}

      <div ref={chipRef} aria-hidden="true" className="absolute top-0 left-0 z-20 invisible opacity-0 pointer-events-none">
        <span ref={chipTextRef} className="block rounded-md px-2.5 py-1.5 text-[15px] leading-none font-semibold whitespace-nowrap text-black" style={{background: accent}} />
      </div>

      {/* The cards are pixels, so this is what screen readers and the keyboard get. */}
      <ul className="absolute inset-0 z-30 list-none pointer-events-none">
        {items.map((item, index) => (
          <li key={index}>
            {item.href ? (
              <a
                href={item.href}
                onFocus={() => engine.current.show(index)}
                className="px-3 py-2 text-sm font-semibold text-black rounded-md pointer-events-auto sr-only focus:not-sr-only focus:absolute focus:bottom-4 focus:left-4"
                style={{background: accent}}
              >
                {item.title ?? item.alt}
              </a>
            ) : (
              <span className="sr-only">{item.title ? `${item.title}: ${item.alt}` : item.alt}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}