const STORAGE_KEY = "quizzy-auth";

/** @typedef {{ token: string; email?: string; name?: string }} StoredAuth */

/**
 * Read saved auth payload from localStorage (used after refresh and by axios).
 * @returns {StoredAuth | null}
 */
export function getStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data?.token || typeof data.token !== "string") return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Persist token (and optional user fields for UX after reload).
 * @param {StoredAuth} auth
 */
export function setStoredAuth(auth) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
}

export function clearStoredAuth() {
  localStorage.removeItem(STORAGE_KEY);
}
