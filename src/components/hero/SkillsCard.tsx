// Skills panel. Each row is a button that reveals a floating annotation card describing the skill:
// hover or keyboard focus shows it, a click or tap pins it (tap another row to switch), and
// Escape or a tap elsewhere closes it. The card is portalled to <body> so the hero's clipping
// never cuts it off, and it is placed beside the panel (or below the row on narrow screens)
// without moving any row.
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { heroSkills, heroSkillsTitle, type Skill } from '../../content/hero.ts'
import { prefersReducedMotion } from '../../design/motion.ts'
import { StarIcon } from '../ui/icons.tsx'
import styles from './SkillsCard.module.css'

type Props = {
  className?: string
  title?: string
  skills?: Skill[]
}

type Placement = { x: number; y: number; width: number; side: 'left' | 'right' | 'below' | 'above' }

const GAP = 14
const MARGIN = 16
const CARD_W = 300

/** Where the card goes for the active row: beside the panel if there is room, else below/above the row. */
function place(row: DOMRect, list: DOMRect, card: { width: number; height: number }): Placement {
  const vw = document.documentElement.clientWidth
  const vh = window.innerHeight
  const top = Math.min(Math.max(row.top + row.height / 2 - card.height / 2, MARGIN + 64), vh - MARGIN - card.height)

  if (list.left - GAP - card.width >= MARGIN) return { x: list.left - GAP - card.width, y: top, width: card.width, side: 'left' }
  if (list.right + GAP + card.width <= vw - MARGIN) return { x: list.right + GAP, y: top, width: card.width, side: 'right' }

  // Narrow screens: span the panel's width, just under the row (or over it near the bottom).
  const width = Math.min(list.width, vw - 2 * MARGIN)
  const x = Math.min(Math.max(list.left, MARGIN), vw - MARGIN - width)
  const below = row.bottom + 8
  if (below + card.height <= vh - MARGIN) return { x, y: below, width, side: 'below' }
  return { x, y: Math.max(row.top - 8 - card.height, MARGIN), width, side: 'above' }
}

export default function SkillsCard({ className = '', title = heroSkillsTitle, skills = heroSkills }: Props) {
  const [active, setActive] = useState<number | null>(null)
  const [pinned, setPinned] = useState(false)
  const [side, setSide] = useState<Placement['side'] | null>(null)
  const panelRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([])
  const cardRef = useRef<HTMLDivElement>(null)
  /** Whether the card was already showing before this placement (glide) or is just opening (jump). */
  const wasOpen = useRef(false)
  /** Opened by mouse hover (closes on scroll), as opposed to keyboard focus or a tap (follows the row). */
  const viaHover = useRef(false)
  const cardId = useId()

  const close = useCallback(() => {
    setActive(null)
    setPinned(false)
  }, [])

  // Measure and place the card whenever the active row changes, and on resize/scroll.
  const reposition = useCallback(() => {
    if (active === null) {
      wasOpen.current = false
      return
    }
    const row = rowRefs.current[active]
    const panel = panelRef.current
    const card = cardRef.current
    if (!row || !panel || !card) return
    // The panel section itself never animates (the hero entrance slides its tab and list), so its
    // box is the reliable horizontal reference even mid-entrance.
    const listRect = panel.getBoundingClientRect()
    // Width first (narrow screens use the panel width), then height at that width.
    const narrow = listRect.left - GAP - CARD_W < MARGIN && listRect.right + GAP + CARD_W > document.documentElement.clientWidth - MARGIN
    card.style.width = `${narrow ? Math.min(listRect.width, document.documentElement.clientWidth - 2 * MARGIN) : CARD_W}px`
    const p = place(row.getBoundingClientRect(), listRect, { width: card.offsetWidth, height: card.offsetHeight })
    // Written directly (page coordinates; the card lives in <body>). When the card is just
    // opening it appears in place; only moves between rows while open glide.
    // (Only top/left lose their transition here; the fade and lift still play.)
    const jump = !wasOpen.current
    if (jump) card.style.transitionProperty = 'opacity, visibility, transform'
    card.style.left = `${p.x + window.scrollX}px`
    card.style.top = `${p.y + window.scrollY}px`
    if (jump) {
      void card.offsetWidth
      card.style.transitionProperty = ''
    }
    wasOpen.current = true
    setSide(p.side)
  }, [active])

  useLayoutEffect(reposition, [reposition])

  useEffect(() => {
    if (active === null) return
    window.addEventListener('resize', reposition)
    // Hover cards close on scroll (the row moves away from the pointer); focused or pinned ones follow.
    const onScroll = () => (viaHover.current && !pinned ? close() : reposition())
    window.addEventListener('scroll', onScroll, { passive: true })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        rowRefs.current[active]?.focus()
        close()
      }
    }
    document.addEventListener('keydown', onKey)
    // A tap or click anywhere outside the panel closes a pinned card.
    const onPointerDown = (e: PointerEvent) => {
      if (!listRef.current?.contains(e.target as Node)) close()
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [active, pinned, reposition, close])

  // Restrained tilt: the card leans a little toward the pointer's position along the row.
  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const card = cardRef.current
    if (!card || e.pointerType !== 'mouse' || prefersReducedMotion()) return
    const r = e.currentTarget.getBoundingClientRect()
    const dx = (e.clientX - r.left) / r.width - 0.5
    const dy = (e.clientY - r.top) / r.height - 0.5
    card.style.setProperty('--tilt-x', `${(dx * 8).toFixed(2)}px`)
    card.style.setProperty('--tilt-y', `${(dy * 4).toFixed(2)}px`)
    card.style.setProperty('--tilt-r', `${(dx * 1.4).toFixed(2)}deg`)
  }

  // Keep showing the last skill while the card fades out.
  const [lastShown, setLastShown] = useState(0)
  if (active !== null && active !== lastShown) setLastShown(active)
  const shown = active ?? lastShown
  const skill = skills[shown]
  const open = active !== null && side !== null

  return (
    <section ref={panelRef} className={`${styles.panel} ${className}`} aria-labelledby="skills-heading">
      <h2 id="skills-heading" className={styles.tab} data-hero-anim="skills">
        {title}
      </h2>
      <ul
        ref={listRef}
        role="list"
        className={styles.list}
        data-hero-anim="skills"
        onPointerLeave={(e) => {
          if (e.pointerType === 'mouse' && !pinned) close()
        }}
      >
        {skills.map((s, i) => (
          <li key={s.label} className={styles.item} data-highlight={s.highlight || undefined}>
            <button
              ref={(el) => {
                rowRefs.current[i] = el
              }}
              type="button"
              className={styles.row}
              data-active={active === i || undefined}
              aria-expanded={active === i}
              aria-controls={cardId}
              aria-describedby={active === i ? cardId : undefined}
              onPointerEnter={(e) => {
                if (e.pointerType === 'mouse' && !pinned) {
                  viaHover.current = true
                  setActive(i)
                }
              }}
              onPointerMove={onPointerMove}
              onFocus={() => {
                if (!pinned) {
                  viaHover.current = false
                  setActive(i)
                }
              }}
              onBlur={(e) => {
                // Keep it open while focus moves between rows; close when focus leaves the panel.
                if (!pinned && !listRef.current?.contains(e.relatedTarget as Node)) close()
              }}
              onClick={() => {
                if (active === i && pinned) close()
                else {
                  viaHover.current = false
                  setActive(i)
                  setPinned(true)
                }
              }}
            >
              <span>{s.label}</span>
              <StarIcon className={styles.star} />
            </button>
          </li>
        ))}
      </ul>

      {createPortal(
        <div
          ref={cardRef}
          id={cardId}
          role="note"
          className={styles.note}
          data-open={open || undefined}
          data-side={side ?? undefined}
          aria-hidden={!open}
        >
          <p className={styles.noteMeta} aria-hidden="true">
            <span>No. {String(shown + 1).padStart(2, '0')}</span>
            <StarIcon className={styles.noteStar} />
          </p>
          <p className={styles.noteTitle}>{skill.label}</p>
          <p className={styles.noteBody}>{skill.description}</p>
        </div>,
        document.body,
      )}
    </section>
  )
}
