import { getLowestPrice } from "./catalog";
import type { Product } from "./types";

export type ProductSortId = "alphabetical" | "price-asc" | "price-desc";

export const PRODUCT_SORT_OPTIONS: {
  id: ProductSortId;
  label: string;
}[] = [
  { id: "alphabetical", label: "Alphabetical (A–Z)" },
  { id: "price-asc", label: "Price: Low to high" },
  { id: "price-desc", label: "Price: High to low" },
];

export const DEFAULT_PRODUCT_SORT: ProductSortId = "alphabetical";

export function sortProducts(
  products: Product[],
  sort: ProductSortId,
): Product[] {
  const sorted = [...products];

  switch (sort) {
    case "price-asc":
      return sorted.sort(
        (a, b) =>
          getLowestPrice(a) - getLowestPrice(b) ||
          a.name.localeCompare(b.name),
      );
    case "price-desc":
      return sorted.sort(
        (a, b) =>
          getLowestPrice(b) - getLowestPrice(a) ||
          a.name.localeCompare(b.name),
      );
    case "alphabetical":
    default:
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
}
