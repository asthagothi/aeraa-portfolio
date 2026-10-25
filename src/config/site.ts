// Site-wide configuration: section ids, navigation, destinations and contact details.
// Every value here is a placeholder until real details are supplied — do not invent real ones.

/** In-page sections. Components take their `id` from here so links never drift out of sync. */
export const sections = {
  /** Used by the reusable FloatingCardScene demo (not currently mounted). */
  work: { id: 'work', label: 'Work' },
  // Legacy single-page Pinterest sections (components kept in components/page2, not mounted).
  pinterest: { id: 'pinterest', label: 'Pinterest' },
  pinGallery: { id: 'pins', label: 'Selected pins' },
  reach: { id: 'reach', label: 'Reach' },
  affiliate: { id: 'affiliate', label: 'Affiliate' },
  nextMotion: { id: 'art-in-motion', label: 'YouTube & dance' },
  /** Home, third section (after the phone). The nav links here, and /journal redirects here. */
  creative: { id: 'creative-corner', label: 'Creative Corner' },
  /** Home, inside the phone: services ("What I do"). Reached via a registered hash target. */
  services: { id: 'what-i-do', label: 'What I do' },
  /** Home, Contact section (after Creative Corner). */
  contact: { id: 'contact', label: 'Contact' },
  /** Home, final section (after Contact): Thank You. Reserved; the section waits for its visual reference. */
  thankYou: { id: 'thank-you', label: 'Thank you' },
} as const

/** Site pages (real URLs). The nav renders these in order. */
export const routes = {
  home: { path: '/', label: 'Home', title: 'Astha Gothi · Aeraa — Graphic & UI/UX designer' },
  work: { path: '/work', label: 'Work', title: 'Work — Astha Gothi · Aeraa' },
  // Old Page 3 address: Creative Corner is now the third section of the home page, and this
  // path redirects there (see App.tsx), so existing links keep working.
  journal: { path: '/journal', label: 'Creative Corner', title: 'Creative Corner — Personal work' },
} as const

export const navigation: { label: string; href: string }[] = [
  { label: routes.home.label, href: routes.home.path },
  { label: routes.work.label, href: routes.work.path },
  { label: sections.services.label, href: `/#${sections.services.id}` },
  { label: sections.creative.label, href: `/#${sections.creative.id}` },
  { label: sections.contact.label, href: `/#${sections.contact.id}` },
]

export const site = {
  /** Name shown in the navigation. */
  brand: 'Aeraa',

  /** Shown in the floating browser address bar (decorative). Replace with the real domain once there is one. */
  displayDomain: 'Astha Gothi · Portfolio',

  /** Where the intro card's action and other contact actions point (mailto:, a URL, or an in-page anchor). */
  contactHref: 'mailto:aeraaa07@gmail.com',

  contact: {
    name: 'Astha Gothi',
    /** Secondary lines in the contact widget (no phone number: none supplied). */
    lines: ['aeraaa07@gmail.com'],
    /** Optional avatar image URL. When empty, a neutral silhouette is shown. */
    avatarSrc: '',
  },
} as const
