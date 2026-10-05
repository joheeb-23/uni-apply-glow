import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Modal } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const items: { label: string; icon: string; to?: "/admin" | "/" }[] = [
  { label: "Dashboard", icon: "▤", to: "/admin" },
  { label: "Candidates", icon: "◍", to: "/admin" },
  { label: "Applications", icon: "▦" },
  { label: "Documents", icon: "❐" },
  { label: "Screening", icon: "✎" },
  { label: "Admission", icon: "★" },
  { label: "Reports", icon: "▥" },
  { label: "Notifications", icon: "◎" },
  { label: "Profile", icon: "☺" },
  { label: "Logout", icon: "⏻", to: "/" },
];

export function AdminShell({ active, title, children }: { active: string; title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [demo, setDemo] = useState<string | null>(null);

  const nav = (
    <nav className="space-y-1">
      {items.map((it) => {
        const cls = cn(
          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition",
          it.label === active ? "bg-primary text-primary-foreground shadow-[var(--shadow-brand)]" : "text-foreground/60 hover:bg-white/60 hover:text-primary",
        );
        const inner = (<><span className="grid size-6 shrink-0 place-items-center text-xs">{it.icon}</span>{it.label}</>);
        return it.to ? (
          <Link key={it.label} to={it.to} className={cls} onClick={() => setOpen(false)}>{inner}</Link>
        ) : (
          <button key={it.label} type="button" className={cls} onClick={() => { setOpen(false); setDemo(it.label); }}>{inner}</button>
        );
      })}
    </nav>
  );

  return (
    <div className="relative min-h-screen text-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-24 size-[42rem] rounded-full bg-primary/15 blur-[120px]" />
      </div>
      <div className="flex">
        <aside className={cn("glass edge fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto p-5 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
          <div className="mb-6 flex items-center gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary font-display font-bold text-primary-foreground">NU</div>
            <div className="min-w-0">
              <p className="truncate font-display font-bold">Northbridge</p>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">Admissions Office</p>
            </div>
          </div>
          {nav}
        </aside>
        {open && <button aria-label="Close menu" className="fixed inset-0 z-30 bg-foreground/30 lg:hidden" onClick={() => setOpen(false)} />}
        <div className="min-w-0 flex-1">
          <header className="glass sticky top-0 z-20 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-white/40 px-5 py-4 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button aria-label="Open menu" className="rounded-lg px-2 py-1 text-lg lg:hidden" onClick={() => setOpen(true)}>☰</button>
              <h1 className="truncate text-lg font-bold tracking-tight sm:text-xl">{title}</h1>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="hidden text-right sm:block">
                <span className="block text-sm font-semibold">Mrs. A. Bakare</span>
                <span className="block text-xs text-foreground/50">ICT / Admission Officer</span>
              </span>
              <div className="grid size-9 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">AB</div>
            </div>
          </header>
          <main className="p-5 lg:p-8">{children}</main>
        </div>
      </div>
      <Modal open={!!demo} title={demo ?? ""} onClose={() => setDemo(null)}>
        The {demo} section is a placeholder in this prototype. Candidate records are managed from the Dashboard table.
      </Modal>
    </div>
  );
}
