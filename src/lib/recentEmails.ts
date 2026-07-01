const RECENT_KEY = "psycscope-recent-emails";
const MAX = 6;

export function loadRecentEmails(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((e) => typeof e === "string") : [];
  } catch {
    return [];
  }
}

export function rememberEmail(email: string) {
  if (typeof window === "undefined") return;
  const normalized = email.trim().toLowerCase();
  if (!normalized) return;
  const prev = loadRecentEmails().filter((e) => e !== normalized);
  prev.unshift(normalized);
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(prev.slice(0, MAX)));
  } catch {
    // ignore
  }
}
