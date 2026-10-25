// Page 2 — creative portfolio. All projects, collage layouts and case-page content live here.
//
// Rules:
//   - Only real assets and facts. Projects without supplied assets are `placeholder: true` and say so
//     on screen; fields still to be written use TODO text that renders as a marked placeholder.
//   - Collage coordinates: `x`, `y` are % of the stage from its centre (x of width, y of height);
//     `w` is the fragment width as % of stage width; `ratio` is width / height.
//
// Adding a real project: replace a placeholder's `primary`, `fragments` and case fields with real
// images (import them like the pins below) and set `placeholder: false`.
import portrait1024 from '../assets/hero/portrait-1024.webp'
import portrait640 from '../assets/hero/portrait-640.webp'
import { analytics, affiliate, pins, pinterestProfile, storefrontPins } from './page2.ts'

export type Tone = 'sage' | 'botanical' | 'olive' | 'moss' | 'cream' | 'ivory' | 'blush' | 'ink'

export type Visual =
  | { kind: 'image'; src: string; srcSet?: string; alt: string; /** CSS object-position */ focus?: string }
  | { kind: 'placeholder'; tone: Tone; label: string; /** optional glyph drawn inside */ glyph?: 'play' | 'type' | 'grid' | 'window' }

export type FragmentContent =
  | Visual
  | { kind: 'shape'; shape: 'circle' | 'arch' | 'pill' | 'leaf' | 'ring'; tone: Tone }
  | { kind: 'type'; text: string; style: 'serif' | 'italic' | 'label' }
  | { kind: 'ui'; part: 'window' | 'button' | 'swatches' }

export type Fragment = {
  id: string
  content: FragmentContent
  x: number
  y: number
  w: number
  ratio?: number
  rotate?: number
  /** Stacking: positive sits above the central artwork. */
  z?: number
  /** Hidden on tablet-sized stages to keep the composition calm. */
  essential?: boolean
}

export type CategoryId = 'freelance' | 'graphic-ui' | 'content' | 'curation'

export const categories: { id: CategoryId; index: string; label: string; blurb: string }[] = [
  { id: 'freelance', index: '01', label: 'Freelance', blurb: 'Branding, identities and brand launches for clients.' },
  { id: 'graphic-ui', index: '02', label: 'Graphic & UI', blurb: 'Posters, social creatives, layouts and website UI.' },
  { id: 'content', index: '03', label: 'Content', blurb: 'Dance videos, thumbnails and visual storytelling.' },
  { id: 'curation', index: '04', label: 'Curation', blurb: 'Moodboards, aesthetic research and visual collections.' },
]

export type Fact = { label: string; value: string; note?: string }
export type ProjectLink = { label: string; href: string; affiliate?: boolean }

export type Project = {
  slug: string
  title: string
  category: CategoryId
  /** Short discipline label, e.g. "Brand identity". */
  kind: string
  placeholder: boolean
  primary: Visual
  fragments: Fragment[]
  // Case page
  summary: string
  role: string
  approach: string
  deliverables: string[]
  gallery: Visual[]
  facts?: Fact[]
  factsNote?: string
  links?: ProjectLink[]
  disclosure?: string
}

/** Text that renders as a marked "to be completed" placeholder on case pages. */
export const TODO = (what: string) => `TODO: ${what}`
export const isTodo = (text: string) => text.startsWith('TODO:')

const ph = (tone: Tone, label: string, glyph?: 'play' | 'type' | 'grid' | 'window'): Visual => ({ kind: 'placeholder', tone, label, glyph })
const pinVisual = (i: number, focus?: string): Visual => ({ kind: 'image', src: pins[i].image!, srcSet: pins[i].srcSet, alt: pins[i].alt ?? '', focus })

// ---------------------------------------------------------------------------
// Cover — the opening composition. Echoes Page 1 with the same photograph.
// ---------------------------------------------------------------------------
export const cover = {
  eyebrow: 'Creative portfolio',
  title: 'Work',
  intro: 'Freelance branding, graphic and UI design, content creation and visual curation.',
  primary: { kind: 'image', src: portrait1024, srcSet: `${portrait640} 640w, ${portrait1024} 1024w`, alt: 'Portrait from the introduction page.', focus: '50% 40%' } satisfies Visual,
  fragments: [
    { id: 'c1', content: pinVisual(2, '50% 30%'), x: -38, y: -10, w: 6.5, ratio: 0.72, rotate: -3 },
    { id: 'c2', content: { kind: 'shape', shape: 'circle', tone: 'sage' }, x: -27, y: 9, w: 5.5, ratio: 1, essential: true },
    { id: 'c3', content: { kind: 'type', text: 'branding', style: 'italic' }, x: -21, y: -16, w: 9, z: 2 },
    { id: 'c4', content: pinVisual(4, '50% 40%'), x: 25, y: 6, w: 6, ratio: 0.8, rotate: 2, essential: true },
    { id: 'c5', content: { kind: 'shape', shape: 'arch', tone: 'botanical' }, x: 37, y: -9, w: 7, ratio: 0.75 },
    { id: 'c6', content: { kind: 'type', text: 'curation', style: 'italic' }, x: 22, y: -18, w: 9, z: 2 },
  ] satisfies Fragment[],
}

// ---------------------------------------------------------------------------
// Projects, in page order.
// ---------------------------------------------------------------------------
export const projects: Project[] = [
  {
    slug: 'freelance-identity',
    title: 'Freelance project 01',
    category: 'freelance',
    kind: 'Brand identity',
    placeholder: true,
    primary: ph('sage', 'Identity artwork', 'type'),
    fragments: [
      { id: 'f1', content: ph('olive', 'Logo exploration'), x: -36, y: -8, w: 7, ratio: 1, rotate: -2, essential: true },
      { id: 'f2', content: { kind: 'type', text: 'Aa', style: 'serif' }, x: -24, y: 10, w: 6, z: 2 },
      { id: 'f3', content: { kind: 'ui', part: 'swatches' }, x: -20, y: -15, w: 8, ratio: 3.2, z: 2 },
      { id: 'f4', content: ph('ivory', 'Stationery'), x: 26, y: 8, w: 6.5, ratio: 0.72, rotate: 3, essential: true },
      { id: 'f5', content: { kind: 'shape', shape: 'leaf', tone: 'moss' }, x: 37, y: -10, w: 4.5, ratio: 0.6 },
      { id: 'f6', content: { kind: 'type', text: 'logo explorations', style: 'label' }, x: 21, y: -17, w: 12, z: 2 },
    ],
    summary: TODO('a short description of the project and the client brief'),
    role: TODO('your role, e.g. brand designer'),
    approach: TODO('how you approached the identity'),
    deliverables: [TODO('deliverables, e.g. logo, colour palette, typography')],
    gallery: [ph('sage', 'Project image'), ph('botanical', 'Project image'), ph('ivory', 'Project image')],
  },
  {
    slug: 'freelance-launch',
    title: 'Freelance project 02',
    category: 'freelance',
    kind: 'Brand launch',
    placeholder: true,
    primary: ph('botanical', 'Launch campaign', 'grid'),
    fragments: [
      { id: 'l1', content: { kind: 'shape', shape: 'arch', tone: 'sage' }, x: -37, y: 6, w: 6.5, ratio: 0.75, essential: true },
      { id: 'l2', content: ph('blush', 'Social post'), x: -25, y: -11, w: 6, ratio: 0.8, rotate: -3, z: 2 },
      { id: 'l3', content: { kind: 'type', text: 'launch', style: 'italic' }, x: -22, y: 15, w: 9, z: 2 },
      { id: 'l4', content: ph('cream', 'Packaging'), x: 27, y: -6, w: 7.5, ratio: 1, rotate: 2, essential: true },
      { id: 'l5', content: { kind: 'shape', shape: 'circle', tone: 'olive' }, x: 22, y: 14, w: 3.5, ratio: 1, z: 2 },
      { id: 'l6', content: ph('sage', 'Banner'), x: 38, y: 10, w: 6, ratio: 1.6 },
    ],
    summary: TODO('what was launched and what the brand needed'),
    role: TODO('your role'),
    approach: TODO('your approach to the launch visuals'),
    deliverables: [TODO('deliverables, e.g. social creatives, banners, packaging')],
    gallery: [ph('botanical', 'Project image'), ph('blush', 'Project image')],
  },
  {
    slug: 'graphic-design',
    title: 'Posters & social creatives',
    category: 'graphic-ui',
    kind: 'Graphic design',
    placeholder: true,
    primary: ph('olive', 'Poster artwork', 'type'),
    fragments: [
      { id: 'g1', content: { kind: 'type', text: 'poster', style: 'serif' }, x: -30, y: -12, w: 13, z: 2, essential: true },
      { id: 'g2', content: ph('blush', 'Social creative'), x: -36, y: 8, w: 6.5, ratio: 0.8, rotate: -2 },
      { id: 'g3', content: { kind: 'shape', shape: 'ring', tone: 'moss' }, x: -21, y: 13, w: 4.5, ratio: 1, z: 2 },
      { id: 'g4', content: ph('ivory', 'Banner'), x: 26, y: -8, w: 8, ratio: 1.5, rotate: 2, essential: true },
      { id: 'g5', content: { kind: 'shape', shape: 'pill', tone: 'sage' }, x: 37, y: 9, w: 6, ratio: 2.4 },
      { id: 'g6', content: ph('sage', 'Poster detail'), x: 22, y: 13, w: 5, ratio: 0.75, z: 2 },
    ],
    summary: TODO('which posters, banners or social series this covers'),
    role: TODO('your role'),
    approach: TODO('the visual idea behind the series'),
    deliverables: [TODO('deliverables')],
    gallery: [ph('olive', 'Project image'), ph('blush', 'Project image'), ph('sage', 'Project image')],
  },
  {
    slug: 'website-ui',
    title: 'Website UI',
    category: 'graphic-ui',
    kind: 'UI design',
    placeholder: true,
    primary: ph('ivory', 'Website UI', 'window'),
    fragments: [
      { id: 'u1', content: { kind: 'ui', part: 'window' }, x: -33, y: -9, w: 10, ratio: 1.4, rotate: -2, essential: true },
      { id: 'u2', content: { kind: 'ui', part: 'button' }, x: -22, y: 12, w: 7, ratio: 3, z: 2 },
      { id: 'u3', content: { kind: 'shape', shape: 'circle', tone: 'botanical' }, x: -39, y: 10, w: 4, ratio: 1 },
      { id: 'u4', content: ph('sage', 'Mobile screen'), x: 26, y: 4, w: 5.5, ratio: 0.5, rotate: 2, essential: true },
      { id: 'u5', content: { kind: 'type', text: 'interface', style: 'italic' }, x: 23, y: -17, w: 10, z: 2 },
      { id: 'u6', content: { kind: 'ui', part: 'swatches' }, x: 37, y: -6, w: 8, ratio: 3.2 },
    ],
    summary: TODO('the website, its purpose and audience'),
    role: TODO('your role'),
    approach: TODO('layout, typography and interaction decisions'),
    deliverables: [TODO('deliverables, e.g. page designs, components, prototype')],
    gallery: [ph('ivory', 'Screen'), ph('sage', 'Screen')],
  },
  {
    slug: 'youtube-dance',
    title: 'Aeraa on YouTube',
    category: 'content',
    kind: 'Dance videos',
    placeholder: false,
    primary: ph('ink', 'Video thumbnail', 'play'),
    fragments: [
      { id: 'y1', content: { kind: 'type', text: 'art in motion.', style: 'italic' }, x: -29, y: -13, w: 14, z: 2, essential: true },
      { id: 'y2', content: ph('olive', 'Thumbnail', 'play'), x: -34, y: 8, w: 8, ratio: 16 / 9, rotate: -2 },
      { id: 'y3', content: { kind: 'shape', shape: 'circle', tone: 'sage' }, x: -21, y: 14, w: 3.5, ratio: 1, z: 2 },
      { id: 'y4', content: ph('moss', 'Short', 'play'), x: 26, y: 3, w: 5, ratio: 9 / 16, rotate: 2, essential: true },
      { id: 'y5', content: ph('sage', 'Thumbnail', 'play'), x: 37, y: -9, w: 7.5, ratio: 16 / 9 },
      { id: 'y6', content: { kind: 'type', text: '@Aeraaa-m7u', style: 'label' }, x: 22, y: 17, w: 10, z: 2 },
    ],
    summary: 'My YouTube channel, Aeraa, is where I share dance videos. The channel description is “art in motion.”',
    role: 'Dancer and creator: performing, filming and designing thumbnails.',
    approach: TODO('how you plan, film and edit your dance videos'),
    deliverables: ['Dance videos', 'Thumbnails'],
    gallery: [ph('ink', 'Thumbnail', 'play'), ph('olive', 'Thumbnail', 'play'), ph('moss', 'Short', 'play')],
    facts: [{ label: 'Channel views', value: '30,883', note: 'Shown on the channel’s About page, captured 20 Oct 2026.' }],
    factsNote: 'Historical figure, not live data.',
    links: [{ label: 'Watch on YouTube · @Aeraaa-m7u', href: 'https://www.youtube.com/@Aeraaa-m7u' }],
  },
  {
    slug: 'visual-curation',
    title: 'Visual curation',
    category: 'curation',
    kind: 'Pinterest · @styleaeraa',
    placeholder: false,
    primary: pinVisual(0, '50% 35%'),
    fragments: [
      { id: 'p1', content: pinVisual(2, '50% 40%'), x: -35, y: -7, w: 6.5, ratio: 0.75, rotate: -2, essential: true },
      { id: 'p2', content: pinVisual(4, '50% 50%'), x: -24, y: 11, w: 5, ratio: 1, z: 2 },
      { id: 'p3', content: { kind: 'type', text: 'styleaeraa', style: 'italic' }, x: -22, y: -16, w: 11, z: 2 },
      { id: 'p4', content: pinVisual(3, '50% 35%'), x: 26, y: 6, w: 6, ratio: 0.72, rotate: 2, essential: true },
      { id: 'p5', content: pinVisual(7, '50% 40%'), x: 37, y: -10, w: 5, ratio: 0.8 },
      { id: 'p6', content: pinVisual(5, '50% 30%'), x: 22, y: -15, w: 4, ratio: 0.6, z: 2 },
    ],
    summary:
      'On Pinterest I curate and create visual inspiration: fashion finds and outfit ideas, lifestyle and beauty, aesthetic collages, and original pins of my own.',
    role: 'Curator and creator of the pins and collages.',
    approach: TODO('how you research, select and compose your pins'),
    deliverables: ['Outfit collages', 'Fashion finds', 'Moodboards', 'Original pins'],
    gallery: [pins[0], pins[2], pins[3], pins[8], pins[6], pins[9]].map((p) => ({ kind: 'image' as const, src: p.image!, srcSet: p.srcSet, alt: p.alt ?? '' })),
    facts: [
      { label: 'Monthly views', value: pinterestProfile.monthlyViews ?? '—', note: `Shown on the public profile, ${pinterestProfile.capturedLabel}.` },
      { label: 'Followers', value: pinterestProfile.followers ?? '—', note: `Public profile, ${pinterestProfile.capturedLabel}.` },
      { label: 'Impressions', value: analytics.lead.display, note: `${analytics.rangeLabel} (Pinterest showed ${analytics.lead.shown}).` },
      ...analytics.metrics
        .filter((m) => ['saves', 'outbound'].includes(m.id))
        .map((m) => ({ label: m.label, value: m.display, note: `${analytics.rangeLabel}. ${m.definition}` })),
    ],
    factsNote: 'Historical figures from Pinterest, not live data. Monthly views and impressions are measured differently.',
    links: [
      { label: 'View @styleaeraa on Pinterest', href: pinterestProfile.url },
      { label: 'Visit my Amazon storefront', href: affiliate.storefrontUrl ?? '', affiliate: true },
    ].filter((l) => l.href),
    disclosure: affiliate.disclosure,
  },
]

/** Pins titled “Aeraa’s Amazon Page”, reused on the curation case page. */
export const curationStorefrontPins = storefrontPins

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug)
