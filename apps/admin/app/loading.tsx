export default function Loading() {
  return (
    <main className="min-h-screen p-6 lg:p-10">
      <div className="h-4 w-28 animate-pulse rounded bg-slate-700/50" />
      <div className="mt-8 h-8 w-56 animate-pulse rounded bg-slate-700/50" />
      <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-slate-800" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--panel)]" />
        ))}
      </div>
    </main>
  );
}
