import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Badge, Modal } from "@/components/ui/primitives";
import { mockCandidate } from "@/data/candidate";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  icon: string;
  to?: "/dashboard" | "/application" | "/payment" | "/verify" | "/eligibility" | "/documents" | "/review" | "/submission" | "/screening-slip" | "/";
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: "▤", to: "/dashboard" },
  { label: "My Application", icon: "▦", to: "/application" },
  { label: "Personal Information", icon: "◍", to: "/application" },
  { label: "Academic Information", icon: "✎", to: "/application" },
  { label: "Documents", icon: "❐", to: "/documents" },
  { label: "Payment", icon: "₦", to: "/payment" },
  { label: "Screening Slip", icon: "🖨", to: "/screening-slip" },
  { label: "Admission Status", icon: "★" },
  { label: "Notifications", icon: "◎" },
  { label: "Profile", icon: "☺" },
  { label: "Logout", icon: "⏻", to: "/" },
];

const notifications = [
  { title: "Payment confirmed", body: "Your ₦5,000 application fee was received." },
  { title: "Documents pending", body: "2 of 5 required documents are still missing." },
  { title: "Screening date announced", body: "Post-UTME screening holds 18 October 2026." },
];

export function DashboardShell({
  active,
  children,
}: {
  active: string;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [demo, setDemo] = useState<string | null>(null);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const candidate = mockCandidate;

  const nav = (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = item.label === active;
        const classes = cn(
          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition",
          isActive
            ? "bg-primary text-primary-foreground shadow-[var(--shadow-brand)]"
            : "text-foreground/60 hover:bg-white/60 hover:text-primary",
        );
        const inner = (
          <>
            <span className="grid size-6 shrink-0 place-items-center text-xs opacity-80">{item.icon}</span>
            <span className="truncate">{item.label}</span>
          </>
        );
        return item.to ? (
          <Link key={item.label} to={item.to} className={classes} onClick={() => setMobileOpen(false)}>
            {inner}
          </Link>
        ) : (
          <button
            key={item.label}
            type="button"
            className={classes}
            onClick={() => {
              setMobileOpen(false);
              setDemo(item.label);
            }}
          >
            {inner}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-8">
        <aside className="glass edge sticky top-6 hidden h-[calc(100vh-3rem)] w-64 shrink-0 flex-col rounded-3xl p-4 lg:flex">
          <Link to="/" className="mb-5 flex items-center gap-3 px-2">
            <span className="grid size-10 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
              NU
            </span>
            <span className="text-sm font-bold leading-tight">
              Northbridge
              <span className="block text-xs font-semibold text-foreground/50">Post-UTME Portal</span>
            </span>
          </Link>
          <div className="flex-1 overflow-y-auto">{nav}</div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="glass edge-sm mb-6 flex items-center justify-between gap-3 rounded-2xl p-4">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                aria-label="Open menu"
                className="rounded-xl border border-white/60 bg-white/60 px-3 py-2 text-sm lg:hidden"
                onClick={() => setMobileOpen(true)}
              >
                ☰
              </button>
              <div className="min-w-0">
                <p className="truncate text-base font-bold tracking-tight sm:text-lg">
                  Welcome, {candidate.fullName.split(" ")[0]} {candidate.fullName.split(" ").slice(-1)}
                </p>
                <p className="truncate text-xs text-foreground/50">
                  JAMB Reg. {candidate.jambReg} · {candidate.programme}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                aria-label="Notifications"
                onClick={() => setShowNotifs(true)}
                className="relative rounded-xl border border-white/60 bg-white/60 px-3 py-2 text-sm transition hover:text-primary"
              >
                ◎
                <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  3
                </span>
              </button>
              <button
                type="button"
                onClick={() => setShowProfile(true)}
                className="flex items-center gap-2 rounded-xl border border-white/60 bg-white/60 py-1.5 pl-1.5 pr-3 text-sm font-semibold transition hover:text-primary"
              >
                <img src={candidate.photo} alt="" className="size-7 rounded-lg object-cover" />
                <span className="hidden sm:inline">Profile</span>
              </button>
            </div>
          </header>

          {children}
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="flex-1 bg-foreground/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="glass w-72 overflow-y-auto p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-bold">Menu</span>
              <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="px-2 text-foreground/50">
                ✕
              </button>
            </div>
            {nav}
          </div>
        </div>
      )}

      <Modal open={demo !== null} title={demo ?? ""} onClose={() => setDemo(null)}>
        This section is a UI placeholder in the prototype. No data is stored.
      </Modal>

      <Modal open={showNotifs} title="Notifications" onClose={() => setShowNotifs(false)}>
        <ul className="space-y-3">
          {notifications.map((n) => (
            <li key={n.title} className="rounded-xl border border-white/60 bg-white/60 p-3">
              <p className="text-sm font-semibold text-foreground">{n.title}</p>
              <p className="mt-1 text-xs text-foreground/60">{n.body}</p>
            </li>
          ))}
        </ul>
      </Modal>

      <Modal open={showProfile} title="Profile" onClose={() => setShowProfile(false)}>
        <div className="flex items-center gap-3">
          <img src={candidate.photo} alt="" className="size-14 rounded-xl object-cover" />
          <div>
            <p className="text-sm font-semibold text-foreground">{candidate.fullName}</p>
            <p className="text-xs text-foreground/60">{candidate.email}</p>
            <Badge className="mt-2" tone="success">
              Verified candidate
            </Badge>
          </div>
        </div>
      </Modal>
    </div>
  );
}
