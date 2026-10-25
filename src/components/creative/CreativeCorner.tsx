// Home, third section — Creative Corner: a 3D orbit of artwork (after the phone section).
//
// One large focal piece sits at the centre, set back in depth. Every piece travels around it on a
// tilted elliptical orbit in one shared 3D space (CSS perspective + preserve-3d), so the browser
// layers everything by real depth: cards in the front half of the orbit pass in front of the focal
// piece and grow; cards in the back half pass behind it and shrink. Scrolling turns the orbit
// (eased, continuous, no snapping). The card travelling directly behind the focal piece — hidden by
// it — becomes the new focal piece, so the same artwork is never shown twice.
//
// Modes: `orbit` (JS) lays the orbit out; with motion allowed the stage is pinned and driven by
// scroll, with reduced motion it stays still and the ← / → buttons step it. Without JS the pieces
// fall back to a simple centred row. Every card is a real button that opens the viewer.
import { useEffect, useRef, useState } from 'react'
import Lightbox from '../journal/Lightbox.tsx'
import { useLightbox, type LightboxImage } from '../journal/useLightbox.ts'
import { sections } from '../../config/site.ts'
import { artworks, creativeIntro } from '../../content/creative.ts'
import { motionQuery, prefersReducedMotion } from '../../design/motion.ts'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap.ts'
import { scrollToY } from '../../lib/smoothScroll.ts'
import styles from './CreativeCorner.module.css'

const N = artworks.length
const STEP = (Math.PI * 2) / N
const pad = (n: number) => String(n).padStart(2, '0')
const wrap = (i: number) => ((i % N) + N) % N
/** Small, fixed "hand-placed" tilt per piece (deterministic). */
const tilt = (i: number) => [-3, 2, -1.5, 3.5, -2.5, 1.5, -3.5, 2.5, -1.5, 3, -2.5, 1, -3, 2, -1, 3.5, -2, 1.5, -2.5][i % 19]

/** Orbit angle at which card `i` sits directly behind the focal piece. */
const angleFor = (i: number) => i * STEP

const viewable: LightboxImage[] = artworks.map((a) => ({ src: a.src, srcSet: a.srcSet, alt: a.alt, caption: `${a.label} · ${a.kind}` }))

type Geometry = { rx: number; rz: number; ry: number; focalZ: number }

function geometry(): Geometry {
  const w = window.innerWidth
  const h = window.innerHeight
  const phone = w < 700
  const rx = phone ? w * 0.4 : Math.min(w * 0.38, 640)
  // A steeper tilt (ry) carries the front arc beneath the focal piece instead of across it, so the
  // centre stays clear: the focal piece is the one clear focus, the ring frames it. Phones are too
  // narrow for cards beside the focal piece, so there the orbit runs tall: cards pass above and below
  // it and only skim its sides.
  return { rx, rz: rx * (phone ? 0.5 : 0.6), ry: h * (phone ? 0.25 : 0.235), focalZ: -rx * 0.14 }
}

export default function CreativeCorner() {
  const root = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])
  const sceneRef = useRef<HTMLDivElement>(null)
  /** Imperative handle into the running orbit (set while the orbit is mounted). */
  const orbit = useRef<{ goTo: (i: number) => void } | null>(null)
  const lightbox = useLightbox(viewable)

  const [focal, setFocal] = useState(0)
  const [previous, setPrevious] = useState<number | null>(null)

  useGSAP(
    () => {
      const el = root.current!
      const stage = el.querySelector<HTMLElement>('[data-stage]')!
      const scene = sceneRef.current!
      el.dataset.mode = 'orbit'

      let geo = geometry()
      let angle = 0 // current (eased)
      let target = 0 // where scroll / buttons want it
      let drawn = Number.NaN
      let shown = 0
      let tiltX = 0
      let tiltY = 0
      let aimX = 0
      let aimY = 0

      const place = (phi: number) => {
        el.style.setProperty('--focal-z', `${geo.focalZ.toFixed(1)}px`)
        for (let i = 0; i < N; i++) {
          const card = cardRefs.current[i]
          if (!card) continue
          // θ = 0 is the front of the orbit, θ = π the back (behind the focal piece).
          const theta = i * STEP - phi + Math.PI
          const s = Math.sin(theta)
          const c = Math.cos(theta)
          const depth = (c + 1) / 2 // 1 front, 0 back
          const x = s * geo.rx
          const z = c * geo.rz
          const y = c * geo.ry // front lower, back higher: the orbit is tilted toward the viewer
          // Cards stay fully opaque around the ring (true colours, no dimming overlay); they fade only
          // as they pass behind the focal piece, where the same artwork becomes the focal piece.
          // Depth reads through size and position alone.
          const fromBack = Math.abs(Math.atan2(s, -c)) / STEP
          const opacity = Math.min(1, Math.max(0, fromBack - 0.6) / 0.9) * Math.min(1, 0.25 + depth * 1.5)
          card.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${(-s * 14).toFixed(2)}deg) rotate(${tilt(i)}deg)`
          // Hidden cards shouldn't catch clicks or focus.
          card.style.pointerEvents = opacity < 0.15 ? 'none' : ''
          card.tabIndex = opacity < 0.15 ? -1 : 0
        }
        const next = wrap(Math.round(phi / STEP))
        if (next !== shown) {
          setPrevious(shown)
          shown = next
          setFocal(next)
        }
      }

      const mm = gsap.matchMedia()

      // Motion allowed: pin the stage, scroll turns the orbit, the cursor tilts it slightly.
      mm.add(motionQuery.any, () => {
        const st = ScrollTrigger.create({
          trigger: stage,
          start: 'top top',
          end: () => `+=${(N - 1) * window.innerHeight * 0.32}`,
          pin: true,
          onUpdate: (self) => {
            target = self.progress * angleFor(N - 1)
          },
          onRefresh: () => {
            geo = geometry()
            drawn = Number.NaN
          },
        })

        let tiltDrawn = ''
        const tick = () => {
          // Idle frames write nothing (a style write every frame costs style work across the page).
          if (!st.isActive && angle === target && angle === drawn) return
          angle += (target - angle) * 0.075
          if (Math.abs(target - angle) < 0.0005) angle = target
          tiltX += (aimX - tiltX) * 0.06
          tiltY += (aimY - tiltY) * 0.06
          const tilt = `rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`
          if (tilt !== tiltDrawn) {
            tiltDrawn = tilt
            scene.style.transform = tilt
          }
          if (angle !== drawn) {
            drawn = angle
            place(angle)
          }
        }
        // Lay the orbit out now, so there is no frame with every card stacked at the centre.
        angle = target = st.progress * angleFor(N - 1)
        drawn = angle
        place(angle)
        gsap.ticker.add(tick)

        const onPointer = (e: PointerEvent) => {
          if (e.pointerType !== 'mouse') return
          aimY = (e.clientX / window.innerWidth - 0.5) * 7
          aimX = (e.clientY / window.innerHeight - 0.5) * -4
        }
        const onLeave = () => {
          aimX = 0
          aimY = 0
        }
        stage.addEventListener('pointermove', onPointer)
        stage.addEventListener('pointerleave', onLeave)

        orbit.current = {
          goTo: (i) => {
            const k = Math.min(Math.max(i, 0), N - 1)
            scrollToY(st.start + (k / (N - 1)) * (st.end - st.start))
          },
        }

        return () => {
          gsap.ticker.remove(tick)
          stage.removeEventListener('pointermove', onPointer)
          stage.removeEventListener('pointerleave', onLeave)
          st.kill()
          scene.style.transform = ''
          orbit.current = null
        }
      })

      // Reduced motion: a still orbit; the buttons step it instantly.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        const draw = () => {
          geo = geometry()
          place(angle)
        }
        draw()
        window.addEventListener('resize', draw)
        orbit.current = {
          goTo: (i) => {
            angle = target = angleFor(Math.min(Math.max(i, 0), N - 1))
            place(angle)
          },
        }
        return () => {
          window.removeEventListener('resize', draw)
          orbit.current = null
        }
      })

      return () => {
        mm.revert()
        delete el.dataset.mode
        for (const card of cardRefs.current) {
          if (!card) continue
          card.style.transform = ''
          card.style.opacity = ''
          card.style.pointerEvents = ''
          card.tabIndex = 0
        }
      }
    },
    { scope: root },
  )

  // Arrow keys step the orbit while the stage is on screen (not while the viewer is open).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!orbit.current || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return
      if (document.querySelector('dialog[open]')) return
      const t = e.target
      if (t instanceof Element && t.closest('input, textarea, select, [contenteditable]')) return
      const stage = root.current?.querySelector('[data-stage]')?.getBoundingClientRect()
      if (!stage || stage.bottom < window.innerHeight * 0.5 || stage.top > window.innerHeight * 0.5) return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        orbit.current.goTo(focal + 1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        orbit.current.goTo(focal - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focal])

  const piece = artworks[focal]

  return (
    <div ref={root} id={sections.creative.id} className={`theme-studio ${styles.page}`}>
      {/* Introduction in the page flow: the title, and where it all began (Astha's words). Kept out of
          the pinned stage so the orbit has the whole screen to itself. */}
      <header className={styles.head}>
        <div>
          <h2 id="creative-title" className={styles.title}>
            {creativeIntro.title}
          </h2>
          <p className={styles.intro}>{creativeIntro.intro}</p>
        </div>
        <div className={styles.story}>
          <p className={styles.storyTitle}>{creativeIntro.storyTitle}</p>
          <p className={styles.storyText}>{creativeIntro.story}</p>
        </div>
      </header>
      <section className={styles.stage} data-stage aria-labelledby="creative-title">

        <div className={styles.space}>
          <div ref={sceneRef} className={styles.scene}>
            {/* Focal piece: large, set back in depth. */}
            <div className={styles.focal}>
              <div className={styles.focalMat}>
                {previous !== null && previous !== focal && (
                  <img key={`out-${previous}-${focal}`} className={styles.focalOut} src={artworks[previous].src} srcSet={artworks[previous].srcSet} sizes="45vw" alt="" aria-hidden="true" />
                )}
                <img key={`in-${focal}`} className={styles.focalIn} src={piece.src} srcSet={piece.srcSet} sizes="45vw" alt={piece.alt} />
              </div>
            </div>

            {/* The orbit. */}
            <ul role="list" className={styles.orbit} aria-label="Artworks">
              {artworks.map((a, i) => (
                <li key={a.id} className={styles.slot}>
                  <button
                    ref={(node) => {
                      cardRefs.current[i] = node
                    }}
                    type="button"
                    className={styles.card}
                    data-cursor="view"
                    style={{ ['--ratio' as string]: a.ratio, ['--fit' as string]: a.ratio > 1 ? Math.pow(a.ratio, -0.8).toFixed(3) : 1 }}
                    onClick={(e) => lightbox.open(i, e.currentTarget)}
                    aria-label={`View ${a.label} (${a.kind})`}
                  >
                    <span className={styles.cardInner}>
                      <img src={a.src} srcSet={a.srcSet} sizes="(min-width: 700px) 220px, 120px" alt="" decoding="async" />
                    </span>
                    <span className={styles.cardLabel} aria-hidden="true">
                      {a.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.caption}>
          <p className={styles.captionText}>
            <span className={styles.captionNo}>
              {pad(focal + 1)} / {pad(N)}
            </span>
            <span className={styles.captionTitle}>
              <span className={styles.captionLabel}>{piece.label}</span>
              <span className={styles.captionKind}>{piece.kind}</span>
            </span>
          </p>
          <div className={styles.captionActions}>
            <button type="button" className={styles.navBtn} onClick={() => orbit.current?.goTo(focal - 1)} disabled={focal === 0} aria-label="Previous piece">
              ←
            </button>
            <button type="button" className={styles.view} onClick={(e) => lightbox.open(focal, e.currentTarget)}>
              View artwork <span className="visually-hidden">: {piece.label}</span>
            </button>
            <button type="button" className={styles.navBtn} onClick={() => orbit.current?.goTo(focal + 1)} disabled={focal === N - 1} aria-label="Next piece">
              →
            </button>
          </div>
        </div>

        <p className={styles.hint} aria-hidden="true">
          {prefersReducedMotion() ? 'Use ← → to move through the pieces' : creativeIntro.hint}
        </p>
      </section>

      <Lightbox {...lightbox.props} />
    </div>
  )
}
