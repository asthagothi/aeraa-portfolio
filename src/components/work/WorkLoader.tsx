// The Work page's opening, after the reference site (nikastern.framer.media): four near-black columns
// labelled [01]–[04], their thin dividing lines bowed slightly like a lens. One digit of the year
// rises into each column, left to right, while each column's corner square lights up in turn and a
// red line grows along the bottom; then the columns lift away to reveal the page. Plays each time
// the Work page opens; skipped with reduced motion; purely decorative (hidden from assistive tech).
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { prefersReducedMotion } from '../../design/motion.ts'
import styles from './WorkLoader.module.css'

const YEAR = String(new Date().getFullYear())
/** Digits rise, the squares and the line fill, a short hold, then the columns lift (see the CSS). */
const TOTAL_MS = 2900

/** The column dividers, bowed outward from the centre (in a 0–100 box). */
const DIVIDERS = [0, 25, 50, 75, 100].map((x) => {
  const bow = (x - 50) / 50 // -1 at the left edge, 1 at the right
  return `M ${x} 0 Q ${x + bow * 1.1} 50 ${x} 100`
})

export default function WorkLoader() {
  const [show, setShow] = useState(() => typeof window !== 'undefined' && !prefersReducedMotion())

  useEffect(() => {
    if (!show) return
    const t = window.setTimeout(() => setShow(false), TOTAL_MS)
    return () => window.clearTimeout(t)
  }, [show])

  if (!show) return null
  // In the body, above the nav: the page itself is its own stacking context.
  return createPortal(
    <div className={styles.loader} aria-hidden="true">
      <div className={styles.grid}>
        {[...YEAR].map((digit, i) => (
          <div key={i} className={styles.column} style={{ ['--i' as string]: i }}>
            <div className={styles.head}>
              <span>[ {String(i + 1).padStart(2, '0')} ]</span>
              <span className={styles.square} />
            </div>
            {i === 0 && (
              <div className={styles.name}>
                <span>Astha Gothi</span>
                <span className={styles.edition}>Work</span>
              </div>
            )}
            <span className={styles.digit}>{digit}</span>
          </div>
        ))}
        <svg className={styles.lines} viewBox="0 0 100 100" preserveAspectRatio="none">
          {DIVIDERS.map((d) => (
            <path key={d} d={d} />
          ))}
        </svg>
        <span className={styles.progress} />
      </div>
    </div>,
    document.body,
  )
}
