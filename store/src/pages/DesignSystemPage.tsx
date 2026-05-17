import { Badge } from "../design-system/Badge";
import { Button } from "../design-system/Button";
import { Container } from "../design-system/Container";
import {
  NON_COMPLIANT_REFERENCE,
  SEMANTIC_CONTRAST_PAIRS,
} from "../lib/a11y-colors";

const swatches = [
  { name: "Ink", token: "ink", className: "bg-ink" },
  { name: "Ink muted", token: "ink-muted", className: "bg-ink-muted" },
  { name: "Ink subtle", token: "ink-subtle", className: "bg-ink-subtle" },
  { name: "Surface", token: "surface", className: "bg-surface ring-1 ring-border" },
  {
    name: "Surface muted",
    token: "surface-muted",
    className: "bg-surface-muted ring-1 ring-border",
  },
  { name: "Accent", token: "accent", className: "bg-accent" },
  { name: "Link", token: "link", className: "bg-link" },
  { name: "Link brand", token: "link-brand", className: "bg-link-brand" },
  { name: "Forest", token: "forest", className: "bg-forest" },
  { name: "Hero", token: "hero", className: "bg-hero" },
];

function ContrastTable({
  title,
  pairs,
}: {
  title: string;
  pairs: typeof SEMANTIC_CONTRAST_PAIRS;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <div className="mt-3 overflow-x-auto rounded-lg ring-1 ring-border">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead className="bg-surface-muted text-ink-muted">
            <tr>
              <th className="px-3 py-2 font-medium">Use</th>
              <th className="px-3 py-2 font-medium">Ratio</th>
              <th className="px-3 py-2 font-medium">AA normal</th>
              <th className="px-3 py-2 font-medium">AA large</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pairs.map((row) => (
              <tr key={row.usage}>
                <td className="px-3 py-2 text-ink">{row.usage}</td>
                <td className="px-3 py-2 font-mono text-ink-muted">
                  {row.ratio}:1
                </td>
                <td className="px-3 py-2">
                  <span
                    className={
                      row.aaNormal ? "text-ink" : "font-medium text-amber-900"
                    }
                  >
                    {row.aaNormal ? "Pass" : "Fail"}
                  </span>
                </td>
                <td className="px-3 py-2">
                  {row.aaLarge ? "Pass" : "Fail"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function DesignSystemPage() {
  return (
    <Container className="py-12 sm:py-16">
      <header className="max-w-[50ch]">
        <p className="font-mono text-sm tracking-wide text-ink-subtle uppercase">
          Foundation
        </p>
        <h1 className="mt-2 font-display text-5xl font-semibold tracking-tight text-balance text-ink sm:text-6xl">
          Bergara design system
        </h1>
        <p className="mt-4 text-pretty text-ink-muted">
          Tokens, typography, components, and WCAG 2.2 color contrast for the
          storefront.
        </p>
      </header>

      <section className="mt-16">
        <h2 className="text-lg font-semibold text-ink">Typography</h2>
        <div className="mt-6 space-y-6 rounded-lg bg-surface-raised p-6 ring-1 ring-border">
          <div>
            <p className="text-sm text-ink-muted">Display — Rubik</p>
            <p className="font-display text-5xl font-semibold tracking-tight text-ink">
              Bergara
            </p>
          </div>
          <div>
            <p className="text-sm text-ink-muted">Body — Rubik</p>
            <p className="text-base text-pretty text-ink">
              Precision rimfire rifles engineered for consistency at the bench
              and in the field.
            </p>
          </div>
          <div>
            <p className="text-sm text-ink-subtle">Caption — ink subtle</p>
            <p className="text-xs text-ink-subtle">
              Product codes, filter counts, and helper text use ink subtle.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-lg font-semibold text-ink">Color</h2>
        <p className="mt-2 max-w-[60ch] text-pretty text-sm text-ink-muted">
          Semantic tokens are tuned for WCAG 2.2 Level AA (4.5:1 normal text,
          3:1 UI boundaries and large text). Link text uses dark gold on white;
          brand gold
          (<code className="text-ink">#ffc52c</code>) is underline decoration
          only.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {swatches.map((s) => (
            <div key={s.name}>
              <div className={`h-16 rounded-md ${s.className}`} />
              <p className="mt-2 text-sm font-medium text-ink">{s.name}</p>
              <p className="font-mono text-xs text-ink-subtle">{s.token}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 space-y-8">
        <h2 className="text-lg font-semibold text-ink">Accessibility — contrast</h2>
        <ContrastTable title="Semantic pairs (in use)" pairs={SEMANTIC_CONTRAST_PAIRS} />
        <ContrastTable
          title="Reference — not for body text on white"
          pairs={NON_COMPLIANT_REFERENCE}
        />
        <p className="max-w-[60ch] text-pretty text-sm text-ink-muted">
          Links are underlined so color is not the only cue (WCAG 1.4.1). Focus
          states use visible outlines on buttons and form fields.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="text-lg font-semibold text-ink">Buttons</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button size="sm">Small</Button>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-lg font-semibold text-ink">Badges</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          <Badge>B-14R</Badge>
          <Badge tone="accent">Series</Badge>
          <Badge tone="warn">Backordered</Badge>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-lg font-semibold text-ink">Links</h2>
        <p className="mt-4 text-pretty text-ink">
          <a href="/rifles">Shop rifles</a> — accessible link with underline.
        </p>
      </section>
    </Container>
  );
}
