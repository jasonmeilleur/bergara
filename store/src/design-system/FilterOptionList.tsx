import type { FilterOptionWithCount } from "../lib/catalog";

interface FilterOptionListProps {
  label: string;
  options: FilterOptionWithCount[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

function toggleValue(selected: string[], value: string): string[] {
  return selected.includes(value)
    ? selected.filter((v) => v !== value)
    : [...selected, value];
}

function formatOptionCount(count: number): string {
  return String(count);
}

export function FilterOptionList({
  label,
  options,
  selected,
  onChange,
}: FilterOptionListProps) {
  if (options.length === 0) return null;

  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="text-sm font-medium text-ink">{label}</legend>
      <ul className="flex flex-col gap-1" role="group" aria-label={label}>
        {options.map((option) => {
          const id = `${label}-${option.value}`.replace(/\s+/g, "-");
          const isChecked = selected.includes(option.value);

          return (
            <li key={option.value}>
              <label
                htmlFor={id}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <input
                  id={id}
                  type="checkbox"
                  checked={isChecked}
                  onChange={() =>
                    onChange(toggleValue(selected, option.value))
                  }
                  className="size-4 shrink-0 rounded border-border accent-ink"
                />
                <span className="min-w-0 flex-1 text-ink">{option.value}</span>
                <span className="shrink-0 text-xs text-ink-muted">
                  {formatOptionCount(option.count)}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
