import useVerifyEmail from "../hooks/useVerifyEmail.js";

export default function VerifyEmailCard() {
  const {
    CODE_LENGTH,
    digits,
    error,
    success,
    resendStatus,
    formattedTime,
    isExpired,
    codeComplete,
    recipientEmail,
    inputRefs,
    labelId,
    handleDigitChange,
    handleKeyDown,
    handlePaste,
    handleSubmit,
    handleResend,
  } = useVerifyEmail();

  if (success) {
    return (
      <section className="container auth-shell">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-5">
            <div className="card auth-card border-0 shadow-lg">
              <div className="card-body p-4 p-md-5 text-center">
                <div
                  className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle"
                  style={{ width: 64, height: 64, background: "#ecfdf5" }}
                >
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h1 className="h4 fw-bold mb-2">Email Verified!</h1>
                <p className="auth-muted small mb-4">
                  Your email has been successfully verified.
                  <br />
                  Redirecting you to your dashboard…
                </p>
                <div
                  className="spinner-border text-qm-primary"
                  role="status"
                  style={{ width: 20, height: 20, borderWidth: 2 }}
                >
                  <span className="visually-hidden">Loading…</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container auth-shell">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-5">
          <div className="card auth-card border-0 shadow-lg">
            <div className="card-body p-4 p-md-5">
              {/* Header */}
              <div className="text-center mb-4">
                <div
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                  style={{ width: 56, height: 56, background: "#f3f0ff" }}
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#7c3aed"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <h1 className="h4 fw-bold mb-1">Verify your email</h1>
                <p className="auth-muted small mb-0">
                  We sent a 4-digit code to
                </p>
                <p
                  className="small fw-semibold mb-0"
                  style={{ color: "#7c3aed" }}
                >
                  {recipientEmail}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="d-grid gap-3">
                {/* OTP inputs */}
                <div>
                  <label
                    id={labelId}
                    className="form-label small fw-semibold text-center d-block mb-3"
                  >
                    Enter verification code
                  </label>
                  <div
                    className="d-flex justify-content-center gap-2"
                    role="group"
                    aria-labelledby={labelId}
                    onPaste={handlePaste}
                  >
                    {digits.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => (inputRefs.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        aria-label={`Digit ${i + 1}`}
                        onChange={(e) => handleDigitChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onFocus={(e) => e.target.select()}
                        className="form-control text-center fw-bold"
                        style={{
                          width: 52,
                          height: 58,
                          fontSize: 22,
                          borderRadius: 10,
                          borderWidth: 2,
                          borderColor: error
                            ? "#dc3545"
                            : digit
                              ? "#7c3aed"
                              : "#dee2e6",
                          background: error
                            ? "#fff5f5"
                            : digit
                              ? "#f3f0ff"
                              : "#f9fafb",
                          transition: "border-color 0.15s, background 0.15s",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Timer */}
                <div className="d-flex align-items-center justify-content-center gap-1">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isExpired ? "#dc3545" : "#9ca3af"}
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {isExpired ? (
                    <span className="small text-danger">
                      Code expired. Please resend.
                    </span>
                  ) : (
                    <span className="small auth-muted">
                      Code expires in{" "}
                      <span
                        className="fw-semibold"
                        style={{ color: "#6b7280" }}
                      >
                        {formattedTime}
                      </span>
                    </span>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <div
                    className="alert alert-danger py-2 mt-1 mb-0"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  className="btn btn-qm-primary btn-lg rounded-3 mt-1"
                  disabled={!codeComplete || isExpired}
                >
                  Verify Email
                </button>

                {/* Resend */}
                <p className="text-center small mb-0">
                  <span className="auth-muted">
                    Didn&apos;t receive the code?
                  </span>{" "}
                  <button
                    type="button"
                    className="btn btn-link link-qm fw-semibold text-decoration-none p-0 small"
                    onClick={handleResend}
                    disabled={resendStatus !== "idle"}
                  >
                    {resendStatus === "sent"
                      ? "Sent!"
                      : resendStatus === "sending"
                        ? "Sending…"
                        : "Resend code"}
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
