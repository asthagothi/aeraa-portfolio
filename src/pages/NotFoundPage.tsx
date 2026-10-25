// Unknown URLs: a quiet dead-end with routes back into the site.
import { navigation } from '../config/site.ts'
import { Link } from '../router/Router.tsx'
import { useDocumentTheme } from './useDocumentTheme.ts'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  useDocumentTheme('studio', 'Page not found — Aeraa')
  return (
    <div className={`theme-studio ${styles.page}`}>
      <p className={styles.eyebrow}>404</p>
      <h1 className={styles.title}>This page doesn’t exist.</h1>
      <ul role="list" className={styles.links}>
        {navigation.map((n) => (
          <li key={n.href}>
            <Link to={n.href}>{n.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
