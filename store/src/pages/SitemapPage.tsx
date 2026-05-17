import { Link } from "react-router-dom";
import { Breadcrumbs } from "../design-system/Breadcrumbs";
import { Container } from "../design-system/Container";
import {
  pagePadding,
  pageTitle,
  stackAfterBreadcrumb,
} from "../design-system/layout";
import { getSitemapSections } from "../lib/sitemap";

export function SitemapPage() {
  const sections = getSitemapSections();

  return (
    <Container className={pagePadding}>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Sitemap" },
        ]}
      />

      <header className={`max-w-[50ch] ${stackAfterBreadcrumb}`}>
        <h1 className={pageTitle}>Sitemap</h1>
        <p className="mt-2 text-pretty text-sm text-ink-muted">
          Browse every page and product configuration in the Bergara demo store.
        </p>
      </header>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-base font-semibold text-ink">{section.title}</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {section.links.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-link hover:text-link-hover hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Container>
  );
}
