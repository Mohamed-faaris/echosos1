"use client";

import { anyApi } from "convex/server";
import { useQuery } from "convex/react";
import { Clock3 } from "lucide-react";

type AlertHistoryEvent = { _id: string; event_type: string; status_badge: string; user_id: string; created_at: string };

export default function HistoryPage() {
  const result = useQuery(anyApi.admin.listAlertHistory, { limit: 100 });
  const events = result as AlertHistoryEvent[] | undefined;

  return (
    <main className="min-h-screen p-6 lg:p-10">
      <div className="mt-2 flex items-center gap-3">
        <Clock3 className="text-slate-300" />
        <div><h1 className="text-2xl font-semibold">Alert history</h1><p className="mt-1 text-sm text-[var(--muted)]">Latest 100 historical events</p></div>
      </div>
      <section className="mt-7 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)]">
        {events === undefined ? <p className="p-6 text-sm text-[var(--muted)]">Loading history…</p> :
          events.length === 0 ? <p className="p-6 text-sm text-[var(--muted)]">No alert history found.</p> :
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#142133] text-xs uppercase tracking-wide text-slate-400">
                <tr><th className="px-5 py-4">Event</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">User</th><th className="px-5 py-4">Time</th></tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {events.map((event) => <tr key={event._id}>
                  <td className="px-5 py-4 font-medium">{event.event_type.replaceAll("_", " ")}</td>
                  <td className="px-5 py-4">{event.status_badge}</td>
                  <td className="px-5 py-4 text-slate-400">{event.user_id}</td>
                  <td className="px-5 py-4 text-slate-400">{event.created_at}</td>
                </tr>)}
              </tbody>
            </table>
          </div>}
      </section>
    </main>
  );
}
