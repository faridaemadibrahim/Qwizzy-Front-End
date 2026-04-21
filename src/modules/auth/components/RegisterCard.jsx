import { useId, useState } from "react";
import { Link } from "react-router-dom";
export default function RegisterCard() {
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    // TODO: handle registration logic
  }

  return (
    <section className="container auth-shell">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-5">
          <div className="card auth-card border-0 shadow-lg">
            <div className="card-body p-4 p-md-5">
              <h1 className="h4 fw-bold text-center mb-2">Create Account</h1>
              <p className="auth-muted text-center small mb-4">
                Start your learning journey today
              </p>

              <form onSubmit={handleSubmit} className="d-grid gap-3">
                {error && (
                  <div
                    className="alert alert-danger py-2 small mb-0"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                <div>
                  <label
                    htmlFor={nameId}
                    className="form-label small fw-semibold"
                  >
                    Full Name
                  </label>
                  <input
                    id={nameId}
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>

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
                    autoComplete="new-password"
                    required
                    minLength={6}
                  />
                  <div
                    className="form-text auth-muted"
                    style={{ fontSize: "0.78rem" }}
                  >
                    At least 6 characters
                  </div>
                </div>

                <div>
                  <label
                    htmlFor={confirmPasswordId}
                    className="form-label small fw-semibold"
                  >
                    Confirm Password
                  </label>
                  <input
                    id={confirmPasswordId}
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-qm-primary btn-lg rounded-3 mt-2"
                >
                  Create Account
                </button>

                <p className="text-center small mb-0">
                  <span className="auth-muted">Already have an account?</span>{" "}
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
