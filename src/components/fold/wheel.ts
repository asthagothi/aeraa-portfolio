// Turning the question wheel (QuestionWheel.tsx): kept apart from the component so it hot-reloads.

/** Degrees between slots on a drum (8 slots). */
export const STEP = 45

/**
 * Turns both drums to `turn` degrees (left one way, right the other) and lights the slot facing the
 * viewer; slots fade as they turn away. Cheap enough to call on every scroll frame.
 */
export function turnWheel(root: HTMLElement, turn: number) {
  root.querySelectorAll<HTMLElement>('[data-drum]').forEach((drum) => {
    const dir = drum.parentElement!.dataset.side === 'left' ? 1 : -1
    const rot = turn * dir
    drum.style.transform = `rotateX(${rot}deg)`
    drum.querySelectorAll<HTMLElement>('[data-angle]').forEach((slot) => {
      // Angle of this slot relative to the front, in (-180, 180].
      let a = (Number(slot.dataset.angle) - rot) % 360
      if (a > 180) a -= 360
      if (a <= -180) a += 360
      const facing = Math.cos((a * Math.PI) / 180)
      slot.style.opacity = String(Math.max(0, facing) ** 2.2)
      const front = Math.abs(a) < STEP / 2
      if (front !== (slot.dataset.front === 'true')) slot.dataset.front = String(front)
    })
  })
}
