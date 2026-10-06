import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HodShell, inputCls, L } from "@/components/HodShell";
import { Button, Card } from "@/components/ui/primitives";

export const Route = createFileRoute("/hod/settings")({
  head: () => ({
    meta: [
      { title: "Portal Settings | Northbridge University" },
      { name: "description", content: "Configure Post-UTME fees, cut-off score, and application dates." },
      { property: "og:title", content: "Portal Settings | Northbridge University" },
      { property: "og:description", content: "Configure Post-UTME fees, cut-off score, and application dates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});

const defaults = { appFee: 5000, acceptFee: 100000, minScore: 200, open: "2026-06-01", close: "2026-09-30" };

function SettingsPage() {
  const [saved, setSaved] = useState(defaults);
  const [form, setForm] = useState(defaults);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const dirty = JSON.stringify(form) !== JSON.stringify(saved);

  const save = () => {
    if (form.appFee <= 0 || form.acceptFee <= 0) return setError("Fees must be greater than ₦0.");
    if (form.minScore < 0 || form.minScore > 400) return setError("Minimum JAMB score must be between 0 and 400.");
    if (form.close <= form.open) return setError("Closing date must be after the opening date.");
    setError(""); setSaved(form); setMsg("Settings saved (simulated)."); setTimeout(() => setMsg(""), 2500);
  };

  return (
    <HodShell active="Settings" title="Portal Settings">
      <Card elevated className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Admission cycle 2026/2027</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <L label="Application Fee (₦)"><input className={inputCls} type="number" value={form.appFee} onChange={(e) => setForm({ ...form, appFee: Number(e.target.value) })} /></L>
          <L label="Acceptance Fee (₦)"><input className={inputCls} type="number" value={form.acceptFee} onChange={(e) => setForm({ ...form, acceptFee: Number(e.target.value) })} /></L>
          <L label="Minimum JAMB Score"><input className={inputCls} type="number" value={form.minScore} onChange={(e) => setForm({ ...form, minScore: Number(e.target.value) })} /></L>
          <div />
          <L label="Application Opening Date"><input className={inputCls} type="date" value={form.open} onChange={(e) => setForm({ ...form, open: e.target.value })} /></L>
          <L label="Application Closing Date"><input className={inputCls} type="date" value={form.close} onChange={(e) => setForm({ ...form, close: e.target.value })} /></L>
        </div>
        {error && <p className="mt-4 text-sm font-semibold text-destructive">{error}</p>}
        {msg && <p className="mt-4 rounded-xl bg-success/10 px-4 py-2 text-sm font-semibold text-success">{msg}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" disabled={!dirty} onClick={() => { setForm(saved); setError(""); }}>Reset</Button>
          <Button disabled={!dirty} onClick={save}>Save Settings</Button>
        </div>
        <p className="mt-3 text-[11px] text-foreground/40">Changes apply to this preview only and are not stored.</p>
      </Card>
    </HodShell>
  );
}
