import { MAX_COMPARE_RIFLES } from "../lib/compare-rifles";
import { isRifle, getProductBySlug } from "../lib/catalog";
import { useCompareRifles } from "../context/CompareRiflesContext";

interface CompareRifleToggleProps {
  productSlug: string;
  className?: string;
  compact?: boolean;
}

export function CompareRifleToggle({
  productSlug,
  className = "",
  compact = false,
}: CompareRifleToggleProps) {
  const { isInCompare, toggleRifle, isFull } = useCompareRifles();
  const product = getProductBySlug(productSlug);

  if (!product || !isRifle(product)) return null;

  const selected = isInCompare(productSlug);
  const disabled = !selected && isFull;

  return (
    <label
      className={`inline-flex cursor-pointer items-center gap-2 text-sm ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      } ${className}`}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <input
        type="checkbox"
        checked={selected}
        disabled={disabled}
        onChange={() => toggleRifle(productSlug)}
        className="size-4 rounded border-border text-accent focus:ring-accent"
        aria-label={
          selected
            ? `Remove ${product.name} from compare`
            : `Add ${product.name} to compare`
        }
      />
      <span className={compact ? "sr-only" : "font-medium text-ink"}>
        Compare
        {!compact ? ` (max ${MAX_COMPARE_RIFLES})` : null}
      </span>
    </label>
  );
}
