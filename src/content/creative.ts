// Page 3 — Creative Corner: personal work (pencil sketches, paintings, a type poster, the studio).
//
// Rules: labels describe what each piece shows; no invented titles, dates, sizes or stories.
// Mediums are only stated where the image shows them (pencil on paper, paint on canvas).
//
// Adding a piece: drop the photo in source-assets/creative/ named NN-short-name.jpg, run
// `npm run images`, then add an entry below with the same name.
import manifest from './creative-manifest.json'

const files = import.meta.glob<string>('../assets/creative/*.webp', { eager: true, import: 'default' })

export type CreativeCategory = 'sketch' | 'painting' | 'studio'

export type Artwork = {
  id: string
  label: string
  /** Short medium / kind line shown under the label. */
  kind: string
  category: CreativeCategory
  alt: string
  src: string
  srcSet: string
  /** width / height of the processed image. */
  ratio: number
}

function art(name: keyof typeof manifest, label: string, kind: string, category: CreativeCategory, alt: string): Artwork {
  const small = files[`../assets/creative/${name}-480.webp`]
  const large = files[`../assets/creative/${name}-1200.webp`]
  if (!small || !large) throw new Error(`Missing processed artwork "${name}". Run npm run images.`)
  const { width, height } = manifest[name]
  return { id: name, label, kind, category, alt, src: large, srcSet: `${small} 480w, ${large} 1200w`, ratio: width / height }
}

export const creativeIntro = {
  title: 'Creative Corner',
  intro: 'Paintings, sketches, and things I make.',
  storyTitle: 'Where it began',
  story: 'My creative journey began with pencil-and-paper sketches. Over time, I moved into digital painting and experimented with Adobe tools and other design applications. What started with drawing gradually opened up new ways for me to explore graphic design and web design.',
  hint: 'Scroll to turn the orbit',
}

export const artworks: Artwork[] = [
  art('09-sketchbook-portrait', 'Portrait in the sketchbook', 'Pencil on paper', 'sketch', 'Pencil portrait of a young woman with long dark hair and sharp, spiked lashes, drawn in a spiral sketchbook held in one hand.'),
  art('12-starry-night-study', 'Starry Night study', 'Paint on canvas · after Van Gogh', 'painting', 'Painted study of Van Gogh’s The Starry Night: swirling blue sky, yellow stars and crescent moon, a dark cypress and a village below, leaning against an orange wall.'),
  art('03-eye-study', 'Eye study', 'Pencil on paper', 'sketch', 'Detailed pencil study of a single eye with long lashes and a light reflection in the iris.'),
  art('15-autumn-trees', 'Autumn trees at sunset', 'Paint on canvas', 'painting', 'Painting of tall dark trees with copper foliage beside a lake, glowing orange and yellow at sunset.'),
  art('04-portrait-bangs', 'Portrait with bangs', 'Pencil on paper', 'sketch', 'Pencil portrait of a girl with a heavy fringe and long hair, hatched shading on her cheeks, photographed under warm light.'),
  art('19-type-poster', 'TYPE! is SO COOL!', 'Typographic poster', 'studio', 'Poster with bubbly hand-shaped letters reading “TYPE! is SO COOL!” in green, blue and red with black drop shadows on a yellow background.'),
  art('07-butterfly', 'Butterfly', 'Pencil on paper', 'sketch', 'Soft, smoky pencil drawing of a butterfly in flight, its wings dissolving into loose strokes.'),
  art('13-seascape-sunset', 'Seascape at sunset', 'Paint on canvas', 'painting', 'Painting of a deep blue sea under clouds, with a glowing yellow-orange sun on the horizon and white birds overhead.'),
  art('05-framed-portrait', 'Framed portrait', 'Pencil on paper', 'sketch', 'Pencil drawing of a woman’s face behind strands of dark hair, cropped inside a square frame drawn on the page.'),
  art('01-lips-study', 'Lips study', 'Pencil on paper', 'sketch', 'Two detailed pencil studies of lips with soft shading on a sketchbook page.'),
  art('14-moonlit-beach', 'Moonlit beach', 'Paint on canvas', 'painting', 'Painting of a beach at night: a full moon in a blue sky, turquoise waves and textured golden sand.'),
  art('10-face-closeup', 'Face close-up', 'Pencil on paper', 'sketch', 'Close-up pencil drawing of a face framed by dark hair, with spiked lashes, small freckle marks and softly shaded lips.'),
  art('08-sketchbook-page', 'Sketchbook page', 'Pencil on paper', 'sketch', 'Sketchbook page of small pencil drawings: chunky shoes with socks, a Canon camera, an orange slice, a cake slice, a signpost, a lily and a lantern, with handwritten lines.'),
  art('02-ear-study', 'Ear study', 'Pencil on paper', 'sketch', 'Pencil study of an ear with careful shading, next to a dark pencil on white paper.'),
  art('16-holding-autumn-trees', 'With the autumn trees', 'In the studio', 'studio', 'Someone seen from behind, holding up the autumn-trees painting against a dark floral curtain.'),
  art('06-dark-portrait', 'Portrait in shadow', 'Pencil on paper', 'sketch', 'Moody photograph of a pencil portrait with long dark hair, lit dimly on a notebook page.'),
  art('17-painting-lineup', 'The collection', 'Paintings on a dresser', 'studio', 'A row of small paintings — sunsets, seascapes, trees and a Starry Night study — lined up on a white dresser beside a black guitar.'),
  art('11-framed-face', 'Framed face', 'Pencil on paper', 'sketch', 'Pencil drawing of a face with flowing hair lines, cropped in a square frame, photographed at an angle on paper.'),
  art('18-studio-flatlay', 'Studio table', 'Tools of the trade', 'studio', 'Sunlit flatlay of a laptop, sketchbooks, paint palettes, a tube box and two small paintings on a checked cloth.'),
]
