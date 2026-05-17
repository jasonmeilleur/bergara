import { useParams } from "react-router-dom";
import { parseStoreCategory } from "../lib/catalog";
import { resolveProductPath } from "../lib/product-url";
import { CategoryPage } from "./CategoryPage";
import { NotFoundPage } from "./NotFoundPage";
import { ProductPage } from "./ProductPage";

export function CatalogRoute() {
  const { slug } = useParams<{ slug: string }>();

  if (parseStoreCategory(slug)) {
    return <CategoryPage />;
  }

  if (slug && resolveProductPath(slug)) {
    return <ProductPage />;
  }

  return <NotFoundPage />;
}
