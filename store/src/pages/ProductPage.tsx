import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  findVariant,
  categoryPath,
  getCategoryMeta,
  getStoreCategory,
  getVariantPrice,
  isRifle,
  isVariantBackordered,
} from "../lib/catalog";
import { seriesPath } from "../lib/series";
import {
  buildProductPath,
  findVariantByUrlKey,
  resolveProductPath,
  selectionFromVariant,
} from "../lib/product-url";
import type { Variant } from "../lib/types";
import { Badge } from "../design-system/Badge";
import { ProductImage } from "../design-system/ProductImage";
import { Breadcrumbs } from "../design-system/Breadcrumbs";
import { Button } from "../design-system/Button";
import { PriceDisplay } from "../design-system/PriceDisplay";
import { Container } from "../design-system/Container";
import {
  pagePadding,
  pageTitle,
  stackAfterBreadcrumb,
} from "../design-system/layout";
import { JsonLd } from "../components/JsonLd";
import {
  productSpecRows,
  SpecTable,
  variantDetailRows,
} from "../design-system/SpecTable";
import { AvailableAccessories } from "../design-system/AvailableAccessories";
import { ExtraMagazineOffer } from "../design-system/ExtraMagazineOffer";
import { SezzleNotice } from "../design-system/SezzleNotice";
import { VariantSelector } from "../design-system/VariantSelector";
import { useCart } from "../context/CartContext";
import { WishlistButton } from "../design-system/WishlistButton";
import { CompareRifleToggle } from "../design-system/CompareRifleToggle";
import { buildProductSchema } from "../lib/schema";

export function ProductPage() {
  const { slug: pathParam } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();

  const resolved = useMemo(
    () => (pathParam ? resolveProductPath(pathParam) : null),
    [pathParam],
  );

  const product = resolved?.product;

  const [selection, setSelection] = useState<
    Partial<Pick<Variant, "caliber" | "handedness" | "capacity">>
  >({});

  useEffect(() => {
    if (!resolved?.product) return;

    const { product: p, variantKey } = resolved;

    if (!variantKey) {
      navigate(buildProductPath(p, p.variants[0]), { replace: true });
      return;
    }

    const variant = findVariantByUrlKey(p, variantKey);
    if (!variant) return;

    setSelection(selectionFromVariant(variant));
  }, [resolved, navigate]);

  const activeVariant = useMemo(() => {
    if (!product) return undefined;
    return findVariant(product, selection) ?? product.variants[0];
  }, [product, selection]);

  const specRows = useMemo(() => {
    if (!activeVariant || !product) return [];
    const details = variantDetailRows(activeVariant, product);
    const detailLabels = new Set(details.map((r) => r.label));
    const technical = productSpecRows(activeVariant.specs ?? {}).filter(
      (r) => !detailLabels.has(r.label),
    );
    return [...details, ...technical];
  }, [activeVariant, product]);

  const handleSelectionChange = (
    next: Partial<Pick<Variant, "caliber" | "handedness" | "capacity">>,
  ) => {
    if (!product) return;
    setSelection(next);
    const variant = findVariant(product, next);
    if (variant) {
      navigate(buildProductPath(product, variant), { replace: true });
    }
  };

  if (!pathParam || !resolved) {
    return (
      <Container className="py-12">
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          Product not found
        </h1>
        <Link to="/" className="mt-4 inline-block text-link hover:text-link-hover hover:underline">
          Return home
        </Link>
      </Container>
    );
  }

  if (
    resolved.variantKey &&
    product &&
    !findVariantByUrlKey(product, resolved.variantKey)
  ) {
    return (
      <Container className="py-12">
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          Configuration not found
        </h1>
        <p className="mt-4 text-pretty text-ink-muted">
          That product code or configuration is not available for this product.
        </p>
        <Link
          to={buildProductPath(product, product.variants[0])}
          className="mt-4 inline-block text-link hover:text-link-hover hover:underline"
        >
          View default configuration
        </Link>
      </Container>
    );
  }

  if (!product || !activeVariant) {
    return null;
  }

  const storeCategory = getStoreCategory(product);
  const categoryMeta = getCategoryMeta(storeCategory);
  const displayName = product.name;
  const backordered = isVariantBackordered(activeVariant);

  return (
    <Container className={pagePadding}>
      <JsonLd data={buildProductSchema(product, activeVariant)} />
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: categoryMeta.name, path: categoryPath(storeCategory) },
          ...(product.series && isRifle(product)
            ? [{ name: product.series, path: seriesPath(product.series) }]
            : []),
          { name: displayName },
        ]}
      />

      <div className={`${stackAfterBreadcrumb} grid gap-8 lg:grid-cols-2`}>
        <section className="relative aspect-square overflow-hidden rounded-lg ring-1 ring-border">
          <ProductImage
            product={product}
            className="absolute inset-0"
            imageClassName="h-full w-full object-contain object-center p-4 sm:p-6"
          />
          <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-2">
            {product.series && <Badge tone="accent">{product.series}</Badge>}
            {backordered && <Badge tone="warn">Backordered</Badge>}
          </div>
        </section>

        <div>
          <h1 className={pageTitle}>{displayName}</h1>

          <div className="mt-3">
            <PriceDisplay variant={activeVariant} />
          </div>

          {backordered && (
            <p className="mt-3 text-pretty text-sm text-amber-900">
              This configuration is currently backordered. Orders ship when
              inventory is available.
            </p>
          )}

          <SezzleNotice price={getVariantPrice(activeVariant)} />

          <div className="mt-6">
            <VariantSelector
              product={product}
              selection={selection}
              onChange={handleSelectionChange}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              className="w-full sm:w-auto"
              onClick={() => {
                addItem({ product, variant: activeVariant });
                openCart();
              }}
            >
              Add to cart
            </Button>
            <WishlistButton
              product={product}
              variant={activeVariant}
              className="w-full sm:w-auto"
            />
            {isRifle(product) ? (
              <CompareRifleToggle
                productSlug={product.slug}
                className="w-full sm:w-auto sm:px-3 sm:py-2"
              />
            ) : null}
          </div>

          {specRows.length > 0 && (
            <div className="mt-6">
              <SpecTable title="Specifications" rows={specRows} />
            </div>
          )}

          {isRifle(product) && (
            <>
              <ExtraMagazineOffer
                rifle={product}
                rifleVariant={activeVariant}
              />
              <AvailableAccessories rifle={product} />
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
