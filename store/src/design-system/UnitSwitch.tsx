import type { SpecUnitSystem } from "../lib/units";

const OPTIONS: { id: SpecUnitSystem; label: string }[] = [
  { id: "imperial", label: "in · lbs" },
  { id: "metric", label: "cm · kg" },
];

interface UnitSwitchProps {
  value: SpecUnitSystem;
  onChange: (value: SpecUnitSystem) => void;
}

export function UnitSwitch({ value, onChange }: UnitSwitchProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-ink-muted">Units</span>
      <div
        className="inline-flex rounded-md ring-1 ring-border"
        role="group"
        aria-label="Specification units"
      >
        {OPTIONS.map((option, index) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.id)}
              className={`px-2.5 py-1 font-medium transition-colors ${
                index > 0 ? "border-l border-border" : ""
              } ${
                selected
                  ? "bg-ink text-surface"
                  : "bg-surface-raised text-ink hover:bg-surface-muted"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
