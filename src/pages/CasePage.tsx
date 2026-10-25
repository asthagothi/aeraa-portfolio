// Project case page — /work/:slug. Factual fields only; TODO fields render as marked placeholders.
import { useRef } from 'react'
import { revealOnScroll } from '../animation/reveal.ts'
import Lightbox from '../components/journal/Lightbox.tsx'
import { useLightbox } from '../components/journal/useLightbox.ts'
import CollageVisual from '../components/work/CollageVisual.tsx'
import { routes } from '../config/site.ts'
import { categories, isTodo, projectBySlug, projects, type Visual } from '../content/work.ts'
import { motionQuery } from '../design/motion.ts'
import { gsap, useGSAP } from '../lib/gsap.ts'
import { Link } from '../router/Router.tsx'
import NotFoundPage from './NotFoundPage.tsx'
import { useDocumentTheme } from './useDocumentTheme.ts'
import styles from './CasePage.module.css'

function Field({ text }: { text: string }) {
  return isTodo(text) ? (
    <span className={styles.todo}>
      <span className={styles.todoTag}>To complete</span> {text.replace(/^TODO:\s*/, '')}
    </span>
  ) : (
    <>{text}</>
  )
}

export default function CasePage({ slug }: { slug: string }) {
  const project = projectBySlug(slug)
  useDocumentTheme('studio', project ? `${project.title} — Work` : 'Project not found')
  const root = useRef<HTMLDivElement>(null)
  const images = (project?.gallery ?? []).filter((v): v is Extract<Visual, { kind: 'image' }> => v.kind === 'image')
  const lightbox = useLightbox(images.map((v) => ({ src: v.src, srcSet: v.srcSet, alt: v.alt })))

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(motionQuery.any, () => {
        const q = gsap.utils.selector(root)
        // Hero artwork settles in; the rest reveals on scroll.
        gsap.from(q('[data-hero-art]'), { clipPath: 'inset(100% 0% 0% 0%)', duration: 0.9, ease: 'power3.out', delay: 0.15 })
        revealOnScroll(q('[data-reveal]'))
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  if (!project) return <NotFoundPage />

  const index = projects.indexOf(project)
  const prev = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]
  const cat = categories.find((c) => c.id === project.category)!

  return (
    <div ref={root} className={`theme-studio ${styles.page}`}>
      <article className={styles.article} aria-labelledby="case-title">
        <Link to={routes.work.path} className={styles.back}>
          <span aria-hidden="true">←</span> All work
        </Link>

        <header className={styles.head}>
          <p className={styles.eyebrow}>
            {cat.index} — {cat.label} · {project.kind}
            {project.placeholder && <span className={styles.badge}>Placeholder project</span>}
          </p>
          <h1 id="case-title" className={styles.title}>
            {project.title}
          </h1>
          <p className={styles.summary}>
            <Field text={project.summary} />
          </p>
        </header>

        {/* The cell spans only its grid rows, so the sticky artwork stops before the figures. */}
        <div className={styles.heroCell}>
          <div className={styles.heroArt} data-hero-art>
            <CollageVisual content={project.primary} sizes="(min-width: 900px) 40vw, 90vw" eager />
          </div>
        </div>

        {project.placeholder && (
          <p className={styles.notice} data-reveal>
            This project is a placeholder. Its artwork and details will be replaced with the real project once the assets are supplied.
          </p>
        )}

        <dl className={styles.meta} data-reveal>
          <div>
            <dt>Role</dt>
            <dd><Field text={project.role} /></dd>
          </div>
          <div>
            <dt>Approach</dt>
            <dd><Field text={project.approach} /></dd>
          </div>
          <div>
            <dt>Deliverables</dt>
            <dd>
              <ul role="list">
                {project.deliverables.map((d) => (
                  <li key={d}><Field text={d} /></li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>

        {project.facts && (
          <section className={styles.facts} aria-labelledby="case-facts" data-reveal>
            <h2 id="case-facts" className={styles.sectionLabel}>Figures</h2>
            <dl>
              {project.facts.map((f) => (
                <div key={f.label} className={styles.fact}>
                  <dt>{f.label}</dt>
                  <dd>
                    <span className={styles.factValue}>{f.value}</span>
                    {f.note && <span className={styles.factNote}>{f.note}</span>}
                  </dd>
                </div>
              ))}
            </dl>
            {project.factsNote && <p className={styles.factsNote}>{project.factsNote}</p>}
          </section>
        )}

        {project.links && project.links.length > 0 && (
          <section className={styles.links} aria-label="Links" data-reveal>
            <ul role="list">
              {project.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel={`noopener noreferrer${l.affiliate ? ' sponsored' : ''}`} className={styles.link}>
                    {l.label} <span aria-hidden="true">↗</span>
                    <span className="visually-hidden"> (opens in a new tab{l.affiliate ? ', affiliate link' : ''})</span>
                  </a>
                </li>
              ))}
            </ul>
            {project.disclosure && project.links.some((l) => l.affiliate) && <p className={styles.disclosure}>{project.disclosure}</p>}
          </section>
        )}

        <section className={styles.gallery} aria-label="Project images">
          {project.gallery.map((v, i) => {
            const imageIndex = v.kind === 'image' ? images.indexOf(v) : -1
            return (
              <figure key={i} className={styles.galleryItem} data-slot={i % 3} data-reveal>
                {imageIndex >= 0 ? (
                  <button type="button" className={styles.zoom} onClick={(e) => lightbox.open(imageIndex, e.currentTarget)} aria-label={`Open image: ${v.kind === 'image' ? v.alt : ''}`}>
                    <CollageVisual content={v} sizes="(min-width: 900px) 30vw, 90vw" />
                  </button>
                ) : (
                  <CollageVisual content={v} />
                )}
              </figure>
            )
          })}
        </section>

        <nav className={styles.pager} aria-label="More projects">
          <Link to={`${routes.work.path}/${prev.slug}`} className={styles.pagerLink} data-dir="prev">
            <span className={styles.eyebrow}>Previous</span>
            <span className={styles.pagerTitle}>{prev.title}</span>
          </Link>
          <Link to={`${routes.work.path}/${next.slug}`} className={styles.pagerLink} data-dir="next">
            <span className={styles.eyebrow}>Next</span>
            <span className={styles.pagerTitle}>{next.title}</span>
          </Link>
        </nav>
      </article>
      <Lightbox {...lightbox.props} />
    </div>
  )
}
