import { getProductImageUrl } from "../lib/product-images";
import type { Product } from "../lib/types";

interface ProductImageProps {
  product: Product;
  className?: string;
  imageClassName?: string;
}

export function ProductImage({
  product,
  className = "",
  imageClassName = "h-full w-full object-contain object-center p-4 sm:p-6",
}: ProductImageProps) {
  const src = getProductImageUrl(product.slug);
  const alt = product.name.replace(/^Bergara\s+/, "");

  if (!src) {
    return (
      <div
        className={`bg-surface-muted ${className}`}
        aria-hidden
      />
    );
  }

  return (
    <div className={`bg-surface-muted ${className}`}>
      <img
        src={src}
        alt={alt}
        className={imageClassName}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
