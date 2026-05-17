import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/catalog";
import {
  formatMagazineLabel,
  getCompatibleExtraMagazine,
} from "../lib/rifle-magazines";
import { buildProductPath } from "../lib/product-url";
import type { Product, Variant } from "../lib/types";
import { Button } from "./Button";

interface ExtraMagazineOfferProps {
  rifle: Product;
  rifleVariant: Variant;
}

export function ExtraMagazineOffer({
  rifle,
  rifleVariant,
}: ExtraMagazineOfferProps) {
  const { addItem } = useCart();
  const match = getCompatibleExtraMagazine(rifle, rifleVariant);

  if (!match) return null;

  const { magazine, variant } = match;
  const label = formatMagazineLabel(magazine, variant);

  return (
    <section className="mt-6 rounded-lg bg-surface-muted p-4 ring-1 ring-border">
      <h2 className="text-base font-semibold text-ink">Add an extra magazine</h2>
      <p className="mt-2 text-pretty text-sm text-ink-muted">
        Factory magazine matched to this rifle and caliber.
      </p>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-ink">{label}</p>
          <p className="mt-1 text-sm text-ink-subtle">
            Product Code {variant.sku}
          </p>
          <p className="mt-2 text-sm font-medium text-ink">
            {formatPrice(variant.price)}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => addItem({ product: magazine, variant })}
          >
            Add extra magazine
          </Button>
          <Link
            to={buildProductPath(magazine, variant)}
            className="text-center text-sm text-link hover:text-link-hover hover:underline sm:text-right"
          >
            View magazine details
          </Link>
        </div>
      </div>
    </section>
  );
}
