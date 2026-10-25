// A single pin: image (or a marked placeholder), optionally linking to the original pin.
// Presentational only — scenes position and animate it.
import type { CSSProperties } from 'react'
import type { FloatingCardData } from '../floating/types.ts'
import styles from './PinCard.module.css'

type Props = {
  pin: FloatingCardData
  /** Visible caption under the image (gallery). Board pins omit it. */
  caption?: string
  className?: string
  /** Load eagerly (above the fold / start of a pinned scene). */
  eager?: boolean
  /** `sizes` for the responsive image. */
  sizes?: string
  /** Force the slot's aspect class and crop the image to it (board), ignoring `ratio`. */
  crop?: boolean
}

export default function PinCard({ pin, caption, className = '', eager = false, sizes = '(max-width: 767px) 50vw, 300px', crop = false }: Props) {
  const { title, image, srcSet, ratio, alt, href, palette = 'sand', aspect = 'portrait' } = pin
  const style = !crop && ratio ? ({ '--pin-ratio': String(ratio) } as CSSProperties) : undefined

  const media = image ? (
    <img src={image} srcSet={srcSet} sizes={srcSet ? sizes : undefined} alt={alt ?? ''} loading={eager ? 'eager' : 'lazy'} decoding="async" />
  ) : (
    <span className={styles.placeholder} data-palette={palette}>
      <span className={styles.placeholderLabel}>Pin placeholder</span>
    </span>
  )

  return (
    <figure className={`${styles.pin} ${className}`} data-aspect={aspect} data-natural={style ? '' : undefined} style={style}>
      {href ? (
        <a className={styles.media} href={href} target="_blank" rel="noopener noreferrer">
          {media}
          <span className="visually-hidden"> (view pin on Pinterest, opens in a new tab)</span>
        </a>
      ) : (
        <div className={styles.media} role={image ? undefined : 'img'} aria-label={image ? undefined : `${title}, image coming soon`}>
          {media}
        </div>
      )}
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  )
}
