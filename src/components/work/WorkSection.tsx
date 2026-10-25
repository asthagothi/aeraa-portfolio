// One group of the Work page's project grid, after the reference layout: one wide card above a row
// of three, a few pixels apart. Each card carries a label pill (number on wide cards, name, type,
// year where known) and a status tag, and opens its project in the viewer. Entrances come from the
// page's falling system (data-drop="panel"): the card rises from 96% while its image settles from a
// 115% zoom, and its label follows.
import type { CSSProperties } from 'react'
import type { WorkCard } from '../../content/selectedWork.ts'
import styles from './WorkSection.module.css'

export type OpenCard = (card: WorkCard, el: HTMLElement) => void

function Card({ card, number, wide = false, onOpen }: { card: WorkCard; number: number; wide?: boolean; onOpen: OpenCard }) {
  return (
    <li className={styles.card} data-wide={wide || undefined} data-drop="panel">
      <button type="button" className={styles.cardButton} data-cursor="view" onClick={(e) => onOpen(card, e.currentTarget)}>
        <span className={styles.media} data-fit={card.fit} style={{ '--fill': card.image.fill ?? 'var(--mat)' } as CSSProperties}>
          {card.fit === 'contain' && <img className={styles.backdrop} src={card.image.srcSet.split(' ')[0]} alt="" aria-hidden="true" loading="lazy" decoding="async" />}
          <img src={card.image.src} srcSet={card.image.srcSet} sizes={wide ? '(min-width: 900px) 90vw, 92vw' : '(min-width: 900px) 30vw, 92vw'} alt={card.image.alt} loading="lazy" decoding="async" />
        </span>
        {card.status && (
          <span className={styles.tag} aria-hidden="true">
            {card.status}
          </span>
        )}
        <span className={styles.pill}>
          <span className={styles.dot} aria-hidden="true" />
          {wide && (
            <span className={styles.pillNum} aria-hidden="true">
              [{String(number).padStart(2, '0')}]
            </span>
          )}
          <span className={styles.pillName}>
            <span>{card.name}</span>
            <span aria-hidden="true">{card.name}</span>
          </span>
          <span className={styles.pillType}>{card.type}</span>
          {card.year && <span className={styles.pillYear}>[{card.year}]</span>}
        </span>
        <span className="visually-hidden">: open larger</span>
      </button>
    </li>
  )
}

export default function WorkCards({ group, start, onOpen }: { group: { feature: WorkCard; row: WorkCard[] }; start: number; onOpen: OpenCard }) {
  return (
    <ul role="list" className={styles.grid}>
      <Card card={group.feature} number={start} wide onOpen={onOpen} />
      {group.row.map((c, i) => (
        <Card key={c.image.id} card={c} number={start + i + 1} onOpen={onOpen} />
      ))}
    </ul>
  )
}
