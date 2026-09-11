import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Alert, Badge, Button, Card, Field, TextField } from "@/components/ui/primitives";
import { mockCandidate } from "@/data/candidate";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/application")({
  head: () => ({
    meta: [
      { title: "Application Form | Northbridge University" },
      {
        name: "description",
        content:
          "Complete your Post-UTME application form: personal details, academic records, next of kin and birth information.",
      },
      { property: "og:title", content: "Application Form | Northbridge University" },
      {
        property: "og:description",
        content:
          "Complete your Post-UTME application form: personal details, academic records, next of kin and birth information.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ApplicationPage,
});

const sections = ["Personal Information", "Academic Information", "Next of Kin", "Birth Information"];

type FormState = {
  fullName: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  stateOfOrigin: string;
  lga: string;
  address: string;
  kinName: string;
  kinRelationship: string;
  kinPhone: string;
  kinAddress: string;
  placeOfBirth: string;
  nationality: string;
  religion: string;
  maritalStatus: string;
  birthCertificate: string;
};

const initialForm: FormState = {
  fullName: mockCandidate.fullName,
  dob: "2006-04-18",
  gender: "Male",
  phone: mockCandidate.phone,
  email: mockCandidate.email,
  stateOfOrigin: mockCandidate.stateOfOrigin,
  lga: mockCandidate.localGovernment,
  address: "14 Ijaiye Road, Abeokuta, Ogun State",
  kinName: "Adebola Johnson",
  kinRelationship: "Father",
  kinPhone: "+234 802 444 0117",
  kinAddress: "14 Ijaiye Road, Abeokuta, Ogun State",
  placeOfBirth: "Abeokuta, Ogun State",
  nationality: "Nigerian",
  religion: "Christianity",
  maritalStatus: "Single",
  birthCertificate: "",
};

const genders = ["Male", "Female"];
const relationships = ["Father", "Mother", "Guardian", "Sibling", "Spouse"];
const maritalStatuses = ["Single", "Married"];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+0-9][0-9\s-]{8,}$/;

function validate(step: number, form: FormState): Partial<Record<keyof FormState, string>> {
  const e: Partial<Record<keyof FormState, string>> = {};
  if (step === 0) {
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    else if (form.fullName.trim().length < 5) e.fullName = "Enter your full name as it appears on JAMB.";
    if (!form.dob) e.dob = "Date of birth is required.";
    if (!form.gender) e.gender = "Select your gender.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    else if (!phonePattern.test(form.phone.trim())) e.phone = "Enter a valid phone number.";
    if (!form.email.trim()) e.email = "Email address is required.";
    else if (!emailPattern.test(form.email.trim())) e.email = "Enter a valid email address.";
    if (!form.stateOfOrigin.trim()) e.stateOfOrigin = "State of origin is required.";
    if (!form.lga.trim()) e.lga = "Local government is required.";
    if (form.address.trim().length < 10) e.address = "Enter your full home address.";
  }
  if (step === 2) {
    if (!form.kinName.trim()) e.kinName = "Next of kin name is required.";
    if (!form.kinRelationship) e.kinRelationship = "Select a relationship.";
    if (!form.kinPhone.trim()) e.kinPhone = "Phone number is required.";
    else if (!phonePattern.test(form.kinPhone.trim())) e.kinPhone = "Enter a valid phone number.";
    if (form.kinAddress.trim().length < 10) e.kinAddress = "Enter the full address.";
  }
  if (step === 3) {
    if (!form.placeOfBirth.trim()) e.placeOfBirth = "Place of birth is required.";
    if (!form.nationality.trim()) e.nationality = "Nationality is required.";
    if (!form.maritalStatus) e.maritalStatus = "Select your marital status.";
    if (!form.birthCertificate) e.birthCertificate = "Attach your birth certificate or age declaration.";
  }
  return e;
}

function ErrorText({ children }: { children?: string | undefined }) {
  if (!children) return null;
  return <p className="mt-1 text-xs font-semibold text-destructive">{children}</p>;
}

const selectClass =
  "mt-2 w-full rounded-xl border border-white/60 bg-white/70 px-4 py-3 text-sm text-foreground outline-none focus:border-primary/40";

function ApplicationPage() {
  const candidate = mockCandidate;
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [saved, setSaved] = useState<string | null>(null);

  const set = (key: keyof FormState) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setSaved(null);
  };

  const next = () => {
    const e = validate(step, form);
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSaved(null);
    setStep((s) => Math.min(s + 1, sections.length - 1));
  };

  const previous = () => {
    setErrors({});
    setSaved(null);
    setStep((s) => Math.max(s - 1, 0));
  };

  const saveAndContinue = () => {
    const e = validate(step, form);
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSaved(`${sections[step] ?? "Section"} saved locally (demo only).`);
    if (step < sections.length - 1) setStep((s) => s + 1);
  };

  const percent = Math.round(((step + 1) / sections.length) * 100);
  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <DashboardShell active="My Application">
      <div className="space-y-6">
        <Card elevated>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Application form</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{sections[step] ?? ""}</h1>
              <p className="mt-1 text-sm text-foreground/60">
                Step {step + 1} of {sections.length} · {candidate.programme}
              </p>
            </div>
            <Badge tone="brand">{percent}% complete</Badge>
          </div>

          <ol className="mt-5 flex flex-wrap gap-2">
            {sections.map((label, i) => (
              <li key={label}>
                <button
                  type="button"
                  onClick={() => {
                    setErrors({});
                    setStep(i);
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                    i === step
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-brand)]"
                      : i < step
                        ? "bg-primary/10 text-primary"
                        : "bg-foreground/5 text-foreground/40",
                  )}
                >
                  <span className="grid size-5 place-items-center rounded-full bg-white/25 text-[10px] font-bold">
                    {i < step ? "✓" : i + 1}
                  </span>
                  {label}
                </button>
              </li>
            ))}
          </ol>

          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-foreground/10">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
          </div>
        </Card>

        {hasErrors && (
          <Alert>Some fields need attention. Correct the highlighted entries and try again.</Alert>
        )}
        {saved && (
          <div className="frost rounded-2xl border border-success/30 bg-success/10 p-4 text-sm font-semibold text-success">
            {saved}
          </div>
        )}

        <Card elevated>
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              next();
            }}
            noValidate
          >
            {step === 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Field
                    label="Full Name"
                    value={form.fullName}
                    onChange={(e) => set("fullName")(e.target.value)}
                  />
                  <ErrorText>{errors.fullName}</ErrorText>
                </div>
                <div>
                  <Field
                    label="Date of Birth"
                    type="date"
                    value={form.dob}
                    onChange={(e) => set("dob")(e.target.value)}
                  />
                  <ErrorText>{errors.dob}</ErrorText>
                </div>
                <div>
                  <label className="block">
                    <span className="text-xs font-semibold text-foreground/50">Gender</span>
                    <select
                      className={selectClass}
                      value={form.gender}
                      onChange={(e) => set("gender")(e.target.value)}
                    >
                      <option value="">Select gender</option>
                      {genders.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </label>
                  <ErrorText>{errors.gender}</ErrorText>
                </div>
                <div>
                  <Field label="Phone Number" value={form.phone} onChange={(e) => set("phone")(e.target.value)} />
                  <ErrorText>{errors.phone}</ErrorText>
                </div>
                <div>
                  <Field label="Email" type="email" value={form.email} onChange={(e) => set("email")(e.target.value)} />
                  <ErrorText>{errors.email}</ErrorText>
                </div>
                <div>
                  <Field
                    label="State of Origin"
                    value={form.stateOfOrigin}
                    onChange={(e) => set("stateOfOrigin")(e.target.value)}
                  />
                  <ErrorText>{errors.stateOfOrigin}</ErrorText>
                </div>
                <div>
                  <Field label="Local Government" value={form.lga} onChange={(e) => set("lga")(e.target.value)} />
                  <ErrorText>{errors.lga}</ErrorText>
                </div>
                <div className="sm:col-span-2">
                  <TextField
                    label="Home Address"
                    rows={3}
                    value={form.address}
                    onChange={(e) => set("address")(e.target.value)}
                  />
                  <ErrorText>{errors.address}</ErrorText>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <p className="text-sm text-foreground/60">
                  These details are pulled from your verified JAMB record and cannot be edited.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    ["JAMB Registration Number", candidate.jambReg],
                    ["JAMB Score", `${candidate.jambScore} / 400`],
                    ["Examination Year", candidate.examinationYear],
                    ["Programme", candidate.programme],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-white/60 bg-white/50 px-4 py-3">
                      <p className="text-xs font-semibold text-foreground/50">{label}</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-foreground/40">
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
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Field label="Full Name" value={form.kinName} onChange={(e) => set("kinName")(e.target.value)} />
                  <ErrorText>{errors.kinName}</ErrorText>
                </div>
                <div>
                  <label className="block">
                    <span className="text-xs font-semibold text-foreground/50">Relationship</span>
                    <select
                      className={selectClass}
                      value={form.kinRelationship}
                      onChange={(e) => set("kinRelationship")(e.target.value)}
                    >
                      <option value="">Select relationship</option>
                      {relationships.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </label>
                  <ErrorText>{errors.kinRelationship}</ErrorText>
                </div>
                <div>
                  <Field label="Phone Number" value={form.kinPhone} onChange={(e) => set("kinPhone")(e.target.value)} />
                  <ErrorText>{errors.kinPhone}</ErrorText>
                </div>
                <div className="sm:col-span-2">
                  <TextField
                    label="Address"
                    rows={3}
                    value={form.kinAddress}
                    onChange={(e) => set("kinAddress")(e.target.value)}
                  />
                  <ErrorText>{errors.kinAddress}</ErrorText>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Field
                    label="Place of Birth"
                    value={form.placeOfBirth}
                    onChange={(e) => set("placeOfBirth")(e.target.value)}
                  />
                  <ErrorText>{errors.placeOfBirth}</ErrorText>
                </div>
                <div>
                  <Field
                    label="Nationality"
                    value={form.nationality}
                    onChange={(e) => set("nationality")(e.target.value)}
                  />
                  <ErrorText>{errors.nationality}</ErrorText>
                </div>
                <div>
                  <Field label="Religion" value={form.religion} onChange={(e) => set("religion")(e.target.value)} />
                </div>
                <div>
                  <label className="block">
                    <span className="text-xs font-semibold text-foreground/50">Marital Status</span>
                    <select
                      className={selectClass}
                      value={form.maritalStatus}
                      onChange={(e) => set("maritalStatus")(e.target.value)}
                    >
                      <option value="">Select status</option>
                      {maritalStatuses.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </label>
                  <ErrorText>{errors.maritalStatus}</ErrorText>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold text-foreground/50">
                    Birth Certificate / Age Declaration
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-primary/30 bg-white/50 p-4">
                    <span className="text-sm text-foreground/60">
                      {form.birthCertificate || "No file attached (PDF or JPG, max 2MB)"}
                    </span>
                    <Button
                      type="button"
                      variant="glass"
                      className="px-4 py-2"
                      onClick={() => set("birthCertificate")("birth-certificate.pdf")}
                    >
                      Attach document
                    </Button>
                  </div>
                  <ErrorText>{errors.birthCertificate}</ErrorText>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/60 pt-5">
              <Button type="button" variant="glass" onClick={previous} disabled={step === 0}>
                Previous
              </Button>
              <Button type="button" variant="ink" onClick={saveAndContinue}>
                Save &amp; Continue
              </Button>
              {step < sections.length - 1 ? (
                <Button type="submit">Next</Button>
              ) : (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-brand)] transition hover:bg-primary/90"
                >
                  Back to Dashboard
                </Link>
              )}
              <span className="ml-auto text-xs text-foreground/50">
                Prototype only — nothing is stored.
              </span>
            </div>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}
