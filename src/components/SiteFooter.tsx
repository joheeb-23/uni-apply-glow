import { Link } from "@tanstack/react-router";
import { university } from "@/data/portal";

const quickLinks = [
  { label: "Verify Candidate", to: "/verify" as const },
  { label: "Eligibility", to: "/eligibility" as const },
  { label: "Programmes", to: "/" as const },
];
const portalLinks = [
  { label: "Home", to: "/" as const },
  { label: "Help Centre", to: "/" as const },
  { label: "Privacy", to: "/" as const },
];

export function SiteFooter() {
  return (
    <footer className="glass edge relative border-t border-white/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex min-w-0 items-center gap-2">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary font-display font-bold text-primary-foreground">
              {university.short}
            </span>
            <p className="truncate font-display text-sm font-bold uppercase">{university.name}</p>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-foreground/50">{university.blurb}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground/40">
            Quick Links
          </p>
          <ul className="mt-3 space-y-2 text-sm text-foreground/60">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link className="transition hover:text-primary" to={l.to}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground/40">
            Contact
          </p>
          <ul className="mt-3 space-y-2 text-sm text-foreground/60">
            <li>{university.address}</li>
            <li>{university.phone}</li>
            <li>{university.email}</li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground/40">
            Portal
          </p>
          <ul className="mt-3 space-y-2 text-sm text-foreground/60">
            {portalLinks.map((l) => (
              <li key={l.label}>
                <Link className="transition hover:text-primary" to={l.to}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/40">
        <p className="mx-auto max-w-7xl px-5 py-4 text-center text-xs text-foreground/40 lg:px-8">
          © 2025 {university.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
