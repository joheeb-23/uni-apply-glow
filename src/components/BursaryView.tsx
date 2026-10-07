import { useMemo, useState } from "react";
import { AdminShell, type ShellItem } from "@/components/AdminShell";
import { Badge, Button, Card } from "@/components/ui/primitives";
import { fmtDate, naira, transactions, type PayStatus, type PayType, type Txn } from "@/data/transactions";

const items: ShellItem[] = [
  { label: "Dashboard", icon: "▤", to: "/bursary" },
  { label: "Transactions", icon: "⇄", to: "/bursary" },
  { label: "Application Fees", icon: "₦", to: "/bursary/application-fees" },
  { label: "Acceptance Fees", icon: "★", to: "/bursary/acceptance-fees" },
  { label: "Payment Reports", icon: "▥" },
  { label: "Profile", icon: "☺" },
  { label: "Logout", icon: "⏻", to: "/" },
];

const sel = "rounded-xl border border-foreground/10 bg-white/70 px-3 py-2.5 text-sm";
const PER_PAGE = 10;

function StatusBadge({ s }: { s: PayStatus }) {
  return <Badge tone={s === "Successful" ? "success" : s === "Pending" ? "brand" : "neutral"} className={s === "Failed" ? "bg-destructive/10 text-destructive" : ""}>{s}</Badge>;
}

export function BursaryView({ active, title, presetType }: { active: string; title: string; presetType?: PayType }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [type, setType] = useState<string>(presetType ?? "All");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<Txn | null>(null);

  const scope = presetType ? transactions.filter((t) => t.type === presetType) : transactions;
  const ok = scope.filter((t) => t.status === "Successful");
  const stats = [
    { label: "Total Transactions", value: scope.length.toLocaleString() },
    { label: "Successful Payments", value: ok.length.toLocaleString() },
    { label: "Pending Payments", value: scope.filter((t) => t.status === "Pending").length.toLocaleString() },
    { label: "Failed Payments", value: scope.filter((t) => t.status === "Failed").length.toLocaleString() },
    ...(presetType !== "Acceptance Fee" ? [{ label: "Application Fee Revenue", value: naira(ok.filter((t) => t.type === "Post-UTME Application Fee").reduce((a, t) => a + t.amount, 0)) }] : []),
    ...(presetType !== "Post-UTME Application Fee" ? [{ label: "Acceptance Fee Revenue", value: naira(ok.filter((t) => t.type === "Acceptance Fee").reduce((a, t) => a + t.amount, 0)) }] : []),
  ];

  const filtered = useMemo(() => scope.filter((t) => {
    const s = q.trim().toLowerCase();
    return (!s || t.name.toLowerCase().includes(s) || t.jambReg.includes(s) || t.reference.toLowerCase().includes(s))
      && (status === "All" || t.status === status)
      && (type === "All" || t.type === type)
      && (!from || t.date >= from) && (!to || t.date <= to);
  }), [scope, q, status, type, from, to]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const cur = Math.min(page, pages);
  const rows = filtered.slice((cur - 1) * PER_PAGE, cur * PER_PAGE);
  const r = (fn: (v: string) => void) => (e: { target: { value: string } }) => { fn(e.target.value); setPage(1); };
  const clear = () => { setQ(""); setStatus("All"); setType(presetType ?? "All"); setFrom(""); setTo(""); setPage(1); };

  return (
    <AdminShell active={active} title={title} items={items} unit="Bursary Department" user={{ name: "Mr. C. Okeke", role: "Bursary / Finance Officer", initials: "CO" }}>
      <div className="print:hidden">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((s) => (
            <Card key={s.label}>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50">{s.label}</p>
              <p className="mt-2 font-display text-3xl font-bold">{s.value}</p>
            </Card>
          ))}
        </div>

        <Card elevated className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Transactions</p>
              <h2 className="mt-1 text-xl font-bold">Payment Records</h2>
            </div>
            <div className="flex items-center gap-3">
              <Badge tone="neutral">{filtered.length} results</Badge>
              <button onClick={clear} className="text-xs font-semibold text-primary">Clear filters</button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <input value={q} onChange={r(setQ)} placeholder="Search name, JAMB no. or reference" aria-label="Search transactions" className={`${sel} xl:col-span-1`} />
            <select aria-label="Filter by payment type" value={type} onChange={r(setType)} disabled={!!presetType} className={sel}>
              <option>All</option><option>Post-UTME Application Fee</option><option>Acceptance Fee</option>
            </select>
            <select aria-label="Filter by payment status" value={status} onChange={r(setStatus)} className={sel}>
              <option>All</option><option>Successful</option><option>Pending</option><option>Failed</option>
            </select>
            <input type="date" aria-label="From date" value={from} onChange={r(setFrom)} className={sel} />
            <input type="date" aria-label="To date" value={to} onChange={r(setTo)} className={sel} />
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-foreground/50">
                <tr className="border-b border-foreground/10">
                  {["Candidate Name", "JAMB Reg. No.", "Payment Type", "Amount", "Transaction Ref.", "Date", "Status", "Action"].map((h) => <th key={h} className="px-3 py-3 font-semibold">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map((t) => (
                  <tr key={t.id} className="border-b border-foreground/5 hover:bg-white/40">
                    <td className="px-3 py-3 font-semibold">{t.name}</td>
                    <td className="px-3 py-3 font-mono text-xs">{t.jambReg}</td>
                    <td className="px-3 py-3">{t.type}</td>
                    <td className="px-3 py-3 font-semibold">{naira(t.amount)}</td>
                    <td className="px-3 py-3 font-mono text-xs">{t.reference}</td>
                    <td className="px-3 py-3 text-foreground/60">{fmtDate(t.date)}</td>
                    <td className="px-3 py-3"><StatusBadge s={t.status} /></td>
                    <td className="px-3 py-3">
                      <button onClick={() => setDetail(t)} className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20">View</button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && <tr><td colSpan={8} className="px-3 py-10 text-center text-foreground/50">No transactions match your filters.</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
            <p className="text-foreground/50">Page {cur} of {pages}</p>
            <div className="flex flex-wrap gap-2">
              <button disabled={cur === 1} onClick={() => setPage(cur - 1)} className="rounded-lg border border-foreground/10 px-3 py-1.5 font-semibold disabled:opacity-40">Previous</button>
              {Array.from({ length: pages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`rounded-lg px-3 py-1.5 font-semibold ${cur === i + 1 ? "bg-primary text-primary-foreground" : "border border-foreground/10"}`}>{i + 1}</button>
              ))}
              <button disabled={cur === pages} onClick={() => setPage(cur + 1)} className="rounded-lg border border-foreground/10 px-3 py-1.5 font-semibold disabled:opacity-40">Next</button>
            </div>
          </div>
        </Card>
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-foreground/40 p-4 backdrop-blur-sm print:static print:block print:bg-transparent print:p-0">
          <div role="dialog" aria-label="Payment details" className="w-full max-w-2xl rounded-2xl bg-card p-7 text-card-foreground shadow-2xl print:shadow-none">
            <div className="flex items-center gap-3 border-b border-dashed border-foreground/20 pb-4">
              <div className="grid size-12 shrink-0 place-items-center rounded-full bg-primary font-display font-bold text-primary-foreground">NU</div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg font-bold">Northbridge University</p>
                <p className="text-xs text-foreground/50">Bursary Department · Payment Receipt</p>
              </div>
              <StatusBadge s={detail.status} />
            </div>
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Candidate Information</p>
                <dl className="mt-3 space-y-2 text-sm">
                  <R l="Name" v={detail.name} /><R l="JAMB Reg. No." v={detail.jambReg} /><R l="Programme" v={detail.programme} />
                  <R l="Email" v={detail.email} /><R l="Phone" v={detail.phone} />
                </dl>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Payment Information</p>
                <dl className="mt-3 space-y-2 text-sm">
                  <R l="Payment Type" v={detail.type} /><R l="Amount" v={naira(detail.amount)} /><R l="Reference" v={detail.reference} />
                  <R l="Channel" v={detail.channel} /><R l="Date" v={`${fmtDate(detail.date)}, ${detail.time}`} /><R l="Status" v={detail.status} />
                </dl>
              </div>
            </div>
            <div className="mt-7 flex justify-end gap-3 print:hidden">
              <Button variant="glass" onClick={() => window.print()}>Print Receipt</Button>
              <Button onClick={() => setDetail(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function R({ l, v }: { l: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="shrink-0 text-foreground/50">{l}</dt>
      <dd className="min-w-0 break-words text-right font-semibold">{v}</dd>
    </div>
  );
}
