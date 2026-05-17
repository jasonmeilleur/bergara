export type FulfillmentMethodId = "pickup" | "ship";

export type ShippingCarrierId = "canada_post" | "ups";

export const PICKUP_LOCATION = {
  name: "Bergara Calgary Showroom",
  addressLine1: "4820 36 Street SE",
  city: "Calgary",
  provinceCode: "AB",
  postalCode: "T2B 3N4",
  phone: "(403) 555-0192",
  hours: "Mon–Fri 9am–5pm MT",
  readyIn: "Ready in 2–3 business days",
};

export const FULFILLMENT_METHODS: {
  id: FulfillmentMethodId;
  label: string;
  description: string;
}[] = [
  {
    id: "pickup",
    label: "In-store pick-up",
    description: "Collect your order at our Calgary showroom",
  },
  {
    id: "ship",
    label: "Shipping",
    description: "Canada Post or UPS — Canada addresses only",
  },
];

export const SHIPPING_CARRIERS: {
  id: ShippingCarrierId;
  label: string;
  service: string;
  description: string;
  amount: number;
}[] = [
  {
    id: "canada_post",
    label: "Canada Post",
    service: "Expedited Parcel",
    description: "5–7 business days · tracking included",
    amount: 14.99,
  },
  {
    id: "ups",
    label: "UPS",
    service: "UPS Standard",
    description: "3–5 business days · tracking included",
    amount: 18.99,
  },
];

export function getShippingCarrier(carrierId: ShippingCarrierId) {
  return SHIPPING_CARRIERS.find((carrier) => carrier.id === carrierId);
}

export function getShippingCost(
  fulfillment: FulfillmentMethodId,
  carrierId: ShippingCarrierId | null,
): number {
  if (fulfillment === "pickup") return 0;
  if (!carrierId) return 0;
  return getShippingCarrier(carrierId)?.amount ?? 0;
}

export function getFulfillmentLabel(
  fulfillment: FulfillmentMethodId,
  carrierId: ShippingCarrierId | null,
): string {
  if (fulfillment === "pickup") return "In-store pick-up";
  const carrier = carrierId ? getShippingCarrier(carrierId) : null;
  if (!carrier) return "Shipping";
  return `${carrier.label} — ${carrier.service}`;
}
