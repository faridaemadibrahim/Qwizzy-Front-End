import { useId, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyForgotCode, forgotPassword } from "../services/AuthService.js";

const CODE_LENGTH = 4;
const EXPIRY_SECONDS = 299; // 5 minutes

export default function useVerifyForgotCode() {
  const navigate = useNavigate();
  const location = useLocation();

  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendStatus, setResendStatus] = useState("idle");
  const [timeLeft, setTimeLeft] = useState(EXPIRY_SECONDS);

  const inputRefs = useRef([]);
  const labelId = useId();

  const recipientEmail = location.state?.email || "";

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formattedTime = `${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(
    timeLeft % 60
  ).padStart(2, "0")}`;
  const isExpired = timeLeft <= 0;
  const codeComplete = digits.every((d) => d !== "");

  function handleDigitChange(index, value) {
    const cleaned = value.replace(/[^0-9]/g, "").slice(-1);
    setError("");
    const next = [...digits];
    next[index] = cleaned;
    setDigits(next);
    if (cleaned && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, CODE_LENGTH);
    const next = Array(CODE_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => (next[i] = ch));
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!codeComplete) {
      setError("Please enter all 4 digits.");
      return;
    }
    if (isExpired) {
      setError("Your code has expired. Please request a new one.");
      return;
    }
    const code = digits.join("");
    try {
      await verifyForgotCode({ email: recipientEmail, code });
      setSuccess(true);
      // Wait a bit to show success message then navigate
      setTimeout(() => navigate("/reset-password", { state: { email: recipientEmail, code } }), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid code. Please check and try again.");
      setDigits(Array(CODE_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    }
  }

  async function handleResend() {
    setResendStatus("sending");
    setError("");
    setDigits(Array(CODE_LENGTH).fill(""));
    setTimeLeft(EXPIRY_SECONDS);
    try {
      await forgotPassword(recipientEmail);
      setResendStatus("sent");
    } catch (err) {
      setError("Failed to resend code.");
      setResendStatus("idle");
    }
    setTimeout(() => setResendStatus("idle"), 3000);
    inputRefs.current[0]?.focus();
  }

  return {
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
  };
}
