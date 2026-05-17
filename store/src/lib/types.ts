export type VariantOption = "caliber" | "handedness" | "capacity";

export interface ProductSpecs {
  weight?: number;
  overall_length?: number;
  barrel_length?: number;
  twist_rate?: string;
  magazine?: string;
  capacity?: number | string;
}

export type VariantAvailability = "in_stock" | "backorder";

export interface Variant {
  sku: string;
  price: number;
  sale_price?: number;
  availability?: VariantAvailability;
  caliber?: string;
  handedness?: string;
  capacity?: number;
  specs?: ProductSpecs;
}

export interface Product {
  name: string;
  slug: string;
  brand: string;
  product_type: string;
  category: string;
  series?: string;
  variants: Variant[];
  variant_options?: VariantOption[];
}

export interface Catalog {
  brand: string;
  currency: string;
  categories: { id: string; name: string }[];
  products: Product[];
}

export type StoreCategory = "rifles" | "magazines" | "accessories";

export interface StoreCategoryMeta {
  id: StoreCategory;
  name: string;
  description: string;
}
