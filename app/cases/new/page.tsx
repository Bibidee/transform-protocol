"use client";

import { PageWrapper } from "@/components/layout/PageWrapper";
import { CreateCaseForm } from "@/components/forms/CreateCaseForm";
import { WalletConnect } from "@/components/wallet/WalletConnect";
import { useWallet } from "@/lib/context/WalletContext";
import { CONTRACT_ADDRESS } from "@/lib/constants/config";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function NewCasePage() {
  const { address } = useWallet();
  const contractDeployed = !!CONTRACT_ADDRESS;

  return (
    <PageWrapper narrow>
      {/* Page header */}
      <div style={{ marginBottom: "2rem" }}>
        <Link
          href="/cases"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            color: "var(--color-stone)",
            textDecoration: "none",
            marginBottom: "1rem",
          }}
        >
          <ArrowLeft size={13} /> Back to Dossiers
        </Link>

        <div
          style={{
            background: "var(--color-aubergine)",
            borderRadius: "14px",
            padding: "1.75rem 2rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "rgba(255,255,255,0.35)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "8px",
            }}
          >
            Movement Cartography · New Dossier
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.85rem",
              fontWeight: 700,
              color: "white",
              letterSpacing: "-0.02em",
              marginBottom: "6px",
            }}
          >
            Open Transformation Dossier
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", lineHeight: 1.6 }}>
            Define the transformation question, organisation context, and initial evidence summary.
            All data is stored on-chain via GenLayer.
          </p>
        </div>

        {!contractDeployed && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              padding: "12px 16px",
              borderRadius: "10px",
              background: "rgba(194,75,42,0.06)",
              border: "1px solid rgba(194,75,42,0.2)",
            }}
          >
            <AlertCircle size={14} style={{ color: "var(--color-clay)", flexShrink: 0, marginTop: "2px" }} />
            <p style={{ fontSize: "13px", color: "var(--color-clay)", lineHeight: 1.5 }}>
              Contract not deployed. Deploy{" "}
              <code style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>TransformProtocol.py</code>{" "}
              to GenLayer StudioNet and update{" "}
              <code style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>.env.local</code>{" "}
              before creating dossiers.
            </p>
          </div>
        )}
      </div>

      {!address ? (
        <WalletConnect message="Connect your wallet to open a Transformation Dossier." />
      ) : (
        <CreateCaseForm />
      )}
    </PageWrapper>
  );
}
