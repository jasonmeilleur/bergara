import { Link } from "react-router-dom";
import { useCompareRifles } from "../context/CompareRiflesContext";
import { COMPARE_RIFLES_PATH } from "../lib/compare-rifles";
import { Button } from "./Button";
import { Container } from "./Container";

export function CompareRiflesBar() {
  const { itemCount, maxItems, clearCompare } = useCompareRifles();

  if (itemCount === 0) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 backdrop-blur-sm"
      role="region"
      aria-label="Compare rifles"
    >
      <Container className="flex flex-wrap items-center justify-between gap-3 py-3">
        <p className="text-sm text-ink">
          <span className="font-medium">
            {itemCount} of {maxItems} rifles selected
          </span>
          {itemCount < 2 ? (
            <span className="text-ink-muted"> — select at least 2 to compare</span>
          ) : null}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={clearCompare}>
            Clear
          </Button>
          {itemCount >= 2 ? (
            <Link
              to={COMPARE_RIFLES_PATH}
              className="inline-flex items-center justify-center rounded-md bg-accent px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Compare rifles
            </Link>
          ) : (
            <Button type="button" size="sm" disabled>
              Compare rifles
            </Button>
          )}
        </div>
      </Container>
    </div>
  );
}
