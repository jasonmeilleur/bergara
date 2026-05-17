import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { categoryPath, getCategoryMeta } from "../lib/catalog";
import {
  getProductsBySeries,
  getSeriesTitle,
  parseSeriesRoute,
} from "../lib/series";
import { Breadcrumbs } from "../design-system/Breadcrumbs";
import { Container } from "../design-system/Container";
import {
  pagePadding,
  pageTitle,
  productGrid,
  stackAfterBreadcrumb,
} from "../design-system/layout";
import { ProductCard } from "../design-system/ProductCard";
import { ProductSort } from "../design-system/ProductSort";
import { DEFAULT_PRODUCT_SORT, sortProducts } from "../lib/sort";
import type { ProductSortId } from "../lib/sort";

export function SeriesPage() {
  const { categoryId, seriesSlug } = useParams<{
    categoryId: string;
    seriesSlug: string;
  }>();
  const resolved = parseSeriesRoute(categoryId, seriesSlug);

  const [sort, setSort] = useState<ProductSortId>(DEFAULT_PRODUCT_SORT);

  const seriesProducts = useMemo(
    () => (resolved ? getProductsBySeries(resolved.series) : []),
    [resolved],
  );

  const products = useMemo(
    () => sortProducts(seriesProducts, sort),
    [seriesProducts, sort],
  );

  if (!resolved) {
    return (
      <Container className="py-12">
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          Series not found
        </h1>
        <Link
          to={categoryPath("rifles")}
          className="mt-4 inline-block text-link hover:text-link-hover hover:underline"
        >
          View all rifles
        </Link>
      </Container>
    );
  }

  const { category, series } = resolved;
  const categoryMeta = getCategoryMeta(category);
  const title = getSeriesTitle(series);

  return (
    <Container className={pagePadding}>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: categoryMeta.name, path: categoryPath(category) },
          { name: series },
        ]}
      />

      <header className={`max-w-[50ch] ${stackAfterBreadcrumb}`}>
        <h1 className={pageTitle}>{title}</h1>
        <p className="mt-2 text-pretty text-sm text-ink-muted">
          Browse every Bergara {series} rifle configuration in this collection.
        </p>
        <p className="mt-2 text-sm text-ink-subtle">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-4">
        <ProductSort value={sort} onChange={setSort} />
        <div className={productGrid}>
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </Container>
  );
}
