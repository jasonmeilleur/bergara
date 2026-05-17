/** WCAG 2.2 contrast ratios (AA: 4.5 normal text, 3 large / UI). */

export interface ContrastPair {
  foreground: string;
  background: string;
  ratio: number;
  aaNormal: boolean;
  aaLarge: boolean;
  usage: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
  ) as [number, number, number];
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foreground: string, background: string): number {
  const l1 = luminance(foreground);
  const l2 = luminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100;
}

function pair(
  foreground: string,
  background: string,
  usage: string,
): ContrastPair {
  const ratio = contrastRatio(foreground, background);
  return {
    foreground,
    background,
    ratio,
    aaNormal: ratio >= 4.5,
    aaLarge: ratio >= 3,
    usage,
  };
}

/** Design tokens — keep in sync with src/index.css @theme colors. */
export const DESIGN_TOKENS = {
  ink: "#141210",
  inkMuted: "#5c5650",
  inkSubtle: "#6e675e",
  surface: "#ffffff",
  surfaceMuted: "#f5f5f5",
  border: "#969088",
  accent: "#8b5a2b",
  accentHover: "#6f4622",
  link: "#7a6200",
  linkHover: "#5c4800",
  linkBrand: "#ffc52c",
  forest: "#2d3b32",
  hero: "#1a1816",
} as const;

export const SEMANTIC_CONTRAST_PAIRS: ContrastPair[] = [
  pair(DESIGN_TOKENS.ink, DESIGN_TOKENS.surface, "Body text"),
  pair(DESIGN_TOKENS.inkMuted, DESIGN_TOKENS.surface, "Secondary text"),
  pair(DESIGN_TOKENS.inkSubtle, DESIGN_TOKENS.surface, "Captions, hints"),
  pair(DESIGN_TOKENS.inkSubtle, DESIGN_TOKENS.surfaceMuted, "Captions on muted panels"),
  pair(DESIGN_TOKENS.link, DESIGN_TOKENS.surface, "Links"),
  pair(DESIGN_TOKENS.linkHover, DESIGN_TOKENS.surface, "Links (hover)"),
  pair(DESIGN_TOKENS.accent, DESIGN_TOKENS.surface, "Accent text (badges)"),
  pair("#ffffff", DESIGN_TOKENS.accent, "Primary button label"),
  pair("#ffffff", DESIGN_TOKENS.accentHover, "Primary button label (hover)"),
  pair(DESIGN_TOKENS.ink, DESIGN_TOKENS.surfaceMuted, "Text on muted panels"),
  pair(DESIGN_TOKENS.inkMuted, DESIGN_TOKENS.surfaceMuted, "Muted text on panels"),
  pair(DESIGN_TOKENS.border, DESIGN_TOKENS.surface, "Borders, input outlines (UI)"),
  pair("#ffffff", DESIGN_TOKENS.hero, "Text on hero (dark band)"),
  pair("#ffffff", DESIGN_TOKENS.forest, "Text on forest (dark band)"),
];

/** Known failures — do not use for readable text on these backgrounds. */
export const NON_COMPLIANT_REFERENCE: ContrastPair[] = [
  pair(DESIGN_TOKENS.linkBrand, DESIGN_TOKENS.surface, "Brand gold #ffc52c (underline accent only)"),
  pair(DESIGN_TOKENS.ink, DESIGN_TOKENS.hero, "Ink on hero (use white text)"),
  pair("#e5e5e5", DESIGN_TOKENS.surface, "Legacy border (replaced by --color-border)"),
];
