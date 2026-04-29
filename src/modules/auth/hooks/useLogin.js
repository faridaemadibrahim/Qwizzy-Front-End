import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth.jsx";
import { loginUser } from "../services/AuthService.jsx";
import { mapLoginResponse } from "../../../utils/authMapper.js";

export default function useLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin({ email, password }) {
    setError("");
    setLoading(true);

    try {
      const { data } = await loginUser({ email, password });
      const auth = mapLoginResponse(data);
      if (!auth) {
        setError("Login succeeded but server did not return a token.");
        return;
      }
      login({
        token: auth.token,
        email: auth.email || email,
        name: auth.name,
      });
      navigate("/quizzes");
    } catch (err) {
      const e = /** @type {{ response?: { data?: { message?: string } } }} */ (
        err
      );
      setError(
        e.response?.data?.message || "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  }

  return { handleLogin, error, loading };
}
