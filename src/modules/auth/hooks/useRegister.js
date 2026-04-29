import { useState } from "react";
import { registerUser } from "../services/AuthService.jsx";
import { useNavigate } from "react-router-dom";

export default function useRegister() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleRegister({ name, email, password, confirmPassword }) {
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await registerUser({ full_name: name, email, password });

            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Error occurred");
        } finally {
            setLoading(false);
        }
    }

    return { handleRegister, error, loading };
}