import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { categoryPath } from "../lib/catalog";
import { searchProducts } from "../lib/search";
import { Breadcrumbs } from "../design-system/Breadcrumbs";
import { Container } from "../design-system/Container";
import {
  pagePadding,
  pageTitle,
  productGrid,
  sectionSpacingLg,
  stackAfterBreadcrumb,
} from "../design-system/layout";
import { ProductCard } from "../design-system/ProductCard";
import { SearchBox } from "../design-system/SearchBox";
import { ProductSort } from "../design-system/ProductSort";
import { DEFAULT_PRODUCT_SORT, sortProducts } from "../lib/sort";
import type { ProductSortId } from "../lib/sort";

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const [sort, setSort] = useState<ProductSortId>(DEFAULT_PRODUCT_SORT);

  const searchResults = useMemo(() => searchProducts(query), [query]);
  const results = useMemo(
    () => sortProducts(searchResults, sort),
    [searchResults, sort],
  );
  const hasQuery = query.trim().length > 0;

  return (
    <Container className={pagePadding}>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Search" },
        ]}
      />

      <header className={`max-w-xl ${stackAfterBreadcrumb}`}>
        <h1 className={pageTitle}>Search</h1>
        <p className="mt-2 text-pretty text-sm text-ink-muted">
          Find rifles, magazines, and accessories by name, series, caliber, or
          product code.
        </p>
        <SearchBox
          defaultQuery={query}
          className="mt-4"
          autoFocus={!hasQuery}
        />
      </header>

      <div className={sectionSpacingLg}>
        {!hasQuery ? (
          <p className="text-pretty text-sm text-ink-muted">
            Enter a search term to browse the catalog.
          </p>
        ) : results.length > 0 ? (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-ink-subtle">
                {results.length} {results.length === 1 ? "result" : "results"}{" "}
                for &ldquo;{query.trim()}&rdquo;
              </p>
              <ProductSort value={sort} onChange={setSort} />
            </div>
            <div className={productGrid}>
              {results.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-start gap-3">
            <p className="text-pretty text-sm text-ink-muted">
              No products match &ldquo;{query.trim()}&rdquo;. Try a different
              term or browse by category.
            </p>
            <Link
              to={categoryPath("rifles")}
              className="text-sm font-medium text-link hover:text-link-hover hover:underline"
            >
              Browse rifles
            </Link>
          </div>
        )}
      </div>
    </Container>
  );
}
