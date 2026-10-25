// Content shape for a floating card. Real project data and placeholders both use this type.

export type FloatingCardData = {
  id: string
  title: string
  caption?: string
  /** Project image URL. When absent, an abstract placeholder is drawn. */
  image?: string
  /** Optional responsive sources for `image` (e.g. "a-360.webp 360w, a-600.webp 600w"). */
  srcSet?: string
  /** Natural width / height of the image. When set, the card keeps the image's own proportions. */
  ratio?: number
  alt?: string
  /** Optional link to the original (e.g. the pin on Pinterest). Only rendered when set. */
  href?: string
  /** Abstract placeholder palette (used only when there is no image). */
  palette?: 'warm' | 'cool' | 'mono' | 'signal' | 'sand' | 'charcoal' | 'blush' | 'denim' | 'ivory' | 'olive'
  /** portrait 4:5 · landscape 4:3 · square 1:1 · tall 2:3 · card 3:4 */
  aspect?: 'portrait' | 'landscape' | 'square' | 'tall' | 'card'
}
