import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { Breadcrumbs } from "../design-system/Breadcrumbs";
import { Button } from "../design-system/Button";
import { Container } from "../design-system/Container";
import { ProductImage } from "../design-system/ProductImage";
import {
  pagePadding,
  pageTitle,
  stackAfterBreadcrumb,
} from "../design-system/layout";
import { formatCartLineOptions } from "../lib/cart";
import { formatPrice, getProductBySlug } from "../lib/catalog";
import {
  buildProductPathFromKeys,
  findVariantByUrlKey,
} from "../lib/product-url";

export function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem, openCart } = useCart();

  return (
    <Container className={pagePadding}>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Wish list" },
        ]}
      />

      <header
        className={`flex flex-wrap items-end justify-between gap-4 ${stackAfterBreadcrumb}`}
      >
        <div>
          <h1 className={pageTitle}>Wish list</h1>
          <p className="mt-2 text-pretty text-sm text-ink-muted">
            {items.length === 0
              ? "Save products you want to revisit later."
              : `${items.length} ${items.length === 1 ? "item" : "items"} saved on this device.`}
          </p>
        </div>
        {items.length > 0 ? (
          <Button type="button" variant="ghost" size="sm" onClick={clearWishlist}>
            Clear wish list
          </Button>
        ) : null}
      </header>

      {items.length === 0 ? (
        <div className="mt-10 flex flex-col items-start gap-4">
          <p className="text-pretty text-ink-muted">
            Your wish list is empty. Browse rifles, magazines, and accessories,
            then use Save to wish list on any product page.
          </p>
          <Link
            to="/rifles"
            className="inline-flex items-center justify-center rounded-md bg-surface-muted px-3 py-2 text-sm font-medium text-ink ring-1 ring-border transition-colors hover:bg-surface-raised"
          >
            Shop rifles
          </Link>
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-border rounded-lg ring-1 ring-border">
          {items.map((item) => {
            const product = getProductBySlug(item.productSlug);
            const variant = product
              ? (findVariantByUrlKey(product, item.variantUrlKey) ??
                product.variants[0])
              : undefined;
            const options = formatCartLineOptions(item, product);
            const path = buildProductPathFromKeys(
              item.productSlug,
              item.variantUrlKey,
            );

            return (
              <li
                key={item.lineId}
                className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
              >
                <Link to={path} className="flex min-w-0 flex-1 gap-4">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md bg-surface-muted ring-1 ring-border">
                    {product ? (
                      <ProductImage
                        product={product}
                        className="h-full w-full"
                        imageClassName="h-full w-full object-contain object-center p-2"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-ink-subtle">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-ink">{item.productName}</p>
                    <p className="mt-1 text-sm text-ink-subtle">
                      Product Code {item.sku}
                    </p>
                    {options ? (
                      <p className="mt-1 text-sm text-ink-muted">{options}</p>
                    ) : null}
                    <p className="mt-2 text-sm font-medium text-ink">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </Link>

                <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-stretch">
                  {product && variant ? (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        addItem({ product, variant });
                        openCart();
                      }}
                    >
                      Add to cart
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.lineId)}
                  >
                    Remove
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Container>
  );
}
