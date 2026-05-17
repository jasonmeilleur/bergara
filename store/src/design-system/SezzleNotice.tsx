import { formatPrice } from "../lib/catalog";

interface SezzleNoticeProps {
  price: number;
}

export function SezzleNotice({ price }: SezzleNoticeProps) {
  const installment = price / 4;

  return (
    <div className="mt-3 rounded-md bg-[#382757]/5 px-3 py-2 ring-1 ring-[#382757]/15">
      <p className="text-sm text-ink">
        <span className="font-semibold text-[#382757]">Sezzle</span>
        {" — "}
        Pay in 4 interest-free payments of{" "}
        <span className="font-medium">{formatPrice(installment)}</span>
      </p>
      <p className="mt-1.5 text-xs text-ink-subtle">
        Select Sezzle at checkout. Demo messaging only — subject to approval.
      </p>
    </div>
  );
}
