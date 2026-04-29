import '../styles/landing.css'

import LandingHero from '../components/LandingHero.jsx'
import FeaturesSection from '../components/FeaturesSection.jsx'
import StatsSection from '../components/StatsSection.jsx'
import CtaSection from '../components/CtaSection.jsx'
import LandingFooter from '../components/LandingFooter.jsx'
import { featureGroups } from '../data/landingContent.js'

export default function LandingPage() {
  return (
    <div className="landing-page" id="top">
      <main>
        <LandingHero />
        {featureGroups.map((group) => (
          <FeaturesSection key={group.id} group={group} />
        ))}
        <StatsSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}
