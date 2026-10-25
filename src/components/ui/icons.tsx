// Small inline SVG icons. Decorative by default (aria-hidden); pass a title for meaningful use.
import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = (props: IconProps) => ({
  width: '1em',
  height: '1em',
  'aria-hidden': true,
  focusable: false,
  ...props,
})

export function StarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...base(props)}>
      <path d="M12 2.2l2.95 6.3 6.85.78-5.1 4.68 1.4 6.77L12 17.3l-6.1 3.43 1.4-6.77-5.1-4.68 6.85-.78z" />
    </svg>
  )
}

export function LockIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...base(props)}>
      <path d="M7 10V7.5a5 5 0 0 1 10 0V10h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zm2 0h6V7.5a3 3 0 0 0-6 0z" />
    </svg>
  )
}

export function ReloadIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" {...base(props)}>
      <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" />
      <path d="M18 3v4.2h-4.2" strokeLinejoin="round" />
    </svg>
  )
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...base(props)}>
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" />
    </svg>
  )
}

export function PhoneDownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...base(props)}>
      <path d="M12 8.6c-2.6 0-5.1.5-7.4 1.4a1.6 1.6 0 0 0-1 1.5v2.4a1 1 0 0 0 1.2 1l3.2-.6a1 1 0 0 0 .8-.9l.2-1.9a13 13 0 0 1 6 0l.2 1.9a1 1 0 0 0 .8.9l3.2.6a1 1 0 0 0 1.2-1v-2.4a1.6 1.6 0 0 0-1-1.5A19.6 19.6 0 0 0 12 8.6z" />
    </svg>
  )
}

export function AvatarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 40 40" {...base(props)}>
      <circle cx="20" cy="20" r="20" fill="#e1edf4" />
      <circle cx="20" cy="16" r="7" fill="#c4dae8" />
      <path d="M7 34a13 13 0 0 1 26 0" fill="#c4dae8" />
    </svg>
  )
}

export function MailIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...base(props)}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

export function CopyIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...base(props)}>
      <rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2.5" />
      <path d="M15.5 8.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h2.5" />
    </svg>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...base(props)}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  )
}
