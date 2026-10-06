import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { HodShell } from "@/components/HodShell";
import { Card } from "@/components/ui/primitives";

export const Route = createFileRoute("/hod/")({
  head: () => ({
    meta: [
      { title: "HOD Admin Dashboard | Northbridge University" },
      { name: "description", content: "System-wide Post-UTME statistics, charts, and admissions overview." },
      { property: "og:title", content: "HOD Admin Dashboard | Northbridge University" },
      { property: "og:description", content: "System-wide Post-UTME statistics, charts, and admissions overview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HodDashboard,
});

const stats = [
  { label: "Total Candidates", value: "12,480" },
  { label: "Total Applications", value: "9,312" },
  { label: "Eligible Candidates", value: "9,312" },
  { label: "Submitted Applications", value: "8,754" },
  { label: "Total Payments", value: "₦43.8M" },
  { label: "Admission Offers", value: "3,120" },
  { label: "Accepted Candidates", value: "2,486" },
];

const byProgramme = [
  { name: "Comp. Sci", value: 1840 }, { name: "Accounting", value: 1420 }, { name: "Bus. Admin", value: 1210 },
  { name: "Economics", value: 980 }, { name: "Mass Comm", value: 1105 }, { name: "Pol. Sci", value: 860 }, { name: "Nursing", value: 1897 },
];
const byStatus = [
  { name: "Submitted", value: 4210 }, { name: "Under Review", value: 1630 }, { name: "Screened", value: 2914 }, { name: "Pending", value: 558 },
];
const payments = [
  { month: "Jun", application: 6.2, acceptance: 0 }, { month: "Jul", application: 11.4, acceptance: 0 },
  { month: "Aug", application: 14.8, acceptance: 0 }, { month: "Sep", application: 9.3, acceptance: 4.1 },
  { month: "Oct", application: 2.1, acceptance: 12.6 },
];
const trends = [
  { week: "W1", registrations: 820 }, { week: "W2", registrations: 1340 }, { week: "W3", registrations: 1980 },
  { week: "W4", registrations: 2410 }, { week: "W5", registrations: 1870 }, { week: "W6", registrations: 1520 },
  { week: "W7", registrations: 1290 }, { week: "W8", registrations: 1250 },
];

const C = ["var(--primary)", "var(--success)", "oklch(0.7 0.14 220)", "oklch(0.75 0.15 75)"];

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <Card elevated>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{title}</p>
      <div className="mt-4 h-64"><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div>
    </Card>
  );
}

function HodDashboard() {
  return (
    <HodShell active="Dashboard" title="Administrator Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50">{s.label}</p>
            <p className="mt-2 font-display text-3xl font-bold">{s.value}</p>
          </Card>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Applications by Programme">
          <BarChart data={byProgramme}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip />
            <Bar dataKey="value" name="Applications" fill="var(--primary)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartCard>
        <ChartCard title="Applications by Status">
          <PieChart>
            <Pie data={byStatus} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
              {byStatus.map((_, i) => <Cell key={i} fill={C[i % C.length]} />)}
            </Pie>
            <Tooltip /><Legend />
          </PieChart>
        </ChartCard>
        <ChartCard title="Payment Statistics (₦ millions)">
          <BarChart data={payments}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="month" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Legend />
            <Bar dataKey="application" name="Application fees" stackId="a" fill="var(--primary)" />
            <Bar dataKey="acceptance" name="Acceptance fees" stackId="a" fill="var(--success)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartCard>
        <ChartCard title="Candidate Registration Trends">
          <LineChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="week" fontSize={11} /><YAxis fontSize={11} /><Tooltip />
            <Line type="monotone" dataKey="registrations" name="Registrations" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ChartCard>
      </div>
    </HodShell>
  );
}
