import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { StepProgress } from "@/components/StepProgress";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  Badge,
  Button,
  Card,
  Field,
  SectionHeading,
} from "@/components/ui/primitives";
import { examinationYears, mockCandidate, type Candidate } from "@/data/candidate";

export const Route = createFileRoute("/verify")({
  head: () => ({
    meta: [
      { title: "Candidate Verification | Northbridge University" },
      {
        name: "description",
        content:
          "Verify your JAMB registration details to begin the Northbridge University Post-UTME application.",
      },
      { property: "og:title", content: "Candidate Verification | Northbridge University" },
      {
        property: "og:description",
        content:
          "Verify your JAMB registration details to begin the Post-UTME application.",
      },
    ],
  }),
  component: VerifyPage,
});

function VerifyPage() {
  const [jambReg, setJambReg] = useState("");
  const [examYear, setExamYear] = useState(examinationYears[0]);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState<Candidate | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!/^\d{10}$/.test(jambReg.trim())) {
      setError("Enter a valid 10-digit JAMB registration number.");
      return;
    }
    setLoading(true);
    setVerified(null);
    setTimeout(() => {
      const result: Candidate = { ...mockCandidate, jambReg: jambReg.trim(), examinationYear: examYear };
      setVerified(result);
      setLoading(false);
    }, 900);
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-24 size-[42rem] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute right-[-8rem] top-40 size-[34rem] rounded-full bg-sky-300/30 blur-[120px]" />
      </div>

      <SiteHeader
        onLogin={() => {}}
        onApply={() => {}}
      />

      <StepProgress current="verification" />

      <main className="mx-auto max-w-7xl px-5 pb-20 pt-8 lg:px-8">
        <SectionHeading eyebrow="Step 1 of 7" title="Candidate Verification" />

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Verification form */}
          <Card elevated>
            <form onSubmit={handleVerify}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                JAMB verification
              </p>
              <p className="mt-2 text-sm text-foreground/60">
                Enter your JAMB registration number to verify your candidate
                record before starting the Post-UTME application.
              </p>

              <Field
                label="JAMB Registration Number"
                placeholder="e.g. 98765432100"
                className="mt-5"
                value={jambReg}
                onChange={(e) =>
                  setJambReg((e.target as HTMLInputElement).value.replace(/\D/g, ""))
                }
                maxLength={10}
                inputMode="numeric"
              />

              <label className="mt-4 block">
                <span className="text-xs font-semibold text-foreground/50">
                  Examination Year
                </span>
                <select
                  value={examYear}
                  onChange={(e) => setExamYear(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/60 bg-white/70 px-4 py-3 text-sm text-foreground outline-none focus:border-primary/40"
                >
                  {examinationYears.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </label>

              {error && (
                <p className="mt-4 text-sm font-semibold text-destructive">{error}</p>
              )}

              <Button type="submit" className="mt-6 w-full" disabled={loading}>
                {loading ? "Verifying…" : "Verify Candidate"}
              </Button>

              <p className="mt-3 text-center text-[11px] text-foreground/40">
                This is a UI prototype — verification is simulated with mock data.
              </p>
            </form>
          </Card>

          {/* Result panel */}
          <div>
            {!verified && !loading && (
              <Card className="grid h-full min-h-64 place-items-center text-center">
                <div>
                  <span className="grid size-12 mx-auto place-items-center rounded-full bg-primary/10 text-xl text-primary">
                    ✓
                  </span>
                  <p className="mt-3 text-sm font-semibold text-foreground/60">
                    Your verified details will appear here
                  </p>
                  <p className="mt-1 text-xs text-foreground/40">
                    Submit the form to simulate verification.
                  </p>
                </div>
              </Card>
            )}

            {loading && (
              <Card className="grid h-full min-h-64 place-items-center text-center">
                <div>
                  <span className="grid size-12 mx-auto place-items-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    ⏳
                  </span>
                  <p className="mt-3 text-sm font-semibold text-foreground/60">
                    Contacting JAMB records…
                  </p>
                </div>
              </Card>
            )}

            {verified && (
              <Card elevated>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-display text-sm font-bold text-foreground/80">
                    Candidate Record
                  </p>
                  <Badge tone="success">Verified</Badge>
                </div>

                <div className="mt-5 flex flex-col gap-5 sm:flex-row">
                  <img
                    src={verified.photo}
                    alt={`${verified.fullName} candidate photograph`}
                    className="size-24 shrink-0 rounded-2xl object-cover shadow-[var(--shadow-edge-sm)]"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <p className="font-display text-lg font-bold leading-tight">
                      {verified.fullName}
                    </p>
                    <p className="mt-1 text-xs text-foreground/50">
                      JAMB Reg: {verified.jambReg} · {verified.examinationYear}
                    </p>
                    <p className="mt-1 text-xs text-foreground/50">
                      {verified.institution}
                    </p>
                  </div>
                </div>

                <dl className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                  <Detail label="JAMB Score" value={`${verified.jambScore}`} />
                  <Detail label="Programme" value={verified.programme} />
                  <Detail label="Email" value={verified.email} />
                  <Detail label="Phone" value={verified.phone} />
                  <Detail label="State of Origin" value={verified.stateOfOrigin} />
                  <Detail label="Local Government" value={verified.localGovernment} />
                </dl>

                <div className="mt-6">
                  <p className="text-xs font-semibold text-foreground/40">
                    O'Level Result
                  </p>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {verified.oLevel.map((row) => (
                      <li
                        key={row.subject}
                        className="frost flex items-center justify-between rounded-xl border border-white/50 bg-white/40 px-3 py-2 text-sm"
                      >
                        <span className="text-foreground/70">{row.subject}</span>
                        <Badge tone="neutral">{row.grade}</Badge>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-foreground/50">
                    Records match JAMB. You can now check eligibility.
                  </p>
                  <Link to="/eligibility">
                    <Button>Continue to Eligibility →</Button>
                  </Link>
                </div>
              </Card>
            )}
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
