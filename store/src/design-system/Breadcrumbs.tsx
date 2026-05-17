import { Link } from "react-router-dom";
import { JsonLd } from "../components/JsonLd";
import { buildBreadcrumbSchema, type BreadcrumbSchemaItem } from "../lib/schema";

interface BreadcrumbsProps {
  items: BreadcrumbSchemaItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(items)} />
      <nav
        className={`text-sm text-ink-muted ${className}`}
        aria-label="Breadcrumb"
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <span key={`${item.name}-${index}`}>
              {index > 0 && <span className="mx-2">/</span>}
              {item.path && !isLast ? (
                <Link to={item.path} className="text-link hover:text-link-hover">
                  {item.name}
                </Link>
              ) : (
                <span className={isLast ? "text-ink" : undefined}>
                  {item.name}
                </span>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}
