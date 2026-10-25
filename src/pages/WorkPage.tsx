// Work — the full portfolio page, after the reference site (nikastern.framer.media): faint lines mark
// four columns down the whole page; a loader shows the year one digit per column; every section has a
// "[ 0n ] Label" in the first column and its title from the second. Order: hero (meta row, the title,
// a sections index), 01 Approach (lighting up word by word), 02–04 the project grid (one wide card
// above three per group), 05 Experience (dark notes panel), 06 the Ssensazione case study, 07 an index
// of every project (ticket rows), then contact. Text and photos fall into place as they enter view.
// Only real projects and supplied copy (content/selectedWork.ts). Any image opens in the viewer.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import FallText from '../components/fold/FallText.tsx'
import Lightbox from '../components/journal/Lightbox.tsx'
import { useLightbox } from '../components/journal/useLightbox.ts'
import WorkCards from '../components/work/WorkSection.tsx'
import WorkLoader from '../components/work/WorkLoader.tsx'
import { routes, sections } from '../config/site.ts'
import { heroIntro } from '../content/hero.ts'
import { call, elsewhere } from '../content/home.ts'
import { about, experience, projectImageIds, projects, selectedWorkIntro, ssensazioneMaterials, workCategories, workGrid, type Project, type ProjectId, type WorkCard, type WorkImage } from '../content/selectedWork.ts'
import { motionQuery, prefersReducedMotion } from '../design/motion.ts'
import { gsap, useGSAP } from '../lib/gsap.ts'
import { Link } from '../router/Router.tsx'
import { useDocumentTheme } from './useDocumentTheme.ts'
import styles from './WorkPage.module.css'

const allImages = workCategories.flatMap((c) => c.images)
const imageById = (id: string) => allImages.find((i) => i.id === id)!
const imagesOf = (p: ProjectId) => projectImageIds[p].map(imageById)
const category = (id: string) => workCategories.find((c) => c.id === id)!
const featured: ProjectId = 'ssensazione'
const platformLinks = elsewhere.filter((l) => l.label === 'YouTube' || l.label === 'Pinterest')

/** The three grid sections, in workGrid order (Astha's category copy as their text). */
const groups = [
  { id: 'freelance', label: 'Freelance', title: 'Freelance', unit: 'projects', text: [category('brand-identity').description, category('brand-applications').description] },
  { id: 'website-ui', label: 'Websites', title: category('website-ui').title, unit: 'projects', text: [category('website-ui').description] },
  { id: 'youtube-pinterest', label: 'Channels', title: category('youtube-pinterest').title, unit: 'channels', text: [category('youtube-pinterest').description] },
]

/** One index entry per grid section (the hero's sections box). */
const index = groups.map((g, k) => ({ id: g.id, num: String(k + 2).padStart(2, '0'), unit: g.unit, label: g.title, count: String(g.id === 'youtube-pinterest' ? 2 : 1 + workGrid[k].row.length).padStart(2, '0') }))

type Open = (list: WorkImage[], i: number, el: HTMLElement) => void

/** An image button. `natural` sizes it to the image's own proportions (no letterboxing). */
function Thumb({ image, list, onOpen, className = '', sizes, fit = 'contain', natural = false }: { image: WorkImage; list: WorkImage[]; onOpen: Open; className?: string; sizes: string; fit?: 'contain' | 'top'; natural?: boolean }) {
  return (
    <button
      type="button"
      className={`${styles.thumb} ${className}`}
      style={{ ['--fill' as string]: image.fill ?? 'var(--mat)', ['--ratio' as string]: image.ratio, aspectRatio: natural ? String(image.ratio) : undefined }}
      data-fit={fit}
      data-cursor="view"
      onClick={(e) => onOpen(list, list.indexOf(image), e.currentTarget)}
    >
      <img src={image.src} srcSet={image.srcSet} sizes={sizes} alt={image.alt} loading="lazy" decoding="async" />
      <span className="visually-hidden">Open larger: {image.caption}</span>
    </button>
  )
}

function Row({ title, text }: { title: string; text: string }) {
  return (
    <section className={styles.caseRow} data-drop>
      <h4 className={styles.caseRowTitle}>{title}</h4>
      <p className={styles.caseRowText}>{text}</p>
    </section>
  )
}

/** The featured case study: a header with the facts, the logo large, then the story in rows (heading
 * on the left, text on the right), with the applications between the direction and the outcome. */
function CaseStudy({ id, onOpen }: { id: ProjectId; onOpen: Open }) {
  const p: Project = projects[id]
  const story = p.story!
  const [logo, guide, card] = imagesOf(id)
  const { menu, brochures } = ssensazioneMaterials
  const brochureImages = brochures.flatMap((b) => b.images)
  const list = [logo, guide, card, ...brochureImages, ...menu]
  const rows = story.sections
  return (
    <article className={styles.case} aria-label={`Case study: ${p.name}`}>
      <header className={styles.caseHead} data-drop>
        <dl className={styles.caseMeta}>
          <div>
            <dt>Client</dt>
            <dd>{story.client}</dd>
          </div>
          <div>
            <dt>Year</dt>
            <dd>{story.year}</dd>
          </div>
          <div>
            <dt>Project</dt>
            <dd>{story.kind}</dd>
          </div>
          <div>
            <dt>Tools</dt>
            <dd>{story.tools}</dd>
          </div>
        </dl>
      </header>
      <Thumb image={logo} list={list} onOpen={onOpen} className={styles.caseHero} sizes="(min-width: 1000px) 90vw, 92vw" />
      <div className={styles.caseStory}>
        {rows.slice(0, 3).map((r) => (
          <Row key={r.title} {...r} />
        ))}
      </div>
      <div className={styles.caseArt} data-drop>
        <Thumb image={guide} list={list} onOpen={onOpen} sizes="(min-width: 1000px) 45vw, 92vw" natural />
        <Thumb image={card} list={list} onOpen={onOpen} sizes="(min-width: 1000px) 45vw, 92vw" natural />
      </div>
      <div className={styles.caseStory}>
        <Row {...rows[3]} />
      </div>
      <section className={styles.caseGallery} aria-labelledby={`case-${id}-brochure`} data-drop>
        <header className={styles.caseGalleryHead}>
          <h4 id={`case-${id}-brochure`} className={styles.caseRowTitle}>
            Trifold brochure
          </h4>
          <p className={styles.caseGalleryNote}>Two versions, outside and inside.</p>
        </header>
        {brochures.map((b) => (
          <div key={b.label} className={styles.brochure}>
            <p className={styles.kicker}>{b.label}</p>
            <div className={styles.brochurePages}>
              {b.images.map((im) => (
                <Thumb key={im.id} image={im} list={list} onOpen={onOpen} sizes="(min-width: 900px) 45vw, 92vw" natural />
              ))}
            </div>
          </div>
        ))}
      </section>
      <div className={styles.caseStory}>
        <Row {...rows[4]} />
      </div>
      <section className={styles.caseGallery} aria-labelledby={`case-${id}-menu`} data-drop>
        <header className={styles.caseGalleryHead}>
          <h4 id={`case-${id}-menu`} className={styles.caseRowTitle}>
            Menu
          </h4>
          <p className={styles.caseGalleryNote}>Fifteen pages; the cover and five spreads of the range.</p>
        </header>
        <div className={styles.menuPages}>
          {menu.map((im) => (
            <Thumb key={im.id} image={im} list={list} onOpen={onOpen} sizes="(min-width: 900px) 30vw, 46vw" natural />
          ))}
        </div>
      </section>
      <div className={styles.caseStory}>
        {rows.slice(5).map((r) => (
          <Row key={r.title} {...r} />
        ))}
        <section className={styles.caseRow} data-drop>
          <h4 className={styles.caseRowTitle}>Deliverables</h4>
          <div className={styles.caseRowText}>
            <p>{p.deliverables.join(' · ')}</p>
            {p.palette && (
              <ul role="list" className={styles.swatches}>
                {p.palette.map((c) => (
                  <li key={c.hex}>
                    <span className={styles.swatch} style={{ background: c.hex }} aria-hidden="true" />
                    <span>{c.name}</span>
                    <span className={styles.hex}>{c.hex}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </article>
  )
}

/** A section header, after the reference: "[ 0n ] Label" in the first column; the title (letters
 * rising), then any text and meta, from the second. */
function SectionHead({ id, num, label, title, meta, children }: { id: string; num: string; label: string; title: string; meta?: string; children?: ReactNode }) {
  return (
    <header className={styles.sectionHead}>
      <p className={styles.sectionLabel} data-drop="label">
        [ {num} ] {label}
      </p>
      <h2 id={id} className={styles.sectionTitle} data-drop="letters">
        <FallText text={title} />
      </h2>
      {children && (
        <div className={styles.sectionText} data-drop>
          {children}
        </div>
      )}
      {meta && (
        <p className={styles.sectionMeta} data-drop="label">
          {meta}
        </p>
      )}
    </header>
  )
}

/** Splits text into words for the scroll-linked reveal (each word lights up as it scrolls in). */
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <span key={i} className={styles.word} data-word>
          {w}{' '}
        </span>
      ))}
    </>
  )
}

/** Every project and channel as an index row (the reference's study rows). */
type IndexRow = { card: WorkCard; kind: string }
const indexRows: IndexRow[] = (() => {
  const seen = new Set<string>()
  const rows: IndexRow[] = []
  for (const g of workGrid)
    for (const card of [g.feature, ...g.row]) {
      if (seen.has(card.name)) continue
      seen.add(card.name)
      rows.push({ card, kind: card.status ? `${card.status} project` : card.type === 'YouTube' || card.type === 'Pinterest' ? 'Channel' : 'Design project' })
    }
  return rows
})()

export default function WorkPage() {
  useDocumentTheme('studio', routes.work.title)
  const root = useRef<HTMLDivElement>(null)
  const [list, setList] = useState<WorkImage[]>([])
  const lightbox = useLightbox(list.map((im) => ({ src: im.src, srcSet: im.srcSet, alt: im.alt, caption: im.caption })))
  const open: Open = (l, i, el) => {
    setList(l)
    lightbox.open(i, el)
  }
  const openCard = (card: WorkCard, el: HTMLElement) => open(card.open, Math.max(0, card.open.indexOf(card.image)), el)

  // Falling entrances, after the reference: each [data-drop] block settles into place the first time
  // it comes into view; blocks arriving together are staggered 70ms. Nothing is hidden until the page
  // is marked ready ([data-drops]), so without JS or with reduced motion everything simply shows.
  useEffect(() => {
    const el = root.current!
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) return
    el.dataset.drops = ''
    const io = new IntersectionObserver(
      (entries) => {
        let k = 0
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const t = e.target as HTMLElement
          t.style.setProperty('--drop-delay', `${k++ * 70}ms`)
          t.dataset.in = ''
          io.unobserve(t)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    el.querySelectorAll('[data-drop]').forEach((d) => io.observe(d))
    return () => {
      io.disconnect()
      delete el.dataset.drops
    }
  }, [])

  // The approach paragraph lights up word by word as it scrolls through the view.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(motionQuery.any, () => {
        gsap.fromTo(
          '[data-word]',
          { opacity: 0.16 },
          { opacity: 1, ease: 'none', stagger: 0.08, scrollTrigger: { trigger: '[data-approach]', start: 'top 82%', end: 'bottom 48%', scrub: 0.6 } },
        )
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  const thumbs = [workGrid[0].feature, workGrid[1].feature, workGrid[2].feature]

  return (
    <div ref={root} className={`theme-studio ${styles.page}`}>
      <WorkLoader />
      <span className={styles.columns} aria-hidden="true" />

      {/* ---------- Hero ---------- */}
      <header className={styles.hero}>
        <ul role="list" className={styles.heroMeta} aria-label="About this page">
          <li data-drop="label">[ Work ]</li>
          <li data-drop="label">Astha Gothi · Aeraa</li>
          <li data-drop="label">Graphic &amp; UI/UX design</li>
          <li data-drop="label">Projects [{String(indexRows.length).padStart(2, '0')}]</li>
        </ul>
        <h1 className={styles.heroTitle} data-drop="letters">
          <FallText text="Work" />
        </h1>
        <p className={styles.heroShadow} aria-hidden="true" data-drop="letters">
          <FallText text="Aeraa" />
        </p>
        {/* The sections as tickets, after the reference's concept cards: the name on the card, a
            perforated stub below (count, section number). On hover the stub tears down a little and
            its label rolls to "View section". */}
        <nav className={styles.heroIndex} aria-label="Work sections">
          <p className={styles.heroIndexLabel} data-drop="label">
            Sections
          </p>
          <ol role="list" className={styles.tickets}>
            {index.map((s) => (
              <li key={s.id} data-drop="panel">
                <Link to={`#${s.id}`} className={styles.ticket}>
                  <span className={styles.ticketFace}>
                    <span className={styles.ticketName}>{s.label}</span>
                  </span>
                  <span className={styles.ticketStub}>
                    <span className={styles.ticketRoll}>
                      <span>
                        <span className={styles.dot} aria-hidden="true" />
                        {s.count} {s.unit}
                      </span>
                      <span aria-hidden="true">
                        <span className={styles.dot} />
                        View section
                      </span>
                    </span>
                    <span className={styles.ticketNum} aria-hidden="true">
                      [ {s.num} ]
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </header>

      <div className={styles.strip}>
        <div className={styles.stripLeft} data-drop="row">
          <span className={styles.stripThumbs} aria-hidden="true">
            {thumbs.map((c) => (
              <img key={c.image.id} src={c.image.srcSet.split(' ')[0]} alt="" loading="lazy" decoding="async" />
            ))}
          </span>
          <span>
            <span className={styles.stripRole}>{experience.role}</span>
            <span className={styles.stripOrg}>{experience.org}</span>
          </span>
        </div>
        <p className={styles.stripText} data-drop>
          {heroIntro.roles}
        </p>
      </div>

      {/* ---------- 01 Approach ---------- */}
      <section className={styles.approach} aria-labelledby="approach-title" data-approach>
        <p className={styles.sectionLabel} data-drop="label">
          [ 01 ] Approach
        </p>
        <h2 id="approach-title" className="visually-hidden">
          Approach
        </h2>
        <p className={styles.approachLead}>
          <Words text={selectedWorkIntro.intro} />
        </p>
        <div className={styles.approachText} data-drop>
          {about.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
        <Link to="#freelance" className={styles.darkButton} data-drop="row">
          <span className={styles.dot} aria-hidden="true" />
          See the work
        </Link>
      </section>

      {/* ---------- 02–04 The project grid, one section per group ---------- */}
      {groups.map((g, k) => (
        <section key={g.id} id={g.id} className={styles.section} aria-labelledby={`${g.id}-title`}>
          <SectionHead id={`${g.id}-title`} num={String(k + 2).padStart(2, '0')} label={g.label} title={g.title} meta={`${index[k].count} ${g.unit}`}>
            {g.text.map((t) => (
              <p key={t.slice(0, 24)}>{t}</p>
            ))}
          </SectionHead>
          <WorkCards group={workGrid[k]} start={k * 4 + 1} onOpen={openCard} />
          {g.id === 'youtube-pinterest' && (
            <p className={styles.platformLinks} data-drop="label">
              {platformLinks.map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label} {l.handle} <span aria-hidden="true">↗</span>
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              ))}
            </p>
          )}
        </section>
      ))}

      {/* ---------- 05 Experience (the reference's dark notes panel) ---------- */}
      <section className={styles.notes} aria-labelledby="experience-title" data-drop="panel">
        <span className={styles.notesColumns} aria-hidden="true" />
        <div className={styles.notesSide}>
          <p className={styles.sectionLabel}>[ 05 ] Experience</p>
          <p className={styles.notesOrg}>{experience.org}</p>
        </div>
        <div className={styles.notesMain}>
          <h2 id="experience-title" className={styles.notesTitle}>
            {experience.role}
          </h2>
          <ol role="list" className={styles.notesList}>
            {experience.points.map((pt, i) => (
              <li key={pt}>
                <span className={styles.notesNum}>{String(i + 1).padStart(2, '0')}</span>
                <span>{pt}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- 06 Case study ---------- */}
      <section className={styles.section} aria-labelledby="case-title">
        <SectionHead id="case-title" num="06" label="Case study" title={projects[featured].name} meta={(projects[featured] as Project).story?.kind} />
        <CaseStudy id={featured} onOpen={open} />
      </section>

      {/* ---------- 07 Index (the reference's study rows) ---------- */}
      <section className={styles.section} aria-labelledby="index-title">
        <SectionHead id="index-title" num="07" label="Index" title="Every project" meta={`${String(indexRows.length).padStart(2, '0')} entries`} />
        <ol role="list" className={styles.rows}>
          {indexRows.map(({ card, kind }) => (
            <li key={card.name} data-drop="panel">
              <button type="button" className={styles.row} data-cursor="view" onClick={(e) => openCard(card, e.currentTarget)}>
                <span className={styles.rowThumb} style={{ background: card.image.fill ?? 'var(--mat)' }}>
                  <img src={card.image.srcSet.split(' ')[0]} alt="" loading="lazy" decoding="async" data-fit={card.fit} />
                </span>
                <span className={styles.rowBody}>
                  <span className={styles.rowKind}>{kind}</span>
                  <span className={styles.rowMeta}>
                    <span className={styles.dot} aria-hidden="true" />
                    {card.year && <span>{card.year}</span>}
                    <span className={styles.rowName}>{card.name}</span>
                    <span className={styles.rowType}>[{card.type}]</span>
                  </span>
                </span>
                {card.status && <span className={styles.rowTag}>{card.status}</span>}
                <span className="visually-hidden">: open larger</span>
              </button>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Contact ---------- */}
      <footer className={styles.close} data-drop="panel">
        <p className={styles.sectionLabel}>[ Contact ]</p>
        <div className={styles.closeMain}>
          <h2 className={styles.closeTitle}>Have something in mind? Let’s make it happen.</h2>
          {call.email && (
            <a className={styles.closeEmail} href={`mailto:${call.email}`}>
              {call.email}
            </a>
          )}
          <div className={styles.closeActions}>
            {call.email && (
              <a className={styles.primary} href={`mailto:${call.email}?subject=${encodeURIComponent('Hello Astha')}`}>
                <span className={styles.dot} aria-hidden="true" />
                Write to me
              </a>
            )}
            <Link to={`/#${sections.creative.id}`} className={styles.secondary}>
              Creative Corner
            </Link>
          </div>
        </div>
      </footer>

      <Lightbox {...lightbox.props} />
    </div>
  )
}
