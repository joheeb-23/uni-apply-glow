import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FormModal, HodShell, inputCls, L } from "@/components/HodShell";
import { Badge, Button, Card } from "@/components/ui/primitives";

export const Route = createFileRoute("/hod/users")({
  head: () => ({
    meta: [
      { title: "User Management | Northbridge University" },
      { name: "description", content: "Add, edit, deactivate users and assign portal roles." },
      { property: "og:title", content: "User Management | Northbridge University" },
      { property: "og:description", content: "Add, edit, deactivate users and assign portal roles." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: UsersPage,
});

const roles = ["Candidate", "ICT", "HOD/Admin", "Bursary"] as const;
type Role = (typeof roles)[number];
type User = { id: number; name: string; email: string; role: Role; active: boolean };

const seed: User[] = [
  { id: 1, name: "Prof. K. Adebayo", email: "k.adebayo@northbridge.edu.ng", role: "HOD/Admin", active: true },
  { id: 2, name: "Mrs. A. Bakare", email: "a.bakare@northbridge.edu.ng", role: "ICT", active: true },
  { id: 3, name: "Mr. C. Okeke", email: "c.okeke@northbridge.edu.ng", role: "Bursary", active: true },
  { id: 4, name: "Oluwaseun Johnson", email: "oluwaseun.johnson@example.com", role: "Candidate", active: true },
  { id: 5, name: "Chiamaka Okafor", email: "chiamaka.okafor@example.com", role: "Candidate", active: true },
  { id: 6, name: "Mr. T. Usman", email: "t.usman@northbridge.edu.ng", role: "ICT", active: false },
  { id: 7, name: "Ibrahim Bello", email: "ibrahim.bello@example.com", role: "Candidate", active: true },
];

const empty: Omit<User, "id"> = { name: "", email: "", role: "Candidate", active: true };

function UsersPage() {
  const [users, setUsers] = useState(seed);
  const [editing, setEditing] = useState<User | "new" | null>(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [toast, setToast] = useState("");
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const open = (u: User | "new") => { setEditing(u); setForm(u === "new" ? empty : u); setError(""); };
  const save = () => {
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) { setError("Enter a name and a valid email."); return; }
    if (editing === "new") { setUsers((s) => [...s, { ...form, id: Date.now() }]); flash(`${form.name} added.`); }
    else if (editing) { setUsers((s) => s.map((u) => (u.id === editing.id ? { ...u, ...form } : u))); flash(`${form.name} updated.`); }
    setEditing(null);
  };
  const toggle = (u: User) => { setUsers((s) => s.map((x) => (x.id === u.id ? { ...x, active: !x.active } : x))); flash(`${u.name} ${u.active ? "deactivated" : "reactivated"}.`); };
  const assign = (u: User, role: Role) => { setUsers((s) => s.map((x) => (x.id === u.id ? { ...x, role } : x))); flash(`${u.name} is now ${role}.`); };

  const shown = users.filter((u) => roleFilter === "All" || u.role === roleFilter);

  return (
    <HodShell active="Users" title="User Management">
      <Card elevated>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <select aria-label="Filter by role" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className={`${inputCls} w-auto`}>
              <option>All</option>{roles.map((r) => <option key={r}>{r}</option>)}
            </select>
            <Badge tone="neutral">{shown.length} users</Badge>
          </div>
          <Button onClick={() => open("new")}>+ Add User</Button>
        </div>
        {toast && <p className="mt-4 rounded-xl bg-success/10 px-4 py-2 text-sm font-semibold text-success">{toast}</p>}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-foreground/50">
              <tr className="border-b border-foreground/10">{["Name", "Email", "Role", "Status", "Actions"].map((h) => <th key={h} className="px-3 py-3">{h}</th>)}</tr>
            </thead>
            <tbody>
              {shown.map((u) => (
                <tr key={u.id} className="border-b border-foreground/5">
                  <td className="px-3 py-3 font-semibold">{u.name}</td>
                  <td className="px-3 py-3 text-foreground/60">{u.email}</td>
                  <td className="px-3 py-3">
                    <select aria-label={`Assign role for ${u.name}`} value={u.role} onChange={(e) => assign(u, e.target.value as Role)} className="rounded-lg border border-foreground/10 bg-white/70 px-2 py-1 text-xs font-semibold">
                      {roles.map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-3"><Badge tone={u.active ? "success" : "neutral"}>{u.active ? "Active" : "Inactive"}</Badge></td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => open(u)} className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">Edit</button>
                      <button onClick={() => toggle(u)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${u.active ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>{u.active ? "Deactivate" : "Activate"}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {editing && (
        <FormModal title={editing === "new" ? "Add User" : "Edit User"} onClose={() => setEditing(null)} onSave={save}>
          <L label="Full Name"><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} /></L>
          <L label="Email"><input className={inputCls} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={255} /></L>
          <L label="Role">
            <select className={inputCls} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>{roles.map((r) => <option key={r}>{r}</option>)}</select>
          </L>
          {error && <p className="text-sm font-semibold text-destructive">{error}</p>}
        </FormModal>
      )}
    </HodShell>
  );
}
