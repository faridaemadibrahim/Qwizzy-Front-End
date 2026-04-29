import { jwtDecode } from "jwt-decode";

/**
 * Decode JWT payload safely.
 * @param {string} token
 * @returns {Record<string, unknown> | null}
 */
export function decodeJwtPayload(token) {
  try {
    const payload = jwtDecode(token);
    return payload && typeof payload === "object" ? payload : null;
  } catch {
    return null;
  }
}
