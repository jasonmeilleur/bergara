import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthShell, AuthSwitchLink } from "../design-system/AuthShell";
import { Button } from "../design-system/Button";
import { inputClass, labelClass } from "../design-system/forms";

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  const redirectTo =
    (location.state as { from?: string } | null)?.from ?? "/account";

  if (isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    const message = login(email, password);
    if (message) {
      setError(message);
      return;
    }

    navigate(redirectTo, { replace: true });
  };

  return (
    <AuthShell
      title="Sign in"
      description="Access your Bergara account to track demo orders and saved details."
      footer={
        <AuthSwitchLink
          prompt="New here?"
          linkLabel="Create an account"
          to="/account/sign-up"
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
            autoComplete="current-password"
            minLength={8}
            className={inputClass}
          />
        </label>

        <Button type="submit" className="mt-2 w-full">
          Sign in
        </Button>
      </form>

      <p className="mt-4 text-pretty text-xs text-ink-subtle">
        Demo storefront — credentials are stored locally in your browser only.
      </p>
    </AuthShell>
  );
}
