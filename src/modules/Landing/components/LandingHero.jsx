import { hero } from '../data/landingContent.js'
import { Link } from 'react-router-dom'

export default function LandingHero() {
  return (
    <section className="py-5">
      <div className="container text-center py-lg-5">
        <h1 className="hero-title fw-bold mb-3">
          <span className="d-block text-dark">{hero.titleLead}</span>
          <span className="d-block text-qm-purple">{hero.titleAccent}</span>
        </h1>
        <p className="lead text-qm-muted mx-auto mb-4" style={{ maxWidth: '36rem' }}>
          {hero.subtitle}
        </p>
        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
          <Link className="btn btn-qm-primary btn-lg rounded-pill px-4" to="/register">
            {hero.primaryCta}
          </Link>
          <Link className="btn btn-qm-outline btn-lg rounded-pill px-4" to="/login">
            {hero.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  )
}
