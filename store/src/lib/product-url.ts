import { catalog } from "./catalog";
import type { Product, Variant } from "./types";

function optionSlug(value: string | number): string {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function getVariantUrlKey(product: Product, variant: Variant): string {
  const skuKey = variant.sku.toLowerCase();
  const sameSku = product.variants.filter(
    (v) => v.sku.toLowerCase() === skuKey,
  );

  if (sameSku.length === 1) return skuKey;

  let key = skuKey;
  if (variant.caliber) key += `-${optionSlug(variant.caliber)}`;

  const sameSkuAndCaliber = product.variants.filter(
    (v) =>
      v.sku.toLowerCase() === skuKey && v.caliber === variant.caliber,
  );

  if (
    variant.capacity !== undefined &&
    sameSkuAndCaliber.length > 1
  ) {
    key += `-${optionSlug(variant.capacity)}`;
  }

  return key;
}

export function buildProductPath(product: Product, variant?: Variant): string {
  if (!variant) return `/${product.slug}`;
  return `/${product.slug}-${getVariantUrlKey(product, variant)}`;
}

export function buildProductPathFromKeys(
  productSlug: string,
  variantUrlKey: string,
): string {
  return `/${productSlug}-${variantUrlKey}`;
}

export interface ResolvedProductPath {
  product: Product;
  variantKey?: string;
}

export function resolveProductPath(
  pathParam: string,
): ResolvedProductPath | null {
  const sorted = [...catalog.products].sort(
    (a, b) => b.slug.length - a.slug.length,
  );

  for (const product of sorted) {
    if (pathParam === product.slug) {
      return { product };
    }
    const prefix = `${product.slug}-`;
    if (pathParam.startsWith(prefix)) {
      return {
        product,
        variantKey: pathParam.slice(prefix.length),
      };
    }
  }

  return null;
}

export function findVariantByUrlKey(
  product: Product,
  variantKey: string,
): Variant | undefined {
  const normalized = variantKey.toLowerCase();
  return product.variants.find(
    (variant) => getVariantUrlKey(product, variant) === normalized,
  );
}

export function selectionFromVariant(
  variant: Variant,
): Pick<Variant, "caliber" | "handedness" | "capacity"> {
  return {
    caliber: variant.caliber,
    handedness: variant.handedness,
    capacity: variant.capacity,
  };
}
