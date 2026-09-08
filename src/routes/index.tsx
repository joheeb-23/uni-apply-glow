import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  Alert,
  Badge,
  Button,
  Card,
  Field,
  Modal,
  SectionHeading,
  TextField,
} from "@/components/ui/primitives";
import {
  keyDates,
  mockStatus,
  processSteps,
  programmes,
  university,
} from "@/data/portal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Post-UTME Application Portal | Northbridge University" },
      {
        name: "description",
        content:
          "Apply for Northbridge University Post-UTME screening online, verify your JAMB details, pay, upload documents and monitor your admission status.",
      },
      { property: "og:title", content: "Post-UTME Application Portal | Northbridge University" },
      {
        property: "og:description",
        content:
          "Apply for Post-UTME screening online, verify your information and monitor your admission status.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const [modal, setModal] = useState<null | { title: string; body: string }>(null);
  const [statusResult, setStatusResult] = useState(false);

  const openModal = (title: string, body: string) => setModal({ title, body });

  const submitStatus = (e: FormEvent) => {
    e.preventDefault();
    setStatusResult(true);
  };

  const submitContact = (e: FormEvent) => {
    e.preventDefault();
    openModal(
      "Message sent",
      "Thank you for reaching out. The admissions office will respond within 2 working days. (Demo only — nothing was submitted.)",
    );
  };

  return (
    <div id="home" className="relative min-h-screen overflow-hidden text-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-24 size-[42rem] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute right-[-8rem] top-40 size-[34rem] rounded-full bg-sky-300/30 blur-[120px]" />
        <div className="absolute bottom-[-6rem] left-1/3 size-[30rem] rounded-full bg-teal-300/20 blur-[120px]" />
      </div>

      <SiteHeader
        onLogin={() =>
          openModal(
            "Applicant login",
            "This is a UI prototype, so sign-in is not connected. In the live portal you would enter your JAMB registration number and password here.",
          )
        }
        onApply={() =>
          openModal(
            "Start your application",
            "The application form is part of the prototype walkthrough. Follow the eight steps below to see what each stage collects.",
          )
        }
      />

      <main>
        {/* Hero */}
        <section className="relative mx-auto max-w-7xl px-5 pb-16 pt-14 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/60 px-3 py-1 text-xs font-semibold text-primary">
                <span className="size-1.5 rounded-full bg-primary" /> Applications open · Nov 04,
                2025
              </span>
              <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Post-UTME
                <br />
                Application Portal
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/60 sm:text-lg">
                Apply for Post-UTME screening online, verify your information, complete your
                application and monitor your admission status.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  onClick={() =>
                    openModal(
                      "Start your application",
                      "The application form is part of the prototype walkthrough. Follow the eight steps below to see what each stage collects.",
                    )
                  }
                >
                  Apply Now
                </Button>
                <a href="#status">
                  <Button variant="glass">Check Application Status</Button>
                </a>
                <Button
                  variant="ghost"
                  onClick={() =>
                    openModal(
                      "Applicant login",
                      "This is a UI prototype, so sign-in is not connected. In the live portal you would enter your JAMB registration number and password here.",
                    )
                  }
                >
                  Login
                </Button>
              </div>
            </div>

            <Card elevated id="status">
              <form onSubmit={submitStatus} id="status">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display text-sm font-bold text-foreground/80">
                    Check Application Status
                  </p>
                  <Badge tone="success">Verified</Badge>
                </div>
                <Field
                  label="JAMB Registration Number"
                  placeholder="e.g. 12345678901"
                  className="mt-5"
                />
                <Field label="Date of Birth" placeholder="DD / MM / YYYY" className="mt-4" />
                <Button type="submit" variant="ink" className="mt-5 w-full">
                  Check Status
                </Button>

                {statusResult && (
                  <div className="mt-6 rounded-2xl border border-white/50 bg-white/40 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground/40">
                      Recent result
                    </p>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-display text-sm font-bold">{mockStatus.decision}</p>
                        <p className="text-xs text-foreground/50">
                          {mockStatus.candidate} · {mockStatus.programme}
                        </p>
                      </div>
                      <Badge tone="success">{mockStatus.badge}</Badge>
                    </div>
                  </div>
                )}
              </form>
            </Card>
          </div>
        </section>

        {/* Important Information */}
        <section id="about" className="relative mx-auto max-w-7xl px-5 pb-16 lg:px-8">
          <SectionHeading eyebrow="Key dates" title="Important Information" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {keyDates.map((item) => (
              <Card key={item.label}>
                <p className="text-xs font-semibold text-foreground/40">{item.label}</p>
                <p className="mt-2 font-display text-xl font-bold">{item.value}</p>
                <p className="mt-1 text-xs text-foreground/50">{item.note}</p>
              </Card>
            ))}
          </div>
          <Alert className="mt-4">
            <span className="font-semibold">Note:</span> Ensure your JAMB details match your
            admission form exactly. Applicants must present a valid ID at the screening venue.
          </Alert>
        </section>

        {/* Application Process */}
        <section id="admission" className="relative mx-auto max-w-7xl px-5 pb-16 lg:px-8">
          <SectionHeading eyebrow="How it works" title="Application Process" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, i) => (
              <Card key={step.title}>
                <span className="grid size-9 place-items-center rounded-lg bg-primary/10 font-display text-sm font-bold text-primary">
                  {i + 1}
                </span>
                <p className="mt-3 text-sm font-semibold">{step.title}</p>
                <p className="mt-1 text-xs text-foreground/50">{step.note}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Programmes */}
        <section id="programmes" className="relative mx-auto max-w-7xl px-5 pb-16 lg:px-8">
          <SectionHeading
            eyebrow="Course of study"
            title="Popular Programmes"
            action={
              <button
                onClick={() =>
                  openModal(
                    "Full programme list",
                    "The complete catalogue of faculties and courses is not part of this prototype. The seven programmes shown are sample entries.",
                  )
                }
                className="hidden text-sm font-semibold text-primary sm:block"
              >
                View all →
              </button>
            }
          >
          </SectionHeading>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {programmes.map((p) => (
              <Card key={p.name}>
                <p className="font-display text-sm font-bold">{p.name}</p>
                <p className="mt-1 text-xs text-foreground/50">{p.faculty}</p>
                <p className="mt-1 text-xs text-foreground/40">{p.duration}</p>
                <Badge tone={p.highlight ? "success" : "brand"} className="mt-4">
                  Cut-off {p.cutOff}
                </Badge>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="relative mx-auto max-w-7xl px-5 pb-20 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <Card elevated>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Get in touch
              </p>
              <h2 className="mt-1 text-2xl font-bold">Contact</h2>
              <div className="mt-5 space-y-4 text-sm">
                <div>
                  <p className="text-xs font-semibold text-foreground/40">Address</p>
                  <p className="mt-1 text-foreground/70">{university.address}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground/40">Phone</p>
                  <p className="mt-1 text-foreground/70">{university.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground/40">Email</p>
                  <p className="mt-1 text-foreground/70">{university.email}</p>
                </div>
              </div>
            </Card>
            <Card elevated>
              <form onSubmit={submitContact}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full Name" placeholder="Your name" className="sm:col-span-2" />
                  <Field label="Email" type="email" placeholder="you@email.com" />
                  <Field label="Phone" placeholder="+234 ..." />
                  <TextField
                    label="Message"
                    rows={3}
                    placeholder="How can we help?"
                    className="sm:col-span-2"
                  />
                </div>
                <Button type="submit" className="mt-5 w-full">
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </section>
      </main>

      <SiteFooter />

      <Modal open={modal !== null} title={modal?.title ?? ""} onClose={() => setModal(null)}>
        {modal?.body}
      </Modal>
    </div>
  );
}
