// Home — the foldable-device experience. All copy and figures used on the home page.
// Rules: only facts you supplied or that were read from your screenshots/profiles, each with its
// source; anything not supplied yet is a marked placeholder.
import { analytics, pinterestProfile } from './page2.ts'
import { categories, projects } from './work.ts'
// Tool logos in their official colours (Devicon, MIT: src/assets/tools/DEVICON-LICENSE.txt). Django and
// GitHub use their white marks (the brands' versions for dark backgrounds). The database glyph is our
// own, since "SQL & database fundamentals" names no particular product.
import canvaLogo from '../assets/tools/canva.svg'
import css3Logo from '../assets/tools/css3.svg'
import databaseGlyph from '../assets/tools/database.svg'
import djangoLogo from '../assets/tools/django-light.svg'
import figmaLogo from '../assets/tools/figma.svg'
import gitLogo from '../assets/tools/git.svg'
import githubLogo from '../assets/tools/github-light.svg'
import html5Logo from '../assets/tools/html5.svg'
import illustratorLogo from '../assets/tools/illustrator.svg'
import photoshopLogo from '../assets/tools/photoshop.svg'
import pythonLogo from '../assets/tools/python.svg'

export const identity = {
  /** Giant name behind the device. */
  name: 'AERAA',
  /** From the introduction page's headline. */
  role: 'Multimedia designer',
  /** Factual summary of the disciplines you described. */
  intro: 'Freelance branding, graphic and UI design, content creation and visual curation.',
  /** Small label above the name on the home screen. */
  eyebrow: 'Multimedia designer · Freelance',
}

/** Lock-screen notifications: real, dated items. */
export const notifications = [
  {
    id: 'pinterest',
    tile: 'P',
    tone: 'blush',
    title: `${pinterestProfile.monthlyViews} monthly views`,
    meta: `Pinterest · @${pinterestProfile.username} · ${pinterestProfile.capturedLabel}`,
  },
  {
    id: 'youtube',
    tile: 'Y',
    tone: 'sage',
    title: 'art in motion.',
    meta: 'YouTube · @Aeraaa-m7u',
  },
] as const

/** Stats strip. Each figure is real and carries its source. */
export const stats = [
  { value: '10+', label: 'Freelance design projects', source: '' },
  { value: pinterestProfile.monthlyViews ?? '—', label: 'Pinterest monthly views', source: `Profile, ${pinterestProfile.capturedLabel}` },
  { value: analytics.lead.display, label: 'Pinterest impressions', source: analytics.rangeLabel },
  { value: '30,883', label: 'YouTube channel views', source: 'About page, 20 Oct 2026' },
]

export const statsNote = 'Historical figures, not live data.'

/** Panel tones for the split project screens (studio palette). */
const panelTones = ['sage', 'blush', 'botanical', 'olive', 'cream', 'moss'] as const

export const selectedWork = projects.map((p, i) => {
  const cat = categories.find((c) => c.id === p.category)!
  return {
    slug: p.slug,
    number: String(i + 1).padStart(2, '0'),
    category: `${cat.label} · ${p.kind}`,
    title: p.title,
    line: p.summary.startsWith('TODO:') ? null : p.summary,
    placeholder: p.placeholder,
    visual: p.primary,
    tone: panelTones[i % panelTones.length],
  }
})

/** "What I do": service groups (copy as supplied), then tools in a separate group. */
export const services = [
  {
    title: 'Brand Identity & Logo Design',
    line: 'I enjoy exploring how a brand can express its personality through visuals. From logos to typography and colors, I like bringing different elements together to create an identity that feels distinct.',
  },
  {
    title: 'Brand Applications & Print Design',
    line: 'I like seeing a visual identity move beyond a logo and become something tangible. Posters, print materials, and brand launch assets let me explore how the same visual language works across different formats.',
  },
  {
    title: 'UI/UX & Website Design',
    line: 'Web design brings together two things I’m interested in: technology and visual presentation. I enjoy exploring how a website looks, feels, and guides someone through its content.',
  },
  {
    title: 'Social Media & Content Creation',
    line: 'I’m drawn to how visuals communicate ideas before a person even reads the words. Creating social media graphics and digital content gives me room to experiment with composition, aesthetics, and presentation.',
  },
]

/** Tools, kept apart from the design services; no proficiency levels are claimed. */
const logo = (src: string, glow: string) => ({ src, glow })

/** Each tool shows its logo(s), glowing softly in the brand colour; entries naming two tools show both. */
export const toolGroups = [
  {
    title: 'Design tools',
    items: [
      { name: 'Figma', logos: [logo(figmaLogo, '#a259ff')] },
      { name: 'Adobe Illustrator', logos: [logo(illustratorLogo, '#ff9a00')] },
      { name: 'Adobe Photoshop', logos: [logo(photoshopLogo, '#31a8ff')] },
      { name: 'Canva', logos: [logo(canvaLogo, '#00c4cc')] },
    ],
  },
  {
    title: 'Technical foundation',
    items: [
      { name: 'HTML & CSS', logos: [logo(html5Logo, '#f16529'), logo(css3Logo, '#33a9dc')] },
      { name: 'Python & Django', logos: [logo(pythonLogo, '#ffd43b'), logo(djangoLogo, '#44b78b')] },
      { name: 'SQL & database fundamentals', logos: [logo(databaseGlyph, '#4f8fd0')] },
      { name: 'Git & GitHub', logos: [logo(gitLogo, '#f34f29'), logo(githubLogo, '#ffffff')] },
    ],
  },
]

/** Closing card at the end of the inside scroll. */
export const cta = {
  title: 'Have a project in mind?',
  action: 'Start a project',
}

/** Device finishes (swatches under the device), all from the studio palette. */
export const finishes = [
  { id: 'chocopie', label: 'Chocopie' },
  { id: 'ocean', label: 'Silent Ocean' },
  { id: 'blue', label: 'Blue' },
  { id: 'slate', label: 'Slate Gray' },
  { id: 'butter', label: 'Butter' },
] as const

/** Backdrops behind the device: the giant name, a soft glow, or a wheel of questions to ask. */
export const backdrops = [
  { id: 'basic', label: 'Basic' },
  { id: 'glow', label: 'Glow' },
  { id: 'wheel', label: 'Wheel' },
] as const

/**
 * The Wheel backdrop: two drums of questions either side of the device, turning as you scroll. They
 * are prompts for visitors, drawn from the services above; each opens an email with the question as
 * its subject.
 */
export const wheelQuestions = {
  left: ['Starting a new brand?', 'Need a logo that feels like you?', 'Packaging people want to keep?', 'Posts that stop the scroll?'],
  right: ['Launching a website?', 'Is your landing page clear?', 'Thumbnails that get clicked?', 'Looking for a freelance designer?'],
} as const

export const elsewhere = [
  { label: 'Pinterest', handle: '@styleaeraa', href: pinterestProfile.url },
  { label: 'YouTube', handle: '@Aeraaa-m7u', href: 'https://www.youtube.com/@Aeraaa-m7u' },
  // From the Links on the YouTube channel's About panel (source-assets/drive/pinterest-youtube/p13.png).
  { label: 'Instagram', handle: '@foundmme', href: 'https://www.instagram.com/foundmme/' },
]

/** Closing "incoming call". With `email` set to null, no mailto link is rendered. */
export const call = {
  caller: 'AERAA',
  /** Small label above the name. */
  status: 'Incoming call',
  line: 'About your next project? Email is the quickest way to reach me.',
  email: 'aeraaa07@gmail.com' as string | null,
  emailPending: 'Email address to be added',
  action: 'Email me',
}
