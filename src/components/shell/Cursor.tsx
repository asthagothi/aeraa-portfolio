// Custom cursor: a small dot that follows the pointer exactly (no trailing lag) and adapts to what
// is underneath it, in the site palette.
//   light surfaces → Silent Ocean dot
//   dark surfaces  → Butter dot (reads on Chocopie / Silent Ocean)
//   photos         → glowing Butter dot with a hairline Silent Ocean edge (reads on any image)
// Each dot carries a soft haze in its own colour (subtle on light, glowing on dark), as in the reference.
//   [data-cursor="view"] → a Chocopie glass pill with a Blue mark and a Butter label (data-cursor-label, default "View")
// Only for fine pointers that can hover (mouse, trackpad, pen); touch keeps its native behaviour.
// The surface is re-read on pointer move and on scroll (content moves under a still pointer),
// at most once per frame. The native cursor comes back over the image viewer (a top-layer
// <dialog> the dot can't sit above).
import { useEffect, useRef, useState } from 'react'
import styles from './Cursor.module.css'

type Variant = 'light' | 'dark' | 'media' | 'view'

const FINE = '(hover: hover) and (pointer: fine)'

function parseRgb(color: string): [number, number, number, number] | null {
  const m = color.match(/rgba?\(([^)]+)\)/)
  if (!m) return null
  const [r, g, b, a = '1'] = m[1].split(/[\s,/]+/).filter(Boolean)
  return [Number(r), Number(g), Number(b), Number(a)]
}

/** Relative luminance (WCAG) of an sRGB colour, 0–1. */
function luminance(r: number, g: number, b: number) {
  const lin = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

/** What the pointer is over: the first opaque surface up the tree decides. */
function surfaceAt(x: number, y: number): { variant: Variant; label?: string } {
  const hit = document.elementFromPoint(x, y)
  if (!hit) return { variant: 'light' }
  const view = hit.closest<HTMLElement>('[data-cursor="view"]')
  if (view) return { variant: 'view', label: view.dataset.cursorLabel || 'View' }
  for (let n: Element | null = hit; n && n !== document.documentElement; n = n.parentElement) {
    if (n instanceof HTMLImageElement || n instanceof HTMLVideoElement || n instanceof HTMLCanvasElement) {
      const r = n.getBoundingClientRect()
      if (r.width * r.height > 96 * 96) return { variant: 'media' }
      continue
    }
    const cs = getComputedStyle(n)
    const bg = parseRgb(cs.backgroundColor)
    if (bg && bg[3] >= 0.5) return { variant: luminance(bg[0], bg[1], bg[2]) < 0.2 ? 'dark' : 'light' }
    if (cs.backgroundImage.includes('url(')) return { variant: 'media' }
  }
  return { variant: 'light' }
}

export default function Cursor() {
  const [enabled, setEnabled] = useState(() => typeof window !== 'undefined' && window.matchMedia(FINE).matches)
  const dot = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const query = window.matchMedia(FINE)
    const sync = () => setEnabled(query.matches)
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const el = dot.current!
    const html = document.documentElement
    html.classList.add('has-custom-cursor')

    let x = -100
    let y = -100
    let frame = 0
    let current: Variant | null = null
    let currentLabel = ''

    const render = () => {
      frame = 0
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      const s = surfaceAt(x, y)
      if (s.variant !== current) {
        current = s.variant
        el.dataset.variant = s.variant
      }
      const text = s.label ?? ''
      if (text !== currentLabel) {
        currentLabel = text
        label.current!.textContent = text
      }
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render)
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        el.dataset.hidden = 'true'
        return
      }
      x = e.clientX
      y = e.clientY
      delete el.dataset.hidden
      schedule()
    }
    const onLeave = () => (el.dataset.hidden = 'true')
    const onDown = () => (el.dataset.pressed = 'true')
    const onUp = () => delete el.dataset.pressed

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    window.addEventListener('scroll', schedule, { passive: true })
    html.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('scroll', schedule)
      html.removeEventListener('pointerleave', onLeave)
      html.classList.remove('has-custom-cursor')
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <div ref={dot} className={styles.cursor} data-variant="light" data-hidden="true" aria-hidden="true">
      <span className={styles.shape}>
        <span className={styles.mark} />
        <span ref={label} className={styles.label} />
      </span>
    </div>
  )
}
