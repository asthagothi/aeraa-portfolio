// Router context, types and hooks (kept separate from the components for fast refresh).
import { createContext, useContext } from 'react'

export type Location = { path: string; hash: string }
/** Plays a cover animation, calls `swap` while covered, then uncovers. */
export type TransitionPlayer = (swap: () => void) => void

type RouterValue = {
  path: string
  hash: string
  /** No files replaced swaps the current history entry instead of adding one (for redirects). */
  navigate: (to: string, options?: { replace?: boolean }) => void
  /** Registered by <PageTransition>; without one, navigation is instant. */
  setTransition: (player: TransitionPlayer | null) => void
}

const RouterContext = createContext<RouterValue | null>(null)

export { RouterContext }

export function useRouter() {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('useRouter must be used inside <RouterProvider>')
  return ctx
}
