import { Link } from "react-router-dom";
import logo from "../../../assets/logo.jpg";
export default function QmDashboardNavbar({ user }) {
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

          <div className="ms-auto d-flex align-items-center gap-3">
            <div className="text-end">
              <p className="mb-0 fw-semibold" style={{ fontSize: "0.88rem" }}>
                {user.name}
              </p>
              <p className="mb-0 qm-text-muted" style={{ fontSize: "0.75rem" }}>
                {user.role}
              </p>
            </div>
            <button
              title="Sign out"
              className="btn btn-link qm-text-muted p-0"
              style={{ fontSize: "1.2rem", lineHeight: 1 }}
            >
              ↪
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
