// Page 2 — Pinterest & affiliate marketing. Follows Page 1 in the same continuous scroll.
// Order: board assembles → intro → gallery → reach → affiliate journey → hand-off to Page 3.
import { sections } from '../../config/site.ts'
import AffiliateJourney from './AffiliateJourney.tsx'
import OutroToMotion from './OutroToMotion.tsx'
import PinBoardScene from './PinBoardScene.tsx'
import PinGallery from './PinGallery.tsx'
import PinIntro from './PinIntro.tsx'
import ReachSection from './ReachSection.tsx'

export default function Page2() {
  return (
    <>
      <PinBoardScene id={sections.pinterest.id} />
      <PinIntro />
      <PinGallery id={sections.pinGallery.id} />
      <ReachSection id={sections.reach.id} />
      <AffiliateJourney id={sections.affiliate.id} />
      <OutroToMotion id={sections.nextMotion.id} />
    </>
  )
}
