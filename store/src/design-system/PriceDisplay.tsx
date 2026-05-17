import {
  formatPrice,
  formatPriceRange,
  getHighestPrice,
  getLowestPrice,
  getVariantCompareAtPrice,
  getVariantPrice,
} from "../lib/catalog";
import type { Product, Variant } from "../lib/types";

interface PriceDisplayProps {
  variant: Variant;
  size?: "sm" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: {
    current: "text-sm font-medium",
    compare: "text-sm",
  },
  lg: {
    current: "text-xl font-medium",
    compare: "text-base",
  },
};

export function PriceDisplay({
  variant,
  size = "lg",
  className = "",
}: PriceDisplayProps) {
  const price = getVariantPrice(variant);
  const compareAt = getVariantCompareAtPrice(variant);
  const sizes = sizeClasses[size];

  if (!compareAt) {
    return (
      <p className={`${sizes.current} text-ink ${className}`}>
        {formatPrice(price)}
      </p>
    );
  }

  return (
    <p className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 ${className}`}>
      <span className={`${sizes.current} text-ink`}>{formatPrice(price)}</span>
      <span className={`${sizes.compare} text-ink-muted line-through`}>
        {formatPrice(compareAt)}
      </span>
    </p>
  );
}

interface ProductPriceProps {
  product: Product;
  className?: string;
}

export function ProductPrice({ product, className = "" }: ProductPriceProps) {
  const low = getLowestPrice(product);
  const high = getHighestPrice(product);

  if (low !== high) {
    return (
      <p className={`text-sm font-medium text-ink ${className}`}>
        {formatPriceRange(product)}
      </p>
    );
  }

  const variant =
    product.variants.find((v) => getVariantPrice(v) === low) ??
    product.variants[0];

  return (
    <PriceDisplay variant={variant} size="sm" className={className} />
  );
}
