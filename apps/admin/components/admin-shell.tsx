"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BellRing,
  Bluetooth,
  Clock3,
  ContactRound,
  LayoutDashboard,
  ShieldCheck,
  Users
} from "lucide-react";
import SignOutButton from "@/components/sign-out-button";

const navigation = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "SOS monitoring", href: "/alerts", icon: BellRing },
  { label: "Users", href: "/users", icon: Users },
  { label: "Beacons", href: "/beacons", icon: Bluetooth },
  { label: "Emergency contacts", href: "/contacts", icon: ContactRound },
  { label: "Alert history", href: "/history", icon: Clock3 }
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/sign-in") return <>{children}</>;

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
      <aside className="border-b border-[var(--border)] bg-[#0b1320] p-5 lg:min-h-screen lg:border-b-0 lg:border-r">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f04452] text-white">
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="font-semibold tracking-wide">EchoSOS</div>
            <div className="text-xs text-[var(--muted)]">ADMIN CONSOLE</div>
          </div>
        </Link>

        <div className="mt-10 text-[10px] font-semibold uppercase tracking-[.2em] text-slate-500">Operations</div>
        <nav className="mt-3 space-y-1" aria-label="Admin navigation">
          {navigation.map(({ label, href, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${active ? "bg-[#1a2a3d] text-white" : "text-slate-400 hover:bg-[#142133] hover:text-white"}`}
              >
                <Icon size={17} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-10 rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Activity size={15} className="text-emerald-400" />
            Shared backend
          </div>
          <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
            Connected to the existing EchoSOS Convex deployment. No duplicate database.
          </p>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] px-6 py-4 lg:px-9">
          <div>
            <p className="text-xs text-[var(--muted)]">ECHO SOS / ADMINISTRATION</p>
            <p className="mt-1 text-sm font-medium">{navigation.find((item) => item.href === pathname)?.label ?? "Operations"}</p>
          </div>
          <SignOutButton />
        </header>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
