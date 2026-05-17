import type { PaymentMethodId } from "../lib/payments";
import { PAYMENT_METHODS } from "../lib/payments";

function CardIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="shrink-0 text-ink-muted"
      aria-hidden
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

function InteracIcon() {
  return (
    <span
      className="flex h-5 shrink-0 items-center rounded bg-[#ffcc00] px-1.5 text-[10px] font-bold tracking-tight text-[#1a1a1a]"
      aria-hidden
    >
      Interac
    </span>
  );
}

function SezzleMark() {
  return (
    <span className="shrink-0 font-semibold text-[#382757]" aria-hidden>
      Sezzle
    </span>
  );
}

function MethodIcon({ id }: { id: PaymentMethodId }) {
  if (id === "credit_card") return <CardIcon />;
  if (id === "interac") return <InteracIcon />;
  return <SezzleMark />;
}

interface PaymentOptionsProps {
  compact?: boolean;
  selectable?: boolean;
  value?: PaymentMethodId;
  onChange?: (method: PaymentMethodId) => void;
}

export function PaymentOptions({
  compact = false,
  selectable = false,
  value,
  onChange,
}: PaymentOptionsProps) {
  if (selectable && onChange) {
    return (
      <fieldset className={compact ? "space-y-2" : "space-y-3"}>
        <legend className="text-sm font-medium text-ink">Payment method</legend>
        <div className="flex flex-col gap-2" role="radiogroup">
          {PAYMENT_METHODS.map((method) => {
            const selected = value === method.id;
            return (
              <label
                key={method.id}
                className={`flex cursor-pointer items-start gap-3 rounded-lg px-4 py-3 ring-1 transition-colors ${
                  selected
                    ? "bg-surface-muted ring-ink"
                    : "bg-surface-raised ring-border hover:ring-ink-muted"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selected}
                  onChange={() => onChange(method.id)}
                  className="mt-1 shrink-0 accent-ink"
                />
                <MethodIcon id={method.id} />
                <div className="min-w-0 text-sm">
                  <span className="font-medium text-ink">{method.label}</span>
                  <p className="mt-0.5 text-ink-muted">{method.description}</p>
                </div>
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  }

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <p className="text-sm font-medium text-ink">Payment options</p>
      <ul className="space-y-2.5" role="list">
        {PAYMENT_METHODS.map((method) => (
          <li key={method.id} className="flex items-start gap-3 text-sm">
            <MethodIcon id={method.id} />
            <div className="min-w-0">
              <span className="font-medium text-ink">{method.label}</span>
              <p className="mt-0.5 text-ink-muted">{method.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
