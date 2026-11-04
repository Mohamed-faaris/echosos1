import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import AdminShell from "@/components/admin-shell";

export const metadata: Metadata = {
  title: "EchoSOS Admin",
  description: "Emergency response administration console"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>
          <AdminShell>{children}</AdminShell>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
