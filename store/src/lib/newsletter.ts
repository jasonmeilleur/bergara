const STORAGE_KEY = "bergara-newsletter";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function readSubscribers(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSubscribers(emails: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(emails));
}

export function subscribeNewsletter(email: string): string | null {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    return "Enter your email address.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return "Enter a valid email address.";
  }

  const subscribers = readSubscribers();
  if (!subscribers.includes(normalized)) {
    writeSubscribers([...subscribers, normalized]);
  }

  return null;
}
