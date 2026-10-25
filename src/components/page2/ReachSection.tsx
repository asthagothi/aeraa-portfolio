// Pinterest reach — historical figures read from the analytics screenshot, with their date range,
// what each metric means, and the exact values Pinterest displayed.
import { useRef } from 'react'
import { revealOnScroll } from '../../animation/reveal.ts'
import { analytics, pins, pinterestProfile } from '../../content/page2.ts'
import { motionQuery } from '../../design/motion.ts'
import { gsap, useGSAP } from '../../lib/gsap.ts'
import styles from './ReachSection.module.css'

export default function ReachSection({ id }: { id: string }) {
  const scope = useRef<HTMLElement>(null)
  const { lead, metrics, topPin } = analytics
  const topPinImage = pins.find((p) => p.id === topPin.pinId)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(motionQuery.any, () => revealOnScroll(gsap.utils.toArray('[data-reveal]', scope.current!)))
      return () => mm.revert()
    },
    { scope },
  )

  return (
    <section ref={scope} id={id} className={styles.reach} aria-labelledby={`${id}-heading`}>
      <div className={styles.inner}>
        <header className={styles.head} data-reveal>
          <p className={styles.eyebrow}>{analytics.eyebrow}</p>
          <h3 id={`${id}-heading`} className={styles.heading}>
            {analytics.heading}
          </h3>
          <p className={styles.meta}>
            <time dateTime="2026-09-20/2026-10-20">{analytics.rangeLabel}</time>
            <span aria-hidden="true"> · </span>
            {analytics.source}
          </p>
          {pinterestProfile.monthlyViews && (
            <div className={styles.profile}>
              <p className={styles.profileFigures}>
                <span className={styles.profileLabel}>On my profile · {pinterestProfile.capturedLabel}</span>
                <span>
                  <b>{pinterestProfile.monthlyViews}</b> monthly views
                </span>
                {pinterestProfile.followers && (
                  <span>
                    <b>{pinterestProfile.followers}</b> followers
                  </span>
                )}
              </p>
              <p className={styles.profileDef}>{pinterestProfile.monthlyViewsDefinition}</p>
            </div>
          )}
        </header>

        <div className={styles.lead} data-reveal>
          <p className={styles.leadValue}>
            {lead.display}
            <span className="visually-hidden"> {lead.label.toLowerCase()}</span>
          </p>
          <p className={styles.leadLabel} aria-hidden="true">
            {lead.label}
          </p>
          <p className={styles.change}>
            {lead.change} <span>vs previous 30 days</span>
          </p>
          <p className={styles.definition}>{lead.definition}</p>
        </div>

        {/* Dark panel — sibling of the Page 1 skills panel and call widget. */}
        <dl className={styles.panel} data-reveal>
          {metrics.map((m) => (
            <div key={m.id} className={styles.row}>
              <dt>
                <span className={styles.rowLabel}>{m.label}</span>
                <span className={styles.rowDef}>{m.definition}</span>
              </dt>
              <dd>
                <span className={styles.rowValue}>{m.display}</span>
                <span className={styles.rowChange}>{m.change}</span>
              </dd>
            </div>
          ))}
        </dl>

        <aside className={styles.topPin} aria-label={topPin.label} data-reveal>
          {topPinImage?.image && (
            <img className={styles.topPinThumb} src={topPinImage.image} srcSet={topPinImage.srcSet} sizes="72px" alt="" loading="lazy" decoding="async" />
          )}
          <span className={styles.topPinLabel}>{topPin.label}</span>
          <span className={styles.topPinTitle}>“{topPin.title}”</span>
          <span className={styles.topPinValue}>{topPin.display}</span>
        </aside>

        <footer className={styles.notes} data-reveal>
          <p>{analytics.comparisonNote}</p>
          <p>{analytics.abbreviationNote}</p>
        </footer>
      </div>
    </section>
  )
}
