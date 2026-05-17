import { catalog, getVariantPrice, isVariantBackordered } from "./catalog";
import { buildProductPath } from "./product-url";
import { absoluteUrl } from "./site";
import type { Product, Variant } from "./types";

export interface BreadcrumbSchemaItem {
  name: string;
  path?: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbSchemaItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path
        ? { item: absoluteUrl(item.path) }
        : {}),
    })),
  };
}

function schemaAvailability(variant: Variant): string {
  if (isVariantBackordered(variant)) {
    return "https://schema.org/BackOrder";
  }
  return "https://schema.org/InStock";
}

export function buildProductSchema(product: Product, variant: Variant) {
  const displayName = product.name.replace(/^Bergara\s+/, "");
  const price = getVariantPrice(variant);
  const productUrl = absoluteUrl(buildProductPath(product, variant));

  const offer: Record<string, unknown> = {
    "@type": "Offer",
    url: productUrl,
    priceCurrency: catalog.currency,
    price: price.toFixed(2),
    availability: schemaAvailability(variant),
    itemCondition: "https://schema.org/NewCondition",
  };

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: displayName,
    sku: variant.sku,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: offer,
    url: productUrl,
  };

  if (product.series) {
    schema.category = product.series;
  }

  const descriptionParts: string[] = [product.product_type];
  if (variant.caliber) descriptionParts.push(variant.caliber);
  if (variant.handedness) descriptionParts.push(variant.handedness);
  if (variant.capacity !== undefined) {
    descriptionParts.push(`${variant.capacity}-round capacity`);
  }
  schema.description = descriptionParts.join(" · ");

  return schema;
}
