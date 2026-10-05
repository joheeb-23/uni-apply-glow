import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { AdminShell } from "@/components/AdminShell";
import { Badge, Button, Card } from "@/components/ui/primitives";
import { StatusPill } from "@/components/StatusPill";
import { adminCandidates, allStatuses, type AppStatus } from "@/data/admin";

export const Route = createFileRoute("/admin/candidates/$id")({
  loader: ({ params }) => {
    const candidate = adminCandidates.find((c) => c.id === params.id);
    if (!candidate) throw notFound();
    return { candidate };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Candidate not found" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.candidate.name} | Candidate Profile`;
    const d = `Admissions profile for ${loaderData.candidate.name}, ${loaderData.candidate.programme}.`;
    return { meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "profile" }, { name: "twitter:card", content: "summary" }] };
  },
  notFoundComponent: CandidateNotFound,
  component: CandidateDetail,
});

function CandidateNotFound() {
  return (
    <AdminShell active="Candidates" title="Candidate not found">
      <Card><p>No candidate with this ID exists.</p><Link to="/admin" className="mt-3 inline-block font-semibold text-primary">← Back to candidates</Link></Card>
    </AdminShell>
  );
}

const docNames = ["Passport Photograph", "O'Level Result", "JAMB Result", "Birth Certificate", "NIN"];

function CandidateDetail() {
  const { candidate: c } = Route.useLoaderData();
  const [status, setStatus] = useState<AppStatus>(c.status);
  const [modal, setModal] = useState<null | "app" | "docs" | "status">(null);
  const [draft, setDraft] = useState<AppStatus>(c.status);
  const [docState, setDocState] = useState<Record<string, "Pending" | "Approved" | "Rejected">>({});
  const [toast, setToast] = useState("");

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  return (
    <AdminShell active="Candidates" title="Candidate Profile">
      <Link to="/admin" className="text-sm font-semibold text-primary">← Back to candidates</Link>

      <Card elevated className="mt-4">
        <div className="flex flex-wrap items-center gap-5">
          <img src={c.photo} alt={c.name} className="size-20 shrink-0 rounded-2xl object-cover" />
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold tracking-tight">{c.name}</h2>
            <p className="text-sm text-foreground/60">{c.programme} · JAMB {c.jambReg}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge tone={c.eligible ? "success" : "neutral"}>{c.eligible ? "Eligible" : "Not Eligible"}</Badge>
              <StatusPill status={status} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="glass" onClick={() => setModal("app")}>Review Application</Button>
            <Button variant="glass" onClick={() => setModal("docs")}>Review Documents</Button>
            <Button onClick={() => { setDraft(status); setModal("status"); }}>Update Status</Button>
          </div>
        </div>
        {toast && <p className="mt-4 rounded-xl bg-success/10 px-4 py-2 text-sm font-semibold text-success">{toast}</p>}
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Section title="Personal Information">
          <D l="Full Name" v={c.name} /><D l="Gender" v={c.gender} /><D l="Date of Birth" v={c.dob} />
          <D l="Phone" v={c.phone} /><D l="Email" v={c.email} /><D l="State / LGA" v={`${c.state} / ${c.lga}`} />
        </Section>
        <Section title="Academic Information">
          <D l="JAMB Reg. No." v={c.jambReg} /><D l="JAMB Score" v={`${c.score} / 400`} /><D l="Required Minimum" v="200" />
          <D l="Programme" v={c.programme} /><D l="Exam Year" v="2026" /><D l="O'Level" v="WAEC — 5 credits incl. English & Maths" />
        </Section>
        <Section title="Application">
          <D l="Application No." v={`PUTME/2026/${c.id.padStart(6, "0")}`} /><D l="Submitted" v={c.date} />
          <D l="Next of Kin" v="Mr. A. Parent (Father)" /><D l="Screening Venue" v="Main Auditorium" />
        </Section>
        <Section title="Payment">
          <D l="Application Fee" v="₦5,000" /><D l="Reference" v={c.reference} /><D l="Status" v={c.paid ? "Paid" : "Unpaid"} />
        </Section>
        <Section title="Documents">
          {docNames.map((d, i) => <D key={d} l={d} v={docState[d] ?? (i < c.docs ? "Uploaded" : "Missing")} />)}
        </Section>
        <Section title="Application Status">
          <D l="Current Status" v={status} /><D l="Eligibility" v={c.eligible ? "Eligible" : "Not Eligible"} /><D l="Last Updated" v="Today" />
        </Section>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm">
          <div className="glass edge w-full max-w-lg rounded-3xl p-6">
            {modal === "app" && (<>
              <h3 className="text-lg font-bold">Review Application</h3>
              <p className="mt-2 text-sm text-foreground/60">All sections have been completed by {c.name}. Mark the application as reviewed?</p>
              <div className="mt-5 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
                <Button onClick={() => { setStatus("Under Review"); setModal(null); flash("Application marked as Under Review."); }}>Mark as Reviewed</Button>
              </div>
            </>)}
            {modal === "docs" && (<>
              <h3 className="text-lg font-bold">Review Documents</h3>
              <ul className="mt-4 space-y-2">
                {docNames.map((d, i) => (
                  <li key={d} className="flex items-center justify-between gap-2 rounded-xl bg-white/50 px-3 py-2 text-sm">
                    <span className="min-w-0 truncate font-semibold">{d}</span>
                    {i < c.docs ? (
                      <span className="flex shrink-0 gap-1">
                        <button onClick={() => setDocState((s) => ({ ...s, [d]: "Approved" }))} className={`rounded-lg px-2 py-1 text-xs font-semibold ${docState[d] === "Approved" ? "bg-success text-primary-foreground" : "bg-success/10 text-success"}`}>Approve</button>
                        <button onClick={() => setDocState((s) => ({ ...s, [d]: "Rejected" }))} className={`rounded-lg px-2 py-1 text-xs font-semibold ${docState[d] === "Rejected" ? "bg-destructive text-destructive-foreground" : "bg-destructive/10 text-destructive"}`}>Reject</button>
                      </span>
                    ) : <span className="text-xs text-foreground/40">Not uploaded</span>}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex justify-end"><Button onClick={() => { setModal(null); flash("Document review saved."); }}>Save Review</Button></div>
            </>)}
            {modal === "status" && (<>
              <h3 className="text-lg font-bold">Update Status</h3>
              <select aria-label="New status" value={draft} onChange={(e) => setDraft(e.target.value as AppStatus)} className="mt-4 w-full rounded-xl border border-foreground/10 bg-white/70 px-3 py-2.5 text-sm">
                {allStatuses.map((s) => <option key={s}>{s}</option>)}
              </select>
              <div className="mt-5 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
                <Button onClick={() => { setStatus(draft); setModal(null); flash(`Status updated to ${draft}.`); }}>Save Status</Button>
              </div>
            </>)}
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{title}</p>
      <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">{children}</dl>
    </Card>
  );
}

function D({ l, v }: { l: string; v: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-semibold uppercase tracking-wider text-foreground/40">{l}</dt>
      <dd className="mt-0.5 break-words font-semibold">{v}</dd>
    </div>
  );
}
