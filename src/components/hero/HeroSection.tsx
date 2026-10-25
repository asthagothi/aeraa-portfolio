// Landing hero. Owns the composition (where each piece sits) and the entrance timeline;
// the child components own only their own appearance.
import { useRef } from 'react'
import { duration, ease, motionQuery } from '../../design/motion.ts'
import { gsap, useGSAP } from '../../lib/gsap.ts'
import BrowserAddressBar from './BrowserAddressBar.tsx'
import ContactWidget from './ContactWidget.tsx'
import HeroPortrait from './HeroPortrait.tsx'
import HeroTypography from './HeroTypography.tsx'
import IntroductionCard from './IntroductionCard.tsx'
import { PORTRAIT_SIZES } from './portrait.ts'
import SkillsCard from './SkillsCard.tsx'
import styles from './HeroSection.module.css'


export default function HeroSection() {
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Content is visible in the HTML by default; the timeline only animates *from* an offset,
      // so with reduced motion (or no JS) everything simply appears in place.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const q = gsap.utils.selector(scope)
        const tl = gsap.timeline({ defaults: { duration: duration.entrance, ease: ease.outExpo } })

        tl.from(q('[data-hero-anim="eyebrow"], [data-hero-anim="title"]'), {
          yPercent: 35,
          autoAlpha: 0,
          stagger: 0.08,
        })
          // Both portrait layers get the same tween so they stay pixel-aligned.
          .from(q('[data-hero-anim="portrait"]'), { y: 24, scale: 1.025, autoAlpha: 0, duration: 1.1 }, 0.05)
          .from(q('[data-hero-anim="intro"]'), { x: -40, autoAlpha: 0 }, 0.3)
          .from(q('[data-hero-anim="skills"]'), { x: 40, autoAlpha: 0, stagger: 0.1 }, 0.38)
          .from(q('[data-hero-anim="browser"]'), { y: 16, autoAlpha: 0, duration: duration.slow }, 0.6)
          .from(q('[data-hero-anim="contact"]'), { y: 24, scale: 0.96, autoAlpha: 0 }, 0.72)
      })

      // Hand-off to the phone section (desktop scene only): as the next section slides up over
      // it, the hero recedes more slowly than the page, easing back and softening, so it reads as
      // one continuous move into the phone rather than a cut. Scrubbed; reverses exactly.
      mm.add(motionQuery.fold, () => {
        gsap.fromTo(
          scope.current!.querySelector('[data-hero-stage]'),
          { y: 0, scale: 1, opacity: 1 },
          {
            y: () => window.innerHeight * 0.38,
            scale: 0.94,
            opacity: 0.35,
            ease: 'none',
            transformOrigin: '50% 30%',
            scrollTrigger: { trigger: scope.current, start: 'bottom bottom', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true },
          },
        )
      })

      return () => mm.revert()
    },
    { scope },
  )

  return (
    <section ref={scope} className={styles.hero}>
      <div className={styles.stage} data-hero-stage>
        <HeroPortrait className={styles.portrait} sizes={PORTRAIT_SIZES} />
        <HeroTypography className={styles.headline} />
        {/* Left column: the intro card with the contact card a fixed gap below it (desktop), so they never overlap. */}
        <div className={styles.leftCol}>
          <IntroductionCard className={styles.intro} />
          <ContactWidget className={styles.contact} />
        </div>
        <SkillsCard className={styles.skills} />
        <BrowserAddressBar className={styles.browser} />
      </div>
    </section>
  )
}
