"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, ShieldCheck } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("EchoSOS Admin route error:", error);
  }, [error]);

  const accessDenied = /administrator access required|unauthorized|forbidden/i.test(error.message || "");

  return (
    <main className="grid min-h-screen place-items-center px-5 py-12">
      <section className="w-full max-w-lg rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-8">
        <div className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${accessDenied ? "bg-amber-500/10 text-amber-300" : "bg-rose-500/10 text-rose-300"}`}>
          {accessDenied ? <ShieldCheck size={27} /> : <AlertTriangle size={27} />}
        </div>
        <h1 className="mt-5 text-center text-xl font-semibold">{accessDenied ? "Administrator access required" : "Unable to load this view"}</h1>
        <p className="mt-2 text-center text-sm leading-6 text-[var(--muted)]">
          {accessDenied
            ? "This account is not authorized for the EchoSOS administration console."
            : "The dashboard could not retrieve this data. Check the shared Convex development deployment and retry."}
        </p>
        {error.digest && <p className="mt-3 text-center text-[11px] text-slate-500">Reference: {error.digest}</p>}
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button onClick={reset} className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#e83d4d] px-4 text-sm font-semibold text-white hover:bg-[#f05260]"><RefreshCw size={15} /> Try again</button>
          <Link href="/sign-in" className="inline-flex h-11 items-center rounded-xl border border-[var(--border)] px-4 text-sm text-slate-200 hover:bg-[#142133]">Sign in</Link>
        </div>
      </section>
    </main>
  );
}
