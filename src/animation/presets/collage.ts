// "Collage" choreography: six cards fly in from different edges along curved paths,
// cross over each other mid-flight, and settle into an asymmetric, overlapping arrangement.
// Coordinates are % of the scene from its centre (see Pose in ../types.ts).
import type { SceneMotion } from '../types.ts'

export const collageMotion: SceneMotion = {
  scrollLength: 2.2,
  scrub: 0.7,
  cards: [
    {
      // Sweeps in from the far left, arcing up before dropping into place.
      from: { x: -78, y: 28, rotate: -28, scale: 0.8, opacity: 0 },
      via: [{ x: -46, y: -22, rotate: -14, scale: 0.95 }],
      to: { x: -28, y: -8, rotate: -6 },
      start: 0,
      duration: 0.46,
      z: 2,
    },
    {
      // Rises from below the fold, large and close, then recedes to its slot.
      from: { x: -4, y: 82, rotate: 16, scale: 1.25, opacity: 0 },
      via: [{ x: -20, y: 26, rotate: 9, scale: 1.12 }],
      to: { x: -9, y: 7, rotate: 3 },
      start: 0.07,
      duration: 0.48,
      ease: 'expo.out',
      z: 6,
    },
    {
      // Drops from above, tumbling slightly in 3D.
      from: { x: 30, y: -82, rotate: 22, rotateX: 35, scale: 0.85, opacity: 0 },
      via: [{ x: 22, y: -32, rotate: 10, rotateX: 12 }],
      to: { x: 10, y: -11, rotate: -2 },
      start: 0.14,
      duration: 0.44,
      z: 3,
    },
    {
      // Swings in from the right with a door-like Y rotation.
      from: { x: 82, y: -12, rotate: 30, rotateY: -45, scale: 0.9, opacity: 0 },
      via: [{ x: 46, y: 18, rotate: 12, rotateY: -15 }],
      to: { x: 28, y: 3, rotate: 5 },
      start: 0.21,
      duration: 0.46,
      pathEase: 'power1.inOut',
      z: 4,
    },
    {
      // Low diagonal from bottom-left, crossing under card 2.
      from: { x: -64, y: 86, rotate: -22, scale: 0.75, opacity: 0 },
      via: [{ x: -38, y: 42, rotate: -8, scale: 0.85 }],
      to: { x: -21, y: 24, rotate: 4, scale: 0.88 },
      start: 0.3,
      duration: 0.42,
      z: 5,
    },
    {
      // Last in, from bottom-right; lands on top of the cluster's edge.
      from: { x: 68, y: 84, rotate: 26, scale: 0.75, opacity: 0 },
      via: [{ x: 40, y: 46, rotate: 10, scale: 0.88 }],
      to: { x: 18, y: 25, rotate: -4, scale: 0.9 },
      start: 0.38,
      duration: 0.42,
      ease: 'back.out(1.4)',
      z: 7,
    },
  ],
}
