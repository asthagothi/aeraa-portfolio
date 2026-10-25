// Configuration types for scroll-driven floating cards.
// Motion is described as data; components never contain choreography.

/**
 * A card's transform at one moment.
 * x / y are offsets from the scene centre, as a percentage of the scene's width / height,
 * so a choreography adapts to any viewport size.
 */
export type Pose = {
  x: number
  y: number
  rotate?: number
  rotateX?: number
  rotateY?: number
  scale?: number
  opacity?: number
}

export type CardMotion = {
  /** Where the card is before its entrance (normally off-stage). */
  from: Pose
  /** Optional waypoints between `from` and `to` — this shapes the flight path. */
  via?: Pose[]
  /** Where the card settles. */
  to: Pose
  /** Optional exit after the hold, e.g. drifting away before the scene unpins. */
  exit?: Pose
  /** Timeline position (0–1) where the entrance begins. */
  start: number
  /** Entrance length as a fraction (0–1) of the whole scene timeline. */
  duration: number
  /** Where the exit begins (0–1). Required when `exit` is set. */
  exitStart?: number
  exitDuration?: number
  /** Ease for the settle segment. Waypoint segments use `pathEase`. */
  ease?: string
  pathEase?: string
  /** Stacking order within the scene. */
  z: number
}

export type SceneMotion = {
  /** Scroll distance while pinned, as a multiple of the viewport height. */
  scrollLength: number
  /** Scrub smoothing in seconds (`true` = locked to the scrollbar). */
  scrub: number | true
  cards: CardMotion[]
}
