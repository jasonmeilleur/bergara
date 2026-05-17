export type PaymentMethodId = "credit_card" | "interac" | "sezzle";

export const PAYMENT_METHODS: {
  id: PaymentMethodId;
  label: string;
  description: string;
}[] = [
  {
    id: "credit_card",
    label: "Credit card",
    description: "Visa · Mastercard · American Express",
  },
  {
    id: "interac",
    label: "Interac e-Payment",
    description: "Pay securely from your bank account",
  },
  {
    id: "sezzle",
    label: "Sezzle",
    description: "Buy now, pay later in 4 interest-free payments",
  },
];
