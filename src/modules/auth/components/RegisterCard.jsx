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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { handleRegister, errors, loading } = useRegister();

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
                {errors.api && (
                  <div className="alert alert-danger py-2 small mb-0">
                    {errors.api}
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
                    className={`form-control form-control-lg ${errors.name ? "is-invalid" : ""}`}
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
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
                  <div className="position-relative">
                    <input
                      id={passwordId}
                      className={`form-control form-control-lg pe-5 ${errors.password ? "is-invalid" : ""}`}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="btn btn-link position-absolute top-50 end-0 translate-middle-y pe-3 p-0 text-secondary"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor={confirmPasswordId}
                    className="form-label small fw-semibold"
                  >
                    Confirm Password
                  </label>
                  <div className="position-relative">
                    <input
                      id={confirmPasswordId}
                      className={`form-control form-control-lg pe-5 ${errors.confirmPassword ? "is-invalid" : ""}`}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="btn btn-link position-absolute top-50 end-0 translate-middle-y pe-3 p-0 text-secondary"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">
                      {errors.confirmPassword}
                    </div>
                  )}
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
