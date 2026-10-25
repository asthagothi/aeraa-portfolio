// "Board assembles" — Page 2 opening.
// Card 0 is the Page 1 portrait: it starts large (echoing the hero) and shrinks into the centre pin.
// Cards 1–8 fly in from the edges along curved paths and settle into a five-column, staggered board.
// Coordinates are % of the pinned stage from its centre (see Pose in ../types.ts).
// Settled positions were laid out for 1440×900 with pins 12.5vw wide; they scale with the viewport.
import type { SceneMotion } from '../types.ts'

export const boardMotion: SceneMotion = {
  scrollLength: 2,
  scrub: 0.6,
  cards: [
    // 0 · portrait → centre pin
    { from: { x: 0, y: 1, scale: 2 }, to: { x: 0, y: 3.3 }, start: 0, duration: 0.42, ease: 'power2.inOut', z: 10 },
    // 1 · col −36, top
    { from: { x: -82, y: 40, rotate: -25, scale: 0.8, opacity: 0 }, via: [{ x: -56, y: -6, rotate: -10 }], to: { x: -36, y: -12.2, rotate: -1.5 }, start: 0.14, duration: 0.42, z: 3 },
    // 2 · col −36, bottom
    { from: { x: -72, y: 92, rotate: 18, opacity: 0 }, via: [{ x: -46, y: 36, rotate: 8 }], to: { x: -36, y: 15, rotate: 1 }, start: 0.3, duration: 0.4, z: 4 },
    // 3 · col −18, top
    { from: { x: -30, y: 96, rotate: -14, opacity: 0 }, via: [{ x: -26, y: 40, rotate: -6 }], to: { x: -18, y: -5, rotate: 1.2 }, start: 0.2, duration: 0.42, ease: 'expo.out', z: 5 },
    // 4 · col +18, top
    { from: { x: 30, y: -92, rotate: 16, opacity: 0 }, via: [{ x: 25, y: -36, rotate: 6 }], to: { x: 18, y: -8.3, rotate: -1 }, start: 0.18, duration: 0.42, z: 5 },
    // 5 · col +18, bottom
    { from: { x: 62, y: 96, rotate: -20, opacity: 0 }, via: [{ x: 32, y: 46, rotate: -8 }], to: { x: 18, y: 16.3, rotate: 1.5 }, start: 0.36, duration: 0.4, z: 6 },
    // 6 · col +36, top (swings in with a Y rotation)
    { from: { x: 86, y: -30, rotate: 28, rotateY: -35, opacity: 0 }, via: [{ x: 56, y: -14, rotate: 10, rotateY: -12 }], to: { x: 36, y: -6.7, rotate: 1 }, start: 0.24, duration: 0.42, pathEase: 'power1.inOut', z: 4 },
    // 7 · col −18, bottom
    { from: { x: -52, y: 110, rotate: 20, opacity: 0 }, via: [{ x: -30, y: 56, rotate: 6 }], to: { x: -18, y: 23, rotate: -1 }, start: 0.42, duration: 0.4, z: 6 },
    // 8 · col +36, bottom
    { from: { x: 82, y: 82, rotate: -18, opacity: 0 }, via: [{ x: 50, y: 40, rotate: -6 }], to: { x: 36, y: 23, rotate: -1.5 }, start: 0.46, duration: 0.4, ease: 'back.out(1.3)', z: 7 },
  ],
}
