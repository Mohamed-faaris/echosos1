"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    await authClient.signOut();
    router.replace("/sign-in");
  }

  return (
    <button onClick={signOut} className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-xs text-slate-300 hover:bg-[var(--panel-soft)] hover:text-white">
      <LogOut size={14} /> Sign out
    </button>
  );
}
