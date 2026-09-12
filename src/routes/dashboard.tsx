import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Badge, Button, Card, Modal } from "@/components/ui/primitives";
import { mockCandidate } from "@/data/candidate";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Candidate Dashboard | Northbridge University" },
      {
        name: "description",
        content:
          "Track your Post-UTME application progress, payment, documents and admission status from one dashboard.",
      },
      { property: "og:title", content: "Candidate Dashboard | Northbridge University" },
      {
        property: "og:description",
        content:
          "Track your Post-UTME application progress, payment, documents and admission status from one dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

type Tone = "success" | "brand" | "neutral";

const statusCards: { title: string; value: string; tone: Tone; note: string }[] = [
  { title: "Verification", value: "Completed", tone: "success", note: "JAMB details confirmed" },
  { title: "Eligibility", value: "Eligible", tone: "success", note: "Score 214 / min. 200" },
  { title: "Payment", value: "Paid", tone: "success", note: "₦5,000 · POSTUTME-2026-001245" },
  { title: "Application", value: "In Progress", tone: "brand", note: "2 of 4 sections done" },
  { title: "Documents", value: "3/5 Uploaded", tone: "brand", note: "2 documents outstanding" },
  { title: "Submission", value: "Pending", tone: "neutral", note: "Submit before 30 Sept 2026" },
  { title: "Admission", value: "Pending", tone: "neutral", note: "Results after screening" },
];

const PROGRESS = 65;

function DashboardPage() {
  const candidate = mockCandidate;
  const [demo, setDemo] = useState<string | null>(null);

  return (
    <DashboardShell active="Dashboard">
      <div className="space-y-6">
        <Card elevated>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Overview</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                Application Progress: {PROGRESS}%
              </h1>
              <p className="mt-1 text-sm text-foreground/60">
                {candidate.programme} · {candidate.institution}
              </p>
            </div>
            <Badge tone="brand">In Progress</Badge>
          </div>
          <div
            className="mt-5 h-3 w-full overflow-hidden rounded-full bg-foreground/10"
            role="progressbar"
            aria-valuenow={PROGRESS}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${PROGRESS}%` }} />
          </div>
          <p className="mt-2 text-xs text-foreground/50">
            Complete your application sections and upload the remaining documents to reach 100%.
          </p>
        </Card>

        <section>
          <h2 className="mb-3 text-lg font-bold tracking-tight">Application status</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statusCards.map((card) => (
              <Card key={card.title}>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground/40">
                  {card.title}
                </p>
                <p className="mt-2 text-lg font-bold tracking-tight">{card.value}</p>
                <Badge className="mt-3" tone={card.tone}>
                  {card.note}
                </Badge>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold tracking-tight">Quick actions</h2>
          <Card elevated>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <Link
                to="/application"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-brand)] transition hover:bg-primary/90"
              >
                Continue Application
              </Link>
              <Link
                to="/documents"
                className="frost inline-flex items-center justify-center rounded-xl border border-white/50 bg-white/50 px-6 py-3 text-sm font-semibold text-foreground/80 transition hover:bg-white/70"
              >
                Upload Documents
              </Link>
              <Link
                to="/application"
                className="frost inline-flex items-center justify-center rounded-xl border border-white/50 bg-white/50 px-6 py-3 text-sm font-semibold text-foreground/80 transition hover:bg-white/70"
              >
                View Application
              </Link>
              <Button variant="glass" onClick={() => setDemo("Print Screening Slip")}>
                Print Screening Slip
              </Button>
              <Button variant="glass" onClick={() => setDemo("Check Admission Status")}>
                Check Admission Status
              </Button>
              <Link
                to="/payment"
                className="frost inline-flex items-center justify-center rounded-xl border border-white/50 bg-white/50 px-6 py-3 text-sm font-semibold text-foreground/80 transition hover:bg-white/70"
              >
                View Payment Receipt
              </Link>
            </div>
          </Card>
        </section>
      </div>

      <Modal open={demo !== null} title={demo ?? ""} onClose={() => setDemo(null)}>
        This is a demonstration interface. {demo} will be available once the full portal is connected.
      </Modal>
    </DashboardShell>
  );
}
