import { Link } from "react-router-dom";

import { catalog, categoryPath, STORE_CATEGORIES } from "../lib/catalog";

import { Container } from "../design-system/Container";

import { ProductCard } from "../design-system/ProductCard";

import {

  heroTitle,

  productGridWide,

  sectionHeading,

} from "../design-system/layout";



const featured = catalog.products.slice(0, 4);



export function HomePage() {

  return (

    <>

      <section className="border-b border-border bg-surface">

        <Container className="py-12 sm:py-16">

          <p className="font-mono text-xs tracking-wide text-ink-subtle uppercase">

            Precision rimfire

          </p>

          <h1 className={`mt-2 max-w-[18ch] ${heroTitle}`}>

            Built for repeatable accuracy

          </h1>

          <p className="mt-3 max-w-[50ch] text-pretty text-sm text-ink-muted sm:text-base">

            Bergara rifles, magazines, and accessories — configured by caliber,

            handedness, and platform so you get exactly what fits your setup.

          </p>

          <div className="mt-6 flex flex-wrap gap-2">

            <Link

              to={categoryPath("rifles")}

              className="inline-flex items-center justify-center rounded-md bg-accent px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"

            >

              Shop rifles

            </Link>

            <Link

              to={categoryPath("magazines")}

              className="inline-flex items-center justify-center rounded-md bg-surface-muted px-3 py-2 text-sm font-medium text-ink ring-1 ring-border transition-colors hover:bg-surface-raised"

            >

              View magazines

            </Link>

          </div>

        </Container>

      </section>



      <section className="border-b border-border py-10">

        <Container>

          <h2 className="text-xs font-medium tracking-wide text-ink-subtle uppercase">

            Shop by category

          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">

            {STORE_CATEGORIES.map((cat) => (

              <Link

                key={cat.id}

                to={categoryPath(cat.id)}

                className="group rounded-lg bg-surface-raised p-4 ring-1 ring-border"

              >

                <h3 className="font-display text-2xl font-semibold tracking-tight text-ink group-hover:text-link">

                  {cat.name}

                </h3>

                <p className="mt-1.5 text-pretty text-sm text-ink-muted">

                  {cat.description}

                </p>

                <span className="mt-3 inline-block text-sm font-medium text-link">

                  Browse →

                </span>

              </Link>

            ))}

          </div>

        </Container>

      </section>



      <section className="py-10">

        <Container>

          <div>

            <h2 className={sectionHeading}>Featured products</h2>

            <p className="mt-1.5 text-pretty text-sm text-ink-muted">

              Popular configurations from the current catalog.

            </p>

          </div>

          <div className={`${productGridWide} mt-6`}>

            {featured.map((product) => (

              <ProductCard key={product.slug} product={product} />

            ))}

          </div>

        </Container>

      </section>

    </>

  );

}

