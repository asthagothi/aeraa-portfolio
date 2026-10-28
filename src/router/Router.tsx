// Minimal client-side router: real URLs, back/forward, direct loading, scroll restoration,
// in-page hash links, and an optional page-transition hook. No dependency needed for four routes.
//
// Hosting note: the server must serve index.html for unknown paths (SPA fallback). Vite's dev and
// preview servers do this already; for static hosting add a rewrite of /* → /index.html (GitHub
// Pages serves the 404.html copy the deploy workflow makes).
//
// Route paths are written without the site's base (e.g. '/work'). When the site is served from a
// sub-folder (BASE_PATH at build time, e.g. GitHub Pages' /aeraa-portfolio/), the base is removed
// when reading the URL and added back when writing it.
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type AnchorHTMLAttributes, type MouseEvent, type ReactNode, type Ref } from 'react'
import { RouterContext, useRouter, type Location, type TransitionPlayer } from './routerContext.ts'
import { ScrollTrigger } from '../lib/gsap.ts'
import { scrollToElement, scrollToY } from '../lib/smoothScroll.ts'
import { scrollToHashTarget } from './hashTargets.ts'

const base = import.meta.env.BASE_URL.replace(/\/+$/, '')
const withBase = (to: string) => (base && to.startsWith('/') ? base + to : to)
const stripBase = (path: string) => (base && (path === base || path.startsWith(base + '/')) ? path.slice(base.length) || '/' : path)

const readLocation = (): Location => ({ path: normalise(stripBase(window.location.pathname)), hash: window.location.hash })
const normalise = (path: string) => (path.length > 1 ? path.replace(/\/+$/, '') : path)

function scrollToHash(hash: string, smooth = true) {
  if (!hash) return false
  const id = decodeURIComponent(hash.slice(1))
  if (scrollToHashTarget(id, smooth)) return true
  const el = document.getElementById(id)
  if (el) scrollToElement(el, { smooth })
  return !!el
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<Location>(readLocation)
  const transition = useRef<TransitionPlayer | null>(null)
  /** Where to scroll once the new route has rendered: a y position or a hash. */
  const pendingScroll = useRef<{ y?: number; hash?: string } | null>(null)

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    const onPop = () => {
      const next = readLocation()
      const swap = () => {
        // Read the URL again: a quicker back/forward may have landed while the transition played.
        const now = readLocation()
        pendingScroll.current = { y: (history.state as { scroll?: number } | null)?.scroll ?? 0, hash: now.hash }
        setLocation(now)
      }
      // Back/forward within the same page (hash change) needs no transition.
      if (next.path === normalise(location.path)) swap()
      else (transition.current ?? ((s) => s()))(swap)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [location.path])

  // Direct load with a hash (e.g. /#contact): place it ourselves rather than relying on the
  // browser's native anchor jump, which the smooth scroller doesn't follow and which happens before
  // pinned sections are measured. Again once images have loaded, in case they moved the target.
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return
    const jump = () => {
      ScrollTrigger.refresh()
      scrollToHash(hash, false)
    }
    const frame = requestAnimationFrame(jump)
    if (document.readyState === 'complete') return () => cancelAnimationFrame(frame)
    window.addEventListener('load', jump, { once: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('load', jump)
    }
  }, [])

  // After the new route has committed: restore or reset scroll, then let ScrollTrigger re-measure.
  useLayoutEffect(() => {
    const target = pendingScroll.current
    if (!target) return
    pendingScroll.current = null
    // Move focus to the new page's content so keyboard and screen-reader users start there.
    if (!target.hash) document.getElementById('main')?.focus({ preventScroll: true })
    if (target.hash) {
      // A hash target is only placed correctly once pinned sections have been measured, and a
      // refresh restores the scroll position, so measure first and then jump (while the transition
      // covers). The new page's pins already exist (child effects run first). Repeat on the next
      // frame in case late layout (images, fonts) moved things.
      const jump = () => {
        ScrollTrigger.refresh()
        if (!scrollToHash(target.hash!, false)) scrollToY(target.y ?? 0, { smooth: false })
      }
      scrollToY(0, { smooth: false })
      jump()
      requestAnimationFrame(jump)
    } else {
      scrollToY(target.y ?? 0, { smooth: false })
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }
  }, [location])

  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    const write = options?.replace ? history.replaceState.bind(history) : history.pushState.bind(history)
    const url = new URL(withBase(to), window.location.href)
    if (url.origin !== window.location.origin) {
      window.location.assign(url.href)
      return
    }
    const next: Location = { path: normalise(stripBase(url.pathname)), hash: url.hash }
    const current = readLocation()

    // Same page: just move to the hash (or the top).
    if (next.path === current.path) {
      if (next.hash !== current.hash) write({ scroll: 0 }, '', url.pathname + url.search + url.hash)
      if (!scrollToHash(next.hash)) scrollToY(0)
      if (next.hash !== current.hash) setLocation(next)
      return
    }

    // Remember where we were on the page we're leaving (for the Back button).
    if (!options?.replace) history.replaceState({ ...(history.state ?? {}), scroll: window.scrollY }, '')
    const swap = () => {
      write({ scroll: 0 }, '', url.pathname + url.search + url.hash)
      pendingScroll.current = { y: 0, hash: next.hash }
      setLocation(next)
    }
    ;(transition.current ?? ((s) => s()))(swap)
  }, [])

  const setTransition = useCallback((player: TransitionPlayer | null) => {
    transition.current = player
  }, [])

  const value = useMemo(() => ({ ...location, navigate, setTransition }), [location, navigate, setTransition])
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string
  ref?: Ref<HTMLAnchorElement>
  /** Mark as current when the path matches exactly (default) or as a prefix. */
  match?: 'exact' | 'prefix'
}

/** In-app link: a real <a href> (works without JS, new tabs, copy link) that navigates client-side. */
export function Link({ to, match = 'exact', onClick, children, ...rest }: LinkProps) {
  const { path, navigate } = useRouter()
  const target = normalise(new URL(to, 'http://x').pathname)
  const active = match === 'exact' ? path === target : path === target || path.startsWith(target + '/')

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || rest.target === '_blank') return
    e.preventDefault()
    navigate(to)
  }

  return (
    <a href={withBase(to)} onClick={handleClick} aria-current={active && !to.includes('#') ? 'page' : undefined} {...rest}>
      {children}
    </a>
  )
}
