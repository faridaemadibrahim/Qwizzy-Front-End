import { useId, useState } from "react";
import { Link } from "react-router-dom";
import useRegister from "../hooks/useRegister";

export default function RegisterCard() {
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { handleRegister, error, loading } = useRegister();

  function handleSubmit(event) {
    event.preventDefault();

    handleRegister({
      name,
      email,
      password,
      confirmPassword,
    });
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
                  <div className="alert alert-danger py-2 small mb-0">
                    {error}
                  </div>
                )}

                {/* Name */}
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
                    required
                  />
                </div>

                {/* Email */}
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
                    required
                  />
                </div>

                {/* Password */}
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
                    required
                  />
                </div>

                {/* Confirm Password */}
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
                    required
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn btn-qm-primary btn-lg rounded-3 mt-2"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Account"}
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
