import { catalog, getVariantPrice, isVariantBackordered } from "./catalog";
import { getProductImageUrl } from "./product-images";
import { buildProductPath } from "./product-url";
import { SHIPPING_CARRIERS } from "./shipping";
import { absoluteUrl, SITE_LOGO_URL } from "./site";
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
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  };
}

function schemaAvailability(variant: Variant): string {
  if (isVariantBackordered(variant)) {
    return "https://schema.org/BackOrder";
  }
  return "https://schema.org/InStock";
}

function productSchemaImage(slug: string): string[] {
  const path = getProductImageUrl(slug) ?? SITE_LOGO_URL;
  return [absoluteUrl(path)];
}

function priceValidUntilDate(): string {
  const date = new Date();
  date.setUTCFullYear(date.getUTCFullYear() + 1);
  return date.toISOString().slice(0, 10);
}

function offerShippingDetails() {
  const lowestRate = Math.min(...SHIPPING_CARRIERS.map((carrier) => carrier.amount));

  return {
    "@type": "OfferShippingDetails",
    shippingRate: {
      "@type": "MonetaryAmount",
      value: lowestRate.toFixed(2),
      currency: catalog.currency,
    },
    shippingDestination: {
      "@type": "DefinedRegion",
      addressCountry: "CA",
    },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: {
        "@type": "QuantitativeValue",
        minValue: 0,
        maxValue: 3,
        unitCode: "DAY",
      },
      transitTime: {
        "@type": "QuantitativeValue",
        minValue: 3,
        maxValue: 7,
        unitCode: "DAY",
      },
    },
  };
}

function merchantReturnPolicy() {
  return {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "CA",
    returnPolicyCategory:
      "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 30,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
  };
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
    priceValidUntil: priceValidUntilDate(),
    availability: schemaAvailability(variant),
    itemCondition: "https://schema.org/NewCondition",
    shippingDetails: offerShippingDetails(),
    hasMerchantReturnPolicy: merchantReturnPolicy(),
  };

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: displayName,
    image: productSchemaImage(product.slug),
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
