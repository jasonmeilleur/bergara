import {
  catalog,
  categoryPath,
  getCategoryMeta,
  getStoreCategory,
  STORE_CATEGORIES,
} from "./catalog";
import { buildProductPath } from "./product-url";
import { getRifleSeriesList, getSeriesTitle, seriesPath } from "./series";

export interface SitemapLink {
  label: string;
  path: string;
}

export interface SitemapSection {
  title: string;
  links: SitemapLink[];
}

const STATIC_PAGES: SitemapLink[] = [
  { label: "Home", path: "/" },
  { label: "Sign in", path: "/account/login" },
  { label: "Create account", path: "/account/sign-up" },
  { label: "Account", path: "/account" },
  { label: "FAQ", path: "/faq" },
  { label: "Search", path: "/search" },
  { label: "Wish list", path: "/wishlist" },
  { label: "Sitemap", path: "/sitemap" },
];

export function getSitemapSections(): SitemapSection[] {
  const categorySections = STORE_CATEGORIES.map((category) => {
    const meta = getCategoryMeta(category.id);
    const products = catalog.products.filter(
      (product) => getStoreCategory(product) === category.id,
    );

    const seriesLinks =
      category.id === "rifles"
        ? getRifleSeriesList().map((series) => ({
            label: getSeriesTitle(series),
            path: seriesPath(series),
          }))
        : [];

    return {
      title: meta.name,
      links: [
        { label: meta.name, path: categoryPath(category.id) },
        ...seriesLinks,
        ...products.flatMap((product) =>
          product.variants.map((variant) => ({
            label: formatSitemapProductLabel(product.name, variant),
            path: buildProductPath(product, variant),
          })),
        ),
      ],
    };
  });

  return [
    { title: "Pages", links: STATIC_PAGES },
    ...categorySections,
  ];
}

function formatSitemapProductLabel(
  productName: string,
  variant: { caliber?: string; handedness?: string; capacity?: number },
): string {
  const base = productName.replace(/^Bergara\s+/, "");
  const parts: string[] = [];
  if (variant.caliber) parts.push(variant.caliber);
  if (variant.handedness) parts.push(variant.handedness);
  if (variant.capacity !== undefined) parts.push(`${variant.capacity} rd`);
  if (parts.length === 0) return base;
  return `${base} (${parts.join(" · ")})`;
}

export function getAllSitemapPaths(): string[] {
  const paths = new Set<string>();
  for (const section of getSitemapSections()) {
    for (const link of section.links) {
      paths.add(link.path);
    }
  }
  return [...paths].sort();
}
