import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCompareRifles } from "../context/CompareRiflesContext";
import { COMPARE_RIFLES_PATH } from "../lib/compare-rifles";
import {
  EMPTY_RIFLE_FILTERS,
  filterRifleProducts,
  getCategoryMeta,
  hasActiveRifleFilters,
  getProductsByCategory,
  getRifleFilterOptions,
  parseStoreCategory,
} from "../lib/catalog";
import type { RifleFilters } from "../lib/catalog";
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
import { ProductSort } from "../design-system/ProductSort";
import { RifleFilters as RifleFiltersPanel } from "../design-system/RifleFilters";
import { DEFAULT_PRODUCT_SORT, sortProducts } from "../lib/sort";
import type { ProductSortId } from "../lib/sort";

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = parseStoreCategory(slug);
  const [rifleFilters, setRifleFilters] =
    useState<RifleFilters>(EMPTY_RIFLE_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState<ProductSortId>(DEFAULT_PRODUCT_SORT);
  const { itemCount: compareCount } = useCompareRifles();

  const allProducts = useMemo(
    () => (category ? getProductsByCategory(category) : []),
    [category],
  );

  const filterOptions = useMemo(
    () => (category === "rifles" ? getRifleFilterOptions(allProducts) : null),
    [category, allProducts],
  );

  const filteredProducts = useMemo(() => {
    if (category !== "rifles") return allProducts;
    return filterRifleProducts(allProducts, rifleFilters);
  }, [category, allProducts, rifleFilters]);

  const products = useMemo(
    () => sortProducts(filteredProducts, sort),
    [filteredProducts, sort],
  );

  const activeFilterCount =
    rifleFilters.brands.length +
    rifleFilters.calibers.length +
    rifleFilters.handedness.length;

  if (!category) {
    return (
      <Container className="py-12">
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          Category not found
        </h1>
        <Link to="/" className="mt-4 inline-block text-link hover:text-link-hover hover:underline">
          Return home
        </Link>
      </Container>
    );
  }

  const meta = getCategoryMeta(category);

  return (
    <Container className={pagePadding}>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: meta.name },
        ]}
      />

      <header className={`max-w-[50ch] ${stackAfterBreadcrumb}`}>
        <h1 className={pageTitle}>{meta.name}</h1>
        <p className="mt-2 text-pretty text-sm text-ink-muted">{meta.description}</p>
        <p className="mt-2 text-sm text-ink-subtle">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
      </header>

      <div
        className={`${sectionSpacingLg} flex flex-col gap-4`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ProductSort value={sort} onChange={setSort} className="justify-start" />
          {category === "rifles" ? (
            <div className="flex flex-wrap items-center gap-2">
              {compareCount >= 2 ? (
                <Link
                  to={COMPARE_RIFLES_PATH}
                  className="inline-flex items-center rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
                >
                  Compare ({compareCount})
                </Link>
              ) : null}
              {filterOptions ? (
            <button
              type="button"
              aria-expanded={filtersOpen}
              aria-controls="rifle-filters"
              onClick={() => setFiltersOpen((open) => !open)}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium ring-1 transition-colors ${
                filtersOpen || hasActiveRifleFilters(rifleFilters)
                  ? "bg-ink text-surface ring-ink"
                  : "bg-surface-raised text-ink ring-border hover:bg-surface-muted"
              }`}
            >
              Filter
              {activeFilterCount > 0 ? (
                <span className="tabular-nums">({activeFilterCount})</span>
              ) : null}
            </button>
              ) : null}
            </div>
          ) : null}
        </div>

        {category === "rifles" && filterOptions && filtersOpen ? (
          <RifleFiltersPanel
            id="rifle-filters"
            options={filterOptions}
            filters={rifleFilters}
            onChange={setRifleFilters}
          />
        ) : null}

        {products.length > 0 ? (
          <div className={productGrid}>
              {products.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
        ) : (
          <div className="flex flex-col items-start gap-3 py-8">
            <p className="text-pretty text-ink-muted">
              {category === "rifles" && hasActiveRifleFilters(rifleFilters)
                ? "No rifles match the selected filters."
                : "No products in this category yet."}
            </p>
            {category === "rifles" && hasActiveRifleFilters(rifleFilters) ? (
              <button
                type="button"
                onClick={() => setRifleFilters(EMPTY_RIFLE_FILTERS)}
                className="text-sm font-medium text-link hover:text-link-hover hover:underline"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        )}
      </div>
    </Container>
  );
}
