import { Link } from "react-router-dom";
import { useCompareRifles } from "../context/CompareRiflesContext";
import { Breadcrumbs } from "../design-system/Breadcrumbs";
import { Button } from "../design-system/Button";
import { CompareRifleToggle } from "../design-system/CompareRifleToggle";
import { Container } from "../design-system/Container";
import { ProductImage } from "../design-system/ProductImage";
import {
  pagePadding,
  pageTitle,
  stackAfterBreadcrumb,
} from "../design-system/layout";
import { categoryPath } from "../lib/catalog";
import {
  buildCompareSpecRows,
  COMPARE_RIFLES_PATH,
  resolveCompareRifleEntries,
} from "../lib/compare-rifles";
import { buildProductPath } from "../lib/product-url";

export function CompareRiflesPage() {
  const { items, removeRifle, clearCompare } = useCompareRifles();
  const entries = resolveCompareRifleEntries(items);
  const specRows = buildCompareSpecRows(entries);

  return (
    <Container className={`${pagePadding} pb-24`}>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Rifles", path: categoryPath("rifles") },
          { name: "Compare" },
        ]}
      />

      <header
        className={`flex flex-wrap items-end justify-between gap-4 ${stackAfterBreadcrumb}`}
      >
        <div>
          <h1 className={pageTitle}>Compare rifles</h1>
          <p className="mt-2 max-w-[60ch] text-pretty text-sm text-ink-muted">
            Side-by-side specs for up to 3 models. Dimensions use a representative
            configuration (22 LR, right-hand when available).
          </p>
        </div>
        {entries.length > 0 ? (
          <Button type="button" variant="ghost" size="sm" onClick={clearCompare}>
            Clear all
          </Button>
        ) : null}
      </header>

      {entries.length === 0 ? (
        <div className="mt-10 flex flex-col items-start gap-4">
          <p className="text-pretty text-ink-muted">
            No rifles selected. Use the Compare checkbox on rifle cards or product
            pages, then return here to view specs side by side.
          </p>
          <Link
            to={categoryPath("rifles")}
            className="inline-flex items-center justify-center rounded-md bg-surface-muted px-3 py-2 text-sm font-medium text-ink ring-1 ring-border transition-colors hover:bg-surface-raised"
          >
            Browse rifles
          </Link>
        </div>
      ) : entries.length === 1 ? (
        <div className="mt-10 flex flex-col items-start gap-4">
          <p className="text-pretty text-ink-muted">
            Add at least one more rifle to compare. You can select up to 3 models.
          </p>
          <Link
            to={categoryPath("rifles")}
            className="inline-flex items-center justify-center rounded-md bg-accent px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Browse rifles
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-lg ring-1 ring-border">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted">
                <th className="w-36 shrink-0 p-3 font-medium text-ink-muted sm:w-40">
                  Model
                </th>
                {entries.map(({ product, variant, representativeLabel }) => (
                  <th key={product.slug} className="min-w-[12rem] p-3 align-top">
                    <div className="flex flex-col gap-3">
                      <div className="mx-auto h-28 w-28 overflow-hidden rounded-md bg-surface ring-1 ring-border">
                        <ProductImage
                          product={product}
                          className="h-full w-full"
                          imageClassName="h-full w-full object-contain object-center p-2"
                        />
                      </div>
                      <div>
                        <Link
                          to={buildProductPath(product, variant)}
                          className="font-semibold text-ink hover:text-link"
                        >
                          {product.name.replace(/^Bergara\s+/, "")}
                        </Link>
                        {representativeLabel ? (
                          <p className="mt-1 text-xs text-ink-subtle">
                            Specs: {representativeLabel}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex flex-col gap-2">
                        <CompareRifleToggle
                          productSlug={product.slug}
                          compact
                          className="justify-center"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRifle(product.slug)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specRows.map((row) => (
                <tr key={row.label} className="border-b border-border last:border-b-0">
                  <th className="bg-surface-muted/60 p-3 font-medium text-ink-muted">
                    {row.label}
                  </th>
                  {row.values.map((value, index) => (
                    <td
                      key={`${row.label}-${entries[index]?.product.slug ?? index}`}
                      className="p-3 font-medium text-ink"
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {entries.length >= 2 ? (
        <p className="mt-4 text-xs text-ink-subtle">
          Compare list is saved on this device. Share this page after selecting rifles:
          {" "}
          <span className="font-mono">{COMPARE_RIFLES_PATH}</span>
        </p>
      ) : null}
    </Container>
  );
}
