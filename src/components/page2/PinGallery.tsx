// "The board, up close" — the browsable gallery of pins.
// Large screens: four columns that drift at different speeds as you scroll (parallax).
// Smaller screens / reduced motion: a plain CSS multi-column masonry.
import { useRef } from 'react'
import { revealOnScroll } from '../../animation/reveal.ts'
import { gallery, pins } from '../../content/page2.ts'
import { motionQuery } from '../../design/motion.ts'
import { gsap, useGSAP } from '../../lib/gsap.ts'
import PinCard from './PinCard.tsx'
import styles from './PinGallery.module.css'

const COLUMNS = 4
/** Vertical drift per column in px across the section's scroll (start → end). */
const DRIFT = [90, -30, 140, 20]

const columns = Array.from({ length: COLUMNS }, (_, c) => pins.filter((_, i) => i % COLUMNS === c))

export default function PinGallery({ id }: { id: string }) {
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(`${motionQuery.scene} and (min-width: 1024px)`, () => {
        gsap.utils.toArray<HTMLElement>('[data-column]', scope.current!).forEach((col, i) => {
          gsap.fromTo(col, { y: DRIFT[i] }, {
            y: -DRIFT[i],
            ease: 'none',
            scrollTrigger: { trigger: scope.current, start: 'top bottom', end: 'bottom top', scrub: true },
          })
        })
      })

      mm.add(motionQuery.any, () => revealOnScroll(gsap.utils.toArray('[data-reveal]', scope.current!)))

      return () => mm.revert()
    },
    { scope },
  )

  return (
    <section ref={scope} id={id} className={styles.gallery} aria-labelledby={`${id}-heading`}>
      <header className={styles.head} data-reveal>
        <p className={styles.eyebrow}>{gallery.eyebrow}</p>
        <h3 id={`${id}-heading`} className={styles.heading}>
          {gallery.heading}
        </h3>
        <p className={styles.note}>{gallery.note}</p>
      </header>

      <div className={styles.grid}>
        {columns.map((col, c) => (
          <ul key={c} role="list" className={styles.column} data-column>
            {col.map((pin) => (
              <li key={pin.id} data-reveal>
                <PinCard pin={pin} caption={pin.caption ?? pin.theme} sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 290px" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  )
}
