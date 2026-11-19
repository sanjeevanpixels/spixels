// Masked Title Flip by Made for Award: https://www.madeforaward.com/ui/text/title-flip-reveal
// Free and open source (MIT). If it helped, a star means a lot: https://github.com/shivc868/madeforaward-ui
'use client'

import {useRef} from 'react'
import gsap from 'gsap'
import {useGSAP} from '@gsap/react'
import {CustomEase} from 'gsap/CustomEase'
import {ScrollTrigger} from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, CustomEase, ScrollTrigger)

/**
 * Props:
 * @param {string[]} [lines]        the headline, one entry per line
 * @param {string[]} [altLines]     the second headline it flips to
 * @param {'click'|'hover'|'none'} [flipOn]  what flips it: a click (tap), hovering, or nothing
 * @param {number} [duration]       seconds for each line to rise in
 * @param {number} [stagger]        seconds between lines
 * @param {number} [delay]          seconds before the first line
 * @param {number} [scaleFrom]      the whole headline grows from this scale as the lines rise (1 = no zoom)
 * @param {number} [scaleDuration]  seconds for that zoom
 * @param {string} [ease]           GSAP ease for the lines rising in, e.g. 'expo.out'
 * @param {number} [flipDuration]   seconds for an incoming line in a flip (the rest of the flip scales with it)
 * @param {'view'|'mount'} [trigger] 'view' plays each time it scrolls into view; 'mount' once at once
 * @param {Element|string} [scroller] the scrolling element, when it isn't the window
 * @param {'h1'|'h2'|'div'} [as]
 * @param {string} [className]
 */

// fast out of the gate, a long soft landing
CustomEase.create('mfa-title-reveal', '.4,0,0,1')

// lines lean in from alternate sides
const side = (i) => (i % 2 ? '-5%' : '5%')

// A big headline whose lines rise out of masks one after another, each
// sliding in from 5% to the side (alternating left and right), on a sharp
// ease that settles slowly, while the whole headline zooms up from 45% on
// a slow-fast-slow expo curve. A click swaps it for a second headline: line
// by line the old words drop back into their masks and, a beat later,
// the new ones rise in their place; click again to swap back.
export default function TitleFlipReveal({
  lines = ['Make it', 'move with', 'purpose'],
  altLines = ['Then', 'make it', 'sing'],
  flipOn = 'click',
  duration = 1,
  stagger = 0.115,
  delay = 0.115,
  scaleFrom = 0.45,
  scaleDuration = 0.8,
  ease = 'mfa-title-reveal',
  flipDuration = 2,
  trigger = 'view',
  scroller,
  as: Tag = 'h2',
  className = '',
}) {
  const rootRef = useRef(null)
  const zoomRef = useRef(null)
  const maskRefs = useRef([])
  const altMaskRefs = useRef([])
  const lineRefs = useRef([])
  const altLineRefs = useRef([])

  useGSAP(
    (_, contextSafe) => {
      const root = rootRef.current
      const masks = maskRefs.current.slice(0, lines.length)
      const altMasks = altMaskRefs.current.slice(0, altLines.length)
      const main = lineRefs.current.slice(0, lines.length)
      const alt = altLineRefs.current.slice(0, altLines.length)
      const still = matchMedia('(prefers-reduced-motion: reduce)').matches
      gsap.set(root, {visibility: 'visible'})
      alt.forEach((el, i) => gsap.set(el, {y: '100%', x: side(i), force3D: true}))

      // the entrance: the headline zooms up while both layers' masks rise (the hidden layer's words stay tucked inside);
      // the moving layers are promoted only while it plays, so the text is crisp again once it lands
      const moving = scaleFrom < 1 ? [zoomRef.current, ...masks, ...altMasks] : [...masks, ...altMasks]
      const intro = gsap.timeline({
        paused: true,
        onStart: () => gsap.set(moving, {willChange: 'transform'}),
        onComplete: () => gsap.set(moving, {willChange: 'auto'}),
      })
      if (scaleFrom < 1)
        intro.fromTo(
          zoomRef.current,
          {scale: scaleFrom},
          {scale: 1, duration: scaleDuration, ease: 'expo.inOut', transformOrigin: '50% 50%', force3D: true},
          0,
        )
      ;[masks, altMasks].forEach((set) =>
        set.forEach((el, i) =>
          intro.fromTo(el, {y: '100%', x: side(i)}, {y: '0%', x: '0%', ease, duration, force3D: true}, delay + i * stagger),
        ),
      )
      let frame = 0
      if (still) intro.progress(1)
      // on mount, wait for the fonts and one quiet frame so the first frames aren't fighting hydration
      else if (trigger === 'mount')
        document.fonts.ready.then(contextSafe(() => (frame = requestAnimationFrame(() => intro.play()))))
      else
        ScrollTrigger.create({
          trigger: root,
          scroller,
          start: 'top bottom',
          onEnter: () => intro.restart(true),
          onLeaveBack: () => intro.pause(0),
        })

      let flipped = false
      let flip = null
      const swap = contextSafe((to) => {
        if (to === flipped) return
        flipped = to
        flip?.kill()
        const [out, into, outSide] = to ? [main, alt, side] : [alt, main, (i) => (i % 2 ? '5%' : '-5%')]
        // promoted only while it plays; everything scales with flipDuration
        const tl = gsap.timeline({
          onStart: () => gsap.set([...out, ...into], {willChange: 'transform'}),
          onComplete: () => gsap.set([...out, ...into], {willChange: 'auto'}),
        })
        const k = still ? 0 : flipDuration
        out.forEach((el, i) =>
          tl.to(el, {y: '100%', x: outSide(i), ease: 'power3.in', duration: 0.6 * k, force3D: true}, i * 0.05 * k),
        )
        // the new lines start only once the last old one has dropped out of sight
        const gone = (0.6 + (out.length - 1) * 0.05) * k
        into.forEach((el, i) => tl.to(el, {y: '0%', x: '0%', ease, duration: k, force3D: true}, gone + i * 0.05 * k))
        flip = tl
      })

      const click = () => swap(!flipped)
      const enter = () => swap(true)
      const leave = () => swap(false)
      if (flipOn === 'click') root.addEventListener('click', click)
      else if (flipOn === 'hover') {
        root.addEventListener('pointerenter', enter)
        root.addEventListener('pointerleave', leave)
      }
      return () => {
        cancelAnimationFrame(frame)
        root.removeEventListener('click', click)
        root.removeEventListener('pointerenter', enter)
        root.removeEventListener('pointerleave', leave)
      }
    },
    {
      scope: rootRef,
      dependencies: [lines.join('\n'), altLines.join('\n'), flipOn, duration, stagger, delay, scaleFrom, scaleDuration, ease, flipDuration, trigger, scroller],
      revertOnUpdate: true,
    },
  )

  const layer = (words, masksRef, wordsRef) =>
    words.map((word, i) => (
      // the outer span is the fixed mask; the middle one rises in on entrance; the inner one flips
      <span key={i} className="block overflow-hidden">
        <span
          ref={(el) => {
            if (el) masksRef.current[i] = el
          }}
          className="block overflow-hidden [backface-visibility:hidden]"
        >
          <span
            ref={(el) => {
              if (el) wordsRef.current[i] = el
            }}
            className="block [backface-visibility:hidden]"
          >
            {word}
          </span>
        </span>
      </span>
    ))

  return (
    <Tag
      ref={rootRef}
      aria-label={lines.join(' ')}
      className={`relative ${flipOn === 'click' ? 'cursor-pointer select-none' : ''} ${className}`}
      // hidden until the masks are set, so the words never flash in place on load
      style={{visibility: 'hidden'}}
    >
      <span ref={zoomRef} className="relative block">
        <span aria-hidden className="relative z-2 block [contain:paint]">
          {layer(lines, maskRefs, lineRefs)}
        </span>
        <span aria-hidden className="absolute top-1/2 left-1/2 block w-full -translate-x-1/2 -translate-y-1/2">
          {layer(altLines, altMaskRefs, altLineRefs)}
        </span>
      </span>
    </Tag>
  )
}