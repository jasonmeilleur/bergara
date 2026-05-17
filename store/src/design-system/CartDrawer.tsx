import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice, getProductBySlug } from "../lib/catalog";
import { getProductImageUrl } from "../lib/product-images";
import { buildProductPathFromKeys } from "../lib/product-url";
import { formatCartLineOptions } from "../lib/cart";
import { Button } from "./Button";
import { PaymentOptions } from "./PaymentOptions";

export function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    isOpen,
    closeCart,
    removeItem,
    setQuantity,
    clearCart,
  } = useCart();

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/20 backdrop-blur-sm"
        aria-label="Close cart"
        onClick={closeCart}
      />

      <aside className="absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-surface-raised ring-1 ring-border">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 id="cart-drawer-title" className="text-lg font-semibold text-ink">
            Cart ({itemCount})
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-md p-2 text-ink-muted hover:bg-surface-muted hover:text-ink"
            aria-label="Close cart"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 text-center">
            <p className="text-pretty text-ink-muted">Your cart is empty.</p>
            <Button variant="secondary" onClick={closeCart}>
              Continue shopping
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-4 py-3">
              {items.map((item) => {
                const product = getProductBySlug(item.productSlug);
                const options = formatCartLineOptions(item, product);
                const imageUrl = getProductImageUrl(item.productSlug);

                return (
                  <li
                    key={item.lineId}
                    className="border-b border-border py-3 first:pt-0 last:border-b-0"
                  >
                    <div className="flex gap-4">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-surface-muted ring-1 ring-border">
                        {imageUrl && product ? (
                          <img
                            src={imageUrl}
                            alt={item.productName}
                            className="h-full w-full object-contain object-center p-1"
                          />
                        ) : (
                          <div
                            aria-hidden
                            className="h-full w-full bg-surface-muted"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          to={buildProductPathFromKeys(
                            item.productSlug,
                            item.variantUrlKey,
                          )}
                          onClick={closeCart}
                          className="font-medium text-ink hover:text-link"
                        >
                          {item.productName}
                        </Link>
                        {options && (
                          <p className="mt-1 text-sm text-ink-muted">{options}</p>
                        )}
                        <p className="mt-1 text-sm text-ink-subtle">Product Code {item.sku}</p>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() =>
                                setQuantity(item.lineId, item.quantity - 1)
                              }
                              className="flex size-8 items-center justify-center rounded-md ring-1 ring-border text-ink hover:bg-surface-muted"
                            >
                              −
                            </button>
                            <span className="min-w-6 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() =>
                                setQuantity(item.lineId, item.quantity + 1)
                              }
                              className="flex size-8 items-center justify-center rounded-md ring-1 ring-border text-ink hover:bg-surface-muted"
                            >
                              +
                            </button>
                          </div>
                          <p className="text-sm font-medium text-ink">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.lineId)}
                          className="mt-2 text-sm text-ink-muted hover:text-ink"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-border px-4 py-4">
              <PaymentOptions compact />
              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="text-ink-muted">Subtotal</span>
                <span className="text-lg font-medium text-ink">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <Link to="/checkout" onClick={closeCart} className="mt-4 block">
                <Button className="w-full">Checkout</Button>
              </Link>
              <p className="mt-2 text-center text-sm text-ink-subtle">
                Demo checkout — no payment processed.
              </p>
              <button
                type="button"
                onClick={clearCart}
                className="mt-4 w-full text-sm text-ink-muted hover:text-ink"
              >
                Clear cart
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
