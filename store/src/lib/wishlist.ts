import { cartLineId } from "./cart";
import { getVariantPrice } from "./catalog";
import { getVariantUrlKey } from "./product-url";
import type { Product, Variant } from "./types";

const STORAGE_KEY = "bergara-wishlist";

export interface WishlistItem {
  lineId: string;
  productSlug: string;
  variantUrlKey: string;
  productName: string;
  sku: string;
  price: number;
  caliber?: string;
  handedness?: string;
  capacity?: number;
  addedAt: number;
}

export function buildWishlistItem(product: Product, variant: Variant): WishlistItem {
  const variantUrlKey = getVariantUrlKey(product, variant);
  return {
    lineId: cartLineId(product.slug, variantUrlKey),
    productSlug: product.slug,
    variantUrlKey,
    productName: product.name.replace(/^Bergara\s+/, ""),
    sku: variant.sku,
    price: getVariantPrice(variant),
    caliber: variant.caliber,
    handedness: variant.handedness,
    capacity: variant.capacity,
    addedAt: Date.now(),
  };
}

function isWishlistItem(value: unknown): value is WishlistItem {
  if (!value || typeof value !== "object") return false;
  const item = value as WishlistItem;
  return (
    typeof item.lineId === "string" &&
    typeof item.productSlug === "string" &&
    typeof item.variantUrlKey === "string" &&
    typeof item.productName === "string" &&
    typeof item.sku === "string" &&
    typeof item.price === "number"
  );
}

export function loadWishlist(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isWishlistItem);
  } catch {
    return [];
  }
}

export function saveWishlist(items: WishlistItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage errors (private browsing, quota, etc.)
  }
}

export function getWishlistCount(items: WishlistItem[]): number {
  return items.length;
}
