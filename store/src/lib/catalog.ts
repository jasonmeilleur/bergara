import rawCatalog from "../data/catalog.json";
import type {
  Catalog,
  Product,
  StoreCategory,
  Variant,
  VariantOption,
} from "./types";

export const CALIBER_ORDER = ["17 HMR", "22 LR", "22 WMR"] as const;
const HANDEDNESS_ORDER = ["Right", "Left"] as const;
const MAGAZINE_CAPACITY_ORDER = [5, 10] as const;

export interface RifleFilters {
  brands: string[];
  calibers: string[];
  handedness: string[];
}

export const EMPTY_RIFLE_FILTERS: RifleFilters = {
  brands: [],
  calibers: [],
  handedness: [],
};

export const catalog = rawCatalog as Catalog;

export const STORE_CATEGORIES = [
  {
    id: "rifles" as const,
    name: "Rifles",
    description: "Precision rimfire rifles built for consistency and control.",
  },
  {
    id: "magazines" as const,
    name: "Magazines",
    description: "Factory magazines matched to Bergara platforms.",
  },
  {
    id: "accessories" as const,
    name: "Accessories",
    description: "Rails, mats, and essentials for the bench and field.",
  },
];

const STORE_CATEGORY_IDS = new Set<StoreCategory>(
  STORE_CATEGORIES.map((category) => category.id),
);

const ACCESSORY_SOURCE = new Set(["Mats", "Rails"]);

export function categoryPath(category: StoreCategory): string {
  return `/${category}`;
}

export function parseStoreCategory(
  segment: string | undefined,
): StoreCategory | null {
  if (
    segment !== undefined &&
    STORE_CATEGORY_IDS.has(segment as StoreCategory)
  ) {
    return segment as StoreCategory;
  }
  return null;
}

export function getStoreCategory(product: Product): StoreCategory {
  if (product.category === "Rifles") return "rifles";
  if (product.category === "Magazines") return "magazines";
  return "accessories";
}

export function getProductsByCategory(category: StoreCategory): Product[] {
  return catalog.products.filter((p) => getStoreCategory(p) === category);
}

export function getProductBySlug(slug: string): Product | undefined {
  return catalog.products.find((p) => p.slug === slug);
}

export function getCategoryMeta(id: StoreCategory) {
  return STORE_CATEGORIES.find((c) => c.id === id)!;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: catalog.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

export function getVariantPrice(variant: Variant): number {
  return variant.sale_price ?? variant.price;
}

export function getVariantCompareAtPrice(variant: Variant): number | undefined {
  if (
    variant.sale_price !== undefined &&
    variant.sale_price < variant.price
  ) {
    return variant.price;
  }
  return undefined;
}

export function isVariantOnSale(variant: Variant): boolean {
  return getVariantCompareAtPrice(variant) !== undefined;
}

export function isVariantBackordered(variant: Variant): boolean {
  return variant.availability === "backorder";
}

export function isProductBackordered(product: Product): boolean {
  return product.variants.some(isVariantBackordered);
}

export function getLowestPrice(product: Product): number {
  return Math.min(...product.variants.map(getVariantPrice));
}

export function getHighestPrice(product: Product): number {
  return Math.max(...product.variants.map(getVariantPrice));
}

export function formatPriceRange(product: Product): string {
  const low = getLowestPrice(product);
  const high = getHighestPrice(product);
  if (low === high) return formatPrice(low);
  return `${formatPrice(low)} – ${formatPrice(high)}`;
}

export function findVariant(
  product: Product,
  selection: Partial<Pick<Variant, "caliber" | "handedness" | "capacity">>,
): Variant | undefined {
  return product.variants.find((v) => {
    if (selection.caliber && v.caliber !== selection.caliber) return false;
    if (selection.handedness && v.handedness !== selection.handedness)
      return false;
    if (
      selection.capacity !== undefined &&
      v.capacity !== selection.capacity
    )
      return false;
    return true;
  });
}

export function getUniqueOptionValues<T extends keyof Variant>(
  product: Product,
  key: T,
): NonNullable<Variant[T]>[] {
  const values = new Set<NonNullable<Variant[T]>>();
  for (const v of product.variants) {
    const val = v[key];
    if (val !== undefined && val !== null) values.add(val as NonNullable<Variant[T]>);
  }
  return [...values];
}

export function isMagazine(product: Product): boolean {
  return product.category === "Magazines";
}

export function isRifle(product: Product): boolean {
  return product.category === "Rifles";
}

export function cartHasRifles(
  items: { productSlug: string }[],
): boolean {
  return items.some((item) => {
    const product = getProductBySlug(item.productSlug);
    return product ? isRifle(product) : false;
  });
}

export function getProductCalibers(product: Product): string[] {
  const calibers = new Set<string>();
  for (const variant of product.variants) {
    if (variant.caliber) calibers.add(variant.caliber);
  }
  return sortCalibers([...calibers]);
}

export function hasLeftHandAvailable(product: Product): boolean {
  return product.variants.some((variant) => variant.handedness === "Left");
}

function caliberRank(caliber: string): number {
  const index = CALIBER_ORDER.indexOf(
    caliber as (typeof CALIBER_ORDER)[number],
  );
  return index === -1 ? CALIBER_ORDER.length : index;
}

export function sortCalibers(calibers: string[]): string[] {
  return [...calibers].sort((a, b) => caliberRank(a) - caliberRank(b));
}

function handednessRank(handedness: string): number {
  const index = HANDEDNESS_ORDER.indexOf(
    handedness as (typeof HANDEDNESS_ORDER)[number],
  );
  return index === -1 ? HANDEDNESS_ORDER.length : index;
}

export function sortHandedness(values: string[]): string[] {
  return [...values].sort((a, b) => handednessRank(a) - handednessRank(b));
}

export interface FilterOptionWithCount {
  value: string;
  count: number;
}

export interface RifleFilterOptions {
  brands: FilterOptionWithCount[];
  calibers: FilterOptionWithCount[];
  handedness: FilterOptionWithCount[];
}

function countVariantsByBrand(products: Product[]): FilterOptionWithCount[] {
  const counts = new Map<string, number>();

  for (const product of products) {
    counts.set(
      product.brand,
      (counts.get(product.brand) ?? 0) + product.variants.length,
    );
  }

  return [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([value, count]) => ({ value, count }));
}

function countVariantsByHandedness(
  products: Product[],
): FilterOptionWithCount[] {
  const counts = new Map<string, number>();

  for (const product of products) {
    for (const variant of product.variants) {
      if (!variant.handedness) continue;
      counts.set(
        variant.handedness,
        (counts.get(variant.handedness) ?? 0) + 1,
      );
    }
  }

  return sortHandedness([...counts.keys()]).map((value) => ({
    value,
    count: counts.get(value) ?? 0,
  }));
}

function countVariantsByCaliber(products: Product[]): FilterOptionWithCount[] {
  const counts = new Map<string, number>();

  for (const product of products) {
    for (const variant of product.variants) {
      if (!variant.caliber) continue;
      counts.set(
        variant.caliber,
        (counts.get(variant.caliber) ?? 0) + 1,
      );
    }
  }

  return sortCalibers([...counts.keys()]).map((value) => ({
    value,
    count: counts.get(value) ?? 0,
  }));
}

export function getRifleFilterOptions(products: Product[]): RifleFilterOptions {
  return {
    brands: countVariantsByBrand(products),
    calibers: countVariantsByCaliber(products),
    handedness: countVariantsByHandedness(products),
  };
}

export function filterRifleProducts(
  products: Product[],
  filters: RifleFilters,
): Product[] {
  return products.filter((product) => {
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
      return false;
    }

    if (filters.calibers.length === 0 && filters.handedness.length === 0) {
      return true;
    }

    return product.variants.some((variant) => {
      if (
        filters.calibers.length > 0 &&
        (!variant.caliber || !filters.calibers.includes(variant.caliber))
      ) {
        return false;
      }
      if (
        filters.handedness.length > 0 &&
        (!variant.handedness ||
          !filters.handedness.includes(variant.handedness))
      ) {
        return false;
      }
      return true;
    });
  });
}

export function hasActiveRifleFilters(filters: RifleFilters): boolean {
  return (
    filters.brands.length > 0 ||
    filters.calibers.length > 0 ||
    filters.handedness.length > 0
  );
}

export function getOrderedOptionValues(
  product: Product,
  option: VariantOption,
): (string | number)[] {
  const values = getUniqueOptionValues(product, option);

  if (option === "caliber") {
    return sortCalibers(values as string[]);
  }

  if (isMagazine(product) && option === "capacity") {
    return (values as number[]).sort(
      (a, b) =>
        MAGAZINE_CAPACITY_ORDER.indexOf(
          a as (typeof MAGAZINE_CAPACITY_ORDER)[number],
        ) -
        MAGAZINE_CAPACITY_ORDER.indexOf(
          b as (typeof MAGAZINE_CAPACITY_ORDER)[number],
        ),
    );
  }

  return values as (string | number)[];
}

export function formatVariantOptionLabel(
  product: Product,
  option: VariantOption,
  value: string | number,
): string {
  if (isMagazine(product) && option === "capacity") {
    return `${value} rounds`;
  }
  return String(value);
}

export function formatCapacityValue(
  product: Product,
  capacity: number,
): string {
  if (isMagazine(product)) return `${capacity} rounds`;
  return String(capacity);
}

export { ACCESSORY_SOURCE };
