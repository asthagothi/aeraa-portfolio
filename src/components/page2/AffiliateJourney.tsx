// Affiliate marketing: an illustrative pin → product journey, then the storefront area and disclosure.
// The journey is explanatory only — it never implies that every pin leads to a click or a sale.
//
// Modes: pinned + scrubbed step sequence (scene) · static, all steps visible (light / reduced motion).
import { useRef } from 'react'
import { revealOnScroll } from '../../animation/reveal.ts'
import { affiliate, storefrontPins } from '../../content/page2.ts'
import { motionQuery } from '../../design/motion.ts'
import { gsap, useGSAP } from '../../lib/gsap.ts'
import BrowserAddressBar from '../hero/BrowserAddressBar.tsx'
import PinCard from './PinCard.tsx'
import styles from './AffiliateJourney.module.css'

const SCROLL_LENGTH = 2.4 // viewport heights while pinned
// Decorative copy of a storefront pin (no link: the illustration is hidden from assistive tech).
const JOURNEY_PIN = { ...storefrontPins[0], id: 'journey-pin', href: undefined }

export default function AffiliateJourney({ id }: { id: string }) {
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Pinned only where copy and illustration fit side by side within one viewport.
      mm.add(`${motionQuery.scene} and (min-width: 900px) and (min-height: 680px)`, () => {
        const sectionEl = section.current!
        const stageEl = stage.current!
        const q = gsap.utils.selector(stageEl)
        const steps = q('[data-step]')
        sectionEl.dataset.animated = 'true'

        const setActive = (index: number) => steps.forEach((el, i) => el.toggleAttribute('data-active', i === index))
        setActive(0)

        const tl = gsap.timeline({
          defaults: { ease: 'power2.out' },
          scrollTrigger: {
            trigger: stageEl,
            start: 'top top',
            end: () => `+=${SCROLL_LENGTH * window.innerHeight}`,
            pin: stageEl,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => setActive(Math.min(3, Math.floor(self.progress * 4))),
          },
        })
        tl.fromTo(q('[data-part="pin"]'), { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.18 }, 0)
          .fromTo(q('[data-part="hotspot"]'), { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.12, ease: 'back.out(2)' }, 0.27)
          .fromTo(q('[data-part="tag"]'), { x: -12, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.1 }, 0.33)
          .fromTo(q('[data-part="link"]'), { scaleX: 0 }, { scaleX: 1, duration: 0.18, ease: 'none' }, 0.5)
          .fromTo(q('[data-part="destination"]'), { x: 40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.18 }, 0.75)
          .to({}, { duration: 0.05 }) // hold the final step briefly before unpinning

        return () => {
          tl.scrollTrigger?.kill()
          tl.kill()
          gsap.set(q('[data-part]'), { clearProps: 'transform,opacity,visibility' })
          steps.forEach((el) => el.removeAttribute('data-active'))
          delete sectionEl.dataset.animated
        }
      })

      mm.add(motionQuery.any, () => revealOnScroll(gsap.utils.toArray('[data-reveal]', section.current!)))

      return () => mm.revert()
    },
    { scope: section },
  )

  const { products, storefrontUrl } = affiliate

  return (
    <section ref={section} id={id} className={styles.affiliate} aria-labelledby={`${id}-heading`}>
      <div ref={stage} className={styles.stage}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{affiliate.eyebrow}</p>
          <h3 id={`${id}-heading`} className={styles.heading}>
            {affiliate.heading}
          </h3>
          <p className={styles.intro}>{affiliate.intro}</p>
          <ol className={styles.steps}>
            {affiliate.steps.map((step, i) => (
              <li key={step.id} className={styles.step} data-step>
                <span className={styles.stepNum} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>
                  <span className={styles.stepTitle}>{step.title}</span>
                  <span className={styles.stepBody}>{step.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Illustration of the four steps. Decorative: the steps list carries the meaning. */}
        <div className={styles.visual} aria-hidden="true">
          <div className={styles.pin} data-part="pin">
            <PinCard pin={JOURNEY_PIN} sizes="(max-width: 640px) 60vw, 300px" />
            <span className={styles.hotspot} data-part="hotspot" />
            <span className={styles.tag} data-part="tag">
              Product
            </span>
          </div>
          <span className={styles.link} data-part="link">
            <span>link</span>
          </span>
          <div className={styles.destination} data-part="destination">
            <BrowserAddressBar domain="amazon · affiliate link" className={styles.bar} />
            <div className={styles.page}>
              <span className={styles.pageImage} />
              <span className={styles.pageLine} />
              <span className={styles.pageLine} data-short />
              <span className={styles.pageLabel}>Product page · illustration</span>
            </div>
          </div>
        </div>
      </div>

      {/* Storefront and products — normal flow after the pinned sequence. */}
      <div className={styles.shop}>
        <div className={styles.shopHead} data-reveal>
          <h4 className={styles.shopHeading}>{affiliate.storefrontHeading}</h4>
          {storefrontUrl ? (
            <a className={styles.storefront} href={storefrontUrl} target="_blank" rel="noopener noreferrer sponsored">
              {affiliate.storefrontLabel}
              <span className="visually-hidden"> (affiliate link, opens in a new tab)</span>
            </a>
          ) : (
            <p className={styles.pending}>{affiliate.storefrontPending}</p>
          )}
          <p className={styles.disclosure}>{affiliate.disclosure}</p>
        </div>

        <ul role="list" className={styles.products}>
          {products.length > 0
            ? products.map((p) => (
                <li key={p.id} data-reveal>
                  <a className={styles.product} href={p.url} target="_blank" rel="noopener noreferrer sponsored">
                    {p.image ? <img src={p.image} alt={p.alt ?? ''} loading="lazy" decoding="async" /> : <span className={styles.productImage} />}
                    <span className={styles.productTitle}>{p.title}</span>
                    <span className={styles.productNote}>Affiliate link</span>
                  </a>
                </li>
              ))
            : storefrontPins.map((pin) => (
                <li key={pin.id} data-reveal>
                  <PinCard pin={pin} caption={pin.caption} sizes="(max-width: 520px) 50vw, 220px" />
                </li>
              ))}
        </ul>
        {products.length === 0 && (
          <p className={styles.pinsNote} data-reveal>
            {affiliate.storefrontPinsNote}
          </p>
        )}
      </div>
    </section>
  )
}
