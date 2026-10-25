// Page 3 — personal visual journal. Paper, intimate type, asymmetric entries, and a lightbox for
// a closer look. Entries come from content/journal.ts.
import { Fragment, useRef } from 'react'
import { revealOnScroll } from '../animation/reveal.ts'
import Lightbox from '../components/journal/Lightbox.tsx'
import { useLightbox, type LightboxImage } from '../components/journal/useLightbox.ts'
import CollageVisual from '../components/work/CollageVisual.tsx'
import { routes } from '../config/site.ts'
import { entries, journalIntro, type JournalImage } from '../content/journal.ts'
import { isTodo } from '../content/work.ts'
import { motionQuery } from '../design/motion.ts'
import { gsap, useGSAP } from '../lib/gsap.ts'
import { Link } from '../router/Router.tsx'
import { useDocumentTheme } from './useDocumentTheme.ts'
import styles from './JournalPage.module.css'

/** All real images across entries, in order, for the lightbox. */
const viewable: (LightboxImage & { ref: JournalImage })[] = entries.flatMap((e) =>
  e.images.filter((i) => i.kind === 'image').map((i) => ({ src: i.src, srcSet: i.srcSet, alt: i.alt, caption: i.caption, ref: i })),
)

function Text({ text, className }: { text: string; className?: string }) {
  if (!isTodo(text)) return <span className={className}>{text}</span>
  return (
    <span className={`${className ?? ''} ${styles.todo}`}>
      <span className={styles.todoTag}>To add</span> {text.replace(/^TODO:\s*/, '')}
    </span>
  )
}

export default function JournalPage() {
  useDocumentTheme('journal', routes.journal.title)
  const root = useRef<HTMLDivElement>(null)
  const lightbox = useLightbox(viewable)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(motionQuery.any, () => revealOnScroll(gsap.utils.toArray('[data-reveal]', root.current!), { y: 40 }))
      // Large screens: images inside an entry drift at slightly different rates (subtle depth).
      mm.add(motionQuery.scene, () => {
        gsap.utils.toArray<HTMLElement>('[data-drift]', root.current!).forEach((el) => {
          const amount = Number(el.dataset.drift)
          gsap.fromTo(el, { y: amount }, { y: -amount, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <div ref={root} className={`theme-studio ${styles.page}`}>
      <header className={styles.head}>
        <p className={styles.eyebrow}>{journalIntro.eyebrow}</p>
        <h1 className={styles.title}>{journalIntro.title}</h1>
        <p className={styles.intro}>{journalIntro.intro}</p>
      </header>

      <ol className={styles.entries} aria-label="Journal entries">
        {entries.map((entry, n) => (
          <li key={entry.id} className={styles.entry} data-layout={entry.layout} data-align={entry.align ?? 'left'} data-reveal>
            <p className={styles.number} aria-hidden="true">
              No. {String(n + 1).padStart(2, '0')}
            </p>

            {entry.images.length > 0 && (
              <div className={styles.images}>
                {entry.images.map((img, i) => {
                  const lightboxIndex = img.kind === 'image' ? viewable.findIndex((v) => v.ref === img) : -1
                  const visual = img.kind === 'image' ? ({ kind: 'image', src: img.src, srcSet: img.srcSet, alt: img.alt } as const) : ({ kind: 'placeholder', tone: img.tone, label: img.label } as const)
                  return (
                    <figure key={i} className={styles.figure} data-i={i} data-drift={entry.layout === 'cluster' ? [18, -14, 26, -8][i % 4] : undefined}>
                      <div className={styles.paper} style={{ aspectRatio: String(img.ratio) }}>
                        {lightboxIndex >= 0 ? (
                          <button type="button" className={styles.zoom} onClick={(e) => lightbox.open(lightboxIndex, e.currentTarget)} aria-label={`Open image: ${img.kind === 'image' ? img.alt : ''}`}>
                            <CollageVisual content={visual} sizes="(min-width: 900px) 28vw, 80vw" />
                          </button>
                        ) : (
                          <CollageVisual content={visual} />
                        )}
                      </div>
                      {img.caption && (
                        <figcaption className={styles.caption}>
                          <Text text={img.caption} />
                        </figcaption>
                      )}
                    </figure>
                  )
                })}
              </div>
            )}

            {(entry.title || entry.date || entry.note) && (
              <div className={styles.text}>
                {entry.title && (
                  <h2 className={styles.entryTitle}>
                    <Text text={entry.title} />
                  </h2>
                )}
                {entry.date && (
                  <p className={styles.date}>
                    <time dateTime={entry.date}>{entry.date}</time>
                  </p>
                )}
                {entry.note && (
                  <p className={styles.note}>
                    {entry.note.split('\n').map((line, i) => (
                      <Fragment key={i}>
                        {i > 0 && <br />}
                        <Text text={line} />
                      </Fragment>
                    ))}
                  </p>
                )}
              </div>
            )}
          </li>
        ))}
      </ol>

      <footer className={styles.foot}>
        <Link to={routes.work.path} className={styles.footLink}>
          <span aria-hidden="true">←</span> Back to work
        </Link>
        <Link to={routes.home.path} className={styles.footLink}>
          Introduction
        </Link>
      </footer>

      <Lightbox {...lightbox.props} />
    </div>
  )
}
