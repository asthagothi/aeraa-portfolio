// Home, Section 2 (inside the phone) — "A little about me" and "Work".
//
// Copy is used exactly as supplied. Images are the originals from the shared Google Drive folder
// (source-assets/drive/, processed by `npm run images` into src/assets/selected-work/). Alt text
// describes what each image shows; nothing here adds clients, results or figures.
import manifest from './selected-work-manifest.json'

const files = import.meta.glob<string>('../assets/selected-work/*.webp', { eager: true, import: 'default' })

export type WorkImage = {
  id: string
  src: string
  srcSet: string
  alt: string
  /** width / height of the processed image */
  ratio: number
  caption: string
  /** Background filling any space around the image in its grid cell (matches the image's own
   * background, so a contained image never looks letterboxed). */
  fill?: string
}

function img(name: keyof typeof manifest, caption: string, alt: string, fill?: string): WorkImage {
  const small = files[`../assets/selected-work/${name}-480.webp`]
  const large = files[`../assets/selected-work/${name}-1200.webp`]
  if (!small || !large) throw new Error(`Missing processed image "${name}". Run npm run images.`)
  const { width, height } = manifest[name]
  return { id: name, src: large, srcSet: `${small} 480w, ${large} 1200w`, alt, ratio: width / height, caption, fill }
}

export const about = {
  title: 'A little about me',
  paragraphs: [
    'I’m Astha Gothi, creatively known as Aeraa. With a background in Computer Science and Engineering, I’ve found myself drawn to the visual side of creativity, exploring everything from graphic design and branding to web design.',
  ],
}

/** Work history, as supplied. */
export const experience = {
  role: 'Freelance Graphic Designer & Content Creator',
  org: 'Self-Employed | Freelance Projects',
  points: [
    'Completed 10+ freelance projects in logo design, branding, website UI, posters, banners, and social media creatives.',
    'Created digital content for YouTube, Pinterest, Substack, and client social media accounts.',
    'Used Adobe Illustrator, Photoshop, Figma, and Canva to develop engaging visual designs.',
    'Tracked content performance through views, reach, and engagement.',
  ],
}

export const selectedWorkIntro = {
  title: 'Work',
  intro:
    "A collection of projects, visual experiments, and ideas I've brought to life. From freelance design work to digital experiences and visual content, each project reflects a different part of my creative practice.",
}

/**
 * What is known about each project. Only facts from the files themselves: names and lines printed
 * on the artwork, the deliverables that exist, colours sampled from the artwork. `brief`, `role`
 * and `decisions` render only once supplied by Astha; they're never filled in by guesswork.
 * `status` likewise: "Freelance" only where the files came from the freelance folder.
 */
export type Project = {
  name: string
  type: string
  status?: 'Freelance' | 'Concept' | 'Personal'
  deliverables: string[]
  brief?: string
  role?: string
  decisions?: string[]
  /** The full case study (Work page only), in Astha's words. */
  story?: {
    client: string
    year: string
    kind: string
    tools: string
    sections: { title: string; text: string }[]
  }
  /** Observations read off the artwork (e.g. a line printed on it), labelled as such. */
  notes?: { label: string; text: string }[]
  /** Colours sampled from the artwork's pixels. */
  palette?: { name: string; hex: string }[]
}

export const projects = {
  ssensazione: {
    name: 'Ssensazione — D3 Grinder Rebranding',
    type: 'Product rebranding & visual identity',
    status: 'Freelance',
    brief: 'Commissioned to rebrand the D3 grinder: a logo and visual direction aligned with the client’s vision.',
    // Supplied by Astha (25 Oct 2026). Nothing here is added beyond what she wrote.
    story: {
      client: 'Ssensazione',
      year: '2026',
      kind: 'Commissioned · Product rebranding & visual identity',
      tools: 'Adobe Creative Suite, Canva and other design applications',
      sections: [
        {
          title: 'The brief',
          text: 'Ssensazione commissioned me to rebrand its D3 grinder product: a logo and a visual direction aligned with the client’s vision for the brand.',
        },
        {
          title: 'My role',
          text: 'I handled the design process, from developing the logo and exploring the visual direction to refining the final design. I worked directly with the client throughout, bringing in their feedback while applying my own design judgement.',
        },
        {
          title: 'Creative direction',
          text: 'I started by understanding the client’s preferences and expectations. From our discussion, I prepared a presentation of my design ideas and proposed direction, then refined the concepts through feedback, balancing their vision with my own perspective.',
        },
        {
          title: 'Design process',
          text: 'I developed and refined the identity in Adobe applications, Canva and other tools. Client feedback guided each revision, so every decision met their expectations while keeping a considered visual direction.',
        },
        {
          title: 'Outcome',
          text: 'The client was highly satisfied with the final design and paid me beyond the original arrangement. After the logo, they invited me to contribute to their brand launch, extending my work beyond the first commission.',
        },
      ],
    },
    deliverables: ['Logo', 'Business card', 'Cake care guide', 'Menu (15 pages)', 'Trifold brochure'],
    notes: [
      { label: 'On the card', text: '“Pure eggless · Freshly baked”' },
      { label: 'Type', text: 'Serif capitals for the wordmark, a spaced sans-serif for “The Bake Studio”.' },
    ],
    palette: [
      { name: 'Navy', hex: '#314868' },
      { name: 'Pistachio', hex: '#9BB35F' },
      { name: 'Cherry', hex: '#B92721' },
      { name: 'Sky', hex: '#D5E9FD' },
    ],
  },
  fishMark: { name: 'Logo mark', type: 'Logo design', status: 'Freelance', deliverables: ['Logo mark'] },
  melissa: { name: 'Beauty by Melissa', type: 'Gift voucher', status: 'Freelance', deliverables: ['Gift voucher, front and back'] },
  bloom: { name: 'Bloom Nails', type: 'Printed cards', status: 'Freelance', deliverables: ['Cards'] },
  maisonRouge: { name: 'Maison Rouge', type: 'Website design', deliverables: ['Page designs'] },
  mara: { name: 'Hi, I’m Mara', type: 'Landing page design', deliverables: ['Landing page'] },
  eleanor: { name: 'Eleanor Merriweather', type: 'Interface design', deliverables: ['Profile interface'] },
  asthaProfile: { name: 'Astha Gothi', type: 'Profile interface design', deliverables: ['Profile interface'] },
} satisfies Record<string, Project>

export type ProjectId = keyof typeof projects

/** Which images belong to which project (image ids from workCategories). */
export const projectImageIds: Record<ProjectId, string[]> = {
  ssensazione: ['ssensazione-logo', 'ssensazione-cake-care-guide', 'ssensazione-business-card'],
  fishMark: ['logo-mark-fish'],
  melissa: ['gift-voucher-beauty'],
  bloom: ['bloom-nails-cards'],
  maisonRouge: ['web-maison-rouge'],
  mara: ['web-hi-im-mara'],
  eleanor: ['web-eleanor-profile'],
  asthaProfile: ['web-astha-profile'],
}

/** The Ssensazione case study's further materials (Work page only), from Astha's Drive folder: the
 * menu and the trifold brochure in both of its versions. The brochures' outside panels have the
 * client's personal phone numbers and email blurred. The menu's last page (a photo of the owners) is
 * left out. */
export const ssensazioneMaterials = {
  menu: [
    img('ssensazione-menu-01', 'Ssensazione menu · cover', 'Cover of the Ssensazione menu: the cupcake logo above a large navy “MENU”, three pastry photographs below, on a pale blue watercolour ground.'),
    img('ssensazione-menu-02', 'Ssensazione menu · cheesecakes and cookies', 'Menu page listing cheesecakes and cookies in navy display type, with a raspberry cheesecake slice and heart-centred cookies.'),
    img('ssensazione-menu-04', 'Ssensazione menu · cake slices and tea cake', 'Menu page listing cake slices and tea cakes, with framed photographs of a layered slice and a sponge cake.'),
    img('ssensazione-menu-08', 'Ssensazione menu · granola', 'Menu page listing granola flavours, with three framed photographs of granola bowls with fruit and yoghurt.'),
    img('ssensazione-menu-10', 'Ssensazione menu · focaccia', 'Menu page listing focaccia flavours, with a stack of focaccia slices and a round focaccia topped with vegetables.'),
    img('ssensazione-menu-14', 'Ssensazione menu · vegan, gluten-free, sugar-free', 'Menu page of vegan, gluten-free and sugar-free bars, brownies and muffins, with chocolate and muffin photographs.'),
  ],
  brochures: [
    {
      label: 'Version A',
      images: [
        img('ssensazione-brochure-a-outside', 'Trifold brochure, version A · outside', 'Outside of the trifold brochure: an “About us” panel, a social-profile card with “Thank you” and “Baking”, and the logo cover with a strawberry doughnut.'),
        img('ssensazione-brochure-a-inside', 'Trifold brochure, version A · inside', 'Inside of the trifold brochure: “Special treats just for you!” with a photo grid, a kraft tag listing the menu sections, and an “Order now” cupcake badge.'),
      ],
    },
    {
      label: 'Version B',
      images: [
        img('ssensazione-brochure-b-outside', 'Trifold brochure, version B · outside', 'Outside of the second brochure version: the same panels, with a takeaway bag illustration in place of “Baking”.'),
        img('ssensazione-brochure-b-inside', 'Trifold brochure, version B · inside', 'Inside of the second brochure version: the same treats and menu tag, with packaged products below the “Order now” badge.'),
      ],
    },
  ],
}

/** The project an image belongs to, if any. */
export const projectOfImage = (imageId: string) => (Object.keys(projectImageIds) as ProjectId[]).find((p) => projectImageIds[p].includes(imageId))

/** How a category's images are composed (each gets its own grid, see SelectedWork.module.css). */
export type Composition = 'pair' | 'cases' | 'posters' | 'screens' | 'platforms'

export type WorkCategory = {
  id: string
  number: string
  title: string
  description: string
  composition: Composition
  /** Panel tone (studio palette) behind the visuals. */
  tone: 'blue' | 'butter' | 'pearl' | 'ocean' | 'chocopie'
  images: WorkImage[]
  /** Platforms only: the two distinct collections, by image id, each with its own description. */
  collections?: { label: string; title: string; description: string; ids: string[] }[]
  /** Set while a category has no work good enough to show; it is left out (and the rest renumbered). */
  awaitingAssets?: string
}

const yt = [
  img('youtube-channel', 'YouTube · channel page', 'Screenshot of the Aeraa YouTube channel page: a dark banner, the channel header and a row of Shorts thumbnails from dance videos.', '#0f0f0f'),
  img('youtube-shorts', 'YouTube · Shorts', 'Screenshot of the channel’s Shorts grid: dance-video thumbnails in red and dark, moody lighting, with silhouettes against windows.', '#0f0f0f'),
  img('youtube-about', 'YouTube · About', 'Screenshot of the channel’s About panel with the description “art in motion.” and links to Instagram and Pinterest.', '#0f0f0f'),
]
const pin = [
  img('pinterest-profile', 'Pinterest · profile', 'Screenshot of the Pinterest profile page with a grid of created pins: outfits, collages and a colourful type poster.', '#ffffff'),
  img('pinterest-created', 'Pinterest · created pins', 'Screenshot of a grid of created pins: fashion collages, outfit flat-lays and moodboards.', '#ffffff'),
  img('pinterest-board-a', 'Pinterest · board', 'Screenshot of a Pinterest board row of outfit collages in black, brown and red.', '#ffffff'),
  img('pinterest-board-b', 'Pinterest · board', 'Screenshot of another Pinterest board row of dark, fashion-focused outfit collages.', '#ffffff'),
  img('pinterest-top-pins', 'Pinterest · top pins', 'Screenshot of three pin collections shown side by side on the Pinterest profile.', '#ffffff'),
]

export const workCategories: WorkCategory[] = [
  {
    id: 'brand-identity',
    number: '01',
    title: 'Brand Identity & Logo Design',
    description: 'I enjoy exploring how a brand can express its personality through visuals. From logos to typography and colors, I like bringing different elements together to create an identity that feels distinct.',
    composition: 'pair',
    tone: 'blue',
    images: [
      img('ssensazione-logo', 'Ssensazione — The Bake Studio', 'Ssensazione — The Bake Studio logo: a pistachio-green cupcake topped with a cherry above the wordmark, on a soft blue cloud background.', '#dbe9f6'),
      img('logo-mark-fish', 'Logo mark', 'Logo mark: an abstract fish shape in a blue-to-green gradient on white.', '#ffffff'),
    ],
  },
  {
    id: 'brand-applications',
    number: '02',
    title: 'Brand Applications & Print Design',
    description: 'I like seeing a visual identity move beyond a logo and become something tangible. Posters, print materials, and brand launch assets let me explore how the same visual language works across different formats.',
    composition: 'cases',
    tone: 'butter',
    images: [
      img('ssensazione-cake-care-guide', 'Ssensazione — The Bake Studio · cake care guide', 'Ssensazione “Cake care guide” card: illustrated tips for carrying and storing a cake, on a blue gingham background.', '#d9e6f4'),
      img('ssensazione-business-card', 'Ssensazione — The Bake Studio · business card', 'Ssensazione business card in pale blue with the logo, contact details and a QR code, set against a blueberry cupcake.', '#ffffff'),
      img('gift-voucher-beauty', 'Gift voucher · Beauty by Melissa', 'Pink and red checkered gift voucher for “Beauty by Melissa”, front and back.'),
      img('bloom-nails-cards', 'Bloom Nails · cards', 'Lilac Bloom Nails cards with nail-art photos, a QR code and contact details, on a leafy shadow background.'),
    ],
  },
  {
    id: 'social-creatives',
    number: '03',
    title: 'Social Media & Content Creation',
    description: 'I’m drawn to how visuals communicate ideas before a person even reads the words. Creating social media graphics and digital content gives me room to experiment with composition, aesthetics, and presentation.',
    composition: 'posters',
    // The only poster in the supplied files is “TYPE! is SO COOL!”, which isn't the standard this
    // section should show. Left out until stronger posters / social creatives are supplied.
    awaitingAssets: 'Posters and social creatives (the Drive folder “Social creatives” is empty).',
    tone: 'ocean',
    images: [img('type-poster', 'TYPE! is SO COOL! · poster', 'Poster with bubbly letters reading “TYPE! is SO COOL!” in green, blue and red with black drop shadows on a yellow background.')],
  },
  {
    id: 'website-ui',
    number: '04',
    title: 'UI/UX & Website Design',
    description: 'Web design brings together two things I’m interested in: technology and visual presentation. I enjoy exploring how a website looks, feels, and guides someone through its content.',
    composition: 'screens',
    tone: 'pearl',
    images: [
      img('web-maison-rouge', 'Maison Rouge · website design', 'Website design for “Maison Rouge”: deep red pages with white flowers and editorial bouquet sections.'),
      img('web-hi-im-mara', 'Hi, I’m Mara · website design', 'Long landing-page design “Hi, I’m Mara” in cream and deep red, with portraits and a values section.'),
      img('web-eleanor-profile', 'Eleanor Merriweather · interface design', 'Interface design for a creator profile, “Eleanor Merriweather”, with arched photo frames in warm beige and red.'),
      img('web-astha-profile', 'Astha Gothi · profile interface design', 'Navy and cream profile interface design for “Astha Gothi”, with portrait photos, stats tiles and a gallery.'),
    ],
  },
  {
    id: 'youtube-pinterest',
    number: '05',
    title: 'YouTube & Pinterest Content',
    description: 'A visual playground for ideas, references, and creative direction across digital platforms.',
    composition: 'platforms',
    tone: 'chocopie',
    images: [...yt, ...pin],
    collections: [
      {
        label: 'YouTube',
        title: 'YouTube & Dance',
        description: 'Dance is another way I’ve explored my creativity, sharing my love for dance and music.',
        ids: yt.map((i) => i.id),
      },
      {
        label: 'Pinterest',
        title: 'Pinterest & Visual Presentation',
        description: 'Years of curating visuals and aesthetics, with an audience that once reached one million monthly views.',
        ids: pin.map((i) => i.id),
      },
    ],
  },
]

/** One card in the home Work grid: an image, the label it carries and what the viewer opens. */
export type WorkCard = {
  image: WorkImage
  name: string
  type: string
  year?: string
  status?: Project['status']
  /** How the artwork fills the card: whole on its own colour, or cropped to fill. */
  fit: 'contain' | 'cover' | 'top'
  /** The images the viewer steps through when the card is opened. */
  open: WorkImage[]
}

const allWorkImages = [...workCategories.flatMap((c) => c.images), ...ssensazioneMaterials.menu, ...ssensazioneMaterials.brochures.flatMap((b) => b.images)]
const workImage = (id: string) => allWorkImages.find((i) => i.id === id)!
const projectCard = (id: ProjectId, imageId: string, fit: WorkCard['fit']): WorkCard => {
  const p: Project = projects[id]
  return { image: workImage(imageId), name: p.name, type: p.type, year: p.story?.year, status: p.status, fit, open: projectImageIds[id].map(workImage) }
}
const collection = (label: string) => workCategories.flatMap((c) => c.collections ?? []).find((c) => c.label === label)!
const platformCard = (label: string, imageId: string, fit: WorkCard['fit']): WorkCard => ({
  image: workImage(imageId),
  name: collection(label).title,
  type: label,
  fit,
  open: collection(label).ids.map(workImage),
})

/** The home Work grid: groups of one wide card above a row of three (after the reference layout),
 * using the real projects only. */
export const workGrid: { feature: WorkCard; row: WorkCard[] }[] = [
  {
    feature: projectCard('ssensazione', 'ssensazione-logo', 'contain'),
    row: [projectCard('fishMark', 'logo-mark-fish', 'cover'), projectCard('melissa', 'gift-voucher-beauty', 'cover'), projectCard('bloom', 'bloom-nails-cards', 'cover')],
  },
  {
    feature: projectCard('maisonRouge', 'web-maison-rouge', 'top'),
    row: [projectCard('mara', 'web-hi-im-mara', 'top'), projectCard('eleanor', 'web-eleanor-profile', 'top'), projectCard('asthaProfile', 'web-astha-profile', 'top')],
  },
  {
    feature: platformCard('Pinterest', 'pinterest-top-pins', 'contain'),
    row: [platformCard('Pinterest', 'pinterest-profile', 'top'), platformCard('YouTube', 'youtube-channel', 'top'), platformCard('YouTube', 'youtube-shorts', 'top')],
  },
]
