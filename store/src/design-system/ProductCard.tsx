import { Link } from "react-router-dom";
import {
  getProductCalibers,
  hasLeftHandAvailable,
  isProductBackordered,
  isRifle,
  isVariantOnSale,
} from "../lib/catalog";
import { buildProductPath } from "../lib/product-url";
import type { Product } from "../lib/types";
import { Badge } from "./Badge";
import { ProductImage } from "./ProductImage";
import { ProductPrice } from "./PriceDisplay";
import { WishlistButton } from "./WishlistButton";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const rifle = isRifle(product);
  const calibers = rifle ? getProductCalibers(product) : [];
  const leftHand = rifle && hasLeftHandAvailable(product);
  const backordered = isProductBackordered(product);
  const onSale = product.variants.some(isVariantOnSale);

  return (
    <Link
      to={buildProductPath(product, product.variants[0])}
      className="group flex flex-col overflow-hidden rounded-lg bg-surface-raised ring-1 ring-border"
    >
      <section className="relative aspect-[4/3] overflow-hidden">
        <ProductImage
          product={product}
          className="absolute inset-0"
          imageClassName="h-full w-full object-contain object-center p-2 sm:p-3"
        />
        <div className="absolute top-2 left-2 z-10">
          <WishlistButton
            product={product}
            variant={product.variants[0]}
            iconOnly
          />
        </div>
        <div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-1.5">
          {backordered && <Badge tone="warn">Backordered</Badge>}
          {onSale && <Badge tone="accent">Sale</Badge>}
          {leftHand && <Badge>Left Hand Available</Badge>}
        </div>
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-end p-2">
          {product.series && <Badge tone="accent">{product.series}</Badge>}
        </div>
      </section>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="text-pretty text-base font-semibold text-ink group-hover:text-link">
          {product.name}
        </h3>
        {rifle && calibers.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label="Available calibers">
            {calibers.map((caliber) => (
              <li key={caliber}>
                <span className="inline-flex rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-medium text-ink ring-1 ring-border">
                  {caliber}
                </span>
              </li>
            ))}
          </ul>
        )}
        <ProductPrice product={product} className="mt-auto" />
        {!rifle && product.variants.length > 1 && (
          <p className="text-sm text-ink-muted">
            {product.variants.length} configurations
          </p>
        )}
      </div>
    </Link>
  );
}
