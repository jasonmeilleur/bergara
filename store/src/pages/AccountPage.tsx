import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Breadcrumbs } from "../design-system/Breadcrumbs";
import { Button } from "../design-system/Button";
import { Container } from "../design-system/Container";
import {
  pagePadding,
  pageTitle,
  sectionSpacing,
  stackAfterBreadcrumb,
} from "../design-system/layout";
import { categoryPath } from "../lib/catalog";

export function AccountPage() {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/account/login" replace />;
  }

  return (
    <Container className={pagePadding}>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Account" },
        ]}
      />

      <header className={`max-w-[50ch] ${stackAfterBreadcrumb}`}>
        <p className="font-mono text-xs tracking-wide text-ink-subtle uppercase">
          Account
        </p>
        <h1 className={`mt-1.5 ${pageTitle}`}>Hello, {user.firstName}</h1>
        <p className="mt-2 text-pretty text-sm text-ink-muted">
          You are signed in to this demo Bergara storefront.
        </p>
      </header>

      <section className={`${sectionSpacing} grid gap-4 lg:grid-cols-2`}>
        <article className="rounded-lg bg-surface-raised p-4 ring-1 ring-border">
          <h2 className="text-base font-semibold text-ink">Profile</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">Name</dt>
              <dd className="font-medium text-ink">
                {user.firstName} {user.lastName}
              </dd>
            </div>
            <p className="flex justify-between gap-4">
              <span className="text-ink-muted">Email</span>
              <span className="font-medium text-ink">{user.email}</span>
            </p>
          </dl>
        </article>

        <article className="rounded-lg bg-surface-muted p-4 ring-1 ring-border">
          <h2 className="text-base font-semibold text-ink">Orders</h2>
          <p className="mt-3 text-pretty text-sm text-ink-muted">
            Order history is not available in this demo. Complete a checkout to
            see the thank-you flow.
          </p>
          <Link to="/checkout" className="mt-4 inline-block">
            <Button variant="secondary" size="sm">
              Go to checkout
            </Button>
          </Link>
        </article>
      </section>

      <footer className={`${sectionSpacing} flex flex-wrap gap-2`}>
        <Button variant="secondary" onClick={logout}>
          Sign out
        </Button>
        <Link to={categoryPath("rifles")}>
          <Button>Continue shopping</Button>
        </Link>
      </footer>
    </Container>
  );
}
