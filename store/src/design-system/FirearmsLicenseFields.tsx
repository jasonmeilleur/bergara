const inputClass =
  "mt-1 w-full rounded-md bg-surface-raised px-3 py-2.5 text-sm text-ink ring-1 ring-border placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-accent";

export function FirearmsLicenseFields() {
  return (
    <section>
      <h2 className="text-lg font-semibold text-ink">Firearms license</h2>
      <p className="mt-2 text-pretty text-sm text-ink-muted">
        Your cart includes a rifle. A valid firearms license is required to
        complete this order.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-ink-muted sm:col-span-2">
          License number
          <input
            type="text"
            name="firearmsLicenseNumber"
            required
            className={inputClass}
            placeholder="Enter license number"
          />
        </label>
        <label className="block text-sm text-ink-muted">
          Issuing state / province
          <input
            type="text"
            name="firearmsLicenseJurisdiction"
            required
            className={inputClass}
            placeholder="e.g. Ontario"
          />
        </label>
        <label className="block text-sm text-ink-muted">
          Expiration date
          <input
            type="date"
            name="firearmsLicenseExpiry"
            required
            className={inputClass}
          />
        </label>
        <label className="flex items-start gap-3 text-sm text-ink-muted sm:col-span-2">
          <input
            type="checkbox"
            name="firearmsLicenseConfirm"
            required
            className="mt-1 size-4 shrink-0 rounded border-border accent-ink"
          />
          <span className="text-pretty">
            I confirm I am legally permitted to purchase firearms, my license is
            valid and not expired, and the information provided is accurate.
          </span>
        </label>
      </div>
    </section>
  );
}
