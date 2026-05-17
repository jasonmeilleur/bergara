import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  EMPTY_RIFLE_FILTERS,
  filterRifleProducts,
  getCategoryMeta,
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
  const [sort, setSort] = useState<ProductSortId>(DEFAULT_PRODUCT_SORT);

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
        className={
          category === "rifles"
            ? `${sectionSpacingLg} grid gap-6 lg:grid-cols-[12rem_1fr]`
            : sectionSpacingLg
        }
      >
        {category === "rifles" && filterOptions && (
          <RifleFiltersPanel
            options={filterOptions}
            filters={rifleFilters}
            onChange={setRifleFilters}
          />
        )}

        {products.length > 0 ? (
          <div className="flex flex-col gap-4">
            <ProductSort value={sort} onChange={setSort} />
            <div className={productGrid}>
              {products.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-3 py-8">
            <p className="text-pretty text-ink-muted">
              No rifles match the selected filters.
            </p>
            <button
              type="button"
              onClick={() => setRifleFilters(EMPTY_RIFLE_FILTERS)}
              className="text-sm font-medium text-link hover:text-link-hover hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </Container>
  );
}
