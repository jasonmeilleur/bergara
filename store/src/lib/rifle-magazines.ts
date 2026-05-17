import { findVariant, getProductBySlug } from "./catalog";
import type { Product, Variant } from "./types";

/** Magazine product slug for each rifle platform. */
function getMagazineSlugForRifle(rifle: Product): string | null {
  const magazineType = rifle.variants.find((v) => v.specs?.magazine)?.specs
    ?.magazine;

  if (rifle.series === "B-14R" || magazineType === "AICS Detachable") {
    return "bergara-b14r-aics-magazine";
  }

  if (magazineType === "Rotary") {
    return "bergara-bxr-rotary-magazine";
  }

  if (
    magazineType === "Two Detach Mag" ||
    rifle.series === "BMR-X" ||
    rifle.series === "BMR"
  ) {
    return "bergara-bmr-magazine";
  }

  return null;
}

function preferredMagazineCapacity(rifleVariant: Variant): number | undefined {
  const cap = rifleVariant.specs?.capacity;
  if (cap === undefined) return undefined;
  if (typeof cap === "number") return cap;
  if (String(cap).includes("10")) return 10;
  if (String(cap).includes("5")) return 5;
  return undefined;
}

export function getCompatibleExtraMagazine(
  rifle: Product,
  rifleVariant: Variant,
): { magazine: Product; variant: Variant } | null {
  const magazineSlug = getMagazineSlugForRifle(rifle);
  if (!magazineSlug) return null;

  const magazine = getProductBySlug(magazineSlug);
  if (!magazine) return null;

  const caliber = rifleVariant.caliber;
  const preferredCapacity = preferredMagazineCapacity(rifleVariant);

  if (caliber && preferredCapacity !== undefined) {
    const exact = findVariant(magazine, {
      caliber,
      capacity: preferredCapacity,
    });
    if (exact) return { magazine, variant: exact };
  }

  if (caliber) {
    const byCaliber = findVariant(magazine, { caliber });
    if (byCaliber) return { magazine, variant: byCaliber };
  }

  if (magazine.variants[0]) {
    return { magazine, variant: magazine.variants[0] };
  }

  return null;
}

export function formatMagazineLabel(magazine: Product, variant: Variant): string {
  const name = magazine.name.replace(/^Bergara\s+/, "");
  const parts: string[] = [name];
  if (variant.caliber) parts.push(variant.caliber);
  if (variant.capacity !== undefined) {
    parts.push(`${variant.capacity} rounds`);
  }
  return parts.join(" · ");
}
