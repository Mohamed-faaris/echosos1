"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { anyApi } from "convex/server";
import { useQuery } from "convex/react";
import { Activity, BellRing, Bluetooth, Users } from "lucide-react";

type RecentEvent = { _id: string; event_type: string; status_badge: string; created_at: string };
type Incident = { _id: string; latitude: number; longitude: number; detected_at: string; beacon_id: string };
type OverviewData = {
  activeAlerts: Incident[];
  usersSample: number;
  usersSampleMayBeTruncated: boolean;
  beaconsSample: number;
  beaconsSampleMayBeTruncated: boolean;
  recentEvents: RecentEvent[];
};

const LiveMap = dynamic(() => import("@/components/live-map"), {
  ssr: false,
  loading: () => <div className="grid h-[360px] place-items-center text-sm text-slate-500">Loading map…</div>
});

function Metric({ label, value, note, icon: Icon }: { label: string; value: string; note: string; icon: typeof Activity }) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5">
      <div className="flex items-center justify-between text-sm text-[var(--muted)]"><span>{label}</span><Icon size={18} /></div>
      <div className="mt-4 text-3xl font-semibold tracking-tight">{value}</div>
      <p className="mt-2 text-xs text-[var(--muted)]">{note}</p>
    </section>
  );
}

export default function OverviewLive() {
  const result = useQuery(anyApi.admin.overview, {});
  const data = result as OverviewData | undefined;

  if (data === undefined) {
    return <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-8 text-sm text-[var(--muted)]">Connecting to the shared EchoSOS backend…</div>;
  }

  return (
    <div className="space-y-7">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Active SOS alerts" value={String(data.activeAlerts.length)} note="Current active incidents" icon={BellRing} />
        <Metric label="Users sampled" value={String(data.usersSample)} note={data.usersSampleMayBeTruncated ? "Showing first 500 records" : "All current user records"} icon={Users} />
        <Metric label="Beacons sampled" value={String(data.beaconsSample)} note={data.beaconsSampleMayBeTruncated ? "Showing first 500 records" : "All current beacon records"} icon={Bluetooth} />
        <Metric label="Recent events" value={String(data.recentEvents.length)} note="Latest 20 alert-history entries" icon={Activity} />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)]">
          <div className="border-b border-[var(--border)] px-5 py-4">
            <h3 className="font-semibold">SOS incident map</h3>
            <p className="mt-1 text-xs text-[var(--muted)]">OpenStreetMap · active incident coordinates</p>
          </div>
          <LiveMap incidents={data.activeAlerts} />
          <div className="border-t border-[var(--border)] px-5 py-3 text-xs text-[var(--muted)]">© OpenStreetMap contributors</div>
        </section>
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--panel)]">
          <div className="border-b border-[var(--border)] px-5 py-4">
            <h3 className="font-semibold">Recent SOS activity</h3>
            <p className="mt-1 text-xs text-[var(--muted)]">Latest emergency events</p>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {data.recentEvents.length === 0 ? (
              <p className="p-6 text-sm text-[var(--muted)]">No alert history records yet.</p>
            ) : data.recentEvents.map((event) => (
              <div key={event._id} className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">{event.event_type.replaceAll("_", " ")}</span>
                  <span className="text-xs text-[var(--muted)]">{event.status_badge}</span>
                </div>
                <p className="mt-1 text-xs text-[var(--muted)]">{event.created_at}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5">
        <h3 className="font-semibold">Safety boundary</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">This console monitors and reviews incidents. It cannot cancel a beacon-originated SOS event.</p>
      </div>
      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/alerts" className="text-sky-300 hover:text-sky-200">View active incidents</Link>
        <Link href="/history" className="text-sky-300 hover:text-sky-200">Open alert history</Link>
      </div>
    </div>
  );
}
