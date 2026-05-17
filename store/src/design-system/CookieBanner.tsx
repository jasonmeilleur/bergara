import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { acceptCookies, hasAcceptedCookies } from "../lib/cookies";
import { Button } from "./Button";
import { Container } from "./Container";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasAcceptedCookies()) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const handleAccept = () => {
    acceptCookies();
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur-sm"
    >
      <Container className="py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0 flex-1">
            <p
              id="cookie-banner-title"
              className="text-sm font-medium text-ink"
            >
              Cookie notice
            </p>
            <p
              id="cookie-banner-description"
              className="mt-1 text-pretty text-sm text-ink-muted"
            >
              We use cookies to remember your cart, account, and preferences on
              this demo store. See our{" "}
              <Link to="/faq" className="text-link hover:text-link-hover hover:underline">
                FAQ
              </Link>{" "}
              for more about how this site works.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            className="shrink-0 sm:w-auto"
            onClick={handleAccept}
          >
            Accept
          </Button>
        </div>
      </Container>
    </div>
  );
}
