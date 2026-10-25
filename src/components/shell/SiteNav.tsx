// Persistent site navigation: brand, page links with an active indicator, and an accessible
// mobile menu. Small and restrained so it sits over Page 1 without competing with it.
import { useEffect, useRef, useState } from 'react'
import { navigation, routes, site } from '../../config/site.ts'
import { Link } from '../../router/Router.tsx'
import { useRouter } from '../../router/routerContext.ts'
import styles from './SiteNav.module.css'

export default function SiteNav() {
  const { path } = useRouter()
  // The menu belongs to the page it was opened on, so navigating closes it without an effect.
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === path
  const setOpen = (value: boolean | ((v: boolean) => boolean)) =>
    setOpenOn(typeof value === 'function' ? (value(open) ? path : null) : value ? path : null)
  const toggle = useRef<HTMLButtonElement>(null)
  const firstLink = useRef<HTMLAnchorElement>(null)

  // Escape closes the menu and returns focus to the toggle.
  useEffect(() => {
    if (!open) return
    firstLink.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenOn(null)
        toggle.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  // A backing in the page colour; translucent on home so the device backdrops show through.
  const tone = path === routes.journal.path ? 'journal' : path === routes.home.path ? 'home' : 'studio'

  return (
    <header className={styles.nav} data-tone={tone} data-open={open || undefined}>
      <Link to={routes.home.path} className={styles.brand} aria-label={`${site.brand}, home`}>
        {site.brand}
      </Link>

      <nav aria-label="Pages" className={styles.links}>
        <ul role="list">
          {navigation.map((item) => (
            <li key={item.href}>
              <Link to={item.href} match={item.href === '/' ? 'exact' : 'prefix'} className={styles.link}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <button
        ref={toggle}
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? 'Close' : 'Menu'}
      </button>

      <div id="site-menu" className={styles.sheet} hidden={!open}>
        <nav aria-label="Pages">
          <ul role="list">
            {navigation.map((item, i) => (
              <li key={item.href}>
                <Link
                  ref={i === 0 ? firstLink : undefined}
                  to={item.href}
                  match={item.href === '/' ? 'exact' : 'prefix'}
                  className={styles.sheetLink}
                >
                  <span className={styles.sheetIndex} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
