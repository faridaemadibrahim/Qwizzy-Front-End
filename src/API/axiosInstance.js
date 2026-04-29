import axios from "axios";
import { getStoredAuth } from "./authStorage.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const stored = getStoredAuth();
  if (stored?.token) {
    config.headers.Authorization = `Bearer ${stored.token}`;
  }
  return config;
});

export default api;