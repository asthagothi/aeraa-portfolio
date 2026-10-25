// Home, Section 2 (inside the phone's screen): "A little about me", then "Work".
// Each category is a header row (number, title, description, Explore) above a deliberate grid of
// real work, built for its proportions: a logo pair, a case study plus applications grouped by
// brand, browser frames, and two platform collections. Every project is labelled with what is
// known about it (name, type, status, deliverables; see `projects`), and the strongest one,
// Ssensazione, gets a case-study panel. Every cell keeps the artwork whole (contain), filled with
// the image's own background. Images unfold gently as they enter view; clicking one, or Explore,
// opens that category in the viewer.
import { useEffect, useRef, useState } from 'react'
import { routes } from '../../config/site.ts'
import { about, projectOfImage, projects, selectedWorkIntro, workCategories, type Project, type WorkCategory, type WorkImage } from '../../content/selectedWork.ts'
import { Link } from '../../router/Router.tsx'
import FallText from './FallText.tsx'
import Lightbox from '../journal/Lightbox.tsx'
import { useLightbox } from '../journal/useLightbox.ts'
import styles from './SelectedWork.module.css'

/** Categories shown, renumbered so the sequence stays complete while one awaits its assets. */
const shown = workCategories.filter((c) => !c.awaitingAssets).map((c, k) => ({ ...c, number: String(k + 1).padStart(2, '0') }))

type Open = (i: number, el: HTMLElement) => void

function Cell({ image, index, onOpen, sizes, className = '', fit = 'contain' }: { image: WorkImage; index: number; onOpen: Open; sizes: string; className?: string; fit?: 'contain' | 'top' }) {
  return (
    <button
      type="button"
      className={`${styles.cell} ${className}`}
      style={{ ['--fill' as string]: image.fill ?? 'var(--mat)', ['--i' as string]: index }}
      data-fit={fit}
      data-fold
      data-cursor="view"
      onClick={(e) => onOpen(index, e.currentTarget)}
    >
      <img src={image.src} srcSet={image.srcSet} sizes={sizes} alt={image.alt} loading="lazy" decoding="async" />
      <span className="visually-hidden">Open larger: {image.caption}</span>
    </button>
  )
}

/** A project's label under its artwork: name, then type and status, then deliverables. */
function Meta({ project, as: Tag = 'figcaption' }: { project: Project; as?: 'figcaption' | 'div' }) {
  return (
    <Tag className={styles.meta}>
      <span className={styles.metaName}>{project.name}</span>
      <span className={styles.metaType}>
        {project.type}
        {project.status && <span className={styles.status}>{project.status}</span>}
      </span>
      <span className={styles.metaDeliv}>
        <span className="visually-hidden">Deliverables: </span>
        {project.deliverables.join(' · ')}
      </span>
    </Tag>
  )
}

/** The case-study panel: the facts that exist, and nothing filled in. */
/** The project's logo, shown at the foot of its case-study panel. */
const ssensazioneLogo = workCategories.flatMap((c) => c.images).find((i) => i.id === 'ssensazione-logo')

function CaseFacts({ project, logo }: { project: Project; logo?: WorkImage }) {
  return (
    <div className={styles.facts}>
      <p className={styles.factsKicker}>Case study</p>
      <h4 className={styles.factsName}>{project.name}</h4>
      <dl className={styles.factsList}>
        <div>
          <dt>Project</dt>
          <dd>
            {project.type}
            {project.status && <span className={styles.status}>{project.status}</span>}
          </dd>
        </div>
        {project.brief && (
          <div>
            <dt>Brief</dt>
            <dd>{project.brief}</dd>
          </div>
        )}
        {project.role && (
          <div>
            <dt>My role</dt>
            <dd>{project.role}</dd>
          </div>
        )}
        {project.decisions && project.decisions.length > 0 && (
          <div>
            <dt>Design decisions</dt>
            <dd>
              <ul role="list" className={styles.factsBullets}>
                {project.decisions.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </dd>
          </div>
        )}
        <div>
          <dt>Deliverables</dt>
          <dd>{project.deliverables.join(' · ')}</dd>
        </div>
        {project.notes?.map((n) => (
          <div key={n.label}>
            <dt>{n.label}</dt>
            <dd>{n.text}</dd>
          </div>
        ))}
        {project.palette && (
          <div>
            <dt>Colour</dt>
            <dd>
              <ul role="list" className={styles.swatches}>
                {project.palette.map((c) => (
                  <li key={c.hex}>
                    <span className={styles.swatch} style={{ background: c.hex }} aria-hidden="true" />
                    <span>{c.name}</span>
                    <span className={styles.hex}>{c.hex}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}
      </dl>
      {/* Fills the panel to the artwork's height, so both columns end on one line. */}
      {logo && (
        <figure className={styles.factsLogo} style={{ ['--fill' as string]: logo.fill ?? 'var(--mat)' }}>
          <img src={logo.src} srcSet={logo.srcSet} sizes="(min-width: 900px) 24vw, 90vw" alt={logo.alt} loading="lazy" decoding="async" />
        </figure>
      )}
    </div>
  )
}

/** A platform's title and description (Astha's words), then its handle. */
function PlatformIntro({ category, label, handle, href }: { category: WorkCategory; label: string; handle: string; href: string }) {
  const c = category.collections?.find((x) => x.label === label)
  return (
    <div className={styles.platformIntro}>
      <p className={styles.platformTitle}>{c?.title ?? label}</p>
      {c && <p className={styles.platformText}>{c.description}</p>}
      <a className={styles.platformLink} href={href} target="_blank" rel="noopener noreferrer">
        {handle} <span aria-hidden="true">↗</span>
        <span className="visually-hidden"> (opens in a new tab)</span>
      </a>
    </div>
  )
}

function Visual({ category, onOpen }: { category: WorkCategory; onOpen: Open }) {
  const im = category.images
  const at = (id: string) => im.findIndex((x) => x.id === id)
  const cell = (id: string, sizes: string, className = '', fit: 'contain' | 'top' = 'contain') => <Cell image={im[at(id)]} index={at(id)} onOpen={onOpen} sizes={sizes} className={className} fit={fit} />

  switch (category.composition) {
    case 'pair':
      return (
        <div className={styles.pair}>
          {im.map((image, i) => (
            <figure key={image.id} className={styles.figure}>
              <Cell image={image} index={i} onOpen={onOpen} sizes="(min-width: 900px) 30vw, 46vw" className={styles.square} />
              <Meta project={projects[projectOfImage(image.id)!]} />
            </figure>
          ))}
        </div>
      )
    case 'cases':
      return (
        <div className={styles.cases}>
          <article className={styles.caseStudy} aria-label={`Case study: ${projects.ssensazione.name}`}>
            <div className={styles.caseRow}>
              {cell('ssensazione-cake-care-guide', '(min-width: 900px) 34vw, 92vw', styles.caseMain)}
              {cell('ssensazione-business-card', '(min-width: 900px) 24vw, 92vw', styles.caseSide)}
            </div>
            <CaseFacts project={projects.ssensazione} logo={ssensazioneLogo} />
          </article>
          <figure className={styles.figure}>
            {cell('gift-voucher-beauty', '(min-width: 900px) 29vw, 92vw', styles.square)}
            <Meta project={projects.melissa} />
          </figure>
          <figure className={styles.figure}>
            {cell('bloom-nails-cards', '(min-width: 900px) 29vw, 92vw', styles.square)}
            <Meta project={projects.bloom} />
          </figure>
        </div>
      )
    case 'screens':
      return (
        <div className={styles.screens}>
          {im.map((image, i) => (
            <figure key={image.id} className={styles.figure}>
              <div className={styles.browser}>
                <span className={styles.browserBar} aria-hidden="true" />
                <Cell image={image} index={i} onOpen={onOpen} sizes="(min-width: 900px) 15vw, 45vw" className={styles.screen} fit="top" />
              </div>
              <Meta project={projects[projectOfImage(image.id)!]} />
            </figure>
          ))}
        </div>
      )
    case 'platforms':
      return (
        <div className={styles.platforms}>
          <figure className={`${styles.figure} ${styles.platform}`} data-platform="youtube">
            <PlatformIntro category={category} label="YouTube" handle="@Aeraaa-m7u" href="https://www.youtube.com/@Aeraaa-m7u" />
            <div className={styles.ytGrid}>
              {cell('youtube-channel', '(min-width: 900px) 18vw, 44vw', styles.ytChannel)}
              {cell('youtube-shorts', '(min-width: 900px) 18vw, 44vw', styles.ytShorts)}
              {cell('youtube-about', '(min-width: 900px) 14vw, 44vw', styles.ytAbout)}
            </div>
          </figure>
          <figure className={`${styles.figure} ${styles.platform}`} data-platform="pinterest">
            <PlatformIntro category={category} label="Pinterest" handle="@styleaeraa" href="https://www.pinterest.com/styleaeraa/" />
            <div className={styles.pinGrid}>
              {cell('pinterest-profile', '(min-width: 900px) 20vw, 44vw', styles.pinTop)}
              {cell('pinterest-created', '(min-width: 900px) 20vw, 44vw', styles.pinTop)}
              {cell('pinterest-board-a', '(min-width: 900px) 20vw, 44vw', styles.pinBoard)}
              {cell('pinterest-board-b', '(min-width: 900px) 20vw, 44vw', styles.pinBoard)}
              {cell('pinterest-top-pins', '(min-width: 900px) 40vw, 92vw', styles.pinWide)}
            </div>
          </figure>
        </div>
      )
    default:
      return (
        <div className={styles.pair}>
          {im.map((image, i) => (
            <Cell key={image.id} image={image} index={i} onOpen={onOpen} sizes="(min-width: 900px) 30vw, 92vw" />
          ))}
        </div>
      )
  }
}

export default function SelectedWork() {
  const root = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const lightbox = useLightbox(shown[active].images.map((im) => ({ src: im.src, srcSet: im.srcSet, alt: im.alt, caption: im.caption })))

  // Unfold each image the first time it enters view.
  useEffect(() => {
    const els = root.current?.querySelectorAll<HTMLElement>('[data-fold]')
    if (!els) return
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => (el.dataset.in = 'true'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            ;(e.target as HTMLElement).dataset.in = 'true'
            io.unobserve(e.target)
          }
        }
      },
      { threshold: 0.1 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const openFrom = (k: number) => (i: number, el: HTMLElement) => {
    setActive(k)
    lightbox.open(i, el)
  }

  return (
    <div ref={root} className={styles.root}>
      <section className={styles.about} data-section="about" aria-labelledby="about-title">
        <p className={styles.kicker} aria-hidden="true" data-drop="label">
          About
        </p>
        <h2 id="about-title" className={styles.aboutTitle} data-drop="letters">
          <FallText text={about.title} />
        </h2>
        <div className={styles.aboutText} data-drop>
          {about.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </section>

      <section className={styles.work} data-section="work" aria-labelledby="work-title">
        <header className={styles.workHead}>
          <h2 id="work-title" className={styles.workTitle} data-drop="letters">
            <FallText text={selectedWorkIntro.title} />
          </h2>
          <div className={styles.workAside} data-drop>
            <p className={styles.workIntro}>{selectedWorkIntro.intro}</p>
            <Link to={routes.work.path} className={styles.allLink}>
              All projects <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </header>

        <ol className={styles.categories}>
          {shown.map((c, k) => (
            <li key={c.id} className={styles.category} data-tone={c.tone} data-composition={c.composition}>
              <header className={styles.catHead}>
                <span className={styles.number} aria-hidden="true" data-drop="label">
                  {c.number}
                </span>
                <h3 className={styles.title} data-drop="letters">
                  <FallText text={c.title} />
                </h3>
                <p className={styles.description} data-drop>
                  {c.description}
                </p>
                <button type="button" className={styles.explore} onClick={(e) => openFrom(k)(0, e.currentTarget)} data-drop="row">
                  Explore the work <span aria-hidden="true">→</span>
                  <span className="visually-hidden">: {c.title}</span>
                </button>
              </header>
              <div className={styles.visual}>
                <Visual category={c} onOpen={openFrom(k)} />
              </div>
            </li>
          ))}
        </ol>
      </section>

      <Lightbox {...lightbox.props} />
    </div>
  )
}
