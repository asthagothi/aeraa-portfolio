// Presentational card. Knows nothing about motion; the scene positions and animates it.
import type { FloatingCardData } from './types.ts'
import styles from './FloatingCard.module.css'

type Props = {
  card: FloatingCardData
  className?: string
}

export default function FloatingCard({ card, className = '' }: Props) {
  const { title, caption, image, alt, palette = 'mono', aspect = 'portrait' } = card

  return (
    <article className={`${styles.card} ${className}`} data-aspect={aspect}>
      <header className={styles.bar}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.controls} aria-hidden="true">
          <i />
          <i />
        </span>
      </header>
      <div className={styles.media}>
        {image ? (
          <img src={image} alt={alt ?? ''} loading="lazy" decoding="async" />
        ) : (
          <span className={styles.placeholder} data-palette={palette} aria-hidden="true" />
        )}
      </div>
      {caption && <p className={styles.caption}>{caption}</p>}
    </article>
  )
}
