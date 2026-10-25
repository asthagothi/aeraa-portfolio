// Hero copy and data (copy as supplied by Astha).

export const heroHeadline = {
  eyebrow: 'Multimedia',
  title: 'Designer',
} as const

export const heroIntro = {
  heading: 'Multidisciplinary Designer & Creative',
  body: 'I bring ideas to life through visual identity, digital experiences, and storytelling.',
  /** What I do, plainly. */
  roles: 'Graphic & UI/UX design · Brand identity · Content creation',
  /** Primary action: the work. Secondary: an email (Astha's own closing line). */
  actionLabel: 'See my work',
} as const

export type Skill = {
  label: string
  /** Shown in the floating annotation card on hover, focus or tap. */
  description: string
  /** Visually emphasised row, set apart by a divider (red in the reference). */
  highlight?: boolean
}

export const heroSkillsTitle = 'Skills'

export const heroSkills: Skill[] = [
  {
    label: 'UX/UI — Web Design',
    description: 'Designing intuitive, visually engaging website interfaces with thoughtful layouts, clear navigation, and a balance between aesthetics and usability.',
  },
  {
    label: 'Email Design',
    description: 'Creating visually appealing email layouts that communicate brand messages clearly through typography, imagery, hierarchy, and compelling calls to action.',
  },
  {
    label: 'Social Creatives',
    description: 'Designing platform-specific social media posts, promotional graphics, banners, and campaign visuals that capture attention and maintain a consistent visual identity.',
  },
  {
    label: 'Logo — Branding',
    description: 'Building distinctive brand identities through logo design, colour palettes, typography, and visual elements that give a brand its own character.',
  },
  {
    label: 'Adobe Creative Suite',
    description: 'Using Adobe creative tools to develop graphic assets, edit visuals, refine layouts, and bring branding and design concepts to life.',
    highlight: true,
  },
  {
    label: 'Figma',
    description: 'Creating interface designs, organising design systems, exploring layouts, and building interactive prototypes for digital experiences.',
  },
]
