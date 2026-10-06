import type { ReactNode } from "react";
import { AdminShell, type ShellItem } from "@/components/AdminShell";

const hodItems: ShellItem[] = [
  { label: "Dashboard", icon: "▤", to: "/hod" },
  { label: "Candidates", icon: "◍" },
  { label: "Applications", icon: "▦" },
  { label: "Programmes", icon: "✎", to: "/hod/programmes" },
  { label: "Users", icon: "☷", to: "/hod/users" },
  { label: "Payments", icon: "₦" },
  { label: "Admissions", icon: "★" },
  { label: "Announcements", icon: "✉" },
  { label: "Reports", icon: "▥" },
  { label: "Settings", icon: "⚙", to: "/hod/settings" },
  { label: "Profile", icon: "☺" },
  { label: "Logout", icon: "⏻", to: "/" },
];

export function HodShell({ active, title, children }: { active: string; title: string; children: ReactNode }) {
  return (
    <AdminShell
      active={active}
      title={title}
      items={hodItems}
      unit="System Administration"
      user={{ name: "Prof. K. Adebayo", role: "HOD / System Administrator", initials: "KA" }}
    >
      {children}
    </AdminShell>
  );
}

export const inputCls = "w-full rounded-xl border border-foreground/10 bg-white/70 px-3 py-2.5 text-sm";

export function FormModal({ title, onClose, onSave, children }: { title: string; onClose: () => void; onSave: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-foreground/40 p-4 backdrop-blur-sm">
      <form
        className="glass edge w-full max-w-lg rounded-3xl p-6"
        onSubmit={(e) => { e.preventDefault(); onSave(); }}
      >
        <h3 className="text-lg font-bold">{title}</h3>
        <div className="mt-4 space-y-3">{children}</div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-foreground/60 hover:text-primary">Cancel</button>
          <button type="submit" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Save</button>
        </div>
      </form>
    </div>
  );
}

export function L({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/50">{label}</span>
      {children}
    </label>
  );
}
