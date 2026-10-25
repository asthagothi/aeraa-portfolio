// State for <Lightbox>: which image (if any) is open, and which control opened it.
// The opener is passed explicitly because some browsers (Safari) don't focus buttons on click,
// so document.activeElement can't be relied on. Every close path (button, Escape, backdrop) goes
// through `close`, which hands focus back to the opener.
import { useCallback, useRef, useState } from 'react'

export type LightboxImage = { src: string; srcSet?: string; alt: string; caption?: string }

export function useLightbox(images: LightboxImage[]) {
  const [index, setIndex] = useState<number | null>(null)
  const opener = useRef<HTMLElement | null>(null)

  const open = useCallback((i: number, trigger?: HTMLElement | null) => {
    opener.current = trigger ?? (document.activeElement as HTMLElement | null)
    setIndex(i)
  }, [])

  const close = useCallback(() => {
    setIndex(null)
    const el = opener.current
    opener.current = null
    // After the dialog has closed and released focus.
    requestAnimationFrame(() => el?.focus())
  }, [])

  return { open, props: { images, index, onClose: close, onIndex: setIndex } }
}
