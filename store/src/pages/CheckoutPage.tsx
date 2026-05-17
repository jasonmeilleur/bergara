import { useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Button } from "../design-system/Button";
import { Container } from "../design-system/Container";
import { pagePadding, pageTitle, stackAfterBreadcrumb } from "../design-system/layout";
import { PaymentOptions } from "../design-system/PaymentOptions";
import { ShippingOptions } from "../design-system/ShippingOptions";
import {
  cartHasRifles,
  categoryPath,
  formatPrice,
  getProductBySlug,
} from "../lib/catalog";
import { FirearmsLicenseFields } from "../design-system/FirearmsLicenseFields";
import { OrderTotals, useOrderTotals } from "../design-system/OrderTotals";
import { formatCartLineOptions } from "../lib/cart";
import { CANADIAN_PROVINCES } from "../lib/canadian-taxes";
import type { PaymentMethodId } from "../lib/payments";
import {
  getShippingCost,
  PICKUP_LOCATION,
  type FulfillmentMethodId,
  type ShippingCarrierId,
} from "../lib/shipping";

const inputClass =
  "mt-1 w-full rounded-md bg-surface-raised px-3 py-2 text-sm text-ink ring-1 ring-border placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-accent";

export function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodId>("credit_card");
  const [fulfillment, setFulfillment] =
    useState<FulfillmentMethodId>("ship");
  const [shippingCarrier, setShippingCarrier] =
    useState<ShippingCarrierId>("canada_post");
  const [province, setProvince] = useState("");

  const isPickup = fulfillment === "pickup";
  const shippingCost = getShippingCost(fulfillment, shippingCarrier);

  const handleFulfillmentChange = (method: FulfillmentMethodId) => {
    setFulfillment(method);
    if (method === "pickup") {
      setProvince(PICKUP_LOCATION.provinceCode);
    }
  };

  const requiresFirearmsLicense = useMemo(
    () => cartHasRifles(items),
    [items],
  );

  const { total: orderTotal } = useOrderTotals(subtotal, province, shippingCost);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    clearCart();
  };

  if (submitted) {
    return (
      <Container className="py-12 sm:py-16">
        <div className="mx-auto max-w-lg text-center">
          <p className="font-mono text-xs tracking-wide text-ink-subtle uppercase">
            Order received
          </p>
          <h1 className={`mt-3 ${pageTitle}`}>Thank you</h1>
          <p className="mt-3 text-pretty text-sm text-ink-muted">
            This is a demo checkout — no payment was processed and no order was
            placed. Your cart has been cleared.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
            <Link to={categoryPath("rifles")}>
              <Button>Continue shopping</Button>
            </Link>
            <Link to="/faq">
              <Button variant="secondary">View FAQ</Button>
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="py-12 sm:py-16">
        <div className="mx-auto max-w-lg text-center">
          <h1 className={pageTitle}>Checkout</h1>
          <p className="mt-3 text-pretty text-sm text-ink-muted">
            Your cart is empty. Add items before checking out.
          </p>
          <Link to={categoryPath("rifles")} className="mt-6 inline-block">
            <Button>Shop rifles</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className={pagePadding}>
      <header className="max-w-[50ch]">
        <nav className="text-sm text-ink-muted" aria-label="Breadcrumb">
          <Link to="/" className="text-link hover:text-link-hover">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">Checkout</span>
        </nav>
        <h1 className={`${stackAfterBreadcrumb} ${pageTitle}`}>Checkout</h1>
        <p className="mt-2 text-pretty text-sm text-ink-muted">
          Canada-only checkout. Taxes are calculated by province. Demo — no
          payment will be processed.
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <section>
            <h2 className="text-base font-semibold text-ink">Contact</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-ink-muted sm:col-span-2">
                Email
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </label>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink">Delivery</h2>
            <p className="mt-2 text-sm text-ink-muted">
              In-store pick-up or shipping within Canada via Canada Post or UPS.
            </p>
            <div className="mt-4">
              <ShippingOptions
                fulfillment={fulfillment}
                carrier={shippingCarrier}
                onFulfillmentChange={handleFulfillmentChange}
                onCarrierChange={setShippingCarrier}
              />
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink">
              {isPickup ? "Pick-up contact" : "Shipping address"}
            </h2>
            {isPickup ? (
              <p className="mt-2 text-sm text-ink-muted">
                We will email you when your order is ready at the Calgary
                showroom. Tax is calculated for Alberta.
              </p>
            ) : (
              <p className="mt-2 text-sm text-ink-muted">
                Orders ship to Canadian addresses only.
              </p>
            )}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-ink-muted">
                First name
                <input
                  type="text"
                  name="firstName"
                  required
                  autoComplete="given-name"
                  className={inputClass}
                />
              </label>
              <label className="block text-sm text-ink-muted">
                Last name
                <input
                  type="text"
                  name="lastName"
                  required
                  autoComplete="family-name"
                  className={inputClass}
                />
              </label>
              {!isPickup && (
                <>
                  <label className="block text-sm text-ink-muted sm:col-span-2">
                    Address
                    <input
                      type="text"
                      name="address"
                      required
                      autoComplete="street-address"
                      className={inputClass}
                    />
                  </label>
                  <label className="block text-sm text-ink-muted">
                    City
                    <input
                      type="text"
                      name="city"
                      required
                      autoComplete="address-level2"
                      className={inputClass}
                    />
                  </label>
                </>
              )}
              <label className="block text-sm text-ink-muted">
                Province / Territory
                <select
                  name="province"
                  required
                  value={province}
                  onChange={(event) => setProvince(event.target.value)}
                  autoComplete="address-level1"
                  disabled={isPickup}
                  className={`${inputClass} ${isPickup ? "bg-surface-muted text-ink-muted" : ""}`}
                >
                  <option value="">Select province or territory</option>
                  {CANADIAN_PROVINCES.map((entry) => (
                    <option key={entry.code} value={entry.code}>
                      {entry.name}
                    </option>
                  ))}
                </select>
              </label>
              {!isPickup && (
                <label className="block text-sm text-ink-muted">
                  Postal code
                  <input
                    type="text"
                    name="postalCode"
                    required
                    autoComplete="postal-code"
                    className={inputClass}
                    placeholder="A1A 1A1"
                  />
                </label>
              )}
              <label
                className={`block text-sm text-ink-muted ${isPickup ? "" : "sm:col-span-2"}`}
              >
                Country
                <input
                  type="text"
                  name="country"
                  readOnly
                  value="Canada"
                  className={`${inputClass} bg-surface-muted text-ink-muted`}
                />
              </label>
            </div>
          </section>

          {requiresFirearmsLicense && <FirearmsLicenseFields />}

          <section>
            <h2 className="text-base font-semibold text-ink">Payment</h2>
            <div className="mt-4">
              <PaymentOptions
                selectable
                value={paymentMethod}
                onChange={setPaymentMethod}
              />
            </div>

            {paymentMethod === "credit_card" && (
              <div className="mt-6 grid gap-4 opacity-60">
                <p className="text-sm text-ink-muted">
                  Card fields are disabled in this demo.
                </p>
                <label className="block text-sm text-ink-muted">
                  Card number
                  <input
                    type="text"
                    disabled
                    placeholder="0000 0000 0000 0000"
                    className={inputClass}
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm text-ink-muted">
                    Expiry
                    <input
                      type="text"
                      disabled
                      placeholder="MM / YY"
                      className={inputClass}
                    />
                  </label>
                  <label className="block text-sm text-ink-muted">
                    CVC
                    <input
                      type="text"
                      disabled
                      placeholder="123"
                      className={inputClass}
                    />
                  </label>
                </div>
              </div>
            )}

            {paymentMethod === "interac" && (
              <p className="mt-6 rounded-md bg-surface-muted px-4 py-3 text-sm text-pretty text-ink-muted ring-1 ring-border">
                After placing your order, you will receive Interac e-Payment
                instructions by email. Funds must be sent from a Canadian bank
                account. Demo messaging only.
              </p>
            )}

            {paymentMethod === "sezzle" && (
              <div className="mt-6 rounded-md bg-[#382757]/5 px-4 py-3 ring-1 ring-[#382757]/15">
                <p className="text-sm text-ink">
                  <span className="font-semibold text-[#382757]">Sezzle</span>
                  {" — "}
                  Pay in 4 interest-free payments of{" "}
                  <span className="font-medium">
                    {formatPrice(orderTotal / 4)}
                  </span>
                </p>
                <p className="mt-1.5 text-xs text-ink-subtle">
                  You will be redirected to Sezzle to complete payment. Demo
                  messaging only — subject to approval.
                </p>
              </div>
            )}
          </section>

          <Button type="submit" className="w-full sm:w-auto">
            Place demo order
          </Button>
        </form>

        <aside className="h-fit rounded-lg bg-surface-raised p-5 ring-1 ring-border lg:sticky lg:top-24">
          <h2 className="text-base font-semibold text-ink">Order summary</h2>
          <ul className="mt-4 divide-y divide-border">
            {items.map((item) => {
              const product = getProductBySlug(item.productSlug);
              const options = formatCartLineOptions(item, product);

              return (
                <li key={item.lineId} className="flex gap-3 py-3 first:pt-0">
                  <div className="h-14 w-14 shrink-0 rounded-md bg-gradient-to-br from-hero via-forest/70 to-accent/30 ring-1 ring-border" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">
                      {item.productName}
                    </p>
                    {options && (
                      <p className="text-sm text-ink-muted">{options}</p>
                    )}
                    <p className="text-sm text-ink-subtle">
                      Qty {item.quantity} ·{" "}
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 border-t border-border pt-4">
            <OrderTotals
              subtotal={subtotal}
              provinceCode={province}
              shipping={shippingCost}
              fulfillment={fulfillment}
              shippingCarrier={shippingCarrier}
              showTaxHint
            />
          </div>
          <div className="mt-6 border-t border-border pt-4">
            <PaymentOptions compact />
          </div>
          <p className="mt-4 text-sm text-ink-subtle">
            Canadian GST, HST, PST, and QST rates vary by province.
          </p>
        </aside>
      </div>
    </Container>
  );
}
