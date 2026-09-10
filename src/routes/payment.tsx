import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { StepProgress } from "@/components/StepProgress";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Badge, Button, Card, SectionHeading } from "@/components/ui/primitives";
import { mockCandidate } from "@/data/candidate";

export const Route = createFileRoute("/payment")({
  head: () => ({
    meta: [
      { title: "Payment | Northbridge University" },
      {
        name: "description",
        content:
          "Pay the Post-UTME application fee securely online and view your payment receipt.",
      },
      { property: "og:title", content: "Payment | Northbridge University" },
      {
        property: "og:description",
        content:
          "Pay the Post-UTME application fee securely online and view your payment receipt.",
      },
    ],
  }),
  component: PaymentPage,
});

type PayStatus = "unpaid" | "processing" | "successful" | "failed";

const FEE = 5000;
const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;

function genReference() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `POSTUTME-2026-${n}`;
}

function PaymentPage() {
  const candidate = mockCandidate;
  const [status, setStatus] = useState<PayStatus>("unpaid");
  const [reference, setReference] = useState<string>("POSTUTME-2026-001245");
  const [demoFailed, setDemoFailed] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const pay = () => {
    if (status === "processing") return;
    setStatus("processing");
    setShowReceipt(false);
    setTimeout(() => {
      if (demoFailed) {
        setStatus("failed");
        setDemoFailed(false);
      } else {
        setReference(genReference());
        setStatus("successful");
      }
    }, 1500);
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-24 size-[42rem] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute right-[-8rem] top-40 size-[34rem] rounded-full bg-sky-300/30 blur-[120px]" />
      </div>

      <SiteHeader onLogin={() => {}} onApply={() => {}} />

      <StepProgress current="payment" />

      <main className="mx-auto max-w-7xl px-5 pb-20 pt-8 lg:px-8">
        <SectionHeading eyebrow="Step 3 of 7" title="Payment" />

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          {/* Payment card */}
          <Card elevated>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Application Fee
              </p>
              <StatusBadge status={status} />
            </div>

            <dl className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <Detail label="Candidate" value={candidate.fullName} />
              <Detail label="JAMB Reg" value={candidate.jambReg} />
              <Detail label="Programme" value={candidate.programme} />
              <Detail label="Application Fee" value={naira(FEE)} />
              <Detail label="Payment Reference" value={reference} />
              <Detail label="Payment Status" value={labelFor(status)} />
            </dl>

            {/* State banners */}
            <div className="mt-6">
              {status === "unpaid" && (
                <div className="rounded-2xl border border-warning-border bg-warning-surface/60 p-5">
                  <p className="font-display text-lg font-bold text-warning-foreground">
                    Payment required
                  </p>
                  <p className="mt-2 text-sm text-foreground/60">
                    Pay the {naira(FEE)} application fee to continue your
                    Post-UTME application. Payment is secured online.
                  </p>
                </div>
              )}

              {status === "processing" && (
                <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5">
                  <p className="font-display text-lg font-bold text-primary">
                    Processing payment…
                  </p>
                  <p className="mt-2 text-sm text-foreground/60">
                    Please wait while we confirm your transaction. Do not close
                    this window.
                  </p>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-primary/20">
                    <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
                  </div>
                </div>
              )}

              {status === "successful" && (
                <div className="rounded-2xl border border-success/30 bg-success/10 p-5">
                  <p className="font-display text-lg font-bold text-success">
                    Payment Successful
                  </p>
                  <p className="mt-2 text-sm text-foreground/60">
                    Your application fee of {naira(FEE)} has been received.
                    Reference: <span className="font-semibold">{reference}</span>.
                  </p>
                </div>
              )}

              {status === "failed" && (
                <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-5">
                  <p className="font-display text-lg font-bold text-destructive">
                    Payment Failed
                  </p>
                  <p className="mt-2 text-sm text-foreground/60">
                    The transaction could not be completed. No amount was
                    deducted. Please try again.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <Link to="/eligibility">
                <Button variant="ghost">← Back to Eligibility</Button>
              </Link>

              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-foreground/50">
                  <input
                    type="checkbox"
                    checked={demoFailed}
                    onChange={(e) => setDemoFailed(e.target.checked)}
                    disabled={status === "processing"}
                    className="size-4 rounded border-foreground/20"
                  />
                  Demo failed payment
                </label>

                {status === "successful" ? (
                  <>
                    <Button variant="glass" onClick={() => setShowReceipt(true)}>
                      View Receipt
                    </Button>
                    <Button>Continue Application →</Button>
                  </>
                ) : (
                  <Button
                    onClick={pay}
                    disabled={status === "processing"}
                  >
                    {status === "processing"
                      ? "Processing…"
                      : status === "failed"
                        ? "Retry Payment"
                        : "Pay Application Fee"}
                  </Button>
                )}
              </div>
            </div>

            <p className="mt-3 text-center text-[11px] text-foreground/40">
              This is a UI prototype — no real payment is processed.
            </p>
          </Card>

          {/* Side panel */}
          <div className="space-y-6">
            <Card>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Fee summary
              </p>
              <div className="mt-4 space-y-3 text-sm">
                <Row label="Application fee" value={naira(FEE)} />
                <Row label="Processing" value="₦0" />
                <div className="h-px bg-foreground/10" />
                <div className="flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{naira(FEE)}</span>
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
                <li className="flex gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    6
                  </span>
                  Review and submit your application.
                </li>
              </ol>
            </Card>
          </div>
        </div>
      </main>

      <SiteFooter />

      {showReceipt && (
        <ReceiptModal
          reference={reference}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
}

function labelFor(status: PayStatus) {
  switch (status) {
    case "unpaid":
      return "Unpaid";
    case "processing":
      return "Processing";
    case "successful":
      return "Successful";
    case "failed":
      return "Failed";
  }
}

function StatusBadge({ status }: { status: PayStatus }) {
  if (status === "successful") return <Badge tone="success">Successful</Badge>;
  if (status === "processing")
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
        <span className="size-1.5 animate-pulse rounded-full bg-primary" />
        Processing
      </span>
    );
  if (status === "failed")
    return (
      <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-1 text-[11px] font-semibold text-destructive">
        Failed
      </span>
    );
  return <Badge tone="neutral">Unpaid</Badge>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-foreground/40">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-foreground/80">{value}</dd>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-foreground/60">
      <span>{label}</span>
      <span className="font-medium text-foreground/80">{value}</span>
    </div>
  );
}

function ReceiptModal({
  reference,
  onClose,
}: {
  reference: string;
  onClose: () => void;
}) {
  const today = new Date().toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm">
      <div className="glass edge w-full max-w-lg rounded-3xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Payment Receipt
            </p>
            <h3 className="mt-1 text-lg font-bold tracking-tight">
              {mockCandidate.institution}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-lg px-2 text-foreground/50 transition hover:text-primary"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-white/50 bg-white/40 p-5">
          <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
            <Detail label="Candidate" value={mockCandidate.fullName} />
            <Detail label="JAMB Reg" value={mockCandidate.jambReg} />
            <Detail label="Programme" value={mockCandidate.programme} />
            <Detail label="Payment Type" value="Post-UTME Application Fee" />
            <Detail label="Amount" value={naira(FEE)} />
            <Detail label="Transaction Ref" value={reference} />
            <Detail label="Date" value={today} />
            <Detail label="Status" value="Successful" />
          </dl>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="glass" className="flex-1" onClick={() => window.print()}>
            Print Receipt
          </Button>
          <Button className="flex-1" onClick={onClose}>
            Download Receipt
          </Button>
        </div>
        <p className="mt-3 text-center text-[11px] text-foreground/40">
          This is a UI prototype — receipt is mock/demo data.
        </p>
      </div>
    </div>
  );
}
