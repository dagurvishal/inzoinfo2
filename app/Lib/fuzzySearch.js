export function normalizeText(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function fuzzyIncludes(text, query) {
  const t = normalizeText(text);
  const q = normalizeText(query);

  if (!q) return true;
  if (t.includes(q)) return true;

  // basic fuzzy: check all words exist
  const words = q.split(" ").filter(Boolean);
  return words.every((w) => t.includes(w));
}
