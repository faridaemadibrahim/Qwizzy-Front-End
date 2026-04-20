import { footer } from '../data/landingContent.js'

export default function LandingFooter() {
  return (
    <footer className="border-top border-qm-light py-4 text-center">
      <div className="container">
        <p className="small text-qm-muted mb-0">{footer.line}</p>
      </div>
    </footer>
  )
}
