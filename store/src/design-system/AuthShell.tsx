import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "./Breadcrumbs";
import { Container } from "./Container";
import { pagePadding, pageTitle, stackAfterBreadcrumb } from "./layout";

interface AuthShellProps {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthShell({ title, description, children, footer }: AuthShellProps) {
  return (
    <Container className={pagePadding}>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Account", path: "/account" },
          { name: title },
        ]}
      />

      <div className={`mx-auto max-w-md ${stackAfterBreadcrumb}`}>
        <header>
          <h1 className={pageTitle}>{title}</h1>
          <p className="mt-2 text-pretty text-sm text-ink-muted">{description}</p>
        </header>

        <div className="mt-6 rounded-lg bg-surface-raised p-5 ring-1 ring-border">
          {children}
        </div>

        <p className="mt-4 text-center text-sm text-ink-muted">{footer}</p>
      </div>
    </Container>
  );
}

interface AuthSwitchLinkProps {
  prompt: string;
  linkLabel: string;
  to: string;
}

export function AuthSwitchLink({ prompt, linkLabel, to }: AuthSwitchLinkProps) {
  return (
    <>
      {prompt}{" "}
      <Link to={to} className="font-medium text-link hover:text-link-hover hover:underline">
        {linkLabel}
      </Link>
    </>
  );
}
