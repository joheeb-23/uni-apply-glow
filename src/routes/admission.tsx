import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Badge, Button, Card } from "@/components/ui/primitives";
import { mockCandidate } from "@/data/candidate";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admission")({
  head: () => ({
    meta: [
      { title: "Admission Status | Northbridge University" },
      { name: "description", content: "Track your Post-UTME admission status and view your admission offer." },
      { property: "og:title", content: "Admission Status | Northbridge University" },
      { property: "og:description", content: "Track your Post-UTME admission status and view your admission offer." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdmissionPage,
});

const timeline = [
  { label: "Application Submitted", date: "12 Sep 2026" },
  { label: "Application Under Review", date: "20 Sep 2026" },
  { label: "Screening Completed", date: "18 Oct 2026" },
  { label: "Admission Processing", date: "25 Oct 2026" },
  { label: "Admission Offered", date: "2 Nov 2026" },
];

const allStatuses = [
  "Application Submitted",
  "Under Review",
  "Screening Completed",
  "Admission Processing",
  "Admission Offered",
  "Admission Not Offered",
  "Accepted",
  "Declined",
] as const;
type Status = (typeof allStatuses)[number];

const stageIndex: Record<Status, number> = {
  "Application Submitted": 0,
  "Under Review": 1,
  "Screening Completed": 2,
  "Admission Processing": 3,
  "Admission Offered": 4,
  "Admission Not Offered": 4,
  Accepted: 4,
  Declined: 4,
};

export const admissionDetails = {
  faculty: "Faculty of Science",
  department: "Department of Computer Science",
  session: "2026/2027",
  mode: "Full-time (4 years)",
};

function AdmissionPage() {
  const c = mockCandidate;
  const [status, setStatus] = useState<Status>("Admission Offered");
  const [letter, setLetter] = useState(false);
  const current = stageIndex[status];
  const notOffered = status === "Admission Not Offered";
  const finished = ["Admission Offered", "Accepted", "Declined", "Admission Not Offered"].includes(status);

  return (
    <DashboardShell active="Admission Status">
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">2026/2027 Session</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Admission Status</h1>
          </div>
          <label className="text-xs font-semibold text-foreground/50">
            Demo status{" "}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              className="ml-2 rounded-lg border border-foreground/10 bg-white/70 px-2 py-1.5 text-sm text-foreground"
            >
              {allStatuses.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Card elevated>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Timeline</p>
              <Badge tone={notOffered || status === "Declined" ? "neutral" : finished ? "success" : "brand"}>{status}</Badge>
            </div>
            <ol className="mt-6">
              {timeline.map((t, i) => {
                const label = i === 4 && notOffered ? "Admission Not Offered" : t.label;
                const done = i < current || (i === current && finished);
                const active = i === current && !finished;
                return (
                  <li key={t.label} className="relative flex gap-4 pb-6 last:pb-0">
                    {i < timeline.length - 1 && (
                      <span className={cn("absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5", i < current ? "bg-success" : "bg-foreground/10")} />
                    )}
                    <span
                      className={cn(
                        "grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold",
                        done && !(i === 4 && notOffered) && "bg-success text-primary-foreground",
                        done && i === 4 && notOffered && "bg-destructive text-destructive-foreground",
                        active && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                        !done && !active && "bg-foreground/5 text-foreground/40",
                      )}
                    >
                      {done ? (i === 4 && notOffered ? "✕" : "✓") : active ? "→" : i + 1}
                    </span>
                    <div>
                      <p className={cn("font-semibold", !done && !active && "text-foreground/40")}>{label}</p>
                      <p className="text-xs text-foreground/50">{i <= current ? t.date : "Pending"}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Card>

          <Card elevated>
            {status === "Admission Offered" || status === "Accepted" ? (
              <>
                <div className="rounded-2xl border border-success/30 bg-success/10 p-5">
                  <p className="font-display text-xl font-bold text-success">
                    {status === "Accepted" ? "Admission Accepted" : "Congratulations! You have been offered admission."}
                  </p>
                  <p className="mt-2 text-sm text-foreground/60">
                    {status === "Accepted"
                      ? "Your acceptance fee has been received. Watch your email for registration details."
                      : "Accept your offer and pay the acceptance fee to secure your place."}
                  </p>
                </div>
                <dl className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                  <D label="Candidate Name" value={c.fullName} />
                  <D label="Programme" value={c.programme} />
                  <D label="Faculty" value={admissionDetails.faculty} />
                  <D label="Department" value={admissionDetails.department} />
                  <D label="Mode of Study" value={admissionDetails.mode} />
                  <D label="Admission Status" value={status} />
                </dl>
                <div className="mt-6 flex flex-wrap gap-3">
                  {status === "Admission Offered" && (
                    <Link to="/acceptance-fee"><Button>Accept Admission</Button></Link>
                  )}
                  <Button variant="glass" onClick={() => setLetter(true)}>View Admission Letter</Button>
                </div>
              </>
            ) : notOffered ? (
              <Msg title="Admission Not Offered" tone="destructive" body="We regret that you were not offered admission this session. You may be considered for alternative programmes via supplementary admission." />
            ) : status === "Declined" ? (
              <Msg title="Admission Declined" tone="neutral" body="You declined the admission offer. Contact the Admissions Office if this was a mistake." />
            ) : (
              <Msg title={status} tone="primary" body="Your application is still being processed. You will be notified once an admission decision is made." />
            )}
          </Card>
        </div>
      </div>

      {letter && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-foreground/40 p-4 backdrop-blur-sm print:static print:bg-transparent">
          <div className="w-full max-w-2xl rounded-2xl bg-card p-8 text-card-foreground shadow-2xl">
            <div className="flex items-center gap-4 border-b border-foreground/10 pb-4">
              <div className="grid size-14 place-items-center rounded-full bg-primary font-display text-lg font-bold text-primary-foreground">NU</div>
              <div>
                <p className="font-display text-xl font-bold">Northbridge University</p>
                <p className="text-xs text-foreground/50">Office of the Registrar · Admissions Unit · Ibadan</p>
              </div>
            </div>
            <p className="mt-5 text-xs text-foreground/50">Ref: NU/ADM/2026/001245 · 2 November 2026</p>
            <p className="mt-4 font-semibold">Dear {c.fullName},</p>
            <p className="mt-2 text-sm font-bold uppercase">Provisional Offer of Admission — 2026/2027 Session</p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/70">
              We are pleased to inform you that you have been offered provisional admission into the {admissionDetails.department},{" "}
              {admissionDetails.faculty}, to study <strong>{c.programme}</strong> ({admissionDetails.mode}). This offer is subject to
              payment of the acceptance fee and verification of your credentials at registration.
            </p>
            <p className="mt-3 text-sm text-foreground/70">Please accept this offer within two weeks of this letter.</p>
            <div className="mt-8">
              <div className="h-px w-40 bg-foreground/30" />
              <p className="mt-1 text-sm font-semibold">Registrar</p>
            </div>
            <div className="mt-6 flex justify-end gap-3 print:hidden">
              <Button variant="glass" onClick={() => window.print()}>Print</Button>
              <Button onClick={() => setLetter(false)}>Close</Button>
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

function Msg({ title, body, tone }: { title: string; body: string; tone: "destructive" | "neutral" | "primary" }) {
  const cls = {
    destructive: "border-destructive/30 bg-destructive/10 text-destructive",
    neutral: "border-foreground/10 bg-foreground/5 text-foreground",
    primary: "border-primary/30 bg-primary/10 text-primary",
  }[tone];
  return (
    <div className={cn("rounded-2xl border p-5", cls)}>
      <p className="font-display text-xl font-bold">{title}</p>
      <p className="mt-2 text-sm text-foreground/60">{body}</p>
    </div>
  );
}
