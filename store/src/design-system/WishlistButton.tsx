import { buildWishlistItem } from "../lib/wishlist";
import type { Product, Variant } from "../lib/types";
import { useWishlist } from "../context/WishlistContext";
import { Button } from "./Button";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M12 21s-7-4.35-9.5-8.5C.5 9 2.5 5 6.5 5c2 0 3.5 1.5 5.5 4 2-2.5 3.5-4 5.5-4 4 0 6 4 4.5 7.5C19 16.65 12 21 12 21z" />
    </svg>
  );
}

interface WishlistButtonProps {
  product: Product;
  variant: Variant;
  className?: string;
  iconOnly?: boolean;
}

export function WishlistButton({
  product,
  variant,
  className = "",
  iconOnly = false,
}: WishlistButtonProps) {
  const { isInWishlist, toggleItem } = useWishlist();
  const lineId = buildWishlistItem(product, variant).lineId;
  const saved = isInWishlist(lineId);

  if (iconOnly) {
    return (
      <button
        type="button"
        aria-pressed={saved}
        aria-label={saved ? "Remove from wish list" : "Add to wish list"}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          toggleItem({ product, variant });
        }}
        className={`rounded-full bg-surface/90 p-2 text-ink ring-1 ring-border backdrop-blur-sm transition-colors hover:bg-surface hover:text-accent ${className}`}
      >
        <HeartIcon filled={saved} />
      </button>
    );
  }

  return (
    <Button
      type="button"
      variant="secondary"
      aria-pressed={saved}
      className={className}
      onClick={() => toggleItem({ product, variant })}
    >
      <span className="inline-flex items-center gap-2">
        <HeartIcon filled={saved} />
        {saved ? "Saved" : "Save to wish list"}
      </span>
    </Button>
  );
}
