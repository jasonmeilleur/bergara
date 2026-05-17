/** Product slug → public URL for catalog images in /public/images/products/. */
const PRODUCT_IMAGE_URLS: Record<string, string> = {
  "bergara-b-14r-carbon-rifle": "/images/products/bergara-b-14r-carbon-rifle.jpg",
  "bergara-b-14r-steel-rifle": "/images/products/bergara-b-14r-steel-rifle.jpg",
  "bergara-bmr-carbon-rifle": "/images/products/bergara-bmr-carbon-rifle.png",
  "bergara-bmr-steel-rifle": "/images/products/bergara-bmr-steel-rifle.png",
  "bergara-bmr-x-carbon-rifle": "/images/products/bergara-bmr-x-carbon-rifle.png",
  "bergara-bmr-x-steel-rifle": "/images/products/bergara-bmr-x-steel-rifle.png",
};

/** Closest catalog image for rifles without a dedicated asset. */
const PRODUCT_IMAGE_FALLBACKS: Record<string, string> = {
  "bergara-b-14r-crest-cf-rifle": "bergara-b-14r-carbon-rifle",
  "bergara-bxr-carbon-rifle": "bergara-bmr-carbon-rifle",
  "bergara-bxr-steel-rifle": "bergara-bmr-steel-rifle",
};

export function getProductImageUrl(slug: string): string | undefined {
  const direct = PRODUCT_IMAGE_URLS[slug];
  if (direct) return direct;

  const fallbackSlug = PRODUCT_IMAGE_FALLBACKS[slug];
  if (fallbackSlug) return PRODUCT_IMAGE_URLS[fallbackSlug];

  return undefined;
}

export function productHasImage(slug: string): boolean {
  return getProductImageUrl(slug) !== undefined;
}
