import { useState } from "react";
import { registerUser } from "../services/AuthService.jsx";
import { useNavigate } from "react-router-dom";

export default function useRegister() {
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleRegister({ name, email, password, confirmPassword }) {
        const newErrors = {};

        if (!name.trim()) newErrors.name = "Full name is required";

        if (password.length < 8)
            newErrors.password = "Password must be at least 8 characters";
        else if (!/[A-Z]/.test(password))
            newErrors.password = "Must contain at least one uppercase letter";
        else if (!/[a-z]/.test(password))
            newErrors.password = "Must contain at least one lowercase letter";
        else if (!/[0-9]/.test(password))
            newErrors.password = "Must contain at least one number";

        if (password !== confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);
            setErrors({});
            await registerUser({ full_name: name, email, password });
            navigate("/verify-email", { state: { email } });
        } catch (err) {
            setErrors({ api: err.response?.data?.message || "Error occurred" });
        } finally {
            setLoading(false);
        }
    }

    return { handleRegister, errors, loading };
}