import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(
  readFileSync(join(root, "src/data/catalog.json"), "utf8"),
);

const siteUrl = (
  process.env.VITE_SITE_URL ?? "https://store-two-plum.vercel.app"
).replace(/\/$/, "");

const CALIBER_SLUG = (value) =>
  String(value).toLowerCase().replace(/[^a-z0-9]+/g, "");

function variantUrlKey(product, variant) {
  const skuKey = variant.sku.toLowerCase();
  const sameSku = product.variants.filter(
    (v) => v.sku.toLowerCase() === skuKey,
  );
  if (sameSku.length === 1) return skuKey;

  let key = skuKey;
  if (variant.caliber) key += `-${CALIBER_SLUG(variant.caliber)}`;

  const sameSkuAndCaliber = product.variants.filter(
    (v) => v.sku.toLowerCase() === skuKey && v.caliber === variant.caliber,
  );

  if (variant.capacity !== undefined && sameSkuAndCaliber.length > 1) {
    key += `-${CALIBER_SLUG(variant.capacity)}`;
  }

  return key;
}

function productPath(product, variant) {
  return `/${product.slug}-${variantUrlKey(product, variant)}`;
}

const paths = new Set([
  "/",
  "/account",
  "/account/login",
  "/account/sign-up",
  "/faq",
  "/sitemap",
  "/wishlist",
  "/rifles/compare",
]);

for (const category of ["rifles", "magazines", "accessories"]) {
  paths.add(`/${category}`);
}

const rifleSeries = new Set();
for (const product of catalog.products) {
  if (product.category === "Rifles" && product.series) {
    rifleSeries.add(product.series);
  }
}
for (const series of rifleSeries) {
  paths.add(`/rifles/${series.toLowerCase()}`);
}

for (const product of catalog.products) {
  for (const variant of product.variants) {
    paths.add(productPath(product, variant));
  }
}

const urls = [...paths]
  .sort()
  .map(
    (path) =>
      `  <url><loc>${siteUrl}${path}</loc><changefreq>weekly</changefreq></url>`,
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync(join(root, "public/sitemap.xml"), xml);

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

writeFileSync(join(root, "public/robots.txt"), robots);
console.log(`Wrote ${paths.size} URLs to public/sitemap.xml`);
console.log(`Wrote robots.txt (Sitemap: ${siteUrl}/sitemap.xml)`);
