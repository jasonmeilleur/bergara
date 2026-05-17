import { useState, type FormEvent } from "react";
import { subscribeNewsletter } from "../lib/newsletter";
import { Button } from "./Button";
import { inputClass } from "./forms";

export function NewsletterSignup() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const message = subscribeNewsletter(email);

    if (message) {
      setError(message);
      return;
    }

    setSubmitted(true);
    event.currentTarget.reset();
  };

  if (submitted) {
    return (
      <section className="max-w-sm" aria-live="polite">
        <h2 className="text-sm font-medium uppercase tracking-wide text-ink">
          Newsletter
        </h2>
        <p className="mt-3 text-pretty text-sm text-ink-muted">
          You are subscribed. This demo store does not send real emails.
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-sm">
      <h2 className="text-sm font-medium uppercase tracking-wide text-ink">
        Newsletter
      </h2>
      <p className="mt-2 text-pretty text-sm text-ink-muted">
        New rifles, restocks, and Bergara news — straight to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="mt-4">
        {error && (
          <p
            className="mb-3 rounded-sm bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-amber-200"
            role="alert"
          >
            {error}
          </p>
        )}
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor="newsletter-email">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={`${inputClass} mt-0 min-w-0 flex-1`}
          />
          <Button type="submit" className="shrink-0 sm:px-5">
            Subscribe
          </Button>
        </div>
        <p className="mt-3 text-xs text-ink-subtle">
          Demo only — signups are saved in your browser, not sent to a server.
        </p>
      </form>
    </section>
  );
}
