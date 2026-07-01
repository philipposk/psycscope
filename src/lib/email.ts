const DISPOSABLE = new Set([
  "mailinator.com", "guerrillamail.com", "10minutemail.com", "tempmail.com",
  "yopmail.com", "getnada.com", "trashmail.com",
]);

export function isDisposableEmail(email: string): boolean {
  const domain = (email.split("@")[1] || "").trim().toLowerCase();
  return DISPOSABLE.has(domain);
}
