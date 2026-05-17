import {
  formatCapacityValue,
  formatPriceRange,
  getProductCalibers,
  getProductBySlug,
  hasLeftHandAvailable,
  isProductBackordered,
  isVariantBackordered,
} from "./catalog";
import type { Product, ProductSpecs, Variant } from "./types";

export const MAX_COMPARE_RIFLES = 3;
export const COMPARE_RIFLES_PATH = "/rifles/compare";

const STORAGE_KEY = "bergara-compare-rifles";

export interface CompareRifleItem {
  productSlug: string;
  addedAt: number;
}

export interface CompareRifleEntry {
  product: Product;
  variant: Variant;
  representativeLabel: string | null;
}

export interface CompareSpecRow {
  label: string;
  values: string[];
}

function isCompareRifleItem(value: unknown): value is CompareRifleItem {
  if (!value || typeof value !== "object") return false;
  const item = value as CompareRifleItem;
  return typeof item.productSlug === "string";
}

export function loadCompareRifles(): CompareRifleItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCompareRifleItem);
  } catch {
    return [];
  }
}

export function saveCompareRifles(items: CompareRifleItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage errors
  }
}

export function compareRifleId(productSlug: string): string {
  return productSlug;
}

/** Default specs row uses 22 LR / Right when available. */
export function getRepresentativeVariant(product: Product): Variant {
  const preferred = product.variants.find(
    (variant) => variant.caliber === "22 LR" && variant.handedness === "Right",
  );
  return preferred ?? product.variants[0];
}

function representativeLabel(variant: Variant): string | null {
  const parts: string[] = [];
  if (variant.caliber) parts.push(variant.caliber);
  if (variant.handedness) parts.push(`${variant.handedness}-hand`);
  if (parts.length === 0) return null;
  return parts.join(", ");
}

function formatInches(value: number): string {
  return `${value}"`;
}

function formatWeight(value: number): string {
  return `${value} lbs`;
}

function specValue(
  specs: ProductSpecs | undefined,
  key: keyof ProductSpecs,
  product: Product,
): string {
  const value = specs?.[key];
  if (value === undefined || value === null) return "—";
  if (key === "weight" && typeof value === "number") return formatWeight(value);
  if (
    (key === "overall_length" || key === "barrel_length") &&
    typeof value === "number"
  ) {
    return formatInches(value);
  }
  if (key === "capacity" && typeof value === "number") {
    return formatCapacityValue(product, value);
  }
  return String(value);
}

function availabilityLabel(product: Product): string {
  const statuses = new Set(
    product.variants.map((variant) =>
      isVariantBackordered(variant) ? "backorder" : "in_stock",
    ),
  );
  if (statuses.size > 1) return "Mixed availability";
  return isProductBackordered(product) ? "Backordered" : "In stock";
}

export function resolveCompareRifleEntries(
  items: CompareRifleItem[],
): CompareRifleEntry[] {
  return items
    .map((item) => {
      const product = getProductBySlug(item.productSlug);
      if (!product || product.category !== "Rifles") return null;
      const variant = getRepresentativeVariant(product);
      return {
        product,
        variant,
        representativeLabel: representativeLabel(variant),
      };
    })
    .filter((entry): entry is CompareRifleEntry => entry !== null);
}

export function buildCompareSpecRows(entries: CompareRifleEntry[]): CompareSpecRow[] {
  if (entries.length === 0) return [];

  const rows: CompareSpecRow[] = [
    {
      label: "Series",
      values: entries.map(({ product }) => product.series ?? "—"),
    },
    {
      label: "Price",
      values: entries.map(({ product }) => formatPriceRange(product)),
    },
    {
      label: "Calibers",
      values: entries.map(
        ({ product }) => getProductCalibers(product).join(", ") || "—",
      ),
    },
    {
      label: "Handedness",
      values: entries.map(({ product }) => {
        const options = new Set<string>();
        for (const variant of product.variants) {
          if (variant.handedness) options.add(variant.handedness);
        }
        return [...options].join(", ") || "—";
      }),
    },
    {
      label: "Left hand available",
      values: entries.map(({ product }) =>
        hasLeftHandAvailable(product) ? "Yes" : "No",
      ),
    },
    {
      label: "Availability",
      values: entries.map(({ product }) => availabilityLabel(product)),
    },
    {
      label: "Weight",
      values: entries.map(({ product, variant }) =>
        specValue(variant.specs, "weight", product),
      ),
    },
    {
      label: "Overall length",
      values: entries.map(({ product, variant }) =>
        specValue(variant.specs, "overall_length", product),
      ),
    },
    {
      label: "Barrel length",
      values: entries.map(({ product, variant }) =>
        specValue(variant.specs, "barrel_length", product),
      ),
    },
    {
      label: "Twist rate",
      values: entries.map(({ product, variant }) =>
        specValue(variant.specs, "twist_rate", product),
      ),
    },
    {
      label: "Magazine",
      values: entries.map(({ product, variant }) =>
        specValue(variant.specs, "magazine", product),
      ),
    },
    {
      label: "Capacity",
      values: entries.map(({ product, variant }) =>
        specValue(variant.specs, "capacity", product),
      ),
    },
  ];

  return rows;
}
