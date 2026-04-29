import { useContext } from "react";
import { AuthContext } from "./AuthContextObject.jsx";

export function useAuth() {
  return useContext(AuthContext);
}
