// The portrait, shared by the hero and the phone section (lock screen, home screen, call screen).
// Every <img> of it uses these exact srcset / sizes values, so the browser picks the same file for
// all of them and downloads each one once: when the phone section arrives, its portrait is already
// in the cache. (Different `sizes` could make one element pick 640w and another 1024w.)
import photo640 from '../../assets/hero/portrait-palette-640.webp'
import photo1024 from '../../assets/hero/portrait-palette-1024.webp'
import cutout640 from '../../assets/hero/portrait-cutout-640.webp'
import cutout1024 from '../../assets/hero/portrait-cutout-1024.webp'

export const portraitPhoto = { src: photo1024, srcSet: `${photo640} 640w, ${photo1024} 1024w` }
export const portraitCutout = { src: cutout1024, srcSet: `${cutout640} 640w, ${cutout1024} 1024w` }

// Rendered width of the hero portrait per layout (see HeroSection.module.css):
// mobile flow = full bleed (max 30rem); 768–1023px or portrait tablet = 68% of a 3:4 stage;
// desktop = 40% of a stage that is at least 1000px wide. The phone's copies are smaller, so this
// over-describes them slightly; sharing one value is what guarantees a single download.
export const PORTRAIT_SIZES = [
  '(max-width: 767px) min(100vw, 30rem)',
  '(max-height: 520px) and (orientation: landscape) 30rem',
  '(max-width: 1023px) 68vw',
  '(max-width: 1099px) and (orientation: portrait) 68vw',
  '(min-aspect-ratio: 1397/1008) max(400px, 56svh)',
  '40vw',
].join(', ')
