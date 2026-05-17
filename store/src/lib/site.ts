export const SITE_NAME = "Bergara";

export const SITE_LOGO_URL = "/logo.png";

/** Canonical site origin for absolute URLs in structured data. */
export function getSiteOrigin(): string {
  const configured = import.meta.env.VITE_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "https://bergara.example";
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteOrigin()}${normalized}`;
}
