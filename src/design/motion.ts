// Motion tokens for JavaScript-driven animation (GSAP).
// Durations are in seconds to match GSAP. Keep in sync with the --duration-* / --ease-* tokens in tokens.css.

export const duration = {
  fast: 0.15,
  base: 0.25,
  slow: 0.6,
  entrance: 0.9,
} as const

export const ease = {
  standard: 'power2.out',
  outExpo: 'expo.out',
  inOut: 'power3.inOut',
  // Scrubbed scroll timelines read best with linear time mapping.
  scrub: 'none',
} as const

export const stagger = {
  tight: 0.06,
  base: 0.12,
} as const

/**
 * Shared media queries for scroll scenes.
 * - scene: large enough for pinned, scrubbed sequences.
 * - light: motion allowed but small or short screen — simple reveals only, no pinning.
 * Reduced motion matches neither, so content stays static and fully visible.
 */
export const motionQuery = {
  scene: '(prefers-reduced-motion: no-preference) and (min-width: 768px) and (min-height: 521px)',
  light:
    '(prefers-reduced-motion: no-preference) and (max-width: 767px), (prefers-reduced-motion: no-preference) and (max-height: 520px)',
  any: '(prefers-reduced-motion: no-preference)',
  /** The home page's folding-phone scene (and the hero → phone hand-off that leads into it). */
  fold: '(prefers-reduced-motion: no-preference) and (min-width: 900px) and (min-height: 600px)',
} as const

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
