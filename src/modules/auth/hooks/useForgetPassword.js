import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/AuthService.js";

export default function useForgetPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      await forgotPassword(email);
      setSuccess("Reset request sent successfully.");
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset request.");
    } finally {
      setLoading(false);
    }
  }

  return {
    email,
    setEmail,
    error,
    success,
    loading,
    handleSubmit,
  };
}
