import { Link } from "react-router-dom";
import { categoryPath } from "../lib/catalog";
import { Container } from "./Container";
import { LogoLink } from "./Logo";
import { NewsletterSignup } from "./NewsletterSignup";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface text-ink-muted">
      <Container className="py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <LogoLink heightClass="h-8" />
            <p className="mt-2 max-w-sm text-pretty text-sm">
              Precision rimfire rifles and accessories, engineered for repeatable
              accuracy.
            </p>
          </div>
          <NewsletterSignup />
          <nav
            className="flex flex-col gap-2 text-sm font-medium uppercase tracking-wide"
            aria-label="Footer"
          >
            <Link to={categoryPath("rifles")} className="text-link hover:text-link-hover">
              Rifles
            </Link>
            <Link to={categoryPath("magazines")} className="text-link hover:text-link-hover">
              Magazines
            </Link>
            <Link to={categoryPath("accessories")} className="text-link hover:text-link-hover">
              Accessories
            </Link>
            <Link to="/wishlist" className="text-link hover:text-link-hover">
              Wish list
            </Link>
            <Link to="/account/login" className="text-link hover:text-link-hover">
              Account
            </Link>
            <Link to="/faq" className="text-link hover:text-link-hover">
              FAQ
            </Link>
            <Link to="/sitemap" className="text-link hover:text-link-hover">
              Sitemap
            </Link>
            <Link to="/checkout" className="text-link hover:text-link-hover">
              Checkout
            </Link>
          </nav>
        </div>
        <p className="mt-6 text-sm">
          © {new Date().getFullYear()} Bergara. Demo storefront.
        </p>
      </Container>
    </footer>
  );
}
