const STORAGE_KEY = "bergara-cookie-consent";

export function hasAcceptedCookies(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "accepted";
  } catch {
    return false;
  }
}

export function acceptCookies(): void {
  try {
    localStorage.setItem(STORAGE_KEY, "accepted");
  } catch {
    // Ignore storage errors (private browsing, quota, etc.)
  }
}
