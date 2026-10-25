// Fade-up reveal for elements entering the viewport. Call inside a gsap.matchMedia / useGSAP
// context so it is reverted automatically (elements return to fully visible).
import { duration, ease, stagger } from '../design/motion.ts'
import { gsap, ScrollTrigger } from '../lib/gsap.ts'

// `start` defaults to the element entering the viewport. A line higher up the screen (e.g. 'top 90%')
// can never be reached by elements near the very end of the page, which would then stay hidden.
export function revealOnScroll(elements: Element[], { y = 28, start = 'top bottom' } = {}) {
  if (!elements.length) return
  // Hidden up front so nothing shows, vanishes, then fades in as it crosses the trigger line.
  gsap.set(elements, { y, autoAlpha: 0 })
  ScrollTrigger.batch(elements, {
    start,
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { y: 0, autoAlpha: 1, duration: duration.slow, ease: ease.standard, stagger: stagger.tight, overwrite: true }),
  })
}
