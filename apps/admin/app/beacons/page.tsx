"use client";

import { anyApi } from "convex/server";
import { useQuery } from "convex/react";
import { Bluetooth } from "lucide-react";

type AdminBeacon = { id: string; deviceName: string; macAddress: string; status: string; batteryPercent: number; signalDbm: number };

export default function BeaconsPage() {
  const result = useQuery(anyApi.admin.listBeacons, { limit: 100 });
  const beacons = result as AdminBeacon[] | undefined;

  return (
    <main className="min-h-screen p-6 lg:p-10">
      <div className="mt-2 flex items-center gap-3">
        <Bluetooth className="text-slate-300" />
        <div><h1 className="text-2xl font-semibold">Beacon management</h1><p className="mt-1 text-sm text-[var(--muted)]">ESP32 beacon inventory · latest 100</p></div>
      </div>
      <section className="mt-7 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)]">
        {beacons === undefined ? <p className="p-6 text-sm text-[var(--muted)]">Loading beacons…</p> :
          beacons.length === 0 ? <p className="p-6 text-sm text-[var(--muted)]">No registered beacons found.</p> :
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#142133] text-xs uppercase tracking-wide text-slate-400">
                <tr><th className="px-5 py-4">Device</th><th className="px-5 py-4">MAC address</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Battery</th><th className="px-5 py-4">Signal</th></tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {beacons.map((beacon) => <tr key={beacon.id}>
                  <td className="px-5 py-4 font-medium">{beacon.deviceName}</td>
                  <td className="px-5 py-4 text-slate-300">{beacon.macAddress}</td>
                  <td className="px-5 py-4">{beacon.status}</td>
                  <td className="px-5 py-4">{beacon.batteryPercent}%</td>
                  <td className="px-5 py-4 text-slate-400">{beacon.signalDbm} dBm</td>
                </tr>)}
              </tbody>
            </table>
          </div>}
      </section>
    </main>
  );
}
