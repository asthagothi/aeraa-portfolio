// End of Page 2 → Page 3 (YouTube & dance).
// As the section scrolls in, a row of still pins converges into a single vertical video frame:
// from curated stills to movement, introducing the channel line "art in motion."
// Scrubbed but not pinned. Static (frame and text only) on reduced motion.
import { useRef } from 'react'
import { revealOnScroll } from '../../animation/reveal.ts'
import { outro, pins } from '../../content/page2.ts'
import { motionQuery } from '../../design/motion.ts'
import { gsap, useGSAP } from '../../lib/gsap.ts'
import PinCard from './PinCard.tsx'
import styles from './OutroToMotion.module.css'

const ROW = pins.slice(7, 12)
/** Horizontal start offsets (in pin widths) for the converging row. */
const SPREAD = [-2.4, -1.2, 0, 1.2, 2.4]

export default function OutroToMotion({ id }: { id: string }) {
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(motionQuery.any, () => {
        const el = scope.current!
        el.dataset.animated = 'true'
        const q = gsap.utils.selector(el)
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: q(`.${styles.visual}`)[0], start: 'top 85%', end: 'center 45%', scrub: 0.5 },
        })
        q('[data-row-pin]').forEach((pin, i) => {
          tl.fromTo(pin, { xPercent: SPREAD[i] * 100, rotate: (i - 2) * 4, autoAlpha: 1 }, { xPercent: 0, rotate: 0, scale: 0.7, autoAlpha: 0, duration: 1 }, 0)
        })
        tl.fromTo(q(`.${styles.frame}`), { scale: 0.55, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.6 }, 0.4)

        revealOnScroll(q('[data-reveal]'))

        return () => {
          delete el.dataset.animated
        }
      })

      return () => mm.revert()
    },
    { scope },
  )

  return (
    <section ref={scope} id={id} className={styles.outro} aria-labelledby={`${id}-heading`}>
      <div className={styles.visual} aria-hidden="true">
        <ul role="list" className={styles.row}>
          {ROW.map((pin) => (
            <li key={pin.id} className={styles.rowPin} data-row-pin>
              <PinCard pin={{ ...pin, aspect: 'tall', href: undefined }} crop sizes="170px" />
            </li>
          ))}
        </ul>
        {/* Vertical video frame — the next page's medium. */}
        <div className={styles.frame}>
          <span className={styles.play} />
          <span className={styles.frameHandle}>{outro.channelHandle}</span>
        </div>
      </div>

      <div className={styles.copy}>
        <p className={styles.eyebrow} data-reveal>
          {outro.eyebrow}
        </p>
        <h2 id={`${id}-heading`} className={styles.heading} data-reveal>
          {outro.heading}
        </h2>
        <p className={styles.body} data-reveal>
          {outro.body}
        </p>
        <a className={styles.link} href={outro.channelUrl} target="_blank" rel="noopener noreferrer" data-reveal>
          {outro.linkLabel} · {outro.channelHandle}
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      </div>
    </section>
  )
}
