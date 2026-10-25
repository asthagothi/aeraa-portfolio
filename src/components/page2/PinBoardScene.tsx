// Page 2 opening: the Page 1 portrait shrinks into the centre pin while pins fly in and
// assemble into a board behind the "PINTEREST" headline.
//
// Modes (gsap.matchMedia):
//   - scene: pinned, scrubbed sequence (desktop/tablet, motion allowed)
//   - light: no pinning, pins fade up into a static masonry (phones / short screens)
//   - reduced motion / no JS: the static masonry, fully visible (default CSS state)
import { useRef } from 'react'
import { createFlyingCardScene } from '../../animation/ScrollAnimationController.ts'
import { boardMotion } from '../../animation/presets/board.ts'
import { revealOnScroll } from '../../animation/reveal.ts'
import portrait640 from '../../assets/hero/portrait-640.webp'
import { pinIntro, pins, pinterestProfile } from '../../content/page2.ts'
import { motionQuery } from '../../design/motion.ts'
import { gsap, useGSAP } from '../../lib/gsap.ts'
import PinCard from './PinCard.tsx'
import styles from './PinBoardScene.module.css'

const BOARD_PINS = pins.slice(0, boardMotion.cards.length - 1)

export default function PinBoardScene({ id }: { id: string }) {
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(motionQuery.scene, () => {
        const sectionEl = section.current!
        const stageEl = stage.current!
        sectionEl.dataset.animated = 'true'

        const cardEls = gsap.utils.toArray<HTMLElement>('[data-floating-card]', stageEl)
        const headline = stageEl.querySelector<HTMLElement>(`.${styles.headline}`)!
        const tl = createFlyingCardScene({ stage: stageEl, trigger: sectionEl, cards: cardEls, motion: boardMotion })
        // Headline rises in behind the shrinking portrait.
        tl.fromTo(headline, { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.3, ease: 'power2.out' }, 0.12)

        return () => {
          tl.scrollTrigger?.kill()
          tl.kill()
          gsap.set([...cardEls, headline], { clearProps: 'transform,opacity,visibility,zIndex' })
          delete sectionEl.dataset.animated
        }
      })

      mm.add(motionQuery.light, () => {
        revealOnScroll(gsap.utils.toArray<HTMLElement>('[data-floating-card]', stage.current!))
      })

      return () => mm.revert()
    },
    { scope: section },
  )

  return (
    <section ref={section} id={id} className={styles.scene} aria-labelledby={`${id}-heading`}>
      <div ref={stage} className={styles.stage}>
        <div className={styles.headline}>
          <p className={`${styles.eyebrow} t-eyebrow`}>@{pinterestProfile.username}</p>
          <h2 id={`${id}-heading`} className={`${styles.title} t-display`}>
            {pinIntro.title}
          </h2>
        </div>

        <ul role="list" className={styles.board}>
          {/* The Page 1 photograph, now the first pin. Decorative here (described on Page 1). */}
          <li className={`${styles.slot} ${styles.portraitSlot}`} data-floating-card aria-hidden="true">
            <PinCard pin={{ id: 'portrait', title: 'Portrait', image: portrait640, alt: '', aspect: 'tall' }} eager crop />
          </li>
          {BOARD_PINS.map((pin) => (
            <li key={pin.id} className={styles.slot} data-floating-card>
              <PinCard pin={pin} crop sizes="(max-width: 767px) 50vw, 210px" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
