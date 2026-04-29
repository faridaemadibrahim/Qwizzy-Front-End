import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/AuthService.js";

export default function useResetPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }
        if (!/[A-Z]/.test(newPassword)) {
            setError("Password must contain at least one uppercase letter");
            return;
        }
        if (!/[0-9]/.test(newPassword)) {
            setError("Password must contain at least one number");
            return;
        }
        if (!/[^A-Za-z0-9]/.test(newPassword)) {
            setError("Password must contain at least one special character");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const email = location.state?.email;
            if (!email) {
                setError("Missing email. Please request reset code again.");
                return;
            }

            await resetPassword({ email, newPassword });
            setSuccess("Password reset successfully! Redirecting...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Error occurred");
        } finally {
            setLoading(false);
        }
    }

    return {
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        error,
        success,
        loading,
        handleSubmit,
    };
}