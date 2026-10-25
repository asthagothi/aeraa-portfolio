// Scroll-linked collage choreography for the work page.
// Slide k is fully formed at timeline position k. Between k and k+1:
//   - the next artwork wipes up over the current one inside the fixed central frame (the anchor),
//   - titles slide out / in,
//   - slide k's fragments drift left and fade while slide k+1's drift in from the right,
//     so the band of fragments reads as one continuous, coordinated movement.
import { gsap } from '../lib/gsap.ts'

export type CollageFragmentPose = { x: number; y: number; rotate: number }

type Options = {
  trigger: HTMLElement
  stage: HTMLElement
  /** Per slide, in order. */
  slides: {
    primary: HTMLElement
    primaryImage: HTMLElement | null
    title: HTMLElement
    fragments: { el: HTMLElement; pose: CollageFragmentPose }[]
  }[]
  scrub?: number
  onActiveChange?: (index: number) => void
}

/** Horizontal drift (in % of stage width) for fragments entering / leaving. */
const DRIFT = 16

export function createCollageTimeline({ trigger, stage, slides, scrub = 0.6, onActiveChange }: Options) {
  const n = slides.length
  const px = (pct: number, axis: 'x' | 'y') => () => (pct / 100) * (axis === 'x' ? stage.clientWidth : stage.clientHeight)
  let active = -1

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger,
      start: 'top top',
      end: 'bottom bottom',
      scrub,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const i = Math.round(self.progress * (n - 1))
        if (i !== active) {
          active = i
          onActiveChange?.(i)
        }
      },
    },
  })

  slides.forEach((slide, k) => {
    // Central artwork: wipe up from the bottom, image settles from a slight zoom.
    if (k > 0) {
      tl.fromTo(slide.primary, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power2.inOut', immediateRender: true }, k - 0.75)
      if (slide.primaryImage) tl.fromTo(slide.primaryImage, { scale: 1.14 }, { scale: 1, duration: 0.75, ease: 'power2.out', immediateRender: true }, k - 0.75)
    }

    // Title
    if (k > 0) tl.fromTo(slide.title, { yPercent: 70, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.25, ease: 'power2.out', immediateRender: true }, k - 0.32)
    if (k < n - 1) tl.fromTo(slide.title, { yPercent: 0, autoAlpha: 1 }, { yPercent: -70, autoAlpha: 0, duration: 0.25, ease: 'power2.in', immediateRender: false }, k + 0.07)

    // Fragments
    slide.fragments.forEach(({ el, pose }, i) => {
      const centre = { xPercent: -50, yPercent: -50 }
      const formed = { ...centre, x: px(pose.x, 'x'), y: px(pose.y, 'y'), rotate: pose.rotate, autoAlpha: 1, scale: 1 }
      const enterFrom = { ...centre, x: px(pose.x + DRIFT, 'x'), y: px(pose.y, 'y'), rotate: pose.rotate + 8, autoAlpha: 0, scale: 0.92 }
      const exitTo = { ...centre, x: px(pose.x - DRIFT, 'x'), y: px(pose.y, 'y'), rotate: pose.rotate - 6, autoAlpha: 0, scale: 0.92 }
      const stagger = i * 0.035
      if (k === 0) gsap.set(el, formed)
      else tl.fromTo(el, enterFrom, { ...formed, duration: 0.55, ease: 'power2.out', immediateRender: true }, k - 0.8 + stagger)
      if (k < n - 1) tl.fromTo(el, formed, { ...exitTo, duration: 0.55, ease: 'power2.in', immediateRender: false }, k + 0.1 + stagger)
    })
  })

  // Exactly n − 1 units long so position k maps to slide k.
  if (tl.duration() < n - 1) tl.to({}, { duration: n - 1 - tl.duration() })
  onActiveChange?.(0)
  return tl
}
