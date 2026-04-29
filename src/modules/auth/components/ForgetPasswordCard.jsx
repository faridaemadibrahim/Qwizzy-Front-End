import { useId } from "react";
import { Link } from "react-router-dom";
import { authCopyForgetPassword } from "../data/authContent.js";
import useForgetPassword from "../hooks/useForgetPassword.js";

export default function ForgetPasswordCard() {
  const emailId = useId();
  const {
    email,
    setEmail,
    error,
    success,
    loading,
    handleSubmit,
  } = useForgetPassword();

  return (
    <section className="container auth-shell">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-5">
          <div className="card auth-card border-0 shadow-lg">
            <div className="card-body p-4 p-md-5">
              <h1 className="h4 fw-bold text-center mb-2">
                {authCopyForgetPassword.title}
              </h1>
              <p className="auth-muted text-center small mb-4">
                {authCopyForgetPassword.subtitle}
              </p>

              <form onSubmit={handleSubmit} className="d-grid gap-3">
                <div>
                  <label
                    htmlFor={emailId}
                    className="form-label small fw-semibold"
                  >
                    Email
                  </label>
                  <input
                    id={emailId}
                    className="form-control form-control-lg"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-qm-primary btn-lg rounded-3 mt-2"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Code"}
                </button>

                {error && (
                  <div className="alert alert-danger py-2 mt-3" role="alert">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="alert alert-success py-2 mt-3" role="alert">
                    {success}
                  </div>
                )}

                <p className="text-center small mb-0">
                  <span className="auth-muted">Remember your password ? </span>{" "}
                  <Link
                    className="link-qm fw-semibold text-decoration-none"
                    to="/login"
                  >
                    Sign in here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
