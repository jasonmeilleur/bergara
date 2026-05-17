import { useMemo, useState } from "react";

import { formatCapacityValue } from "../lib/catalog";
import type { SpecUnitSystem } from "../lib/units";
import { formatLengthFromInches, formatWeightFromLbs } from "../lib/units";
import type { Product, ProductSpecs, Variant } from "../lib/types";
import { UnitSwitch } from "./UnitSwitch";

export interface SpecRow {
  label: string;
  value?: string | number;
  lengthInches?: number;
  weightLbs?: number;
}

const specLabels: Record<keyof ProductSpecs, string> = {
  weight: "Weight",
  overall_length: "Overall length",
  barrel_length: "Barrel length",
  twist_rate: "Twist rate",
  magazine: "Magazine",
  capacity: "Capacity",
};

function formatRowDisplay(row: SpecRow, system: SpecUnitSystem): string {
  if (row.lengthInches !== undefined) {
    return formatLengthFromInches(row.lengthInches, system);
  }
  if (row.weightLbs !== undefined) {
    return formatWeightFromLbs(row.weightLbs, system);
  }
  if (row.value === undefined || row.value === null) return "";
  return String(row.value);
}

function rowHasConvertibleMeasure(row: SpecRow): boolean {
  return row.lengthInches !== undefined || row.weightLbs !== undefined;
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
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      if (key === "weight" && typeof value === "number") {
        return { label: specLabels[key], weightLbs: value };
      }
      if (
        (key === "overall_length" || key === "barrel_length") &&
        typeof value === "number"
      ) {
        return { label: specLabels[key], lengthInches: value };
      }
      return { label: specLabels[key], value: String(value) };
    });
}

interface SpecTableProps {
  rows: SpecRow[];
  title?: string;
}

export function SpecTable({ rows, title }: SpecTableProps) {
  const [unitSystem, setUnitSystem] = useState<SpecUnitSystem>("imperial");

  const entries = useMemo(
    () =>
      rows.filter((row) => {
        if (rowHasConvertibleMeasure(row)) return true;
        const text =
          row.value === undefined || row.value === null ? "" : String(row.value);
        return text !== "";
      }),
    [rows],
  );

  const showUnitSwitch = entries.some(rowHasConvertibleMeasure);

  if (entries.length === 0) return null;

  return (
    <section>
      {(title || showUnitSwitch) && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          {title ? (
            <h2 className="text-base font-semibold text-ink">{title}</h2>
          ) : (
            <span />
          )}
          {showUnitSwitch ? (
            <UnitSwitch value={unitSystem} onChange={setUnitSystem} />
          ) : null}
        </div>
      )}

      <dl className="divide-y divide-border rounded-lg ring-1 ring-border">
        {entries.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-3 gap-3 px-3 py-2 text-sm sm:px-4"
          >
            <dt className="col-span-1 text-ink-muted">{row.label}</dt>
            <dd className="col-span-2 font-medium text-ink">
              {formatRowDisplay(row, unitSystem)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
