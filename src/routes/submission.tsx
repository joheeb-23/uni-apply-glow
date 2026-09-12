import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardShell } from "@/components/DashboardShell";
import { Badge, Button, Card } from "@/components/ui/primitives";
import { mockCandidate } from "@/data/candidate";

export const Route = createFileRoute("/submission")({
  head: () => ({
    meta: [
      { title: "Application Submitted | Northbridge University" },
      {
        name: "description",
        content:
          "Your Post-UTME application has been submitted successfully. View your application number and screening details.",
      },
      { property: "og:title", content: "Application Submitted | Northbridge University" },
      {
        property: "og:description",
        content:
          "Your Post-UTME application has been submitted successfully. View your application number and screening details.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SubmissionPage,
});

const submission = {
  applicationNumber: "PUTME/2026/001245",
  date: "12 September 2026, 4:32 PM",
  status: "Submitted",
};

function SubmissionPage() {
  const candidate = mockCandidate;

  return (
    <DashboardShell active="My Application">
      <div className="mx-auto max-w-2xl space-y-6">
        <Card elevated className="text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-success/10 text-3xl text-success">
            ✓
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
            Application Submitted Successfully
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-foreground/60">
            Your Post-UTME application has been received. Keep your application number safe — you will need it for the
            screening exercise.
          </p>
          <div className="mx-auto mt-5 inline-block rounded-2xl border border-primary/20 bg-primary/5 px-6 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">Application Number</p>
            <p className="mt-1 text-xl font-bold tracking-tight text-primary">{submission.applicationNumber}</p>
          </div>
        </Card>

        <Card>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Candidate Name", candidate.fullName],
              ["JAMB Registration Number", candidate.jambReg],
              ["Programme", candidate.programme],
              ["Submission Date", submission.date],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-white/60 bg-white/50 px-4 py-3">
                <p className="text-xs font-semibold text-foreground/50">{label}</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
              </div>
            ))}
            <div className="rounded-xl border border-white/60 bg-white/50 px-4 py-3 sm:col-span-2">
              <p className="text-xs font-semibold text-foreground/50">Application Status</p>
              <Badge className="mt-2" tone="success">
                {submission.status} — Awaiting Screening
              </Badge>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/review"
            className="frost inline-flex flex-1 items-center justify-center rounded-xl border border-white/50 bg-white/50 px-6 py-3 text-sm font-semibold text-foreground/80 transition hover:bg-white/70"
          >
            View Application
          </Link>
          <Link
            to="/screening-slip"
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-brand)] transition hover:bg-primary/90"
          >
            Print Screening Slip
          </Link>
        </div>

        <p className="text-center text-xs text-foreground/50">
          Screening holds on 18 October 2026. Check your dashboard notifications for updates. Prototype only — nothing is
          stored.
        </p>
      </div>
    </DashboardShell>
  );
}

export { Button as _unused };
