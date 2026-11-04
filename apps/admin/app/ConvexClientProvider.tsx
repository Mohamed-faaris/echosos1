"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { authClient } from "@/lib/auth-client";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  if (!convex) {
    return (
      <div className="grid min-h-screen place-items-center p-8 text-center text-sm text-slate-400">
        Set NEXT_PUBLIC_CONVEX_URL and NEXT_PUBLIC_CONVEX_SITE_URL in apps/admin/.env.local to connect the shared EchoSOS backend.
      </div>
    );
  }

  return (
    <ConvexBetterAuthProvider client={convex} authClient={authClient as never}>
      {children}
    </ConvexBetterAuthProvider>
  );
}
