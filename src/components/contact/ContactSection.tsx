// Home — Contact (after Creative Corner). A real way to reach me: the email as a mailto link plus a
// copy button, the pages, the disciplines and the profiles elsewhere. Outside every scroll scene,
// so nothing folds, hides or interrupts it. Only details from my own files are used: the email in
// content/home.ts, and the profile links in `elsewhere`.
import { routes, sections } from '../../config/site.ts'
import { call, elsewhere, services } from '../../content/home.ts'
import { scrollToY } from '../../lib/smoothScroll.ts'
import { useCopy } from '../../lib/useCopy.ts'
import { Link } from '../../router/Router.tsx'
import styles from './ContactSection.module.css'

const YEAR = new Date().getFullYear()

export default function ContactSection() {
  const email = call.email
  const { copied, copy } = useCopy(email)

  return (
    <section id={sections.contact.id} className={`theme-studio ${styles.contact}`} aria-labelledby="contact-title">
      <div className={styles.frame}>
        {/* ---------- Row 1: who, and the email ---------- */}
        <div className={styles.intro}>
          <p className={styles.label}>Contact</p>
          <p className={styles.blurb}>Astha Gothi — graphic and UI/UX designer, brand identity designer and content creator. Freelance projects, brand work and digital design.</p>
        </div>

        <div className={styles.lead}>
          <h2 id="contact-title" className={styles.heading}>
            Have something in mind? Let’s make it happen.
          </h2>
          <p className={styles.sub}>If you have a project, an idea, or something creative in mind, I’d love to hear about it. Let’s connect and see what we can make together.</p>
          {email ? (
            <>
              <a className={styles.email} href={`mailto:${email}`}>
                {email}
              </a>
              <div className={styles.actions}>
                <a className={styles.primary} href={`mailto:${email}?subject=${encodeURIComponent('Hello Astha')}`}>
                  Write to me <span aria-hidden="true">↗</span>
                </a>
                <button type="button" className={styles.secondary} onClick={copy}>
                  {copied ? 'Copied ✓' : 'Copy email'}
                </button>
                <span className="visually-hidden" aria-live="polite">
                  {copied ? 'Email address copied' : ''}
                </span>
              </div>
            </>
          ) : (
            <p className={styles.pending}>{call.emailPending}</p>
          )}
        </div>

        {/* ---------- Row 2: index, disciplines, elsewhere ---------- */}
        <nav className={`${styles.col} ${styles.colIndex}`} aria-labelledby="contact-index">
          <p id="contact-index" className={styles.colTitle}>
            Index
          </p>
          <ul role="list" className={styles.list}>
            <li>
              <Link to={routes.home.path} className={styles.link}>
                Home
              </Link>
            </li>
            <li>
              <Link to={routes.work.path} className={styles.link}>
                Work
              </Link>
            </li>
            <li>
              <Link to={`/#${sections.services.id}`} className={styles.link}>
                What I do
              </Link>
            </li>
            <li>
              <Link to={`/#${sections.creative.id}`} className={styles.link}>
                Creative Corner
              </Link>
            </li>
            <li>
              <a href="#main" className={styles.link} onClick={(e) => { e.preventDefault(); scrollToY(0) }}>
                Back to top ↑
              </a>
            </li>
          </ul>
        </nav>

        <div className={`${styles.col} ${styles.colDo}`}>
          <p className={styles.colTitle}>What I do</p>
          <ul role="list" className={styles.list}>
            {services.map((s) => (
              <li key={s.title} className={styles.plain}>
                {s.title}
              </li>
            ))}
          </ul>
        </div>

        <div className={`${styles.col} ${styles.colElse}`}>
          <p className={styles.colTitle}>Elsewhere</p>
          <ul role="list" className={styles.list}>
            {elsewhere.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  {l.label} <span className={styles.handle}>{l.handle}</span>
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ---------- The name, as a deliberate closing typographic block ---------- */}
        <p className={styles.bigName} aria-hidden="true">
          Astha Gothi
        </p>

        <div className={styles.bar}>
          <span>© {YEAR} Astha Gothi · Aeraa</span>
          {email && <a href={`mailto:${email}`} className={styles.barLink}>{email}</a>}
        </div>
      </div>
      {/* The final Thank You section will follow this one (see HomePage). */}
    </section>
  )
}
