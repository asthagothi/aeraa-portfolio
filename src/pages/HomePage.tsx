// Home — first: the original hero (components/hero/HeroSection); second, after scrolling: the
// foldable-device experience (components/fold/FoldHome); third: Creative Corner, the 3D orbit of
// personal artwork (components/creative/CreativeCorner); then Contact (components/contact/ContactSection).
// The final Thank You section will follow Contact once its reference is supplied.
import ContactSection from '../components/contact/ContactSection.tsx'
import CreativeCorner from '../components/creative/CreativeCorner.tsx'
import FoldHome from '../components/fold/FoldHome.tsx'
import HeroSection from '../components/hero/HeroSection.tsx'
import { routes } from '../config/site.ts'
import { useDocumentTheme } from './useDocumentTheme.ts'

export default function HomePage() {
  useDocumentTheme('studio', routes.home.title)
  return (
    <>
      <HeroSection />
      <FoldHome />
      <CreativeCorner />
      <ContactSection />
      {/* Final section: Thank You (id: sections.thankYou.id), separate from Contact — goes here.
          Waiting for the visual reference; not designed or implemented yet. */}
    </>
  )
}
