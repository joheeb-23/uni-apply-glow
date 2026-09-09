import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { StepProgress } from "@/components/StepProgress";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Badge, Button, Card, SectionHeading } from "@/components/ui/primitives";
import { mockCandidate, type Candidate } from "@/data/candidate";

export const Route = createFileRoute("/eligibility")({
  head: () => ({
    meta: [
      { title: "Eligibility Status | Northbridge University" },
      {
        name: "description",
        content:
          "Check your Post-UTME eligibility result — JAMB score, required minimum score and programme eligibility.",
      },
      { property: "og:title", content: "Eligibility Status | Northbridge University" },
      {
        property: "og:description",
        content:
          "Check your Post-UTME eligibility result and proceed to payment if eligible.",
      },
    ],
  }),
  component: EligibilityPage,
});

function EligibilityPage() {
  const candidate: Candidate = mockCandidate;
  const [eligible] = useState<boolean>(candidate.eligible);

  return (
    <div className="relative min-h-screen overflow-hidden text-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-24 size-[42rem] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute right-[-8rem] top-40 size-[34rem] rounded-full bg-sky-300/30 blur-[120px]" />
      </div>

      <SiteHeader onLogin={() => {}} onApply={() => {}} />

      <StepProgress current="eligibility" />

      <main className="mx-auto max-w-7xl px-5 pb-20 pt-8 lg:px-8">
        <SectionHeading eyebrow="Step 2 of 7" title="Eligibility" />

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          {/* Result card */}
          <Card elevated>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Eligibility Status
              </p>
              <Badge tone={eligible ? "success" : "neutral"}>
                {eligible ? "Eligible" : "Not Eligible"}
              </Badge>
            </div>

            {eligible ? (
              <div className="mt-5 rounded-2xl border border-success/30 bg-success/10 p-5">
                <p className="font-display text-lg font-bold text-success">
                  Congratulations! You are eligible to apply for Post-UTME
                  screening.
                </p>
                <p className="mt-2 text-sm text-foreground/60">
                  Your JAMB score meets the minimum requirement for your chosen
                  programme. Proceed to payment to continue your application.
                </p>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-destructive/30 bg-destructive/10 p-5">
                <p className="font-display text-lg font-bold text-destructive">
                  You are not eligible for this programme.
                </p>
                <p className="mt-2 text-sm text-foreground/60">
                  Your JAMB score is below the required minimum. Consider another
                  programme or reapply next session.
                </p>
              </div>
            )}

            <dl className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <Detail label="Candidate" value={candidate.fullName} />
              <Detail label="Programme" value={candidate.programme} />
              <Detail label="JAMB Score" value={`${candidate.jambScore}`} />
              <Detail
                label="Required Minimum Score"
                value={`${candidate.requiredScore}`}
              />
              <Detail label="JAMB Reg" value={candidate.jambReg} />
              <Detail
                label="Eligibility"
                value={eligible ? "Eligible" : "Not Eligible"}
              />
            </dl>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <Link to="/verify">
                <Button variant="ghost">← Back to Verification</Button>
              </Link>
              <Button disabled={!eligible}>
                Proceed to Payment →
              </Button>
            </div>
          </Card>

          {/* Summary side panel */}
          <div className="space-y-6">
            <Card>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Score breakdown
              </p>
              <div className="mt-4 space-y-4">
                <ScoreBar
                  label="Your JAMB Score"
                  value={candidate.jambScore}
                  max={400}
                  tone="brand"
                />
                <ScoreBar
                  label="Required Minimum"
                  value={candidate.requiredScore}
                  max={400}
                  tone="neutral"
                />
                <div className="frost rounded-xl border border-white/50 bg-white/40 p-4 text-sm">
                  <p className="font-semibold text-foreground/80">
                    Margin: +{candidate.jambScore - candidate.requiredScore}
                  </p>
                  <p className="mt-1 text-xs text-foreground/50">
                    You scored {candidate.jambScore - candidate.requiredScore}{" "}
                    points above the cut-off for {candidate.programme}.
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                What happens next
              </p>
              <ol className="mt-4 space-y-3 text-sm text-foreground/60">
                <li className="flex gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    3
                  </span>
                  Pay the screening fee securely online.
                </li>
                <li className="flex gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    4
                  </span>
                  Complete the application form with your details.
                </li>
                <li className="flex gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    5
                  </span>
                  Upload your passport, WAEC and JAMB slip.
                </li>
              </ol>
            </Card>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-foreground/40">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-foreground/80">{value}</dd>
    </div>
  );
}

function ScoreBar({
  label,
  value,
  max,
  tone,
}: {
  label: string;
  value: number;
  max: number;
  tone: "brand" | "neutral";
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold text-foreground/60">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-foreground/10">
        <div
          className={
            tone === "brand"
              ? "h-full rounded-full bg-primary"
              : "h-full rounded-full bg-foreground/30"
          }
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
