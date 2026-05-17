import { formatPrice } from "../lib/catalog";
import {
  FULFILLMENT_METHODS,
  PICKUP_LOCATION,
  SHIPPING_CARRIERS,
  type FulfillmentMethodId,
  type ShippingCarrierId,
} from "../lib/shipping";

function PickupIcon() {
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
      <path d="M3 9l9-6 9 6v11a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9z" />
    </svg>
  );
}

function TruckIcon() {
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
      <path d="M3 6h11v9H3V6zM14 8h4l3 3v4h-7V8z" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </svg>
  );
}

function CanadaPostMark() {
  return (
    <span
      className="flex h-5 shrink-0 items-center rounded bg-[#d80613] px-1.5 text-[9px] font-bold tracking-tight text-white"
      aria-hidden
    >
      CP
    </span>
  );
}

function UpsMark() {
  return (
    <span
      className="flex h-5 shrink-0 items-center rounded bg-[#351c15] px-1.5 text-[9px] font-bold tracking-tight text-[#ffb500]"
      aria-hidden
    >
      UPS
    </span>
  );
}

interface ShippingOptionsProps {
  fulfillment: FulfillmentMethodId;
  carrier: ShippingCarrierId;
  onFulfillmentChange: (method: FulfillmentMethodId) => void;
  onCarrierChange: (carrier: ShippingCarrierId) => void;
}

export function ShippingOptions({
  fulfillment,
  carrier,
  onFulfillmentChange,
  onCarrierChange,
}: ShippingOptionsProps) {
  return (
    <div className="space-y-6">
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-ink">Delivery method</legend>
        <div className="flex flex-col gap-2" role="radiogroup">
          {FULFILLMENT_METHODS.map((method) => {
            const selected = fulfillment === method.id;
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
                  name="fulfillmentMethod"
                  value={method.id}
                  checked={selected}
                  onChange={() => onFulfillmentChange(method.id)}
                  className="mt-1 shrink-0 accent-ink"
                />
                {method.id === "pickup" ? <PickupIcon /> : <TruckIcon />}
                <div className="min-w-0 flex-1 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-ink">{method.label}</span>
                    <span className="shrink-0 text-ink-muted">
                      {method.id === "pickup"
                        ? "Free"
                        : `From ${formatPrice(
                            Math.min(
                              ...SHIPPING_CARRIERS.map((c) => c.amount),
                            ),
                          )}`}
                    </span>
                  </div>
                  <p className="mt-0.5 text-ink-muted">{method.description}</p>
                </div>
              </label>
            );
          })}
        </div>
      </fieldset>

      {fulfillment === "pickup" && (
        <div className="rounded-lg bg-surface-muted px-4 py-3 text-sm ring-1 ring-border">
          <p className="font-medium text-ink">{PICKUP_LOCATION.name}</p>
          <p className="mt-1 text-ink-muted">
            {PICKUP_LOCATION.addressLine1}
            <br />
            {PICKUP_LOCATION.city}, {PICKUP_LOCATION.provinceCode}{" "}
            {PICKUP_LOCATION.postalCode}
          </p>
          <p className="mt-2 text-ink-muted">{PICKUP_LOCATION.phone}</p>
          <p className="mt-1 text-xs text-ink-subtle">{PICKUP_LOCATION.hours}</p>
          <p className="mt-2 text-xs font-medium text-ink">
            {PICKUP_LOCATION.readyIn}
          </p>
        </div>
      )}

      {fulfillment === "ship" && (
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-ink">
            Shipping carrier
          </legend>
          <div className="flex flex-col gap-2" role="radiogroup">
            {SHIPPING_CARRIERS.map((option) => {
              const selected = carrier === option.id;
              return (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg px-4 py-3 ring-1 transition-colors ${
                    selected
                      ? "bg-surface-muted ring-ink"
                      : "bg-surface-raised ring-border hover:ring-ink-muted"
                  }`}
                >
                  <input
                    type="radio"
                    name="shippingCarrier"
                    value={option.id}
                    checked={selected}
                    onChange={() => onCarrierChange(option.id)}
                    className="mt-1 shrink-0 accent-ink"
                  />
                  {option.id === "canada_post" ? (
                    <CanadaPostMark />
                  ) : (
                    <UpsMark />
                  )}
                  <div className="min-w-0 flex-1 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-ink">
                        {option.label} — {option.service}
                      </span>
                      <span className="shrink-0 font-medium text-ink">
                        {formatPrice(option.amount)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-ink-muted">{option.description}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}
    </div>
  );
}
