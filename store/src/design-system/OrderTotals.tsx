import { formatPrice } from "../lib/catalog";
import {
  calculateCanadianTaxes,
  formatTaxRate,
  getOrderTotal,
  getTaxTotal,
  type CalculatedTaxLine,
} from "../lib/canadian-taxes";
import { getFulfillmentLabel } from "../lib/shipping";
import type {
  FulfillmentMethodId,
  ShippingCarrierId,
} from "../lib/shipping";

interface OrderTotalsProps {
  subtotal: number;
  provinceCode: string;
  shipping?: number;
  fulfillment?: FulfillmentMethodId;
  shippingCarrier?: ShippingCarrierId | null;
  showTaxHint?: boolean;
}

export function useOrderTotals(
  subtotal: number,
  provinceCode: string,
  shipping = 0,
) {
  const taxableAmount = subtotal + shipping;
  const taxes: CalculatedTaxLine[] = provinceCode
    ? calculateCanadianTaxes(taxableAmount, provinceCode)
    : [];
  const taxTotal = getTaxTotal(taxes);
  const total = provinceCode
    ? getOrderTotal(subtotal + shipping, taxes)
    : subtotal + shipping;

  return { taxes, taxTotal, total, shipping };
}

export function OrderTotals({
  subtotal,
  provinceCode,
  shipping = 0,
  fulfillment,
  shippingCarrier = null,
  showTaxHint = false,
}: OrderTotalsProps) {
  const { taxes, taxTotal, total } = useOrderTotals(
    subtotal,
    provinceCode,
    shipping,
  );
  const deliveryLabel =
    fulfillment !== undefined
      ? getFulfillmentLabel(fulfillment, shippingCarrier)
      : "Shipping";

  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-ink-muted">Subtotal</span>
        <span className="font-medium text-ink">{formatPrice(subtotal)}</span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-ink-muted">{deliveryLabel}</span>
        <span className="shrink-0 text-ink">
          {shipping === 0 ? "Free" : formatPrice(shipping)}
        </span>
      </div>

      {provinceCode ? (
        taxes.map((tax) => (
          <div key={tax.label} className="flex items-center justify-between">
            <span className="text-ink-muted">
              {tax.label} ({formatTaxRate(tax.rate)})
            </span>
            <span className="text-ink">{formatPrice(tax.amount)}</span>
          </div>
        ))
      ) : (
        showTaxHint && (
          <p className="text-ink-subtle">
            Select a province to calculate Canadian taxes.
          </p>
        )
      )}

      {provinceCode && taxes.length > 0 && (
        <div className="flex items-center justify-between border-t border-border pt-2">
          <span className="text-ink-muted">Tax</span>
          <span className="font-medium text-ink">{formatPrice(taxTotal)}</span>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-border pt-2">
        <span className="font-medium text-ink">Total</span>
        <span className="text-lg font-medium text-ink">
          {formatPrice(total)}
        </span>
      </div>
    </div>
  );
}
