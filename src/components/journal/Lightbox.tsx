// Accessible image viewer on the native <dialog>: focus moves to Close on open and back to the
// opener on close (see useLightbox). Escape closes, arrow keys / buttons move between images, clicking the backdrop closes.
import { useCallback, useEffect, useRef } from 'react'
import styles from './Lightbox.module.css'

import type { LightboxImage } from './useLightbox.ts'

type Props = {
  images: LightboxImage[]
  index: number | null
  onClose: () => void
  onIndex: (i: number) => void
}

export default function Lightbox({ images, index, onClose, onIndex }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const image = index !== null ? images[index] : null
  const many = images.length > 1

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (image && !d.open) {
      d.showModal()
      d.querySelector<HTMLButtonElement>('[data-close]')?.focus()
    }
    if (!image && d.open) d.close()
  }, [image])

  const step = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return
      onIndex((index + dir + images.length) % images.length)
    },
    [index, images.length, onIndex],
  )

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-label={image ? `Image: ${image.alt}` : 'Image viewer'}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialog.current) onClose()
      }}
      onKeyDown={(e) => {
        if (!many) return
        if (e.key === 'ArrowRight') step(1)
        if (e.key === 'ArrowLeft') step(-1)
      }}
    >
      {image && (
        <figure className={styles.figure}>
          <img src={image.src} srcSet={image.srcSet} sizes="90vw" alt={image.alt} />
          {(image.caption || many) && (
            <figcaption className={styles.caption}>
              {image.caption && <span>{image.caption}</span>}
              {many && (
                <span className={styles.count}>
                  {index! + 1} / {images.length}
                </span>
              )}
            </figcaption>
          )}
        </figure>
      )}
      <div className={styles.controls}>
        {many && (
          <>
            <button type="button" onClick={() => step(-1)}>
              <span aria-hidden="true">←</span> Previous
            </button>
            <button type="button" onClick={() => step(1)}>
              Next <span aria-hidden="true">→</span>
            </button>
          </>
        )}
        <button type="button" onClick={onClose} data-close>
          Close
        </button>
      </div>
    </dialog>
  )
}
