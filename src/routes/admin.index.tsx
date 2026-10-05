import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { Badge, Card } from "@/components/ui/primitives";
import { adminCandidates, allStatuses } from "@/data/admin";
import { StatusPill } from "@/components/StatusPill";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admissions Officer Dashboard | Northbridge University" },
      { name: "description", content: "Monitor Post-UTME candidates, applications, and screening progress." },
      { property: "og:title", content: "Admissions Officer Dashboard | Northbridge University" },
      { property: "og:description", content: "Monitor Post-UTME candidates, applications, and screening progress." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminDashboard,
});

const PER_PAGE = 8;

function AdminDashboard() {
  const all = adminCandidates;
  const [q, setQ] = useState("");
  const [prog, setProg] = useState("All");
  const [elig, setElig] = useState("All");
  const [stat, setStat] = useState("All");
  const [page, setPage] = useState(1);

  const stats = [
    { label: "Total Candidates", value: 12480 },
    { label: "Verified Candidates", value: 11926 },
    { label: "Eligible Candidates", value: 9312 },
    { label: "Submitted Applications", value: 8754 },
    { label: "Pending Applications", value: 558 },
    { label: "Screening Completed", value: 6140 },
  ];

  const filtered = useMemo(() => all.filter((c) => {
    const s = q.trim().toLowerCase();
    return (!s || c.name.toLowerCase().includes(s) || c.jambReg.includes(s))
      && (prog === "All" || c.programme === prog)
      && (elig === "All" || (elig === "Eligible") === c.eligible)
      && (stat === "All" || c.status === stat);
  }), [all, q, prog, elig, stat]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const cur = Math.min(page, pages);
  const rows = filtered.slice((cur - 1) * PER_PAGE, cur * PER_PAGE);
  const programmes = [...new Set(all.map((c) => c.programme))];
  const sel = "rounded-xl border border-foreground/10 bg-white/70 px-3 py-2.5 text-sm";
  const reset = (fn: (v: string) => void) => (e: { target: { value: string } }) => { fn(e.target.value); setPage(1); };

  return (
    <AdminShell active="Dashboard" title="Admissions Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50">{s.label}</p>
            <p className="mt-2 font-display text-3xl font-bold">{s.value.toLocaleString("en-NG")}</p>
          </Card>
        ))}
      </div>

      <Card elevated className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Candidates</p>
            <h2 className="mt-1 text-xl font-bold">Candidate Records</h2>
          </div>
          <Badge tone="neutral">{filtered.length} results</Badge>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <input value={q} onChange={reset(setQ)} placeholder="Search name or JAMB number" aria-label="Search candidates" className={sel} />
          <select aria-label="Filter by programme" value={prog} onChange={reset(setProg)} className={sel}>
            <option>All</option>{programmes.map((p) => <option key={p}>{p}</option>)}
          </select>
          <select aria-label="Filter by eligibility" value={elig} onChange={reset(setElig)} className={sel}>
            <option>All</option><option>Eligible</option><option>Not Eligible</option>
          </select>
          <select aria-label="Filter by status" value={stat} onChange={reset(setStat)} className={sel}>
            <option>All</option>{allStatuses.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-foreground/50">
              <tr className="border-b border-foreground/10">
                {["Candidate Name", "JAMB Reg. No.", "Programme", "JAMB Score", "Eligibility", "Application Status", "Date", "Action"].map((h) => <th key={h} className="px-3 py-3 font-semibold">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-b border-foreground/5 hover:bg-white/40">
                  <td className="px-3 py-3 font-semibold">{c.name}</td>
                  <td className="px-3 py-3 font-mono text-xs">{c.jambReg}</td>
                  <td className="px-3 py-3">{c.programme}</td>
                  <td className="px-3 py-3 font-semibold">{c.score}</td>
                  <td className="px-3 py-3"><Badge tone={c.eligible ? "success" : "neutral"}>{c.eligible ? "Eligible" : "Not Eligible"}</Badge></td>
                  <td className="px-3 py-3"><StatusPill status={c.status} /></td>
                  <td className="px-3 py-3 text-foreground/60">{c.date}</td>
                  <td className="px-3 py-3">
                    <Link to="/admin/candidates/$id" params={{ id: c.id }} className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20">View</Link>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={8} className="px-3 py-10 text-center text-foreground/50">No candidates match your search.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
          <p className="text-foreground/50">Page {cur} of {pages}</p>
          <div className="flex gap-2">
            <button disabled={cur === 1} onClick={() => setPage(cur - 1)} className="rounded-lg border border-foreground/10 px-3 py-1.5 font-semibold disabled:opacity-40">Previous</button>
            {Array.from({ length: pages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`rounded-lg px-3 py-1.5 font-semibold ${cur === i + 1 ? "bg-primary text-primary-foreground" : "border border-foreground/10"}`}>{i + 1}</button>
            ))}
            <button disabled={cur === pages} onClick={() => setPage(cur + 1)} className="rounded-lg border border-foreground/10 px-3 py-1.5 font-semibold disabled:opacity-40">Next</button>
          </div>
        </div>
      </Card>
    </AdminShell>
  );
}
