// Turns a SceneMotion config into a pinned, scrubbed GSAP timeline.
// No React state is touched per frame: GSAP writes transforms directly.
import { gsap } from '../lib/gsap.ts'
import type { CardMotion, Pose, SceneMotion } from './types.ts'

type Options = {
  /** Element that is pinned and whose size defines the % coordinate space. */
  stage: HTMLElement
  /** Element that drives the ScrollTrigger (usually the scene section). */
  trigger: HTMLElement
  /** Card elements, in the same order as `motion.cards`. */
  cards: HTMLElement[]
  motion: SceneMotion
}

/** Convert a Pose into GSAP vars. x/y are functions so they recompute on resize. */
function poseVars(pose: Pose, stage: HTMLElement): gsap.TweenVars {
  return {
    // Cards are anchored at the stage centre; xPercent/yPercent centre them on that point.
    xPercent: -50,
    yPercent: -50,
    x: () => (pose.x / 100) * stage.clientWidth,
    y: () => (pose.y / 100) * stage.clientHeight,
    rotation: pose.rotate ?? 0,
    rotationX: pose.rotateX ?? 0,
    rotationY: pose.rotateY ?? 0,
    scale: pose.scale ?? 1,
    autoAlpha: pose.opacity ?? 1,
  }
}

function addCard(tl: gsap.core.Timeline, el: HTMLElement, card: CardMotion, stage: HTMLElement) {
  const via = card.via ?? []
  // Waypoints take 55% of the entrance; the settle takes the rest and decelerates.
  const pathShare = via.length ? 0.55 : 0
  const segments = [
    ...via.map((pose) => ({
      pose,
      duration: (card.duration * pathShare) / via.length,
      ease: card.pathEase ?? 'sine.inOut',
    })),
    { pose: card.to, duration: card.duration * (1 - pathShare), ease: card.ease ?? 'power3.out' },
  ]

  // The first segment is a fromTo with immediateRender so the off-stage pose applies before
  // the card's start time, scrubbing backwards restores it, and reverting clears it cleanly.
  segments.forEach((seg, i) => {
    const vars = { ...poseVars(seg.pose, stage), duration: seg.duration, ease: seg.ease }
    if (i === 0) {
      tl.fromTo(el, { ...poseVars(card.from, stage), zIndex: card.z }, { ...vars, immediateRender: true }, card.start)
    } else {
      tl.to(el, vars, '>')
    }
  })

  if (card.exit) {
    tl.to(
      el,
      { ...poseVars(card.exit, stage), duration: card.exitDuration ?? 0.2, ease: 'power2.in' },
      card.exitStart ?? 1 - (card.exitDuration ?? 0.2),
    )
  }
}

/** Builds the scene. Call inside a gsap.context / useGSAP so it is reverted on unmount. */
export function createFlyingCardScene({ stage, trigger, cards, motion }: Options) {
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger,
      start: 'top top',
      end: () => `+=${motion.scrollLength * window.innerHeight}`,
      pin: stage,
      scrub: motion.scrub,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  })

  motion.cards.forEach((card, i) => {
    const el = cards[i]
    if (el) addCard(tl, el, card, stage)
  })

  // Pad the timeline to exactly 1 so `start`/`duration` read as fractions of the scroll.
  if (tl.duration() < 1) tl.to({}, { duration: 1 - tl.duration() })

  return tl
}
