import { useId, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth.jsx";
import { verifyEmail as verifyEmailRequest } from "../services/AuthService.js";

const CODE_LENGTH = 4;
const EXPIRY_SECONDS = 299;

export default function useVerifyEmail() {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth() ?? {};
    const { verifyEmail, resendVerificationCode, pendingEmail } = auth;

    const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(""));
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [resendStatus, setResendStatus] = useState("idle");
    const [timeLeft, setTimeLeft] = useState(EXPIRY_SECONDS);

    const inputRefs = useRef([]);
    const labelId = useId();

    useEffect(() => {
        if (timeLeft <= 0) return;
        const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearInterval(interval);
    }, [timeLeft]);

    const formattedTime = `${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(timeLeft % 60).padStart(2, "0")}`;
    const isExpired = timeLeft <= 0;
    const codeComplete = digits.every((d) => d !== "");
    const recipientEmail = pendingEmail ?? location.state?.email ?? "your email address";

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
        if (e.key === "ArrowLeft" && index > 0)
            inputRefs.current[index - 1]?.focus();
        if (e.key === "ArrowRight" && index < CODE_LENGTH - 1)
            inputRefs.current[index + 1]?.focus();
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
            const submitVerification = verifyEmail ?? verifyEmailRequest;
            await submitVerification({
                email: recipientEmail,
                code: code
            });
            setSuccess(true);
            setTimeout(() => navigate("/quizzes"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid code. Please check and try again.");
            setDigits(Array(CODE_LENGTH).fill(""));
            inputRefs.current[0]?.focus();
        }
    }

    async function handleResend() {
        if (!resendVerificationCode) {
            setError("Resend is not available right now.");
            return;
        }
        setResendStatus("sending");
        setError("");
        setDigits(Array(CODE_LENGTH).fill(""));
        setTimeLeft(EXPIRY_SECONDS);
        try {
            await resendVerificationCode();
        } catch {
            // silently ignore
        }
        setResendStatus("sent");
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
