import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { categoryPath } from "../lib/catalog";
import { Container } from "./Container";
import { LogoLink } from "./Logo";
import { SearchBox } from "./SearchBox";

const navItems = [
  { to: categoryPath("rifles"), label: "Rifles" },
  { to: categoryPath("magazines"), label: "Magazines" },
  { to: categoryPath("accessories"), label: "Accessories" },
];

function navClass({ isActive }: { isActive: boolean }) {
  return `rounded-md px-2.5 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors ${
    isActive
      ? "bg-surface-muted text-ink"
      : "text-ink-muted hover:bg-surface-muted hover:text-ink"
  }`;
}

function AccountIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
    </svg>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { itemCount, openCart } = useCart();
  const { user } = useAuth();
  const accountPath = user ? "/account" : "/account/login";

  const closeMobile = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-sm">
      <Container>
        <div className="flex h-14 items-center gap-3">
          <LogoLink onClick={closeMobile} heightClass="h-8" />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <SearchBox
            className="hidden min-w-0 flex-1 md:block md:max-w-xs lg:max-w-sm"
            onSubmit={closeMobile}
          />

          <div className="ml-auto flex items-center gap-1">
            <Link
              to={accountPath}
              className="hidden items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-ink hover:bg-surface-muted sm:inline-flex"
              onClick={closeMobile}
            >
              <AccountIcon />
              <span>{user ? user.firstName : "Account"}</span>
            </Link>
            <Link
              to={accountPath}
              className="rounded-md p-2 text-ink hover:bg-surface-muted sm:hidden"
              aria-label={user ? "Account" : "Sign in"}
              onClick={closeMobile}
            >
              <AccountIcon />
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="relative rounded-md p-2 text-ink hover:bg-surface-muted"
              aria-label={`Open cart, ${itemCount} items`}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden
              >
                <path d="M6 6h15l-1.5 9H7.5L6 6zM6 6 5 3H2M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-white">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className="relative rounded-md p-2 text-ink lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">Menu</span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                {open ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <nav
            id="mobile-nav"
            className="border-t border-border py-3 lg:hidden"
            aria-label="Mobile"
          >
            <SearchBox className="mb-3" onSubmit={closeMobile} />
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={navClass}
                    onClick={closeMobile}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <NavLink
                  to={accountPath}
                  className={navClass}
                  onClick={closeMobile}
                >
                  {user ? "My account" : "Sign in"}
                </NavLink>
              </li>
            </ul>
          </nav>
        )}
      </Container>
    </header>
  );
}
