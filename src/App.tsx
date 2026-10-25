// App shell: router, persistent navigation, page transition, and the route table.
import { useEffect } from 'react'
import Cursor from './components/shell/Cursor.tsx'
import SiteNav from './components/shell/SiteNav.tsx'
import PageTransition from './components/shell/PageTransition.tsx'
import { routes, sections } from './config/site.ts'
import HomePage from './pages/HomePage.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'
import WorkPage from './pages/WorkPage.tsx'
import { matchPath } from './router/matchPath.ts'
import { RouterProvider } from './router/Router.tsx'
import { useRouter } from './router/routerContext.ts'

/** Replaces the current address (no extra history entry, so Back doesn't bounce) and re-routes. */
function Redirect({ to }: { to: string }) {
  const { navigate } = useRouter()
  useEffect(() => {
    navigate(to, { replace: true })
  }, [navigate, to])
  return null
}

function Routes() {
  const { path } = useRouter()
  if (path === routes.home.path) return <HomePage />
  if (path === routes.work.path) return <WorkPage />
  if (path === routes.journal.path) return <Redirect to={`/#${sections.creative.id}`} />
  const caseMatch = matchPath(`${routes.work.path}/:slug`, path)
  // The old placeholder case pages now forward to the Work page, which holds every real project.
  if (caseMatch) return <Redirect to={routes.work.path} />
  return <NotFoundPage />
}

export default function App() {
  return (
    <RouterProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteNav />
      <main id="main" tabIndex={-1}>
        <Routes />
      </main>
      <PageTransition />
      <Cursor />
    </RouterProvider>
  )
}
