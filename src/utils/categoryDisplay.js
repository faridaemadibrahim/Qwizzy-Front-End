/** Label for category rows from GET /categories (`NAME` from API). */
export function getCategoryOptionLabel(cat) {
  if (cat == null || typeof cat !== "object") return "";
  const s = cat.NAME;
  return typeof s === "string" ? s.trim() : "";
}
