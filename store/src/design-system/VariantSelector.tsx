import type { Product, Variant, VariantOption } from "../lib/types";
import {
  findVariant,
  formatVariantOptionLabel,
  getOrderedOptionValues,
} from "../lib/catalog";

interface VariantSelectorProps {
  product: Product;
  selection: Partial<Pick<Variant, "caliber" | "handedness" | "capacity">>;
  onChange: (selection: Partial<Pick<Variant, "caliber" | "handedness" | "capacity">>) => void;
}

const labels: Record<VariantOption, string> = {
  caliber: "Caliber",
  handedness: "Handedness",
  capacity: "Capacity",
};

export function VariantSelector({
  product,
  selection,
  onChange,
}: VariantSelectorProps) {
  const options = product.variant_options ?? [];

  if (options.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {options.map((option) => {
        const values = getOrderedOptionValues(product, option);
        return (
          <fieldset key={option} className="flex flex-col gap-3">
            <legend className="text-sm font-medium text-ink">
              {labels[option]}
            </legend>
            <div className="flex flex-wrap gap-2" role="group">
              {values.map((value) => {
                const testSelection = { ...selection, [option]: value };
                const match = findVariant(product, testSelection);
                const selected = selection[option] === value;
                const disabled = !match;

                return (
                  <button
                    key={String(value)}
                    type="button"
                    disabled={disabled}
                    onClick={() => onChange(testSelection)}
                    className={`rounded-md px-3 py-2 text-sm ring-1 transition-colors ${
                      selected
                        ? "bg-ink text-surface ring-ink"
                        : disabled
                          ? "cursor-not-allowed bg-surface-muted text-ink-subtle ring-border opacity-50"
                          : "bg-surface-raised text-ink ring-border hover:ring-ink-muted"
                    }`}
                  >
                    {formatVariantOptionLabel(product, option, value)}
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}
