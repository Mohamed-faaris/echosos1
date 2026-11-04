import OverviewLive from "@/components/overview-live";

export default function Home() {
  return (
    <main className="space-y-7 p-6 lg:p-9">
      <div>
        <p className="text-xs text-[var(--muted)]">ECHO SOS / OPERATIONS</p>
        <h1 className="mt-2 text-2xl font-semibold">Emergency operations</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Monitor active incidents and the EchoSOS service.</p>
      </div>
      <OverviewLive />
    </main>
  );
}
