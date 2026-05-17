import { getProductBySlug } from "./catalog";
import type { Product, Variant } from "./types";

/** Accessory slugs compatible with each rifle series. */
const ACCESSORIES_BY_SERIES: Record<string, string[]> = {
  "B-14R": ["bergara-b14r-rifle-mat"],
  BMR: ["bergara-bmr-rail"],
  "BMR-X": ["bergara-bmr-rail"],
};

export interface RifleAccessoryMatch {
  product: Product;
  variant: Variant;
}

export function getCompatibleAccessories(
  rifle: Product,
): RifleAccessoryMatch[] {
  if (!rifle.series) return [];

  const slugs = ACCESSORIES_BY_SERIES[rifle.series] ?? [];
  const matches: RifleAccessoryMatch[] = [];

  for (const slug of slugs) {
    const product = getProductBySlug(slug);
    const variant = product?.variants[0];
    if (product && variant) {
      matches.push({ product, variant });
    }
  }

  return matches;
}

export function formatAccessoryLabel(product: Product): string {
  return product.name.replace(/^Bergara\s+/, "");
}
