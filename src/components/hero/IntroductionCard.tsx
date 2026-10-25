import { routes } from '../../config/site.ts'
import { heroIntro } from '../../content/hero.ts'
import { Link } from '../../router/Router.tsx'
import styles from './IntroductionCard.module.css'

type Props = { className?: string }

export default function IntroductionCard({ className = '' }: Props) {
  return (
    <article className={`${styles.card} ${className}`} aria-labelledby="intro-heading" data-hero-anim="intro">
      <h2 id="intro-heading" className={styles.heading}>
        {heroIntro.heading}
      </h2>
      <p className={styles.roles}>{heroIntro.roles}</p>
      <p className={styles.text}>{heroIntro.body}</p>
      <div className={styles.actions}>
        <Link className={styles.action} to={routes.work.path}>
          <span>{heroIntro.actionLabel}</span>
          <span className={styles.arrow} aria-hidden="true">
            <svg viewBox="0 0 16 16" width="12" height="12">
              <path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Link>
      </div>
    </article>
  )
}
