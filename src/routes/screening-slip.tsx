import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Badge, Button, Card } from "@/components/ui/primitives";
import { mockCandidate } from "@/data/candidate";

export const Route = createFileRoute("/screening-slip")({
  head: () => ({
    meta: [
      { title: "Screening Slip | Northbridge University" },
      {
        name: "description",
        content:
          "Print or download your official Post-UTME screening acknowledgement slip with screening date, venue and application details.",
      },
      { property: "og:title", content: "Screening Slip | Northbridge University" },
      {
        property: "og:description",
        content:
          "Print or download your official Post-UTME screening acknowledgement slip with screening date, venue and application details.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ScreeningSlipPage,
});

const slip = {
  applicationNumber: "PUTME/2026/001245",
  screeningDate: "Saturday, 18 October 2026 · 9:00 AM",
  venue: "Main Auditorium, Northbridge University, Ibadan Campus",
  status: "Submitted — Awaiting Screening",
  paymentReference: "POSTUTME-2026-001245",
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-dashed border-foreground/15 py-2.5 last:border-b-0">
      <span className="text-xs font-semibold uppercase tracking-wide text-foreground/50">{label}</span>
      <span className="text-right text-sm font-bold">{value}</span>
    </div>
  );
}

function ScreeningSlipPage() {
  const candidate = mockCandidate;
  const [downloaded, setDownloaded] = useState(false);

  const download = () => {
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 4000);
  };

  return (
    <DashboardShell active="Screening Slip">
      <div className="mx-auto max-w-3xl space-y-6">
        {downloaded && (
          <div className="frost rounded-2xl border border-success/30 bg-success/10 p-4 text-sm font-semibold text-success print:hidden">
            Screening slip downloaded successfully (simulated).
          </div>
        )}

        {/* Official slip */}
        <div className="overflow-hidden rounded-2xl border border-foreground/15 bg-white text-foreground shadow-[0_20px_50px_-20px_rgba(15,23,42,0.25)]">
          {/* Header band */}
          <div className="flex items-center gap-4 border-b-4 border-double border-foreground/20 bg-foreground/[0.03] px-6 py-5 sm:px-8">
            <span className="grid size-16 shrink-0 place-items-center rounded-full border-2 border-foreground/20 bg-primary text-lg font-bold text-primary-foreground">
              NU
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-bold uppercase tracking-wide sm:text-xl">Northbridge University</p>
              <p className="text-xs text-foreground/60">
                Km 8 Lagos–Ibadan Expressway, Ibadan, Oyo State · admissions@northbridge.edu.ng
              </p>
              <p className="mt-1 text-sm font-bold uppercase tracking-[0.15em] text-primary">
                Post-UTME Screening Acknowledgement Slip
              </p>
            </div>
          </div>

          <div className="px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-6 sm:flex-row">
              <img
                src={candidate.photo}
                alt={`Passport photograph of ${candidate.fullName}`}
                className="size-32 shrink-0 self-start rounded-lg border-2 border-foreground/20 object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xl font-bold uppercase tracking-wide">{candidate.fullName}</p>
                <Badge className="mt-2" tone="success">
                  {slip.status}
                </Badge>
                <div className="mt-4">
                  <DetailRow label="Application Number" value={slip.applicationNumber} />
                  <DetailRow label="JAMB Reg. Number" value={candidate.jambReg} />
                  <DetailRow label="Programme" value={candidate.programme} />
                  <DetailRow label="JAMB Score" value={`${candidate.jambScore} / 400`} />
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">Screening Date</p>
                  <p className="mt-1 text-sm font-bold">{slip.screeningDate}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">Screening Venue</p>
                  <p className="mt-1 text-sm font-bold">{slip.venue}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">Payment Reference</p>
                  <p className="mt-1 text-sm font-bold">{slip.paymentReference}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">Application Status</p>
                  <p className="mt-1 text-sm font-bold text-success">{slip.status}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-xs leading-relaxed text-foreground/60">
              <p className="font-semibold uppercase tracking-wide text-foreground/70">Instructions to candidates</p>
              <ol className="mt-2 list-decimal space-y-1 pl-4">
                <li>Bring this slip, your JAMB result slip, and a valid ID to the screening venue.</li>
                <li>Arrive at least one hour before your scheduled screening time.</li>
                <li>Mobile phones and electronic devices are not allowed in the screening hall.</li>
              </ol>
            </div>

            <div className="mt-8 flex items-end justify-between gap-6">
              <div className="text-xs text-foreground/50">
                <p>Generated 12 September 2026</p>
                <p className="mt-1 font-mono">{slip.applicationNumber}</p>
              </div>
              <div className="text-center">
                <div className="h-10 w-40 border-b border-foreground/30" />
                <p className="mt-1 text-xs text-foreground/50">Registrar's Signature</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 print:hidden sm:flex-row">
          <Button className="flex-1" onClick={() => window.print()}>
            Print
          </Button>
          <Button variant="ink" className="flex-1" onClick={download}>
            Download PDF
          </Button>
          <Link
            to="/dashboard"
            className="frost inline-flex flex-1 items-center justify-center rounded-xl border border-white/50 bg-white/50 px-6 py-3 text-sm font-semibold text-foreground/80 transition hover:bg-white/70"
          >
            Back to Dashboard
          </Link>
        </div>

        <p className="text-center text-xs text-foreground/50 print:hidden">
          Prototype only — use your browser's "Save as PDF" option when printing. Mock data shown.
        </p>
      </div>
    </DashboardShell>
  );
}
