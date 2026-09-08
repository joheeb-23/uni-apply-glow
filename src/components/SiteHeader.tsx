import { useState } from "react";
import { navLinks, university } from "@/data/portal";
import { Button } from "@/components/ui/primitives";

export function SiteHeader({ onLogin, onApply }: { onLogin: () => void; onApply: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="glass edge sticky top-0 z-30 border-b border-white/40">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 lg:px-8">
        <a href="#home" className="flex min-w-0 items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary font-display text-lg font-bold text-primary-foreground shadow-[var(--shadow-brand)]">
            {university.short}
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-display text-[15px] font-bold uppercase">
              {university.name}
            </span>
            <span className="block truncate text-[11px] text-foreground/50">
              {university.tagline}
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 text-sm font-medium text-foreground/70 lg:flex">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="transition hover:text-primary">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Button variant="ghost" className="hidden px-4 py-2 sm:inline-flex" onClick={onLogin}>
            Login
          </Button>
          <Button className="px-4 py-2 rounded-lg" onClick={onApply}>
            Apply Now
          </Button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm font-semibold text-foreground/70 lg:hidden"
          >
            ☰
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/40 px-5 pb-4 lg:hidden">
          <ul className="grid gap-1 pt-3 text-sm font-medium text-foreground/70">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-2 transition hover:bg-white/60 hover:text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
