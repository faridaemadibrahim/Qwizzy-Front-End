import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { authCopy } from "../data/authContent.js";
import useLogin from "../hooks/useLogin";

export default function LoginCard() {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin, error, loading } = useLogin();

  function handleSubmit(event) {
    event.preventDefault();
    handleLogin({ email, password });
  }

  return (
    <section className="container auth-shell">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-5">
          <div className="card auth-card border-0 shadow-lg">
            <div className="card-body p-4 p-md-5">
              <h1 className="h4 fw-bold text-center mb-2">{authCopy.title}</h1>
              <p className="auth-muted text-center small mb-4">
                {authCopy.subtitle}
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

                <div>
                  <label
                    htmlFor={passwordId}
                    className="form-label small fw-semibold"
                  >
                    Password
                  </label>
                  <input
                    id={passwordId}
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-qm-primary btn-lg rounded-3 mt-2"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>

                {error && (
                  <div className="alert alert-danger py-2 mt-1" role="alert">
                    {error}
                  </div>
                )}

                <div>
                  <Link to="/forgot-password" className="link-qm fw-semibold">
                    Forgot Password?
                  </Link>
                </div>

                <p className="text-center small mb-0">
                  <span className="auth-muted">
                    Don&apos;t have an account?
                  </span>{" "}
                  <Link
                    className="link-qm fw-semibold text-decoration-none"
                    to="/register"
                  >
                    Sign up here
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
