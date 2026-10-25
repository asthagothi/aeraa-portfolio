// In-page targets that can't be reached by plain element scrolling. The services section, for
// example, lives inside the pinned phone, whose content moves with scroll; FoldHome registers a
// handler that maps it to the right page position. The router tries these before looking up an id.
const targets = new Map<string, (smooth: boolean) => boolean>()

export function registerHashTarget(id: string, handler: (smooth: boolean) => boolean) {
  targets.set(id, handler)
  return () => {
    if (targets.get(id) === handler) targets.delete(id)
  }
}

/** Runs the handler for `id`, if there is one. Returns false when there is none (or it declined). */
export function scrollToHashTarget(id: string, smooth: boolean) {
  return targets.get(id)?.(smooth) ?? false
}
