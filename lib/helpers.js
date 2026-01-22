export function safeText(v) {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

export function formatCategory(cat) {
  const c = safeText(cat).toUpperCase();
  if (c === "BOLLYWOOD") return "BOLLYWOOD";
  if (c === "HOLLYWOOD") return "HOLLYWOOD";
  if (c === "ADULT") return "ADULT";
  return "HOLLYWOOD";
}

export function isValidUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch (e) {
    return false;
  }
}

export function fileExtFromName(name) {
  const n = safeText(name);
  const parts = n.split(".");
  if (parts.length < 2) return "jpg";
  return parts.pop().toLowerCase();
}
