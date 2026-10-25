// A pinned scene in which cards fly along configured paths as the user scrolls.
// Content (cards) and choreography (motion) are passed in separately, so either can be swapped.
//
// Without motion (reduced-motion preference or no JS) the cards are shown in a static grid —
// the default CSS state. The pinned flight is opted into from JS on large screens; small or
// short screens keep the grid and get a light fade-up instead of a pinned sequence.
import { useRef } from 'react'
import { createFlyingCardScene } from '../../animation/ScrollAnimationController.ts'
import type { SceneMotion } from '../../animation/types.ts'
import type { FloatingCardData } from './types.ts'
import { duration, ease, stagger } from '../../design/motion.ts'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap.ts'
import FloatingCard from './FloatingCard.tsx'
import styles from './FloatingCardScene.module.css'

type Props = {
  id?: string
  /** Accessible heading for the section; also drawn large behind the cards. */
  heading: string
  cards: FloatingCardData[]
  motion: SceneMotion
  /** Media query under which the pinned flying animation runs. */
  animateWhen?: string
  /** Media query under which cards only fade up into the static grid. */
  fadeWhen?: string
}

const FLY_QUERY = '(prefers-reduced-motion: no-preference) and (min-width: 768px) and (min-height: 521px)'
const FADE_QUERY =
  '(prefers-reduced-motion: no-preference) and (max-width: 767px), (prefers-reduced-motion: no-preference) and (max-height: 520px)'

export default function FloatingCardScene({
  id,
  heading,
  cards,
  motion,
  animateWhen = FLY_QUERY,
  fadeWhen = FADE_QUERY,
}: Props) {
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(animateWhen, () => {
        const sectionEl = section.current!
        const stageEl = stage.current!
        sectionEl.dataset.animated = 'true'

        const cardEls = gsap.utils.toArray<HTMLElement>('[data-floating-card]', stageEl)
        const tl = createFlyingCardScene({ stage: stageEl, trigger: sectionEl, cards: cardEls, motion })

        // Parallax the backdrop heading gently against the cards for depth.
        gsap.fromTo(
          `.${styles.backdrop}`,
          { yPercent: 20, scale: 0.94 },
          {
            yPercent: -20,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionEl,
              start: 'top top',
              end: () => `+=${motion.scrollLength * window.innerHeight}`,
              scrub: true,
            },
          },
        )

        return () => {
          // Leaving the animated mode (resize, preference change, unmount): return cards to the static grid.
          tl.scrollTrigger?.kill()
          tl.kill()
          gsap.set(cardEls, { clearProps: 'transform,opacity,visibility,zIndex' })
          delete sectionEl.dataset.animated
        }
      })

      // Small screens with motion allowed: no pinning, just a short fade-up as cards scroll in.
      mm.add(fadeWhen, () => {
        const cardEls = gsap.utils.toArray<HTMLElement>('[data-floating-card]', stage.current!)
        // Hide up front so a card never shows, vanishes, then fades in as it crosses the trigger line.
        gsap.set(cardEls, { y: 28, autoAlpha: 0 })
        ScrollTrigger.batch(cardEls, {
          start: 'top bottom', // entering the viewport; a higher line is unreachable near the page end
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              y: 0,
              autoAlpha: 1,
              duration: duration.slow,
              ease: ease.standard,
              stagger: stagger.tight,
              overwrite: true,
            }),
        })
      })

      return () => mm.revert()
    },
    { scope: section, dependencies: [motion, animateWhen, fadeWhen] },
  )

  const headingId = `${id ?? 'floating-scene'}-heading`

  return (
    <section ref={section} id={id} className={styles.scene} aria-labelledby={headingId}>
      <div ref={stage} className={styles.stage}>
        <h2 id={headingId} className={styles.backdrop}>
          {heading}
        </h2>
        <ul role="list" className={styles.cards}>
          {cards.map((card) => (
            <li key={card.id} className={styles.slot} data-floating-card>
              <FloatingCard card={card} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
