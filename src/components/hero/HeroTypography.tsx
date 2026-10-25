import { heroHeadline } from '../../content/hero.ts'
import styles from './HeroTypography.module.css'

type Props = { className?: string }

export default function HeroTypography({ className = '' }: Props) {
  return (
    <h1 className={`${styles.headline} ${className}`}>
      <span className={`${styles.eyebrow} t-eyebrow`} data-hero-anim="eyebrow">
        {heroHeadline.eyebrow}
      </span>
      <span className={`${styles.title} t-display`} data-hero-anim="title">
        {heroHeadline.title}
      </span>
    </h1>
  )
}
