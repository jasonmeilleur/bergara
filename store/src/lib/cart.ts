import { formatCapacityValue, getVariantPrice } from "./catalog";
import { getVariantUrlKey } from "./product-url";
import type { Product, Variant } from "./types";

export interface CartItem {
  lineId: string;
  productSlug: string;
  variantUrlKey: string;
  productName: string;
  sku: string;
  price: number;
  quantity: number;
  caliber?: string;
  handedness?: string;
  capacity?: number;
}

export function cartLineId(productSlug: string, variantUrlKey: string): string {
  return `${productSlug}::${variantUrlKey}`;
}

export function buildCartItem(
  product: Product,
  variant: Variant,
  quantity = 1,
): CartItem {
  const variantUrlKey = getVariantUrlKey(product, variant);
  return {
    lineId: cartLineId(product.slug, variantUrlKey),
    productSlug: product.slug,
    variantUrlKey,
    productName: product.name.replace(/^Bergara\s+/, ""),
    sku: variant.sku,
    price: getVariantPrice(variant),
    quantity,
    caliber: variant.caliber,
    handedness: variant.handedness,
    capacity: variant.capacity,
  };
}

export function formatCartLineOptions(
  item: Pick<CartItem, "caliber" | "handedness" | "capacity">,
  product?: Product,
): string | null {
  const parts: string[] = [];
  if (item.caliber) parts.push(item.caliber);
  if (item.handedness) parts.push(item.handedness);
  if (item.capacity !== undefined) {
    parts.push(
      product
        ? formatCapacityValue(product, item.capacity)
        : String(item.capacity),
    );
  }
  return parts.length > 0 ? parts.join(" · ") : null;
}

export function getCartItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
