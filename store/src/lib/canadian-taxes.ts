export interface CanadianProvince {
  code: string;
  name: string;
}

export const CANADIAN_PROVINCES: CanadianProvince[] = [
  { code: "AB", name: "Alberta" },
  { code: "BC", name: "British Columbia" },
  { code: "MB", name: "Manitoba" },
  { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland and Labrador" },
  { code: "NS", name: "Nova Scotia" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NU", name: "Nunavut" },
  { code: "ON", name: "Ontario" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "QC", name: "Quebec" },
  { code: "SK", name: "Saskatchewan" },
  { code: "YT", name: "Yukon" },
];

interface TaxRate {
  label: string;
  rate: number;
}

const PROVINCE_TAX_RATES: Record<string, TaxRate[]> = {
  AB: [{ label: "GST", rate: 0.05 }],
  BC: [
    { label: "GST", rate: 0.05 },
    { label: "PST", rate: 0.07 },
  ],
  MB: [
    { label: "GST", rate: 0.05 },
    { label: "PST", rate: 0.07 },
  ],
  NB: [{ label: "HST", rate: 0.15 }],
  NL: [{ label: "HST", rate: 0.15 }],
  NS: [{ label: "HST", rate: 0.14 }],
  NT: [{ label: "GST", rate: 0.05 }],
  NU: [{ label: "GST", rate: 0.05 }],
  ON: [{ label: "HST", rate: 0.13 }],
  PE: [{ label: "HST", rate: 0.15 }],
  QC: [
    { label: "GST", rate: 0.05 },
    { label: "QST", rate: 0.09975 },
  ],
  SK: [
    { label: "GST", rate: 0.05 },
    { label: "PST", rate: 0.06 },
  ],
  YT: [{ label: "GST", rate: 0.05 }],
};

export interface CalculatedTaxLine {
  label: string;
  rate: number;
  amount: number;
}

export function calculateCanadianTaxes(
  subtotal: number,
  provinceCode: string,
): CalculatedTaxLine[] {
  const rates = PROVINCE_TAX_RATES[provinceCode];
  if (!rates) return [];

  return rates.map(({ label, rate }) => ({
    label,
    rate,
    amount: roundMoney(subtotal * rate),
  }));
}

export function getTaxTotal(taxes: CalculatedTaxLine[]): number {
  return roundMoney(taxes.reduce((sum, line) => sum + line.amount, 0));
}

export function getOrderTotal(subtotal: number, taxes: CalculatedTaxLine[]): number {
  return roundMoney(subtotal + getTaxTotal(taxes));
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function formatTaxRate(rate: number): string {
  return `${(rate * 100).toFixed(rate === 0.09975 ? 3 : 1).replace(/\.?0+$/, "")}%`;
}
