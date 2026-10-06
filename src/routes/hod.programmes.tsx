import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FormModal, HodShell, inputCls, L } from "@/components/HodShell";
import { Badge, Button, Card } from "@/components/ui/primitives";

export const Route = createFileRoute("/hod/programmes")({
  head: () => ({
    meta: [
      { title: "Programme Management | Northbridge University" },
      { name: "description", content: "Manage Post-UTME programmes, cut-off scores, and availability." },
      { property: "og:title", content: "Programme Management | Northbridge University" },
      { property: "og:description", content: "Manage Post-UTME programmes, cut-off scores, and availability." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProgrammesPage,
});

type Prog = { id: number; name: string; department: string; faculty: string; minScore: number; applicants: number; active: boolean };

const seed: Prog[] = [
  { id: 1, name: "Computer Science", department: "Computer Science", faculty: "Science", minScore: 200, applicants: 1840, active: true },
  { id: 2, name: "Accounting", department: "Accounting", faculty: "Management Sciences", minScore: 200, applicants: 1420, active: true },
  { id: 3, name: "Business Administration", department: "Business Administration", faculty: "Management Sciences", minScore: 190, applicants: 1210, active: true },
  { id: 4, name: "Economics", department: "Economics", faculty: "Social Sciences", minScore: 190, applicants: 980, active: true },
  { id: 5, name: "Mass Communication", department: "Mass Communication", faculty: "Arts & Communication", minScore: 200, applicants: 1105, active: true },
  { id: 6, name: "Political Science", department: "Political Science", faculty: "Social Sciences", minScore: 180, applicants: 860, active: true },
  { id: 7, name: "Nursing", department: "Nursing Science", faculty: "Basic Medical Sciences", minScore: 230, applicants: 1897, active: true },
  { id: 8, name: "Geography", department: "Geography", faculty: "Social Sciences", minScore: 180, applicants: 0, active: false },
];

const empty: Omit<Prog, "id" | "applicants"> = { name: "", department: "", faculty: "", minScore: 180, active: true };

function ProgrammesPage() {
  const [list, setList] = useState(seed);
  const [editing, setEditing] = useState<Prog | "new" | null>(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const open = (p: Prog | "new") => { setEditing(p); setForm(p === "new" ? empty : p); setError(""); };
  const save = () => {
    if (!form.name.trim() || !form.department.trim() || !form.faculty.trim()) { setError("All fields are required."); return; }
    if (form.minScore < 0 || form.minScore > 400) { setError("Minimum JAMB score must be between 0 and 400."); return; }
    if (editing === "new") { setList((s) => [...s, { ...form, id: Date.now(), applicants: 0 }]); flash(`${form.name} added.`); }
    else if (editing) { setList((s) => s.map((p) => (p.id === editing.id ? { ...p, ...form } : p))); flash(`${form.name} updated.`); }
    setEditing(null);
  };
  const toggle = (p: Prog) => { setList((s) => s.map((x) => (x.id === p.id ? { ...x, active: !x.active } : x))); flash(`${p.name} ${p.active ? "deactivated" : "activated"}.`); };

  return (
    <HodShell active="Programmes" title="Programme Management">
      <Card elevated>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge tone="neutral">{list.length} programmes</Badge>
          <Button onClick={() => open("new")}>+ Add Programme</Button>
        </div>
        {toast && <p className="mt-4 rounded-xl bg-success/10 px-4 py-2 text-sm font-semibold text-success">{toast}</p>}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-foreground/50">
              <tr className="border-b border-foreground/10">{["Programme", "Department", "Faculty", "Min. JAMB", "Applicants", "Status", "Actions"].map((h) => <th key={h} className="px-3 py-3">{h}</th>)}</tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id} className="border-b border-foreground/5">
                  <td className="px-3 py-3 font-semibold">{p.name}</td>
                  <td className="px-3 py-3">{p.department}</td>
                  <td className="px-3 py-3 text-foreground/60">{p.faculty}</td>
                  <td className="px-3 py-3 font-semibold">{p.minScore}</td>
                  <td className="px-3 py-3">{p.applicants.toLocaleString("en-NG")}</td>
                  <td className="px-3 py-3"><Badge tone={p.active ? "success" : "neutral"}>{p.active ? "Active" : "Inactive"}</Badge></td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => open(p)} className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">Edit</button>
                      <button onClick={() => toggle(p)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${p.active ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>{p.active ? "Deactivate" : "Activate"}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {editing && (
        <FormModal title={editing === "new" ? "Add Programme" : "Edit Programme"} onClose={() => setEditing(null)} onSave={save}>
          <L label="Programme Name"><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} /></L>
          <L label="Department"><input className={inputCls} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} maxLength={100} /></L>
          <L label="Faculty"><input className={inputCls} value={form.faculty} onChange={(e) => setForm({ ...form, faculty: e.target.value })} maxLength={100} /></L>
          <L label="Minimum JAMB Score"><input className={inputCls} type="number" value={form.minScore} onChange={(e) => setForm({ ...form, minScore: Number(e.target.value) })} /></L>
          {error && <p className="text-sm font-semibold text-destructive">{error}</p>}
        </FormModal>
      )}
    </HodShell>
  );
}
