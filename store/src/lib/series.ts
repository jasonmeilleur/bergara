import {
  categoryPath,
  getProductsByCategory,
  parseStoreCategory,
} from "./catalog";
import type { Product, StoreCategory } from "./types";

export function seriesToSlug(series: string): string {
  return series.toLowerCase();
}

export function findSeriesBySlug(seriesSlug: string): string | null {
  for (const product of getProductsByCategory("rifles")) {
    if (product.series && seriesToSlug(product.series) === seriesSlug) {
      return product.series;
    }
  }
  return null;
}

export function seriesPath(series: string): string {
  return `${categoryPath("rifles")}/${seriesToSlug(series)}`;
}

export function getSeriesTitle(series: string): string {
  return `Bergara ${series} Rifles`;
}

export function getProductsBySeries(series: string): Product[] {
  return getProductsByCategory("rifles").filter(
    (product) => product.series === series,
  );
}

export function getRifleSeriesList(): string[] {
  const seriesNames = new Set<string>();
  for (const product of getProductsByCategory("rifles")) {
    if (product.series) seriesNames.add(product.series);
  }
  return [...seriesNames].sort((a, b) => a.localeCompare(b));
}

export function parseSeriesRoute(
  categoryId: string | undefined,
  seriesSlug: string | undefined,
): { category: StoreCategory; series: string } | null {
  const category = parseStoreCategory(categoryId);
  if (category !== "rifles" || !seriesSlug) return null;

  const series = findSeriesBySlug(seriesSlug);
  if (!series) return null;

  return { category, series };
}
