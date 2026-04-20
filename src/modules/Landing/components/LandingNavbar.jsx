import { brand } from "../data/landingContent.js";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.jpg";

export default function LandingNavbar() {
  return (
    <header>
      <nav className="navbar navbar-expand-lg bg-white border-bottom border-qm-light py-3">
        <div className="container">
          <a
            className="navbar-brand d-flex align-items-center gap-2 fw-bold text-qm-purple"
            href="#top"
          >
            <span className="navbar-brand-mark" aria-hidden>
              <img className="navbar-brand-logo" src={logo} alt="" />
            </span>
            {brand.name}
          </a>
          <div className="ms-auto d-flex align-items-center gap-3">
            <Link
              className="text-decoration-none text-qm-muted small fw-medium"
              to="/login"
            >
              Sign In
            </Link>
            <a
              className="btn btn-qm-primary rounded-3 px-4"
              href="#get-started"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
