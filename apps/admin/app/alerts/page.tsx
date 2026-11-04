"use client";

import { anyApi } from "convex/server";
import { useQuery } from "convex/react";
import { BellRing, ExternalLink, MapPin, ShieldAlert, Users } from "lucide-react";

type ActiveAlert = {
  _id: string;
  detected_at: string;
  beacon_id: string;
  signal_dbm: string | number;
  latitude: number;
  longitude: number;
  user_name?: string;
  user_phone?: string;
  emergency_contact_count?: number;
};
type Overview = { activeAlerts: ActiveAlert[] };

export default function AlertsPage() {
  const result = useQuery(anyApi.admin.overview, {});
  const data = result as Overview | undefined;
  const alerts = data?.activeAlerts;

  return (
    <main className="min-h-screen p-6 lg:p-10">
      <div className="mt-2 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-rose-500/10 text-rose-400"><BellRing /></div>
        <div><h1 className="text-2xl font-semibold">SOS monitoring</h1><p className="mt-1 text-sm text-[var(--muted)]">Active emergency events and incident locations</p></div>
      </div>
      <section className="mt-7 rounded-2xl border border-[var(--border)] bg-[var(--panel)]">
        <div className="flex items-center gap-2 border-b border-[var(--border)] p-5 text-sm font-medium">
          <ShieldAlert size={18} className="text-amber-300" />
          {alerts === undefined ? "Loading active incidents…" : `${alerts.length} active SOS incident(s)`}
        </div>
        {alerts?.map((alert) => (
          <div key={alert._id} className="border-b border-[var(--border)] p-5 last:border-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-medium text-rose-300">ACTIVE SOS</span>
              <span className="text-xs text-[var(--muted)]">{alert.detected_at}</span>
            </div>
            <p className="mt-2 text-sm text-slate-200">{alert.user_name ?? "User details unavailable"} {alert.user_phone ? `· ${alert.user_phone}` : ""}</p>
            <p className="mt-1 text-sm text-slate-400">Beacon: {alert.beacon_id} · Signal: {alert.signal_dbm}</p>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-[var(--muted)]">
              <span className="flex items-center gap-1"><MapPin size={13}/>{alert.latitude.toFixed(5)}, {alert.longitude.toFixed(5)}</span>
              <span className="flex items-center gap-1"><Users size={13}/>{alert.emergency_contact_count ?? "—"} emergency contacts</span>
              <a className="inline-flex items-center gap-1 text-sky-300 hover:text-sky-200" href={`https://www.openstreetmap.org/?mlat=${alert.latitude}&mlon=${alert.longitude}#map=16/${alert.latitude}/${alert.longitude}`} target="_blank" rel="noreferrer">Open map <ExternalLink size={12}/></a>
            </div>
          </div>
        ))}
        {alerts && alerts.length === 0 && <p className="p-6 text-sm text-[var(--muted)]">No active SOS incidents.</p>}
      </section>
      <p className="mt-4 text-xs text-[var(--muted)]">This console does not cancel user-side SOS events.</p>
    </main>
  );
}
