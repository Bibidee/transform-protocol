import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/lib/context/WalletContext";
import { TransformProvider } from "@/lib/context/TransformContext";

export const metadata: Metadata = {
  title: "Transform Protocol — Decentralised Consensus for Transformation Readiness",
  description:
    "Transform converts organisational signals, stakeholder resistance, and implementation uncertainty into transparent, consensus-backed readiness verdicts using decentralised AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <body style={{ minHeight: "100%", background: "#E8EDFF", color: "#0F172A", fontFamily: "var(--font-body)" }}>
        <WalletProvider>
          <TransformProvider>
            {children}
          </TransformProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
