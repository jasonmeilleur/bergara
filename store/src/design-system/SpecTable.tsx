import { formatCapacityValue } from "../lib/catalog";
import type { Product, ProductSpecs, Variant } from "../lib/types";

export interface SpecRow {
  label: string;
  value: string | number;
}

const specLabels: Record<keyof ProductSpecs, string> = {
  weight: "Weight",
  overall_length: "Overall length",
  barrel_length: "Barrel length",
  twist_rate: "Twist rate",
  magazine: "Magazine",
  capacity: "Capacity",
};

function formatSpecValue(
  key: keyof ProductSpecs,
  value: ProductSpecs[keyof ProductSpecs],
): string {
  if (value === undefined || value === null) return "";
  if (key === "weight") return `${value} lbs`;
  if (key === "overall_length" || key === "barrel_length") return `${value}"`;
  return String(value);
}

export function variantDetailRows(variant: Variant, product: Product): SpecRow[] {
  const rows: SpecRow[] = [{ label: "Product Code", value: variant.sku }];
  if (variant.caliber) rows.push({ label: "Caliber", value: variant.caliber });
  if (variant.handedness) {
    rows.push({ label: "Handedness", value: variant.handedness });
  }
  if (variant.capacity !== undefined) {
    rows.push({
      label: "Capacity",
      value: formatCapacityValue(product, variant.capacity),
    });
  }
  return rows;
}

export function productSpecRows(specs: ProductSpecs): SpecRow[] {
  return (
    Object.entries(specs) as [
      keyof ProductSpecs,
      ProductSpecs[keyof ProductSpecs],
    ][]
  )
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([key, value]) => ({
      label: specLabels[key],
      value: formatSpecValue(key, value),
    }));
}

interface SpecTableProps {
  rows: SpecRow[];
}

export function SpecTable({ rows }: SpecTableProps) {
  const entries = rows.filter(
    (r) => r.value !== undefined && r.value !== null && String(r.value) !== "",
  );

  if (entries.length === 0) return null;

  return (
    <dl className="divide-y divide-border rounded-lg ring-1 ring-border">
      {entries.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-3 gap-3 px-3 py-2 text-sm sm:px-4"
        >
          <dt className="col-span-1 text-ink-muted">{row.label}</dt>
          <dd className="col-span-2 font-medium text-ink">{String(row.value)}</dd>
        </div>
      ))}
    </dl>
  );
}
