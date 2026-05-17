import { useId } from "react";
import {
  DEFAULT_PRODUCT_SORT,
  PRODUCT_SORT_OPTIONS,
  type ProductSortId,
} from "../lib/sort";

const selectClass =
  "rounded-md bg-surface-raised py-1.5 pl-3 pr-8 text-sm text-ink ring-1 ring-border focus:outline-none focus:ring-2 focus:ring-accent";

interface ProductSortProps {
  value?: ProductSortId;
  onChange: (value: ProductSortId) => void;
  className?: string;
}

export function ProductSort({
  value = DEFAULT_PRODUCT_SORT,
  onChange,
  className = "",
}: ProductSortProps) {
  const selectId = useId();

  return (
    <div className={`flex items-center justify-end gap-2 ${className}`}>
      <label htmlFor={selectId} className="text-sm text-ink-muted">
        Sort by
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(event) => onChange(event.target.value as ProductSortId)}
        className={selectClass}
      >
        {PRODUCT_SORT_OPTIONS.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
