// Page 3 — personal visual journal. Add an entry by appending to `entries`.
//
// Rules: no invented stories, quotes or dates. Text starting with "TODO:" renders as a marked
// placeholder; images with kind 'placeholder' render as labelled empty frames.
//
// Adding photographs: put files in src/assets/journal/, import them here and use
//   { kind: 'image', src, alt, ratio: width / height, caption? }.
import { TODO, type Tone } from './work.ts'
import { pins } from './page2.ts'

export type JournalImage =
  | { kind: 'image'; src: string; srcSet?: string; alt: string; ratio: number; caption?: string }
  | { kind: 'placeholder'; tone: Tone; label: string; ratio: number; caption?: string }

export type JournalEntry = {
  id: string
  /** single photograph · pair · cluster (moodboard) · note (text only) */
  layout: 'single' | 'pair' | 'cluster' | 'note'
  align?: 'left' | 'right' | 'center'
  title?: string
  /** Only when supplied, e.g. '2026-10-12'. */
  date?: string
  note?: string
  images: JournalImage[]
}

export const journalIntro = {
  eyebrow: 'Page 03 · Journal',
  title: 'Journal',
  intro: 'A visual notebook of photographs, moodboards, collected imagery and small observations.',
}

const photo = (tone: Tone, ratio: number): JournalImage => ({ kind: 'placeholder', tone, label: 'Photograph', ratio, caption: TODO('caption') })
const pin = (i: number): JournalImage => ({ kind: 'image', src: pins[i].image!, srcSet: pins[i].srcSet, alt: pins[i].alt ?? '', ratio: pins[i].ratio ?? 0.75, caption: pins[i].caption })

export const entries: JournalEntry[] = [
  { id: 'entry-01', layout: 'single', align: 'left', images: [photo('botanical', 4 / 5)], note: TODO('a short note about this photograph') },
  {
    id: 'entry-02',
    layout: 'cluster',
    align: 'center',
    title: 'Collected imagery',
    note: 'A small moodboard from my own pins.',
    images: [pin(0), pin(8), pin(3), pin(11)],
  },
  { id: 'entry-03', layout: 'pair', align: 'right', images: [photo('blush', 3 / 4), photo('sage', 1)] },
  { id: 'entry-04', layout: 'note', align: 'left', note: TODO('an observation, a reference or a line you want to keep'), images: [] },
  { id: 'entry-05', layout: 'single', align: 'right', images: [photo('olive', 3 / 2)], note: TODO('where or when this was taken, if you want to share it') },
  { id: 'entry-06', layout: 'cluster', align: 'center', title: TODO('moodboard title'), images: [photo('cream', 3 / 4), photo('sage', 4 / 5), photo('botanical', 1), photo('blush', 2 / 3)] },
]
