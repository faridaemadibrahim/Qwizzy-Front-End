import { Link, NavLink } from 'react-router-dom'

import logo from '../assets/logo.jpg'

export default function QmBrandNavbar({ hideAuthCtas = false }) {
  return (
    <header>
      <nav className="navbar navbar-expand bg-white border-bottom qm-border-light py-3">
        <div className="container">
          <Link
            className="navbar-brand d-flex align-items-center gap-2 fw-bold qm-text-purple"
            to="/"
          >
            <span className="qm-brand-mark" aria-hidden>
              <img className="qm-brand-logo" src={logo} alt="" />
            </span>
            Qwizzy
          </Link>

          {!hideAuthCtas && (
            <div className="ms-auto d-flex align-items-center gap-3">
              <NavLink className="qm-navlink small fw-medium" to="/login">
                Sign In
              </NavLink>
              <a className="btn btn-qm-primary rounded-3 px-4" href="/#get-started">
                Get Started
              </a>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
