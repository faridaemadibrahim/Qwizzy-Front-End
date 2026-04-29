import { decodeJwtPayload } from "./token.js";

/**
 * Normalize login response into auth model for app state.
 * @param {unknown} raw
 * @returns {{ token: string; email: string; name: string } | null}
 */
export function mapLoginResponse(raw) {
  if (!raw || typeof raw !== "object") return null;

  const d = /** @type {Record<string, unknown>} */ (raw);
  const nested =
    d.data !== null && typeof d.data === "object" && !Array.isArray(d.data)
      ? /** @type {Record<string, unknown>} */ (d.data)
      : null;
  const userObj =
    d.user !== null && typeof d.user === "object" && !Array.isArray(d.user)
      ? /** @type {Record<string, unknown>} */ (d.user)
      : null;
  const nestedUserObj =
    nested?.user !== null &&
    typeof nested?.user === "object" &&
    !Array.isArray(nested?.user)
      ? /** @type {Record<string, unknown>} */ (nested.user)
      : null;

  const token = /** @type {string | undefined} */ (
    d.token ?? d.accessToken ?? d.access_token ?? nested?.token
  );
  if (typeof token !== "string" || token.length === 0) return null;

  const tokenPayload = decodeJwtPayload(token);

  const email = /** @type {string | undefined} */ (
    typeof d.email === "string"
      ? d.email
      : userObj && typeof userObj.email === "string"
        ? userObj.email
        : typeof nested?.email === "string"
          ? nested.email
          : nestedUserObj && typeof nestedUserObj.email === "string"
            ? nestedUserObj.email
            : tokenPayload && typeof tokenPayload.email === "string"
              ? tokenPayload.email
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
            : typeof nested?.full_name === "string"
              ? nested.full_name
              : typeof nested?.name === "string"
                ? nested.name
                : nestedUserObj && typeof nestedUserObj.full_name === "string"
                  ? nestedUserObj.full_name
                  : nestedUserObj && typeof nestedUserObj.name === "string"
                    ? nestedUserObj.name
                    : tokenPayload && typeof tokenPayload.full_name === "string"
                      ? tokenPayload.full_name
                      : tokenPayload && typeof tokenPayload.name === "string"
                        ? tokenPayload.name
                        : undefined
  );

  return { token, email: email ?? "", name: name ?? "" };
}
