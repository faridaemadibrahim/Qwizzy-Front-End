import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth.jsx";
import { loginUser } from "../services/AuthService.jsx";

/**
 * Normalize common JWT / OAuth login response shapes.
 * @param {unknown} raw
 */
function pickAuthFromResponse(raw) {
  if (!raw || typeof raw !== "object") return null;
  const d = /** @type {Record<string, unknown>} */ (raw);
  const nested =
    d.data !== null &&
    typeof d.data === "object" &&
    !Array.isArray(d.data)
      ? /** @type {Record<string, unknown>} */ (d.data)
      : null;
  const userObj =
    d.user !== null &&
    typeof d.user === "object" &&
    !Array.isArray(d.user)
      ? /** @type {Record<string, unknown>} */ (d.user)
      : null;

  const token = /** @type {string | undefined} */ (
    d.token ??
      d.accessToken ??
      d.access_token ??
      nested?.token
  );
  if (typeof token !== "string" || token.length === 0) return null;

  const email = /** @type {string | undefined} */ (
    typeof d.email === "string"
      ? d.email
      : userObj && typeof userObj.email === "string"
        ? userObj.email
        : undefined
  );

  const name = /** @type {string | undefined} */ (
    typeof d.full_name === "string"
      ? d.full_name
      : typeof d.name === "string"
        ? d.name
        : userObj && typeof userObj.full_name === "string"
          ? userObj.full_name
          : userObj && typeof userObj.name === "string"
            ? userObj.name
            : undefined
  );

  return { token, email: email ?? "", name: name ?? "" };
}

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
      const auth = pickAuthFromResponse(data);
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
