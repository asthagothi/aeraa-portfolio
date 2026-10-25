// Smooth, inertial page scrolling (Lenis), driven by GSAP's ticker so ScrollTrigger scenes read
// exactly the position being drawn. Wheel and trackpad input glide (lerp 0.07: each frame closes
// ~7% of the remaining distance, the feel of the reference site); touch stays native, as do
// keyboard, scrollbar and find-in-page, which Lenis follows. Off with reduced motion.
//
// Every scripted scroll on the site goes through `scrollToY` / `scrollToElement`, so smooth and
// instant jumps both cooperate with Lenis (a raw window.scrollTo during a glide would be undone).
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { prefersReducedMotion } from '../design/motion.ts'
import { gsap, ScrollTrigger } from './gsap.ts'

let lenis: Lenis | null = null

const tick = (time: number) => lenis?.raf(time * 1000)

function start() {
  if (lenis) return
  lenis = new Lenis({
    lerp: 0.07,
    smoothWheel: true,
    // Scroll areas that must keep their own native scrolling (the image viewer).
    prevent: (node) => node instanceof Element && !!node.closest('dialog, [data-lenis-prevent]'),
  })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(tick)
  // Lenis already smooths; GSAP's lag smoothing would make scenes jump after a long frame.
  gsap.ticker.lagSmoothing(0)
}

function stop() {
  if (!lenis) return
  gsap.ticker.remove(tick)
  gsap.ticker.lagSmoothing(500, 33)
  lenis.destroy()
  lenis = null
}

/** Starts smooth scrolling (unless reduced motion is preferred) and follows changes to that preference. */
export function initSmoothScroll() {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  const sync = () => (query.matches ? stop() : start())
  sync()
  query.addEventListener('change', sync)
}

/** Scrolls the page to `y`: a glide when `smooth` (and motion is allowed), otherwise a jump. */
export function scrollToY(y: number, { smooth = true }: { smooth?: boolean } = {}) {
  const glide = smooth && !prefersReducedMotion()
  // Lenis clamps targets to the page height it last measured; pages (and pin spacers) may have
  // grown since, e.g. right after a route change, so measure first.
  lenis?.resize()
  if (lenis) lenis.scrollTo(y, glide ? { duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) } : { immediate: true, force: true })
  else window.scrollTo({ top: y, behavior: glide ? 'smooth' : 'auto' })
}

/** Scrolls so `el` sits at the top (or the middle) of the viewport. */
export function scrollToElement(el: Element, { smooth = true, block = 'start' }: { smooth?: boolean; block?: 'start' | 'center' } = {}) {
  const r = el.getBoundingClientRect()
  // At the top, respect the element's scroll-margin-top (e.g. room for the fixed nav), as native anchors do.
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0
  const y = window.scrollY + r.top - (block === 'center' ? (window.innerHeight - r.height) / 2 : margin)
  scrollToY(Math.max(0, y), { smooth })
}
