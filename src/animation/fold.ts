// Foldable-device choreography for the home page: ONE timeline, driven by ONE value — the page's
// scroll progress through the pinned section. Durations are in page-scroll pixels, so during the
// inside phase one pixel of page scrolling moves the screen's content by exactly one pixel.
// Every input (mouse wheel, trackpad, touch, keyboard, scrollbar) just scrolls the page, and
// scrolling back reverses the timeline exactly. There is no nested scroll area and no wheel
// interception.
//
// The device is always laid out at its open (tablet) size. While folded, only its right half shows,
// covered by the `cover`: a page hinged on the device's centre line. Its front face is the outer
// (phone) screen; its back face is the left half of the inner screen.
//
//   unfold  — the cover swings open 180° like a book page while the device slides to centre
//   inside  — the screen's content scrolls (translateY) through every section
//   fold    — the screen goes dark, the cover swings shut and the outer screen rings (incoming call)
import { gsap } from '../lib/gsap.ts'

export type FoldElements = {
  trigger: HTMLElement
  stage: HTMLElement
  device: HTMLElement
  /** The open device (frame + inner screen). Clipped to its right half while folded. */
  body: HTMLElement
  /** The screen (fixed size, clips the content). */
  screen: HTMLElement
  /** The screen's content: one tall column, moved with translateY. */
  content: HTMLElement
  dock: HTMLElement
  /** Hinge crease on the screen; only visible around the fold. */
  crease: HTMLElement
  /** The hinged page and its two faces. */
  cover: HTMLElement
  shadeFront: HTMLElement
  shadeBack: HTMLElement
  /** Back face layers: a copy of the opening screen, and a dark "screen off" layer. */
  backCopy: HTMLElement
  backBlank: HTMLElement
  /** Front face layers. */
  lock: HTMLElement
  call: HTMLElement
}

export type FoldGeometry = { w: number; h: number }

export type FoldLayout = {
  timeline: gsap.core.Timeline
  /** Scroll offset (px from the trigger's top) where the content starts scrolling. */
  contentStart: number
  /** How far the content scrolls inside the screen. */
  contentTravel: number
  /** Scroll offset where the device starts folding shut. */
  foldStart: number
  total: number
}

/** Frame thickness in px: metal rim + black glass (kept in step with --bezel in FoldHome.module.css). */
export const BEZEL = 10

/** Open-device size: as large as the viewport allows, leaving room for the nav and the controls. */
export function measureGeometry(): FoldGeometry {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const h = Math.round(Math.min(vh * 0.8, 860))
  // Even width, so the two halves meet on a whole pixel.
  const w = Math.round(Math.min(vw * 0.78, h * 1.5) / 2) * 2
  return { w, h }
}

export function createFoldTimeline(el: FoldElements, geo: FoldGeometry, onScroll?: (px: number) => void, scrub = 0.6): FoldLayout {
  const vh = window.innerHeight
  const half = geo.w / 2
  // Measured from the real layout: the content's box height minus the visible screen. (Not
  // scrollHeight: elements still waiting to reveal sit offset below their slot and would inflate it.)
  const contentTravel = Math.max(0, Math.ceil(el.content.offsetHeight - el.screen.clientHeight))

  const UNFOLD = Math.round(vh * 1.0)
  const HOLD_OPEN = Math.round(vh * 0.15)
  const HOLD_END = Math.round(vh * 0.15)
  const FOLD = Math.round(vh * 1.0)
  const HOLD_CALL = Math.round(vh * 0.3)
  const total = UNFOLD + HOLD_OPEN + contentTravel + HOLD_END + FOLD + HOLD_CALL

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: el.trigger,
      start: 'top top',
      end: `+=${total}`,
      pin: el.stage,
      // Pre-applies the pin a frame early, so the stage doesn't jump as it locks in place.
      anticipatePin: 1,
      // Light smoothing between scroll and timeline; the timeline is always a pure function of
      // scroll position, so fast flicks and reversals land exactly where they should.
      scrub,
      invalidateOnRefresh: true,
      onUpdate: onScroll ? (self) => onScroll(self.scroll() - self.start) : undefined,
    },
  })

  // Rounded like the phone, so the body's corners never peek out behind the cover's rounded ones.
  const radius = parseFloat(getComputedStyle(el.body).borderTopLeftRadius) || 0
  const folded = `inset(0px 0px 0px ${half}px round ${radius}px)`
  // Open: no clip at all (the frame and screen are already rounded); a clip-path left on the
  // device would force repaints of the whole clipped area as the content moves.
  const open = 'none'

  // Folded: the right half is centred on screen, under the cover.
  tl.set(el.device, { x: -half / 2 }, 0)
    .set(el.body, { clipPath: folded }, 0)
    .set(el.cover, { rotationY: 0, autoAlpha: 1, transformOrigin: '0% 50%' }, 0)
    .set(el.shadeFront, { opacity: 0 }, 0)
    .set(el.shadeBack, { opacity: 0.45 }, 0)
    .set(el.backCopy, { autoAlpha: 1 }, 0)
    .set(el.backBlank, { autoAlpha: 0 }, 0)
    .set(el.lock, { autoAlpha: 1 }, 0)
    .set(el.call, { autoAlpha: 0 }, 0)
    .set(el.crease, { opacity: 1 }, 0)
    // Content and dock fade with opacity only, so their links stay in the tab order while folded
    // (focusing one scrolls the page there, which unfolds the device).
    .set(el.content, { y: 0, opacity: 1 }, 0)
    .set(el.dock, { opacity: 0 }, 0)

  // Unfold: the page swings open; its back face lands exactly over the body's left half. It starts
  // the moment the stage pins, continuing the hand-off movement (see FoldHome) with no pause.
  let t = 0
  const swing = UNFOLD * 0.8
  tl.to(el.cover, { rotationY: -180, duration: swing, ease: 'power2.inOut' }, t)
    .to(el.device, { x: 0, duration: swing, ease: 'power2.inOut' }, t)
    // Light falls off as each face turns away from the viewer.
    .to(el.shadeFront, { opacity: 0.5, duration: swing / 2, ease: 'power1.in' }, t)
    .to(el.shadeBack, { opacity: 0, duration: swing / 2, ease: 'power1.out' }, t + swing / 2)
    // Swap the landed page for the real left half.
    .set(el.body, { clipPath: open }, t + UNFOLD * 0.86)
    .set(el.cover, { autoAlpha: 0 }, t + UNFOLD * 0.86)
    .fromTo(el.dock, { opacity: 0, yPercent: 60 }, { opacity: 1, yPercent: 0, duration: UNFOLD * 0.12, ease: 'power2.out', immediateRender: false }, t + UNFOLD * 0.86)
    // The crease belongs to the fold; it fades once open so it never runs through text.
    .to(el.crease, { opacity: 0, duration: UNFOLD * 0.1 }, t + UNFOLD * 0.88)

  // Inside the screen: the content scrolls 1:1 with the page.
  t += UNFOLD + HOLD_OPEN
  const contentStart = t
  tl.fromTo(el.content, { y: 0 }, { y: -contentTravel, duration: Math.max(contentTravel, 1), immediateRender: false }, t)

  // Fold shut: screen off, swap in the page (dark on both faces), swing it closed, then ring.
  t += contentTravel + HOLD_END
  const foldStart = t
  const off = FOLD * 0.15
  const swingBack = FOLD * 0.65
  tl.to([el.content, el.dock], { opacity: 0, duration: off }, t)
    .to(el.crease, { opacity: 1, duration: off }, t)
    .set(el.backCopy, { autoAlpha: 0 }, t + off)
    .set(el.backBlank, { autoAlpha: 1 }, t + off)
    .set(el.lock, { autoAlpha: 0 }, t + off)
    .set(el.shadeBack, { opacity: 0 }, t + off)
    .set(el.shadeFront, { opacity: 0.5 }, t + off)
    .set(el.cover, { autoAlpha: 1 }, t + off)
    .set(el.body, { clipPath: folded }, t + off)
    .to(el.cover, { rotationY: 0, duration: swingBack, ease: 'power2.inOut' }, t + off + FOLD * 0.02)
    .to(el.device, { x: -half / 2, duration: swingBack, ease: 'power2.inOut' }, t + off + FOLD * 0.02)
    .to(el.shadeBack, { opacity: 0.45, duration: swingBack / 2, ease: 'power1.in' }, t + off + FOLD * 0.02)
    .to(el.shadeFront, { opacity: 0, duration: swingBack / 2, ease: 'power1.out' }, t + off + FOLD * 0.02 + swingBack / 2)
    .to(el.call, { autoAlpha: 1, duration: FOLD * 0.15 }, t + FOLD * 0.85)

  t += FOLD
  tl.to({}, { duration: HOLD_CALL }, t)

  return { timeline: tl, contentStart, contentTravel, foldStart, total }
}
