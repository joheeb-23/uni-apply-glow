import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Badge, Button, Card } from "@/components/ui/primitives";
import { mockCandidate } from "@/data/candidate";
import { requiredDocuments } from "@/data/documents";

export const Route = createFileRoute("/review")({
  head: () => ({
    meta: [
      { title: "Review Application | Northbridge University" },
      {
        name: "description",
        content:
          "Review your personal information, academic details, next of kin, documents and payment before submitting your Post-UTME application.",
      },
      { property: "og:title", content: "Review Application | Northbridge University" },
      {
        property: "og:description",
        content:
          "Review your personal information, academic details, next of kin, documents and payment before submitting your Post-UTME application.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReviewPage,
});

const reviewDocuments = [
  { name: "Passport Photograph", file: "passport-photo.jpg" },
  { name: "O'Level Result", file: "waec-result.pdf" },
  { name: "JAMB Result", file: "jamb-result-slip.pdf" },
  { name: "Birth Certificate", file: null },
  { name: "NIN Slip", file: null },
  { name: "Other Required Documents", file: null },
];

const payment = {
  fee: "₦5,000",
  reference: "POSTUTME-2026-001245",
  status: "Paid",
  date: "12 September 2026",
};

const nextOfKin = {
  name: "Adebola Johnson",
  relationship: "Father",
  phone: "+234 802 444 0117",
  address: "14 Ijaiye Road, Abeokuta, Ogun State",
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/60 bg-white/50 px-4 py-3">
      <p className="text-xs font-semibold text-foreground/50">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function Section({
  title,
  editTo,
  children,
}: {
  title: string;
  editTo: "/application" | "/documents" | "/payment";
  children: ReactNode;
}) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold tracking-tight">{title}</h2>
        <Link
          to={editTo}
          className="inline-flex items-center rounded-xl border border-white/50 bg-white/50 px-4 py-2 text-xs font-semibold text-foreground/70 transition hover:bg-white/70 hover:text-primary"
        >
          Edit
        </Link>
      </div>
      {children}
    </Card>
  );
}

function ReviewPage() {
  const candidate = mockCandidate;
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [checkboxError, setCheckboxError] = useState(false);

  const uploaded = reviewDocuments.filter((d) => d.file).length;

  const submit = () => {
    if (!confirmed) {
      setCheckboxError(true);
      return;
    }
    setShowConfirm(true);
  };

  return (
    <DashboardShell active="My Application">
      <div className="space-y-6">
        <Card elevated>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Review</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Application Review</h1>
              <p className="mt-1 text-sm text-foreground/60">
                Confirm that all information provided is correct before submitting.
              </p>
            </div>
            <Badge tone={submitted ? "success" : "brand"}>
              {submitted ? "Submitted" : "Awaiting submission"}
            </Badge>
          </div>
        </Card>

        {submitted && (
          <div className="frost rounded-2xl border border-success/30 bg-success/10 p-4 text-sm font-semibold text-success">
            Application submitted successfully (demo). Reference APP-2026-004512. You can print your screening slip from
            the dashboard.
          </div>
        )}

        <Section title="Personal Information" editTo="/application">
          <div className="grid gap-3 sm:grid-cols-2">
            <Row label="Full Name" value={candidate.fullName} />
            <Row label="Date of Birth" value="18 April 2006" />
            <Row label="Gender" value="Male" />
            <Row label="Phone Number" value={candidate.phone} />
            <Row label="Email" value={candidate.email} />
            <Row label="State of Origin" value={candidate.stateOfOrigin} />
            <Row label="Local Government" value={candidate.localGovernment} />
            <Row label="Home Address" value="14 Ijaiye Road, Abeokuta, Ogun State" />
          </div>
        </Section>

        <Section title="Academic Information" editTo="/application">
          <div className="grid gap-3 sm:grid-cols-2">
            <Row label="JAMB Registration Number" value={candidate.jambReg} />
            <Row label="JAMB Score" value={`${candidate.jambScore} / 400`} />
            <Row label="Examination Year" value={candidate.examinationYear} />
            <Row label="Programme" value={candidate.programme} />
          </div>
          <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-foreground/40">
            O'Level Result
          </p>
          <div className="overflow-hidden rounded-xl border border-white/60">
            <table className="w-full text-sm">
              <thead className="bg-white/60 text-left text-xs font-semibold text-foreground/50">
                <tr>
                  <th className="px-4 py-2">Subject</th>
                  <th className="px-4 py-2">Grade</th>
                </tr>
              </thead>
              <tbody>
                {candidate.oLevel.map((row) => (
                  <tr key={row.subject} className="border-t border-white/60 bg-white/40">
                    <td className="px-4 py-2">{row.subject}</td>
                    <td className="px-4 py-2 font-semibold text-primary">{row.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Next of Kin" editTo="/application">
          <div className="grid gap-3 sm:grid-cols-2">
            <Row label="Full Name" value={nextOfKin.name} />
            <Row label="Relationship" value={nextOfKin.relationship} />
            <Row label="Phone Number" value={nextOfKin.phone} />
            <Row label="Address" value={nextOfKin.address} />
          </div>
        </Section>

        <Section title={`Documents (${uploaded}/${requiredDocuments.length} uploaded)`} editTo="/documents">
          <ul className="space-y-2">
            {reviewDocuments.map((doc) => (
              <li
                key={doc.name}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/60 bg-white/50 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{doc.name}</p>
                  {doc.file && <p className="truncate text-xs text-foreground/50">{doc.file}</p>}
                </div>
                <Badge tone={doc.file ? "success" : "neutral"}>{doc.file ? "Uploaded" : "Pending"}</Badge>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Payment" editTo="/payment">
          <div className="grid gap-3 sm:grid-cols-2">
            <Row label="Application Fee" value={payment.fee} />
            <Row label="Payment Reference" value={payment.reference} />
            <Row label="Date" value={payment.date} />
            <div className="rounded-xl border border-white/60 bg-white/50 px-4 py-3">
              <p className="text-xs font-semibold text-foreground/50">Payment Status</p>
              <Badge className="mt-2" tone="success">
                {payment.status}
              </Badge>
            </div>
          </div>
        </Section>

        <Card elevated>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={confirmed}
              disabled={submitted}
              onChange={(e) => {
                setConfirmed(e.target.checked);
                if (e.target.checked) setCheckboxError(false);
              }}
              className="mt-1 size-4 accent-primary"
            />
            <span className="text-sm text-foreground/70">
              I confirm that the information provided is accurate.
            </span>
          </label>
          {checkboxError && (
            <p className="mt-2 text-xs font-semibold text-destructive">
              Please confirm that your information is accurate before submitting.
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button onClick={submit} disabled={submitted}>
              {submitted ? "Application Submitted" : "Submit Application"}
            </Button>
            <span className="text-xs text-foreground/50">Prototype only — nothing is stored.</span>
          </div>
        </Card>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm">
          <div className="glass edge w-full max-w-md rounded-3xl p-6">
            <h3 className="text-lg font-bold tracking-tight">Submit application?</h3>
            <p className="mt-3 text-sm text-foreground/70">
              You are about to submit your Post-UTME application for {candidate.programme}. Once submitted, you will no
              longer be able to edit your details.
            </p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <Button variant="glass" onClick={() => setShowConfirm(false)}>
                Go Back
              </Button>
              <Button
                onClick={() => {
                  setShowConfirm(false);
                  setSubmitted(true);
                }}
              >
                Yes, Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
