// The photograph and its background-removed cut-out, rendered as two pixel-aligned layers.
// They are siblings (not wrapped) so the headline can be stacked between them:
// photo → headline → cut-out. Both share the same geometry class from the parent.
import { portraitCutout, portraitPhoto } from './portrait.ts'
import styles from './HeroPortrait.module.css'

type Props = {
  /** Positions and sizes both layers identically. */
  className?: string
  /** `sizes` attribute describing the rendered width of the layers. */
  sizes: string
}

const WIDTH = 1024
const HEIGHT = 1536

export default function HeroPortrait({ className = '', sizes }: Props) {
  return (
    <>
      <img
        className={`${styles.layer} ${styles.photo} ${className}`}
        src={portraitPhoto.src}
        srcSet={portraitPhoto.srcSet}
        sizes={sizes}
        width={WIDTH}
        height={HEIGHT}
        alt="Portrait of the designer seated on a chair among retro computers, a video camera and a game controller."
        fetchPriority="high"
        decoding="async"
        data-hero-anim="portrait"
        data-hero-photo
      />
      <img
        className={`${styles.layer} ${styles.cutout} ${className}`}
        src={portraitCutout.src}
        srcSet={portraitCutout.srcSet}
        sizes={sizes}
        width={WIDTH}
        height={HEIGHT}
        alt=""
        aria-hidden="true"
        decoding="async"
        data-hero-anim="portrait"
        data-hero-figure
      />
    </>
  )
}
