import type { RifleFilterOptions, RifleFilters as RifleFiltersState } from "../lib/catalog";
import { hasActiveRifleFilters } from "../lib/catalog";
import { Button } from "./Button";
import { FilterOptionList } from "./FilterOptionList";

interface RifleFiltersProps {
  options: RifleFilterOptions;
  filters: RifleFiltersState;
  onChange: (filters: RifleFiltersState) => void;
}

export function RifleFilters({ options, filters, onChange }: RifleFiltersProps) {
  const active = hasActiveRifleFilters(filters);

  return (
    <aside className="rounded-lg bg-surface-raised p-4 ring-1 ring-border">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-ink">Filter</h2>
        {active && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              onChange({ brands: [], calibers: [], handedness: [] })
            }
          >
            Clear all
          </Button>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <FilterOptionList
          label="Brand"
          options={options.brands}
          selected={filters.brands}
          onChange={(brands) => onChange({ ...filters, brands })}
        />
        <FilterOptionList
          label="Caliber"
          options={options.calibers}
          selected={filters.calibers}
          onChange={(calibers) => onChange({ ...filters, calibers })}
        />
        <FilterOptionList
          label="Handedness"
          options={options.handedness}
          selected={filters.handedness}
          onChange={(handedness) => onChange({ ...filters, handedness })}
        />
      </div>
    </aside>
  );
}
