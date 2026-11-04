"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { ShieldCheck, LockKeyhole, Mail, ArrowRight } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && session) router.replace("/");
  }, [isPending, session, router]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    try {
      const result = await authClient.signIn.email({ email: email.trim(), password, callbackURL: "/" });
      if (result.error) setNotice(result.error.message || "Unable to sign in. Check your credentials and try again.");
      else router.replace("/");
    } catch {
      setNotice("The authentication service could not be reached. Check the backend connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-5 py-10 text-slate-900">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#f04452] text-white"><ShieldCheck size={28}/></div>
        <div className="mt-5 text-center"><h1 className="text-2xl font-semibold text-slate-900">EchoSOS Admin</h1><p className="mt-2 text-sm text-slate-500">Secure administrator access</p></div>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <label className="block text-sm font-medium text-slate-700">Administrator email
            <span className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3"><Mail size={17} className="text-slate-400"/><input required type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@example.com" className="h-12 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"/></span>
          </label>
          <label className="block text-sm font-medium text-slate-700">Password
            <span className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3"><LockKeyhole size={17} className="text-slate-400"/><input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" className="h-12 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"/></span>
          </label>
          <button disabled={busy} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#e83d4d] text-sm font-semibold text-white transition hover:bg-[#cf3040] disabled:opacity-60">{busy ? "Signing in…" : "Continue"} <ArrowRight size={17}/></button>
        </form>
        {notice && <p role="alert" className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">{notice}</p>}
        <p className="mt-6 text-center text-[11px] text-slate-500">Access is restricted to the provisioned administrator. Public registration is disabled.</p>
      </div>
    </main>
  );
}
