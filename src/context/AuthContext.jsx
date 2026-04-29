import { useCallback, useState } from "react";
import {
  clearStoredAuth,
  getStoredAuth,
  setStoredAuth,
} from "../API/authStorage.js";
import { AuthContext } from "./AuthContextObject.jsx";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredAuth()?.token ?? null);
  const [user, setUser] = useState(() => {
    const stored = getStoredAuth();
    if (!stored?.email) return null;
    return {
      email: stored.email,
      name: stored.name ?? "",
    };
  });

  const login = useCallback(({ token: nextToken, email, name }) => {
    if (!nextToken) return;
    setToken(nextToken);
    const nextUser = {
      email: email ?? "",
      name: name ?? "",
    };
    setUser(nextUser);
    setStoredAuth({
      token: nextToken,
      email: nextUser.email || undefined,
      name: nextUser.name || undefined,
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
