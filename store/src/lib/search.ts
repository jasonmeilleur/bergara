import { catalog, formatPrice, getCategoryMeta, getLowestPrice, getStoreCategory } from "./catalog";
import { buildProductPath } from "./product-url";
import type { Product } from "./types";

const SUGGESTION_LIMIT = 6;
const MIN_SUGGESTION_LENGTH = 2;

function productSearchText(product: Product): string {
  const categoryMeta = getCategoryMeta(getStoreCategory(product));
  const parts: string[] = [
    product.name,
    product.slug,
    product.brand,
    product.product_type,
    product.category,
    categoryMeta.name,
    product.series ?? "",
  ];

  for (const variant of product.variants) {
    parts.push(variant.sku);
    if (variant.caliber) parts.push(variant.caliber);
    if (variant.handedness) parts.push(variant.handedness);
    if (variant.capacity !== undefined) parts.push(String(variant.capacity));
  }

  return parts.join(" ").toLowerCase();
}

export function searchPath(query: string): string {
  const trimmed = query.trim();
  if (!trimmed) return "/search";
  return `/search?${new URLSearchParams({ q: trimmed }).toString()}`;
}

export function searchProducts(query: string): Product[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const tokens = normalized.split(/\s+/).filter(Boolean);

  return rankProducts(normalized, tokens)
    .filter(({ score }) => score >= 50)
    .map(({ product }) => product);
}

export interface SearchSuggestion {
  product: Product;
  href: string;
  categoryLabel: string;
  priceLabel: string;
}

function nameWords(name: string): string[] {
  return name.toLowerCase().split(/\s+/).filter(Boolean);
}

function scoreProduct(
  product: Product,
  normalized: string,
  tokens: string[],
): number {
  const name = product.name.toLowerCase();
  const haystack = productSearchText(product);
  const words = nameWords(product.name);

  if (name.startsWith(normalized)) return 100;
  if (name.includes(normalized)) return 90;
  if (words.some((word) => word.startsWith(normalized))) return 85;

  if (
    product.variants.some((variant) =>
      variant.sku.toLowerCase().includes(normalized),
    )
  ) {
    return 75;
  }

  if (product.series?.toLowerCase().includes(normalized)) return 65;

  if (tokens.length > 0 && tokens.every((token) => haystack.includes(token))) {
    return 50;
  }

  if (
    tokens.length > 0 &&
    tokens.some((token) => words.some((word) => word.startsWith(token)))
  ) {
    return 40;
  }

  return 0;
}

function rankProducts(normalized: string, tokens: string[]) {
  return catalog.products
    .map((product) => ({
      product,
      score: scoreProduct(product, normalized, tokens),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.product.name.localeCompare(b.product.name);
    });
}

export function getSearchSuggestions(
  query: string,
  limit = SUGGESTION_LIMIT,
): SearchSuggestion[] {
  const normalized = query.trim().toLowerCase();
  if (normalized.length < MIN_SUGGESTION_LENGTH) return [];

  const tokens = normalized.split(/\s+/).filter(Boolean);

  return rankProducts(normalized, tokens)
    .slice(0, limit)
    .map(({ product }) => ({
      product,
      href: buildProductPath(product, product.variants[0]),
      categoryLabel: getCategoryMeta(getStoreCategory(product)).name,
      priceLabel: formatPrice(getLowestPrice(product)),
    }));
}
