import { useCallback, useState } from "react";
import {
  clearStoredAuth,
  getStoredAuth,
  setStoredAuth,
} from "../API/authStorage.js";
import { AuthContext } from "./AuthContextObject.jsx";
import { decodeJwtPayload } from "../utils/token.js";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredAuth()?.token ?? null);
  const [user, setUser] = useState(() => {
    const stored = getStoredAuth();
    if (!stored?.email) return null;
    const decoded = stored.token ? decodeJwtPayload(stored.token) : null;
    const idFromToken =
      decoded != null
        ? String(
            decoded.id ??
              decoded.userId ??
              decoded.user_id ??
              decoded._id ??
              decoded.sub ??
              "",
          )
        : "";
    const storedId = typeof stored.id === "string" ? stored.id.trim() : stored.id != null ? String(stored.id) : "";
    return {
      id: storedId || idFromToken,
      email: stored.email,
      name: stored.name ?? "",
      role: stored.role ?? "",
    };
  });

  const login = useCallback(({ token: nextToken, email, name, id: idFromResponse }) => {
    if (!nextToken) return;
    setToken(nextToken);

    const decoded = decodeJwtPayload(nextToken);
    const role = decoded?.role || "";

    const idFromToken =
      (decoded?.id ??
        decoded?.userId ??
        decoded?.user_id ??
        decoded?._id ??
        decoded?.sub) != null
        ? String(
            decoded.id ??
              decoded.userId ??
              decoded.user_id ??
              decoded._id ??
              decoded.sub,
          )
        : "";

    const nextUser = {
      id: idFromResponse != null && idFromResponse !== "" ? String(idFromResponse) : idFromToken,
      email: email ?? (typeof decoded?.email === "string" ? decoded.email : ""),
      name: name ?? (typeof decoded?.name === "string" ? decoded.name : ""),
      role: role,
    };
    setUser(nextUser);
    setStoredAuth({
      token: nextToken,
      id: nextUser.id || undefined,
      email: nextUser.email || undefined,
      name: nextUser.name || undefined,
      role: nextUser.role || undefined,
    });
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    clearStoredAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
