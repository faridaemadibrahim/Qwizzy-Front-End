import { useId, useState } from "react";
import { Link } from "react-router-dom";
import useResetPassword from "../hooks/useResetPassword.js";

export default function ResetPasswordCard() {
  const newPasswordId = useId();
  const confirmPasswordId = useId();
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    success,
    loading,
    handleSubmit,
  } = useResetPassword();


  // Strength checker
  const hasLen = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasNum = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const score = [hasLen, hasUpper, hasNum, hasSpecial].filter(Boolean).length;

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][score];
  const strengthColor = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"][score];
  const barColors = ["#e5e7eb", "#ef4444", "#f97316", "#eab308", "#22c55e"];

  const passwordsMatch =
    confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordsMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  return (
    <section className="container auth-shell">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-5">
          <div className="card auth-card border-0 shadow-lg">
            <div className="card-body p-4 p-md-5">
              <h1 className="h4 fw-bold text-center mb-2">Reset Password</h1>
              <p className="auth-muted text-center small mb-4">
                Create a strong new password for your account
              </p>

              <form onSubmit={handleSubmit} className="d-grid gap-3">
                {/* New Password */}
                <div>
                  <label
                    htmlFor={newPasswordId}
                    className="form-label small fw-semibold"
                  >
                    New Password
                  </label>
                  <div className="position-relative">
                    <input
                      id={newPasswordId}
                      className={`form-control form-control-lg pe-5 ${
                        newPassword && score < 3 ? "is-invalid" : ""
                      } ${newPassword && score >= 3 ? "is-valid" : ""}`}
                      type={showNew ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((v) => !v)}
                      className="btn btn-link position-absolute top-50 end-0 translate-middle-y pe-3 p-0 text-secondary"
                      tabIndex={-1}
                    >
                      {showNew ? (
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

                  {/* Strength bar */}
                  {newPassword.length > 0 && (
                    <div className="mt-2">
                      <div className="d-flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            style={{
                              flex: 1,
                              height: 4,
                              borderRadius: 4,
                              background:
                                i <= score ? strengthColor : barColors[0],
                              transition: "background 0.3s",
                            }}
                          />
                        ))}
                      </div>
                      <p
                        className="small mb-0"
                        style={{ color: strengthColor }}
                      >
                        {strengthLabel}
                      </p>
                    </div>
                  )}

                  {/* Rules */}
                  {newPassword.length > 0 && (
                    <div className="mt-2 row row-cols-2 g-1">
                      {[
                        { pass: hasLen, label: "At least 8 characters" },
                        { pass: hasUpper, label: "Uppercase letter" },
                        { pass: hasNum, label: "One number" },
                        { pass: hasSpecial, label: "Special character" },
                      ].map(({ pass, label }) => (
                        <div key={label} className="col">
                          <span
                            className="small"
                            style={{ color: pass ? "#10b981" : "#9ca3af" }}
                          >
                            {pass ? "✓" : "○"} {label}
                          </span>
                        </div>
                      ))}
                    </div>
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
                      className={`form-control form-control-lg pe-5 ${
                        passwordsMismatch ? "is-invalid" : ""
                      } ${passwordsMatch ? "is-valid" : ""}`}
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="btn btn-link position-absolute top-50 end-0 translate-middle-y pe-3 p-0 text-secondary"
                      tabIndex={-1}
                    >
                      {showConfirm ? (
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
                  {passwordsMismatch && (
                    <div className="invalid-feedback d-block mt-1">
                      Passwords do not match
                    </div>
                  )}
                  {passwordsMatch && (
                    <div className="valid-feedback d-block mt-1">
                      Passwords match
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-qm-primary btn-lg rounded-3 mt-2"
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>

                {error && (
                  <div className="alert alert-danger py-2 mt-1" role="alert">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="alert alert-success py-2 mt-1" role="alert">
                    {success}
                  </div>
                )}

                <p className="text-center small mb-0">
                  <span className="auth-muted">Remember your password?</span>{" "}
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
