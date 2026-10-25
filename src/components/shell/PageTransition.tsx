// Soft layered page wipe: a sage panel then a cream panel cover the screen, the page swaps
// underneath, and both lift away. About 0.3s before the swap; instant with reduced motion.
import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../../design/motion.ts'
import { gsap } from '../../lib/gsap.ts'
import { useRouter, type TransitionPlayer } from '../../router/routerContext.ts'
import styles from './PageTransition.module.css'

export default function PageTransition() {
  const { setTransition } = useRouter()
  const root = useRef<HTMLDivElement>(null)
  const running = useRef(false)

  useEffect(() => {
    const play: TransitionPlayer = (swap) => {
      const el = root.current
      if (!el || running.current || prefersReducedMotion()) {
        swap()
        return
      }
      running.current = true
      const panels = el.querySelectorAll(`.${styles.panel}`)
      gsap
        .timeline({
          onComplete: () => {
            running.current = false
            gsap.set(el, { visibility: 'hidden' })
          },
        })
        .set(el, { visibility: 'visible' })
        .fromTo(panels, { yPercent: 100 }, { yPercent: 0, duration: 0.3, ease: 'power3.inOut', stagger: 0.06 })
        .add(swap)
        .to(panels, { yPercent: -100, duration: 0.45, ease: 'power3.inOut', stagger: 0.06 }, '+=0.05')
    }
    setTransition(play)
    return () => setTransition(null)
  }, [setTransition])

  return (
    <div ref={root} className={styles.overlay} aria-hidden="true">
      <div className={styles.panel} data-tone="sage" />
      <div className={styles.panel} data-tone="cream" />
    </div>
  )
}
