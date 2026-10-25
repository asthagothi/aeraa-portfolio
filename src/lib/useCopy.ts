// Copy text to the clipboard with a short "copied" state for the button and a live announcement.
// If the clipboard is unavailable, nothing changes and the visible mailto link still works.
import { useCallback, useRef, useState } from 'react'

export function useCopy(text: string | null | undefined, resetMs = 2000) {
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)
  const copy = useCallback(async () => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), resetMs)
    } catch {
      /* clipboard unavailable */
    }
  }, [text, resetMs])
  return { copied, copy }
}
