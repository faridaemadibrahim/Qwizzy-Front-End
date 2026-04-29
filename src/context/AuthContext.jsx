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
    return {
      email: stored.email,
      name: stored.name ?? "",
      role: stored.role ?? "",
    };
  });

  const login = useCallback(({ token: nextToken, email, name }) => {
    if (!nextToken) return;
    setToken(nextToken);

    const decoded = decodeJwtPayload(nextToken);
    const role = decoded?.role || "";

    const nextUser = {
      email: email ?? (typeof decoded?.email === "string" ? decoded.email : ""),
      name: name ?? (typeof decoded?.name === "string" ? decoded.name : ""),
      role: role,
    };
    setUser(nextUser);
    setStoredAuth({
      token: nextToken,
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
