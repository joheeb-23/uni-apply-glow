import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Badge, Button, Card } from "@/components/ui/primitives";
import { mockCandidate } from "@/data/candidate";

export const Route = createFileRoute("/acceptance-fee")({
  head: () => ({
    meta: [
      { title: "Acceptance Fee | Northbridge University" },
      { name: "description", content: "Pay your admission acceptance fee and view your acceptance fee receipt." },
      { property: "og:title", content: "Acceptance Fee | Northbridge University" },
      { property: "og:description", content: "Pay your admission acceptance fee and view your acceptance fee receipt." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AcceptanceFeePage,
});

type S = "unpaid" | "processing" | "paid";
const FEE = 100000;
const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;
const labels: Record<S, string> = { unpaid: "Unpaid", processing: "Processing", paid: "Paid" };

function AcceptanceFeePage() {
  const c = mockCandidate;
  const [status, setStatus] = useState<S>("unpaid");
  const [ref, setRef] = useState("—");
  const [date, setDate] = useState("");
  const [receipt, setReceipt] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const pay = () => {
    setStatus("processing");
    setTimeout(() => {
      setRef(`ACCEPT-2026-${Math.floor(100000 + Math.random() * 900000)}`);
      setDate(new Date().toLocaleString("en-NG", { dateStyle: "long", timeStyle: "short" }));
      setStatus("paid");
    }, 1600);
  };

  return (
    <DashboardShell active="Admission Status">
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Admission</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Acceptance Fee</h1>
        </div>

        <Card elevated className="max-w-3xl">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Payment details</p>
            <Badge tone={status === "paid" ? "success" : status === "processing" ? "brand" : "neutral"}>{labels[status]}</Badge>
          </div>
          <dl className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2">
            <D label="Candidate Name" value={c.fullName} />
            <D label="Programme" value={c.programme} />
            <D label="Acceptance Fee" value={naira(FEE)} />
            <D label="Payment Status" value={labels[status]} />
            {status === "paid" && <D label="Payment Reference" value={ref} />}
          </dl>

          <div className="mt-6">
            {status === "unpaid" && (
              <div className="rounded-2xl border border-warning-border bg-warning-surface/60 p-5">
                <p className="font-display text-lg font-bold text-warning-foreground">Acceptance fee outstanding</p>
                <p className="mt-2 text-sm text-foreground/60">Pay {naira(FEE)} to confirm your admission offer.</p>
              </div>
            )}
            {status === "processing" && (
              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5">
                <p className="font-display text-lg font-bold text-primary">Processing payment…</p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-primary/20">
                  <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
                </div>
              </div>
            )}
            {status === "paid" && (
              <div className="rounded-2xl border border-success/30 bg-success/10 p-5">
                <p className="font-display text-lg font-bold text-success">Acceptance Fee Paid Successfully</p>
                <p className="mt-2 text-sm text-foreground/60">Reference: <span className="font-semibold">{ref}</span></p>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap justify-between gap-3">
            <Link to="/admission"><Button variant="ghost">← Admission Status</Button></Link>
            {status === "paid" ? (
              <Button onClick={() => setReceipt(true)}>View Receipt</Button>
            ) : (
              <Button onClick={pay} disabled={status === "processing"}>
                {status === "processing" ? "Processing…" : "Pay Acceptance Fee"}
              </Button>
            )}
          </div>
          <p className="mt-3 text-center text-[11px] text-foreground/40">UI prototype — no real payment is processed.</p>
        </Card>
      </div>

      {receipt && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-foreground/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-card p-7 text-card-foreground shadow-2xl">
            <div className="flex items-center gap-3 border-b border-dashed border-foreground/20 pb-4">
              <div className="grid size-12 place-items-center rounded-full bg-primary font-display font-bold text-primary-foreground">NU</div>
              <div>
                <p className="font-display text-lg font-bold">Northbridge University</p>
                <p className="text-xs text-foreground/50">Acceptance Fee Receipt</p>
              </div>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <R l="Candidate Name" v={c.fullName} />
              <R l="Programme" v={c.programme} />
              <R l="Payment Type" v="Admission Acceptance Fee" />
              <R l="Amount" v={naira(FEE)} />
              <R l="Transaction Reference" v={ref} />
              <R l="Date" v={date} />
              <R l="Status" v="Paid" />
            </dl>
            {downloaded && <p className="mt-4 text-center text-xs font-semibold text-success">Receipt downloaded (simulated).</p>}
            <div className="mt-6 flex flex-wrap justify-end gap-3 print:hidden">
              <Button variant="glass" onClick={() => window.print()}>Print Receipt</Button>
              <Button variant="glass" onClick={() => setDownloaded(true)}>Download Receipt</Button>
              <Button onClick={() => setReceipt(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

function D({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-foreground/40">{label}</dt>
      <dd className="mt-1 font-semibold">{value}</dd>
    </div>
  );
}

function R({ l, v }: { l: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-foreground/50">{l}</dt>
      <dd className="text-right font-semibold">{v}</dd>
    </div>
  );
}
