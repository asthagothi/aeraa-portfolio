// Decorative mobile-browser address bar showing the configured domain.
import { site } from '../../config/site.ts'
import { LockIcon, ReloadIcon } from '../ui/icons.tsx'
import styles from './BrowserAddressBar.module.css'

type Props = {
  className?: string
  domain?: string
}

export default function BrowserAddressBar({ className = '', domain = site.displayDomain }: Props) {
  return (
    <div className={`${styles.bar} ${className}`} data-hero-anim="browser">
      <span className={styles.aa} aria-hidden="true">
        <small>A</small>A
      </span>
      <span className={styles.address}>
        <LockIcon className={styles.lock} />
        <span className="visually-hidden">Website: </span>
        {domain}
      </span>
      <ReloadIcon className={styles.reload} />
    </div>
  )
}
