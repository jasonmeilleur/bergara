import { Link } from "react-router-dom";
import { categoryPath } from "../lib/catalog";
import { Button } from "../design-system/Button";
import { Container } from "../design-system/Container";
import { pageTitle } from "../design-system/layout";

export function NotFoundPage() {
  return (
    <Container className="py-16 sm:py-20">
      <div className="mx-auto max-w-lg text-center">
        <p className="font-mono text-xs tracking-wide text-ink-subtle uppercase">
          404
        </p>
        <h1 className={`mt-3 ${pageTitle}`}>Page not found</h1>
        <p className="mt-3 text-pretty text-sm text-ink-muted">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
          <Link to="/">
            <Button>Back to home</Button>
          </Link>
          <Link to={categoryPath("rifles")}>
            <Button variant="secondary">Shop rifles</Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
