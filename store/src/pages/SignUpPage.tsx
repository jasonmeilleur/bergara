import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthShell, AuthSwitchLink } from "../design-system/AuthShell";
import { Button } from "../design-system/Button";
import { inputClass, labelClass } from "../design-system/forms";

export function SignUpPage() {
  const { isAuthenticated, signUp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const firstName = String(form.get("firstName") ?? "");
    const lastName = String(form.get("lastName") ?? "");
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const message = signUp({ firstName, lastName, email, password });
    if (message) {
      setError(message);
      return;
    }

    navigate("/account", { replace: true });
  };

  return (
    <AuthShell
      title="Create account"
      description="Register for a demo Bergara account. No email verification required."
      footer={
        <AuthSwitchLink
          prompt="Already have an account?"
          linkLabel="Sign in"
          to="/account/login"
        />
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <p
            className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-amber-200"
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            First name
            <input
              type="text"
              name="firstName"
              required
              autoComplete="given-name"
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Last name
            <input
              type="text"
              name="lastName"
              required
              autoComplete="family-name"
              className={inputClass}
            />
          </label>
        </div>

        <label className={labelClass}>
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

        <label className={labelClass}>
          Password
          <input
            type="password"
            name="password"
            required
            autoComplete="new-password"
            minLength={8}
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          Confirm password
          <input
            type="password"
            name="confirmPassword"
            required
            autoComplete="new-password"
            minLength={8}
            className={inputClass}
          />
        </label>

        <label className="flex items-start gap-2 text-sm text-ink-muted">
          <input
            type="checkbox"
            name="terms"
            required
            className="mt-1 size-4 rounded border-border text-accent focus:ring-accent"
          />
          <span>
            I agree to the{" "}
            <Link to="/faq" className="text-link hover:text-link-hover hover:underline">
              terms of use
            </Link>{" "}
            for this demo store.
          </span>
        </label>

        <Button type="submit" className="mt-2 w-full">
          Create account
        </Button>
      </form>

      <p className="mt-4 text-pretty text-xs text-ink-subtle">
        Demo storefront — account data stays in your browser and is not sent to a
        server.
      </p>
    </AuthShell>
  );
}
