"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { AddDomainForm } from "@/components/forms/AddDomainForm";
import { ReadinessDomainOrbit } from "@/components/atlas/ReadinessDomainOrbit";
import { useWallet } from "@/lib/context/WalletContext";
import { getCase } from "@/lib/genlayer/contractService";
import type { TransformationCase } from "@/types";
import { ArrowLeft, Layers, Plus, Loader2, CheckCircle2 } from "lucide-react";

export default function DomainsPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const { address } = useWallet();
  const [caseData, setCaseData] = useState<TransformationCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  const load = async () => { setLoading(true); setCaseData(await getCase(caseId)); setLoading(false); };
  useEffect(() => { load(); }, [caseId]);

  const isOwner = address && caseData && caseData.owner.toLowerCase() === address.toLowerCase();
  const existingDomains = caseData?.domains.map(d => d.domain_name) ?? [];
  const remaining = 11 - existingDomains.length;
  const allDone = remaining === 0;

  return (
    <PageWrapper>
      <Link href={`/cases/${caseId}`} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#8492B4", textDecoration: "none", marginBottom: "1.5rem" }}>
        <ArrowLeft size={13} /> Back to Case
      </Link>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "linear-gradient(135deg, #5046E5 0%, #2655FF 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Layers size={16} style={{ color: "#fff" }} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#5046E5", textTransform: "uppercase", letterSpacing: "0.08em" }}>Zone 02 — Readiness Terrain</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 700, color: "#1E0B3B", letterSpacing: "-0.01em" }}>Readiness Domains</h1>
          </div>
        </div>
        {isOwner && !allDone && !formOpen && (
          <button onClick={() => setFormOpen(true)} style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "9px 18px", borderRadius: "9px",
            background: "#1E0B3B", color: "#fff",
            fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer",
            boxShadow: "0 3px 12px rgba(30,11,59,0.25)", whiteSpace: "nowrap",
          }}>
            <Plus size={14} /> Assess Domain
          </button>
        )}
      </div>

      {/* Context banner */}
      <div style={{ background: "#EEF1FF", border: "1px solid #C8D2F0", borderRadius: "12px", padding: "12px 16px", marginBottom: "1.5rem", display: "flex", alignItems: "flex-start", gap: "10px" }}>
        <Layers size={14} style={{ color: "#5046E5", flexShrink: 0, marginTop: "1px" }} />
        <div>
          <p style={{ fontSize: "13px", color: "#1E0B3B", fontWeight: 600, marginBottom: "2px" }}>Optional — but valuable for validators</p>
          <p style={{ fontSize: "12px", color: "#4B5675", lineHeight: 1.6 }}>
            Self-assess each of the 11 readiness dimensions. GenLayer validators use these ratings as structured context when producing the consensus verdict. You can skip domains and still request consensus — but assessing even a few improves verdict accuracy.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0", color: "#8492B4" }}>
          <Loader2 size={20} style={{ animation: "spinSlow 1s linear infinite" }} />
        </div>
      ) : !address ? (
        <div style={{ textAlign: "center", padding: "3rem", background: "#fff", border: "1.5px dashed #C8D2F0", borderRadius: "16px" }}>
          <p style={{ fontSize: "14px", color: "#4B5675" }}>Connect your wallet to assess readiness domains.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", alignItems: "start" }}>
          {/* Orbit view */}
          <div>
            <ReadinessDomainOrbit domains={caseData?.domains ?? []} />
          </div>

          {/* Form / status panel */}
          <div>
            {isOwner && formOpen ? (
              <div style={{ background: "#fff", border: "1px solid #C8D2F0", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 2px 16px rgba(30,11,59,0.07)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", paddingBottom: "0.875rem", borderBottom: "1px solid #E8EDFF" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "#1E0B3B" }}>Assess Readiness Domain</div>
                  <button onClick={() => setFormOpen(false)} style={{ fontSize: "12px", color: "#8492B4", background: "none", border: "none", cursor: "pointer", padding: "4px 8px" }}>Cancel</button>
                </div>
                <AddDomainForm caseId={caseId} existingDomains={existingDomains}
                  onSuccess={() => { setFormOpen(false); load(); }} />
              </div>
            ) : allDone ? (
              <div style={{ textAlign: "center", padding: "3rem 2rem", background: "#fff", border: "1px solid #C8D2F0", borderRadius: "16px" }}>
                <CheckCircle2 size={32} style={{ color: "#1A7A4A", margin: "0 auto 0.75rem" }} />
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: "#1E0B3B", marginBottom: "4px" }}>All 11 domains assessed</div>
                <p style={{ fontSize: "13px", color: "#8492B4" }}>Your complete readiness terrain is ready for consensus review.</p>
              </div>
            ) : (
              <div style={{ background: "#fff", border: "1.5px dashed #C8D2F0", borderRadius: "16px", padding: "2.5rem 2rem", textAlign: "center" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#EEF1FF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                  <Layers size={20} style={{ color: "#5046E5" }} />
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: "#1E0B3B", marginBottom: "4px" }}>
                  {existingDomains.length === 0 ? "No domains assessed yet" : `${existingDomains.length} of 11 assessed`}
                </div>
                <p style={{ fontSize: "12px", color: "#8492B4", marginBottom: "1.25rem" }}>
                  {remaining} domain{remaining !== 1 ? "s" : ""} remaining
                </p>
                {isOwner && (
                  <button onClick={() => setFormOpen(true)} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "9px 20px", borderRadius: "9px", background: "linear-gradient(135deg, #5046E5 0%, #2655FF 100%)", color: "#fff", fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(80,70,229,0.3)" }}>
                    <Plus size={14} /> Assess Next Domain
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
