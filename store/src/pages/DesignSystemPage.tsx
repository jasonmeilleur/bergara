import { Badge } from "../design-system/Badge";
import { Button } from "../design-system/Button";
import { Container } from "../design-system/Container";

const swatches = [
  { name: "Ink", className: "bg-ink" },
  { name: "Ink muted", className: "bg-ink-muted" },
  { name: "Surface", className: "bg-surface ring-1 ring-border" },
  { name: "Surface raised", className: "bg-surface-raised ring-1 ring-border" },
  { name: "Accent", className: "bg-accent" },
  { name: "Forest", className: "bg-forest" },
  { name: "Hero", className: "bg-hero" },
];

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
          Tokens, typography, and components used across the storefront.
        </p>
      </header>

      <section className="mt-16">
        <h2 className="text-lg font-semibold text-ink">Typography</h2>
        <div className="mt-6 space-y-6 rounded-lg bg-surface-raised p-6 ring-1 ring-border">
          <div>
            <p className="text-sm text-ink-muted">Display — Rubik</p>
            <p className="font-display text-5xl font-semibold tracking-tight">Bergara</p>
          </div>
          <div>
            <p className="text-sm text-ink-muted">Body — Rubik</p>
            <p className="text-base text-pretty">
              Precision rimfire rifles engineered for consistency at the bench
              and in the field.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-lg font-semibold text-ink">Color</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {swatches.map((s) => (
            <div key={s.name}>
              <div className={`h-16 rounded-md ${s.className}`} />
              <p className="mt-2 text-sm text-ink-muted">{s.name}</p>
            </div>
          ))}
        </div>
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
        </div>
      </section>
    </Container>
  );
}
