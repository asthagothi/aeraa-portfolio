// Contact card in the hero: portrait, name, email, and two real actions: write an email, or copy
// the address. (These replace the earlier decorative phone circles, which did nothing.)
import { site } from '../../config/site.ts'
import { useCopy } from '../../lib/useCopy.ts'
import { CheckIcon, CopyIcon, MailIcon } from '../ui/icons.tsx'
import { PORTRAIT_SIZES, portraitPhoto } from './portrait.ts'
import styles from './ContactWidget.module.css'

type Props = { className?: string }

export default function ContactWidget({ className = '' }: Props) {
  const { name, lines } = site.contact
  const email = lines[0]
  const { copied, copy } = useCopy(email)

  return (
    <aside className={`${styles.widget} ${className}`} aria-label="Contact Astha" data-hero-anim="contact">
      <span className={styles.avatar}>
        {/* The hero's own portrait file, already loaded. */}
        <img src={portraitPhoto.src} srcSet={portraitPhoto.srcSet} sizes={PORTRAIT_SIZES} alt="" width={40} height={40} />
      </span>
      <div className={styles.details}>
        <p className={styles.name}>{name}</p>
        <p className={styles.line}>{email}</p>
      </div>
      <button type="button" className={styles.call} data-tone="copy" onClick={copy} aria-label={copied ? 'Email address copied' : `Copy email address ${email}`} title={copied ? 'Copied' : 'Copy email'}>
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
      <a className={styles.call} data-tone="mail" href={site.contactHref} aria-label={`Email ${name}`} title="Write an email">
        <MailIcon />
      </a>
      <span className="visually-hidden" aria-live="polite">
        {copied ? 'Email address copied' : ''}
      </span>
    </aside>
  )
}
