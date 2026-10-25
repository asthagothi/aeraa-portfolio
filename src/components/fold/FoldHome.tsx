// Home, second half (below the hero) — a foldable device in front of a giant name. Scroll swings the phone open like a book into a
// tablet, scrolls its screen through the work, then folds it shut into an incoming call.
//
// Modes: `scene` (pinned choreography, large screens, motion allowed) and the default static flow
// (phones, short screens, reduced motion, no JS), where the same content reads as a normal page:
// lock screen card, sections, call screen card.
import { useEffect, useRef, useState } from 'react'
import { BEZEL, createFoldTimeline, measureGeometry, type FoldLayout } from '../../animation/fold.ts'
import { PORTRAIT_SIZES, portraitCutout, portraitPhoto } from '../hero/portrait.ts'
import { sections } from '../../config/site.ts'
import { backdrops, call, cta, elsewhere, finishes, identity, notifications, services, stats, statsNote, toolGroups } from '../../content/home.ts'
import { motionQuery, prefersReducedMotion } from '../../design/motion.ts'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap.ts'
import { scrollToElement, scrollToY } from '../../lib/smoothScroll.ts'
import { useCopy } from '../../lib/useCopy.ts'
import { registerHashTarget } from '../../router/hashTargets.ts'
import { Link } from '../../router/Router.tsx'
import styles from './FoldHome.module.css'
import FallText from './FallText.tsx'
import QuestionWheel from './QuestionWheel.tsx'
import { turnWheel } from './wheel.ts'
import SelectedWork from './SelectedWork.tsx'

type Target = 'home' | 'about' | 'work' | 'services' | 'contact'
type Finish = (typeof finishes)[number]['id']
type Backdrop = (typeof backdrops)[number]['id']

const dockItems: { id: Target; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'services', label: 'What I do' },
  { id: 'contact', label: 'Contact' },
]

/** Per-viewer preference; storage can be unavailable (private mode), so failures are ignored. */
function usePreference<T extends string>(key: string, allowed: readonly T[], fallback: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key) as T | null
      return stored && allowed.includes(stored) ? stored : fallback
    } catch {
      return fallback
    }
  })
  const update = (next: T) => {
    setValue(next)
    try {
      window.localStorage.setItem(key, next)
    } catch {
      /* not persisted */
    }
  }
  return [value, update] as const
}

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])
  return { iso: now.toISOString(), label: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}` }
}

function StatusBar({ time }: { time: string }) {
  return (
    <div className={styles.status} aria-hidden="true">
      <span>{time}</span>
      <span className={styles.statusRight}>
        5G <span className={styles.battery} />
      </span>
    </div>
  )
}

/** The opening screen. Rendered twice in scene mode: the real one, and a decorative copy on the cover's back face. */
function HomeScreen({ decorative = false, go }: { decorative?: boolean; go?: (t: Target) => void }) {
  // The hero above owns the page's h1.
  const Name = decorative ? 'p' : 'h2'
  return (
    <section className={styles.home} data-section={decorative ? undefined : 'home'} aria-labelledby={decorative ? undefined : 'home-title'}>
      <div className={styles.homeText}>
        <p className={styles.eyebrow} data-drop={decorative ? undefined : 'label'}>
          {identity.eyebrow}
        </p>
        <Name id={decorative ? undefined : 'home-title'} className={styles.homeName} data-drop={decorative ? undefined : 'letters'}>
          {decorative ? identity.name : <FallText text={identity.name} />}
        </Name>
        <p className={styles.homeIntro} data-drop={decorative ? undefined : ''}>
          {identity.intro}
        </p>
        <div className={styles.actions} data-drop={decorative ? undefined : 'row'}>
          <button type="button" className={styles.primaryBtn} onClick={() => go?.('work')}>
            See the work <span aria-hidden="true">↗</span>
          </button>
          <button type="button" className={styles.secondaryBtn} onClick={() => go?.('contact')}>
            Say hello
          </button>
        </div>
      </div>
      <div className={styles.homePortrait}>
        <img
          src={portraitPhoto.src}
          srcSet={portraitPhoto.srcSet}
          sizes={PORTRAIT_SIZES}
          alt={decorative ? '' : 'Portrait of Aeraa seated among retro computers and a video camera.'}
        />
      </div>
    </section>
  )
}

/**
 * Distance from the top of `ancestor` to `el` in layout space (offsetTop chain). Unlike
 * getBoundingClientRect it ignores transforms, so it stays correct while the device is tilted and
 * scaled during the hand-off, or the content is translated.
 */
function offsetWithin(el: HTMLElement, ancestor: HTMLElement) {
  let y = 0
  for (let n: HTMLElement | null = el; n && n !== ancestor; n = n.offsetParent as HTMLElement | null) y += n.offsetTop
  return y
}

/** Line icons for the link cards, drawn in the text colour (restrained, not brand marks). */
function SocialIcon({ name }: { name: string }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, className: styles.linkIcon }
  switch (name) {
    case 'YouTube':
      return (
        <svg {...common}>
          <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
          <path d="m10 9.2 5 2.8-5 2.8z" fill="currentColor" />
        </svg>
      )
    case 'Instagram':
      return (
        <svg {...common}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'Pinterest':
      return (
        <svg {...common}>
          <path d="M12 21.5c-1-3 0-6 .9-9.5" />
          <path d="M9.6 14.6C7.6 13.9 6.5 12 6.5 10a5.5 5.5 0 1 1 11 0c0 3.2-1.9 5.4-4.1 5.4-1.2 0-2-.8-1.8-2" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <path d="M14.5 4.5 19.5 9.5 11 18l-5 1 1-5z" />
          <path d="m12.8 6.2 5 5" />
        </svg>
      )
  }
}

/** The outer screen once folded again: an "incoming call" that asks to talk, with real actions. */
function CallScreen() {
  const { copied, copy } = useCopy(call.email)
  return (
    <section className={styles.call} data-call aria-labelledby="call-title" data-drop="screen">
      <p className={styles.callStatus}>
        <span className={styles.callPulse} aria-hidden="true" />
        {call.status}
      </p>
      <h2 id="call-title" className={styles.callName}>
        {call.caller}
      </h2>
      <p className={styles.callLine}>{call.line}</p>
      <img className={styles.callAvatar} src={portraitPhoto.src} srcSet={portraitPhoto.srcSet} sizes={PORTRAIT_SIZES} alt="" width={160} height={160} />
      {call.email ? (
        <div className={styles.callActions}>
          <a className={styles.callPrimary} href={`mailto:${call.email}?subject=${encodeURIComponent('Hello Astha')}`}>
            {call.action} <span aria-hidden="true">↗</span>
          </a>
          <button type="button" className={styles.callSecondary} onClick={copy}>
            {copied ? 'Copied ✓' : 'Copy email'}
          </button>
          <span className="visually-hidden" aria-live="polite">
            {copied ? 'Email address copied' : ''}
          </span>
        </div>
      ) : (
        <p className={styles.callLine}>{call.emailPending}</p>
      )}
      {call.email && <p className={styles.callEmail}>{call.email}</p>}
    </section>
  )
}

export default function FoldHome() {
  const root = useRef<HTMLDivElement>(null)
  const layout = useRef<FoldLayout | null>(null)
  /** Section offsets inside the screen content, measured on each build (for the dock's active item). */
  const offsets = useRef<{ id: Target; top: number }[]>([])
  /** A content jump (e.g. "/#what-i-do") asked for while the scene is still being built or settling.
   * Each (re)build in the next few seconds places it again, so it lands right however late the layout
   * settles; any scroll input of the visitor's own cancels it. */
  const pendingJump = useRef<{ el: HTMLElement; until: number } | null>(null)

  /** Scrolls the page so `el` (inside the screen content) sits near the top of the screen. */
  const scrollToContent = (el: HTMLElement, smooth = true) => {
    const l = layout.current
    const st = l?.timeline.scrollTrigger
    if (!l || !st) return false
    const content = root.current!.querySelector<HTMLElement>('[data-content]')!
    const offset = offsetWithin(el, content)
    const y = Math.min(Math.max(offset - 40, 0), l.contentTravel)
    const target = Math.round(st.start + l.contentStart + y)
    scrollToY(target, { smooth })
    if (!smooth) {
      // An instant jump: put the scene in its final state now, rather than letting the scrubbed
      // animations (the unfold, the hand-off, the backdrop) catch up and replay on the way.
      ScrollTrigger.update()
      for (const t of ScrollTrigger.getAll()) t.getTween()?.progress(1)
      // The hero hand-off tween also styles the device (lowered and tilted, its pose before the
      // unfold); finishing it above drew that pose last. Re-render the scene's timeline last, forced
      // (an unchanged time would otherwise skip the render), so the open phone wins.
      l.timeline.progress((target - st.start) / (st.end - st.start))
      l.timeline.render(l.timeline.totalTime(), true, true)
    }
    return true
  }
  /** Places a pending content jump, if one is still fresh. Returns true when it did. */
  const replayPendingJump = () => {
    const p = pendingJump.current
    if (!p || performance.now() > p.until) {
      pendingJump.current = null
      return false
    }
    return scrollToContent(p.el, false)
  }

  const [active, setActive] = useState<Target>('home')
  const [finish, setFinish] = usePreference<Finish>('aeraa-finish', finishes.map((f) => f.id), 'chocopie')
  const [backdrop, setBackdrop] = usePreference<Backdrop>('aeraa-backdrop', backdrops.map((b) => b.id), 'basic')
  const clock = useClock()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(motionQuery.fold, () => {
        const el = root.current!
        const q = <T extends HTMLElement>(sel: string) => el.querySelector<T>(sel)!
        el.dataset.mode = 'scene'

        const content = q('[data-content]')
        const screen = q('[data-screen]')
        // The screen clips its content but never scrolls: the timeline alone positions the content.
        // Focusing a link inside it makes the browser scroll the clipped box; undo that at once
        // (onFocus below scrolls the page to the link instead).
        const pinScreen = () => {
          if (screen.scrollTop || screen.scrollLeft) screen.scrollTo(0, 0)
        }
        screen.addEventListener('scroll', pinScreen, { passive: true })

        /** Dock highlight from the scroll position alone: the call screen once folding starts, otherwise the section in view. */
        const onScroll = (px: number) => {
          const l = layout.current
          if (!l) return
          let next: Target = 'home'
          if (px >= l.foldStart) next = 'contact'
          else {
            const scrolled = Math.min(Math.max(px - l.contentStart, 0), l.contentTravel)
            // At the end of the content everything left on screen counts (the last section is short).
            const y = scrolled + screen.clientHeight * (scrolled >= l.contentTravel ? 1 : 0.4)
            for (const o of offsets.current) if (o.top <= y) next = o.id
          }
          // Only a change re-renders (at most a few times per pass), never every scroll frame.
          setActive((prev) => (prev === next ? prev : next))
        }

        const build = () => {
          const geo = measureGeometry()
          el.style.setProperty('--device-w', `${geo.w}px`)
          el.style.setProperty('--device-h', `${geo.h}px`)
          el.style.setProperty('--screen-h', `${geo.h - 2 * BEZEL}px`)
          // Offsets in layout space (see offsetWithin), so the device's transforms can't skew them.
          offsets.current = [...content.querySelectorAll<HTMLElement>('[data-section]')].map((s) => ({ id: s.dataset.section as Target, top: offsetWithin(s, content) }))
          layout.current = createFoldTimeline(
            {
              trigger: el,
              stage: q('[data-stage]'),
              device: q('[data-device]'),
              body: q('[data-body]'),
              screen,
              content,
              dock: q('[data-dock]'),
              crease: q('[data-crease]'),
              cover: q('[data-cover]'),
              shadeFront: q('[data-shade-front]'),
              shadeBack: q('[data-shade-back]'),
              backCopy: q('[data-back-copy]'),
              backBlank: q('[data-back-blank]'),
              lock: q('[data-lock]'),
              call: q('[data-call]'),
            },
            geo,
            onScroll,
          )
        }
        build()

        // Hand-off from the hero. Over the last screen of scrolling before the stage pins (and a
        // quarter-screen beyond), the phone rises, straightens and grows into place while the seam
        // (the hero's floor colour) dissolves into the backdrop. The phone's on-screen position
        // follows one curve, P = A·(1 − u)^K, across the whole range: it never moves above its
        // section (no clipping), and it arrives with zero speed instead of braking when the pin
        // engages, by which time the unfold has already begun. The hero's own recession is in
        // HeroSection. Only y / scale / rotationX, which the fold timeline never touches.
        const device = q('[data-device]')

        const OVERLAP = 0.25 // of the viewport height, past the pin
        const START = 0.32 // the phone starts this far (× viewport height) below its slot
        const K = 1.6
        const settle = { u: 0 }
        const place = () => {
          const u = settle.u
          const vh = window.innerHeight
          // Where the section's top is, relative to its pinned position, at this progress.
          const sectionTop = Math.max(0, 1 - (1 + OVERLAP) * u)
          const eased = 1 - Math.pow(1 - u, 2)
          gsap.set(device, {
            y: vh * ((1 + START) * Math.pow(1 - u, K) - sectionTop),
            scale: 0.84 + 0.16 * eased,
            rotationX: 16 * (1 - eased),
            transformPerspective: 1800,
            transformOrigin: '50% 100%',
          })
        }
        const pinAt = 1 / (1 + OVERLAP)
        const enter = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: () => `+=${Math.round(window.innerHeight * (1 + OVERLAP))}`,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
        enter
          .fromTo(settle, { u: 0 }, { u: 1, duration: 1, onUpdate: place, immediateRender: true }, 0)
          .fromTo(q('[data-name]'), { yPercent: 18, scale: 0.94 }, { yPercent: 0, scale: 1, ease: 'power1.out', duration: pinAt }, 0)
          .fromTo(q('[data-seam]'), { opacity: 1 }, { opacity: 0, ease: 'power1.in', duration: pinAt * 0.85 }, pinAt * 0.15)
          // The lock screen's wallpaper settles from a slight zoom as the phone arrives (depth).
          .fromTo(q('[data-wallpaper-depth]'), { scale: 1.1 }, { scale: 1, ease: 'power2.out', duration: 1 }, 0)
        place()

        // On every refresh the hand-off re-initialises (invalidateOnRefresh, immediateRender), which
        // draws its starting pose (the phone lowered and tilted) without moving its playhead, so
        // nothing redraws it until the scroll changes. A jump or a rebuild would then leave the phone
        // under the screen. Redraw both at their current times: the hand-off, then the scene on top.
        const reassert = () => {
          enter.render(enter.totalTime(), true, true)
          place() // its onUpdate, which the suppressed render above skips
          const l = layout.current
          l?.timeline.render(l.timeline.totalTime(), true, true)
        }
        ScrollTrigger.addEventListener('refresh', reassert)

        // The phone's weight: scroll momentum (smoothed by Lenis) lets it lag a little and tip back,
        // then settle as the scroll eases off, like an object with mass. On the wrapper, so it never
        // touches the device's own transforms.
        const float = q('[data-float]')
        gsap.set(float, { transformPerspective: 1600, transformOrigin: '50% 60%' })
        const yTo = gsap.quickTo(float, 'y', { duration: 0.9, ease: 'power3.out' })
        const tiltTo = gsap.quickTo(float, 'rotationX', { duration: 0.9, ease: 'power3.out' })
        let lastY = window.scrollY
        let held = 0
        const weigh = () => {
          const v = window.scrollY - lastY
          lastY = window.scrollY
          const t = gsap.utils.clamp(-1, 1, v / 40)
          if (t === 0 && held === 0) return
          held = t
          yTo(t * 14)
          tiltTo(t * 3)
        }
        gsap.ticker.add(weigh)

        // This scene can be created after triggers further down the page (when the window crosses into
        // desktop size); re-sort so every trigger is measured in page order, with this pin's length.
        ScrollTrigger.sort()
        ScrollTrigger.refresh()
        replayPendingJump()

        // The Wheel backdrop turns with the page through the whole section (two full turns), on the
        // same light scrub as the rest of the scene.
        const wheelEl = q('[data-wheel]')
        const wheel = { turn: 0 }
        turnWheel(wheelEl, 0)
        const wheelTween = gsap.to(wheel, {
          turn: 720,
          ease: 'none',
          onUpdate: () => turnWheel(wheelEl, wheel.turn),
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
        })

        // Rebuild when the viewport or the content's height changes (fonts and images settling,
        // a resize), keeping the same progress through the section so nothing jumps.
        let timer = 0
        let lastHeight = content.offsetHeight
        const rebuild = () => {
          window.clearTimeout(timer)
          timer = window.setTimeout(() => {
            const prev = layout.current
            const before = prev?.timeline.scrollTrigger
            const progress = before?.progress ?? 0
            const inside = before?.isActive ?? false
            // Mid-content, keep the same content on screen rather than the same overall progress.
            const px = before ? window.scrollY - before.start : 0
            const scrolled = prev && px >= prev.contentStart && px < prev.foldStart ? px - prev.contentStart : null
            before?.kill(true)
            prev?.timeline.kill()
            build()
            ScrollTrigger.sort()
            ScrollTrigger.refresh()
            lastHeight = content.offsetHeight
            const l = layout.current!
            const st = l.timeline.scrollTrigger!
            if (replayPendingJump()) return
            if (inside) {
              const y = scrolled === null ? progress * (st.end - st.start) : l.contentStart + Math.min(scrolled, l.contentTravel)
              scrollToY(Math.round(st.start + y), { smooth: false })
              l.timeline.progress(y / (st.end - st.start))
            }
          }, 200)
        }
        const onResize = () => rebuild()
        window.addEventListener('resize', onResize)
        const ro = new ResizeObserver(() => {
          if (Math.abs(content.offsetHeight - lastHeight) > 1) rebuild()
        })
        ro.observe(content)

        return () => {
          ScrollTrigger.removeEventListener('refresh', reassert)
          enter.scrollTrigger?.kill()
          enter.kill()
          gsap.ticker.remove(weigh)
          wheelTween.scrollTrigger?.kill()
          wheelTween.kill()
          gsap.set(float, { clearProps: 'transform' })
          gsap.set(q('[data-wallpaper-depth]'), { clearProps: 'transform' })
          gsap.set([device, q('[data-name]'), q('[data-seam]')], { clearProps: 'transform,opacity' })
          window.removeEventListener('resize', onResize)
          ro.disconnect()
          screen.removeEventListener('scroll', pinScreen)
          window.clearTimeout(timer)
          layout.current?.timeline.scrollTrigger?.kill(true)
          layout.current?.timeline.kill()
          layout.current = null
          // Restore every element the fold timeline styles. The timeline is rebuilt after load
          // (resizes, content settling) outside the matchMedia context, so mm.revert() alone would
          // leave its inline styles behind, e.g. the call screen at opacity 0 in the static flow.
          gsap.set(
            ['[data-device]', '[data-body]', '[data-content]', '[data-dock]', '[data-crease]', '[data-cover]', '[data-shade-front]', '[data-shade-back]', '[data-back-copy]', '[data-back-blank]', '[data-lock]', '[data-call]'].map((s) => q(s)),
            { clearProps: 'all' },
          )
          delete el.dataset.mode
          for (const v of ['--device-w', '--device-h', '--screen-h']) el.style.removeProperty(v)
        }
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  /**
   * Scroll the page so `el` (inside the screen) sits near the screen's top. The screen has no
   * scroll of its own: a content offset maps to exactly one page position. Returns false outside the scene.
   */




  // The visitor's own scrolling ends any pending jump.
  useEffect(() => {
    const cancel = () => (pendingJump.current = null)
    window.addEventListener('wheel', cancel, { passive: true })
    window.addEventListener('touchstart', cancel, { passive: true })
    window.addEventListener('keydown', cancel)
    return () => {
      window.removeEventListener('wheel', cancel)
      window.removeEventListener('touchstart', cancel)
      window.removeEventListener('keydown', cancel)
    }
  }, [])

  const go = (target: Target) => {
    const el = root.current!
    const st = layout.current?.timeline.scrollTrigger
    if (target === 'contact') {
      // The real contact details live in the Contact section after Creative Corner.
      const contact = document.getElementById(sections.contact.id)
      if (contact) scrollToElement(contact)
      else if (st) scrollToY(st.end)
      else scrollToElement(el.querySelector<HTMLElement>('[data-call]')!, { block: 'center' })
      return
    }
    const section = el.querySelector<HTMLElement>(`[data-content] [data-section="${target}"]`)!
    if (!scrollToContent(section)) scrollToElement(section)
  }

  // Gravity-like entrances: each [data-drop] block settles into place the first time it comes into
  // view; blocks arriving together are staggered. Works inside the phone's screen (the observer
  // respects the screen's clipping) and in the static flow.
  useEffect(() => {
    const el = root.current!
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) return
    el.dataset.drops = ''
    const io = new IntersectionObserver(
      (entries) => {
        let k = 0
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const t = e.target as HTMLElement
          t.style.setProperty('--drop-delay', `${k++ * 80}ms`)
          t.dataset.in = ''
          io.unobserve(t)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    el.querySelectorAll('[data-drop]').forEach((d) => io.observe(d))
    return () => {
      io.disconnect()
      delete el.dataset.drops
    }
  }, [])

  // "/#what-i-do" (nav, links): in the scene the services sit inside the moving phone, so map them to
  // their page position; in the flow, scroll to the section itself.
  useEffect(() =>
    registerHashTarget(sections.services.id, (smooth) => {
      const section = root.current?.querySelector<HTMLElement>('[data-content] [data-section="services"]')
      if (!section) return false
      pendingJump.current = { el: section, until: performance.now() + 4000 }
      // In the scene, always jump instantly with the phone already open: a glide would replay the
      // whole unfold on the way (slow, with the phone rising from below the screen).
      if (scrollToContent(section, false)) return true
      // The scene isn't built yet (e.g. arriving from another page): it places the jump once built.
      if (window.matchMedia(motionQuery.fold).matches) return true
      pendingJump.current = null
      scrollToElement(section, { smooth })
      return true
    }),
  )

  // Keyboard: keep the focused control visible by scrolling the page to it.
  const onFocus = (e: React.FocusEvent) => {
    const target = e.target as HTMLElement
    const l = layout.current
    const st = l?.timeline.scrollTrigger
    if (!l || !st) return
    const y = window.scrollY - st.start
    const inContent = target.closest<HTMLElement>('[data-content]')
    if (inContent) {
      // After the browser's own focus scrolling, which would otherwise overrule this.
      window.setTimeout(() => scrollToContent(target, false), 0)
    } else if (target.closest('[data-dock]')) {
      if (y < l.contentStart || y >= l.foldStart) scrollToY(st.start + l.contentStart, { smooth: false })
    } else if (target.closest('[data-call]')) {
      if (y < st.end - st.start - 2) scrollToY(st.end, { smooth: false })
    } else if (target.closest('[data-lock]')) {
      if (y > 0) scrollToY(st.start, { smooth: false })
    }
  }

  return (
    <div ref={root} className={`theme-studio ${styles.page}`} data-finish={finish} data-backdrop={backdrop} style={{ ['--bezel' as string]: `${BEZEL}px` }} onFocus={onFocus}>
      <div className={styles.stage} data-stage>
        {/* ---------- Backdrops ---------- */}
        <div className={styles.atmosphere} aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <i />
          <i />
        </div>
        {/* The hero's floor colour at the top edge, dissolved during the hand-off (scene only). */}
        <span className={styles.seam} data-seam aria-hidden="true" />
        <p className={styles.name} data-name aria-hidden="true">
          {identity.name}
        </p>
        <div className={styles.glow} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <QuestionWheel className={styles.wheel} />

        {/* Carries the phone's weight: a small lag and tilt from scroll momentum (scene only). */}
        <div className={styles.float} data-float>
          <div className={styles.device} data-device>
            <span className={styles.floor} aria-hidden="true" />

            {/* ---------- The open device: inner screen ---------- */}
            <div className={`${styles.shell} ${styles.body}`} data-body>
              <div className={styles.screen} data-screen>
                <StatusBar time={clock.label} />
                <div className={styles.content} data-content>
                  <HomeScreen go={go} />

                  <SelectedWork />

                  <section className={styles.stats} aria-labelledby="stats-title">
                    <h2 id="stats-title" className={styles.eyebrow} data-drop="label">
                      In numbers
                    </h2>
                    <ul role="list">
                      {stats.map((s) => (
                        <li key={s.label} data-drop="row">
                          <span className={styles.statValue}>{s.value}</span>
                          <span className={styles.statLabel}>{s.label}</span>
                          {s.source && <span className={styles.statSource}>{s.source}</span>}
                        </li>
                      ))}
                    </ul>
                    <p className={styles.statSource}>{statsNote}</p>
                  </section>

                  <section id={sections.services.id} className={styles.services} data-section="services" aria-labelledby="services-title">
                    <header className={styles.servicesHead}>
                      <p className={styles.eyebrow} aria-hidden="true" data-drop="label">
                        Services
                      </p>
                      <h2 id="services-title" className={styles.servicesTitle} data-drop="letters">
                        <FallText text="What I do" />
                      </h2>
                    </header>
                    <ol className={styles.serviceList}>
                      {services.map((s, i) => (
                        <li key={s.title} className={styles.service} data-drop="panel">
                          <span className={styles.serviceNum} aria-hidden="true">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <h3 className={styles.serviceTitle}>{s.title}</h3>
                          <p className={styles.serviceLine}>{s.line}</p>
                        </li>
                      ))}
                    </ol>

                    <section className={styles.tools} aria-labelledby="tools-title" data-drop="panel">
                      <header className={styles.toolsHead}>
                        <div>
                          <p className={styles.toolsKicker} aria-hidden="true">
                            Toolkit
                          </p>
                          <h3 id="tools-title" className={styles.toolsTitle}>
                            Technical skills
                          </h3>
                        </div>
                        <p className={styles.toolsCount}>{String(toolGroups.reduce((n, g) => n + g.items.length, 0)).padStart(2, '0')} tools</p>
                      </header>
                      <div className={styles.toolGroups}>
                        {toolGroups.map((g, gi) => (
                          <div key={g.title} className={styles.toolGroup}>
                            <h4 className={styles.toolGroupTitle}>
                              <span className={styles.toolGroupNum} aria-hidden="true">
                                {String(gi + 1).padStart(2, '0')}
                              </span>
                              {g.title}
                            </h4>
                            <ul role="list" className={styles.toolList}>
                              {g.items.map((tool) => (
                                <li key={tool.name} className={styles.tool}>
                                  <span className={styles.toolMark} data-count={tool.logos.length} aria-hidden="true">
                                    {tool.logos.map((l) => (
                                      <img key={l.src} src={l.src} alt="" width={28} height={28} loading="lazy" decoding="async" style={{ ['--glow' as string]: l.glow }} />
                                    ))}
                                  </span>
                                  <span className={styles.toolName}>{tool.name}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </section>

                    <div className={styles.elsewhereHead}>
                      <h2 id="elsewhere-title" className={styles.eyebrow} data-drop="label">
                        Find me on
                      </h2>
                      <span className={styles.elsewhereRule} aria-hidden="true" />
                    </div>
                    <ul role="list" className={styles.links} aria-labelledby="elsewhere-title" data-drop="row">
                      {elsewhere.map((l) => (
                        <li key={l.href}>
                          <a href={l.href} target="_blank" rel="noopener noreferrer" className={styles.linkCard} aria-label={`${l.label}, ${l.handle} (opens in a new tab)`}>
                            <span className={styles.linkTop} aria-hidden="true">
                              <SocialIcon name={l.label} />
                              <span className={styles.linkArrow}>↗</span>
                            </span>
                            <span className={styles.linkName}>{l.label}</span>
                            <span className={styles.linkMeta}>{l.handle}</span>
                          </a>
                        </li>
                      ))}
                      <li>
                        <Link to={`/#${sections.creative.id}`} className={styles.linkCard} aria-label="Creative Corner: sketches and paintings, further down this page">
                          <span className={styles.linkTop} aria-hidden="true">
                            <SocialIcon name="Creative Corner" />
                            <span className={styles.linkArrow}>↓</span>
                          </span>
                          <span className={styles.linkName}>Creative Corner</span>
                          <span className={styles.linkMeta}>Sketches &amp; paintings</span>
                        </Link>
                      </li>
                    </ul>
                  </section>

                  <section className={styles.ctaWrap} data-section="contact" aria-labelledby="cta-title">
                    <div className={styles.cta} data-drop="panel">
                      <h2 id="cta-title" className={styles.ctaTitle}>
                        {cta.title}
                      </h2>
                      {call.email ? (
                        <a className={styles.primaryBtn} href={`mailto:${call.email}`}>
                          {cta.action} <span aria-hidden="true">↗</span>
                        </a>
                      ) : (
                        <p className={styles.ctaPending}>{call.emailPending}</p>
                      )}
                    </div>
                  </section>
                </div>

                <span className={styles.crease} data-crease aria-hidden="true" />

                <nav className={styles.dock} data-dock aria-label="On this page">
                  {dockItems.map((d) => (
                    <button key={d.id} type="button" className={styles.dockBtn} aria-current={active === d.id ? 'true' : undefined} onClick={() => go(d.id)}>
                      {d.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* ---------- The hinged page ---------- */}
            <div className={styles.cover} data-cover>
              {/* Front: the outer (phone) screen */}
              <div className={`${styles.shell} ${styles.front}`}>
                <div className={`${styles.screen} ${styles.phoneScreen}`}>
                  <section className={styles.lock} data-lock aria-label="Introduction" data-drop="screen">
                    {/* Depth wallpaper, like a phone lock screen: the original photo, the clock, then the
                        cut-out of the same photo exactly over her (the two files are pixel-aligned), so
                        the clock tucks behind her hair. Both are the hero's files, already loaded. */}
                    <div className={styles.wallpaper} data-wallpaper-depth aria-hidden="true">
                      <img className={styles.wallpaperPhoto} src={portraitPhoto.src} srcSet={portraitPhoto.srcSet} sizes={PORTRAIT_SIZES} alt="" />
                      <time className={styles.clock} dateTime={clock.iso}>
                        {clock.label}
                      </time>
                      <img className={styles.wallpaperSubject} src={portraitCutout.src} srcSet={portraitCutout.srcSet} sizes={PORTRAIT_SIZES} alt="" />
                    </div>
                    <div className={styles.lockTop}>
                      <p className={styles.lockRole}>{identity.role}</p>
                    </div>
                    <ul role="list" className={styles.notes}>
                      {notifications.map((n) => (
                        <li key={n.id} className={styles.note}>
                          <span className={styles.noteTile} data-tone={n.tone} aria-hidden="true">
                            {n.tile}
                          </span>
                          <span>
                            <span className={styles.noteTitle}>{n.title}</span>
                            <span className={styles.noteMeta}>{n.meta}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className={styles.lockBar}>
                      <a className={styles.roundBtn} href={elsewhere[0].href} target="_blank" rel="noopener noreferrer" aria-label={`${elsewhere[0].label} (opens in a new tab)`}>
                        P
                      </a>
                      <button type="button" className={styles.unfoldHint} onClick={() => go('home')}>
                        Scroll to unfold
                      </button>
                      <a className={styles.roundBtn} href={elsewhere[1].href} target="_blank" rel="noopener noreferrer" aria-label={`${elsewhere[1].label} (opens in a new tab)`}>
                        ▶
                      </a>
                    </div>
                  </section>

                  <CallScreen />
                </div>
                <span className={styles.shade} data-shade-front aria-hidden="true" />
              </div>

              {/* Back: the left half of the inner screen, shown while the page swings */}
              <div className={`${styles.shell} ${styles.back}`} aria-hidden="true" inert>
                <div className={`${styles.screen} ${styles.backScreen}`}>
                  <div className={styles.backCopy} data-back-copy>
                    <StatusBar time={clock.label} />
                    <HomeScreen decorative />
                  </div>
                  <div className={styles.backBlank} data-back-blank />
                </div>
                <span className={styles.shade} data-shade-back aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Device finish and backdrop (scene only) ---------- */}
        <div className={styles.controls}>
          <div className={styles.swatches} role="group" aria-label="Device finish">
            {finishes.map((f) => (
              <button key={f.id} type="button" className={styles.swatch} data-finish={f.id} aria-pressed={finish === f.id} aria-label={f.label} title={f.label} onClick={() => setFinish(f.id)} />
            ))}
          </div>
          <div className={styles.segmented} role="group" aria-label="Backdrop">
            {backdrops.map((b) => (
              <button key={b.id} type="button" aria-pressed={backdrop === b.id} onClick={() => setBackdrop(b.id)}>
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
