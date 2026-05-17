import { Container } from "../design-system/Container";
import { pageTitle } from "../design-system/layout";

const faqs = [
  {
    question: "How do I choose the right caliber?",
    answer:
      "Match caliber to your intended use. 22 LR is ideal for practice and small game. 17 HMR offers a flatter trajectory at longer rimfire distances. 22 WMR bridges the two with more energy. Each rifle page lists available calibers for that model.",
  },
  {
    question: "Are left-handed models available?",
    answer:
      "Select rifles are offered in left-hand configurations. On category pages, look for the Left Hand Available badge on the product image, then choose Left under Handedness on the product page.",
  },
  {
    question: "Are magazines interchangeable between platforms?",
    answer:
      "Magazines are platform-specific. B-14R rifles use AICS-pattern magazines. BMR and BXR platforms use their own factory magazines listed under Magazines in the shop.",
  },
  {
    question: "What is included with a rifle purchase?",
    answer:
      "Configuration varies by model. Product specifications on each detail page list magazine type, capacity, barrel length, twist rate, and weight for the variant you select.",
  },
  {
    question: "Do you ship firearms directly to my door?",
    answer:
      "This is a demo storefront. In a live environment, firearms must ship to a licensed FFL dealer. Ammunition and accessory rules vary by jurisdiction.",
  },
  {
    question: "What is your return policy?",
    answer:
      "This demo site does not process real orders. A production Bergara dealer network would define warranty and return terms at the point of purchase.",
  },
  {
    question: "How can I find an authorized dealer?",
    answer:
      "Visit bergarausa.com for dealer locator and product support resources outside this demo experience.",
  },
];

export function FaqPage() {
  return (
    <Container className="py-10 sm:py-12">
      <header className="max-w-[50ch]">
        <p className="font-mono text-xs tracking-wide text-ink-subtle uppercase">
          Support
        </p>
        <h1 className={`mt-1.5 ${pageTitle}`}>Frequently asked questions</h1>
        <p className="mt-2 text-pretty text-sm text-ink-muted">
          Answers about calibers, configurations, and how this demo store works.
        </p>
      </header>

      <div className="mt-8 max-w-3xl divide-y divide-border rounded-lg ring-1 ring-border">
        {faqs.map((faq) => (
          <details key={faq.question} className="group px-4 py-3">
            <summary className="cursor-pointer list-none text-pretty font-medium text-ink marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-4">
                {faq.question}
                <span
                  aria-hidden
                  className="shrink-0 text-ink-muted transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 text-pretty text-sm text-ink-muted">{faq.answer}</p>
          </details>
        ))}
      </div>
    </Container>
  );
}
