// Short introduction to the Pinterest work. Echoes Page 1's objects: a glass card and a dark panel.
import { useRef } from 'react'
import { revealOnScroll } from '../../animation/reveal.ts'
import { pinIntro, pinterestProfile } from '../../content/page2.ts'
import { motionQuery } from '../../design/motion.ts'
import { gsap, useGSAP } from '../../lib/gsap.ts'
import { StarIcon } from '../ui/icons.tsx'
import styles from './PinIntro.module.css'

export default function PinIntro() {
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(motionQuery.any, () => revealOnScroll(gsap.utils.toArray('[data-reveal]', scope.current!)))
      return () => mm.revert()
    },
    { scope },
  )

  return (
    <section ref={scope} className={styles.intro} aria-labelledby="pin-intro-heading">
      <div className={styles.inner}>
        <article className={styles.card} data-reveal>
          <p className={styles.eyebrow}>{pinIntro.eyebrow}</p>
          <h3 id="pin-intro-heading" className={styles.heading}>
            {pinIntro.heading}
          </h3>
          <p className={styles.body}>{pinIntro.body}</p>
          <a className={styles.action} href={pinterestProfile.url} target="_blank" rel="noopener noreferrer">
            {pinIntro.linkLabel}
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </article>

        <section className={styles.themes} aria-labelledby="pin-themes-heading" data-reveal>
          <h3 id="pin-themes-heading" className={styles.tab}>
            {pinIntro.themesTitle}
          </h3>
          <ul role="list" className={styles.list}>
            {pinIntro.themes.map((theme) => (
              <li key={theme} className={styles.row}>
                <span>{theme}</span>
                <StarIcon className={styles.star} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  )
}
