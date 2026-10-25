// Renders one collage element: an image, a marked placeholder, an abstract shape,
// a typographic fragment, or a small interface fragment. Purely presentational.
import type { FragmentContent } from '../../content/work.ts'
import styles from './CollageVisual.module.css'

type Props = {
  content: FragmentContent
  /** `sizes` for responsive images. */
  sizes?: string
  eager?: boolean
  className?: string
}

export default function CollageVisual({ content, sizes = '200px', eager = false, className = '' }: Props) {
  switch (content.kind) {
    case 'image':
      return (
        <img
          className={`${styles.image} ${className}`}
          src={content.src}
          srcSet={content.srcSet}
          sizes={content.srcSet ? sizes : undefined}
          alt={content.alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          style={content.focus ? { objectPosition: content.focus } : undefined}
        />
      )
    case 'placeholder':
      return (
        <div className={`${styles.placeholder} ${className}`} data-tone={content.tone} role="img" aria-label={`${content.label} (placeholder)`}>
          {content.glyph && <span className={styles.glyph} data-glyph={content.glyph} aria-hidden="true" />}
          <span className={styles.placeholderLabel} aria-hidden="true">
            Placeholder · {content.label}
          </span>
        </div>
      )
    case 'shape':
      return <span className={`${styles.shape} ${className}`} data-shape={content.shape} data-tone={content.tone} aria-hidden="true" />
    case 'type':
      return (
        <span className={`${styles.type} ${className}`} data-style={content.style} aria-hidden="true">
          {content.text}
        </span>
      )
    case 'ui':
      return (
        <span className={`${styles.ui} ${className}`} data-part={content.part} aria-hidden="true">
          {content.part === 'window' && (
            <>
              <i />
              <i />
              <i />
            </>
          )}
          {content.part === 'swatches' && (
            <>
              <i data-tone="sage" />
              <i data-tone="botanical" />
              <i data-tone="olive" />
              <i data-tone="cream" />
            </>
          )}
        </span>
      )
  }
}
