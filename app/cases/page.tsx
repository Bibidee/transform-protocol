"use client";

import { useState } from "react";
import Link from "next/link";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { CaseCard } from "@/components/cases/CaseCard";
import { useWallet } from "@/lib/context/WalletContext";
import { useTransform } from "@/lib/context/TransformContext";
import { Plus, RefreshCw, Loader2, FolderOpen } from "lucide-react";

type FilterMode = "all" | "mine" | "verdict_issued" | "open";

export default function CasesPage() {
  const { address } = useWallet();
  const { cases, loadingCases, refreshCases } = useTransform();
  const [filter, setFilter] = useState<FilterMode>("all");
  const [refreshing, setRefreshing] = useState(false);

  const filtered = cases.filter(c => {
    if (filter === "mine") return address && c.owner.toLowerCase() === address.toLowerCase();
    if (filter === "verdict_issued") return c.status === "VERDICT_ISSUED";
    if (filter === "open") return c.status === "OPEN";
    return true;
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshCases();
    setRefreshing(false);
  };

  const FILTERS: { id: FilterMode; label: string; count?: number }[] = [
    { id: "all", label: "All Dossiers", count: cases.length },
    { id: "mine", label: "My Dossiers", count: address ? cases.filter(c => c.owner.toLowerCase() === address.toLowerCase()).length : 0 },
    { id: "open", label: "Open", count: cases.filter(c => c.status === "OPEN").length },
    { id: "verdict_issued", label: "Verdict Issued", count: cases.filter(c => c.status === "VERDICT_ISSUED").length },
  ];

  return (
    <PageWrapper>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#2655FF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px" }}>
            Case Registry
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, color: "#1E0B3B", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            Transformation Dossiers
          </h1>
          <p style={{ color: "#8492B4", fontSize: "13px", marginTop: "5px" }}>
            {cases.length} dossier{cases.length !== 1 ? "s" : ""} registered on GenLayer
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          <button onClick={handleRefresh} disabled={refreshing || loadingCases} style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "9px 16px", borderRadius: "9px",
            border: "1px solid #C8D2F0", background: "#fff",
            color: "#4B5675", fontSize: "13px", fontWeight: 500,
            cursor: "pointer", whiteSpace: "nowrap",
          }}>
            <RefreshCw size={13} style={{ animation: (refreshing || loadingCases) ? "spinSlow 1s linear infinite" : "none" }} />
            Refresh
          </button>
          {address && (
            <Link href="/cases/new" style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "9px 18px", borderRadius: "9px",
              background: "#1E0B3B", color: "#fff",
              fontSize: "13px", fontWeight: 700,
              textDecoration: "none", whiteSpace: "nowrap",
              boxShadow: "0 3px 12px rgba(30,11,59,0.25)",
            }}>
              <Plus size={14} /> New Dossier
            </Link>
          )}
        </div>
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {FILTERS.map(f => {
          const active = filter === f.id;
          return (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "7px 16px", borderRadius: "999px",
              background: active ? "#1E0B3B" : "#fff",
              color: active ? "#fff" : "#4B5675",
              border: `1px solid ${active ? "#1E0B3B" : "#C8D2F0"}`,
              fontSize: "13px", fontWeight: active ? 600 : 500,
              cursor: "pointer", transition: "all 0.15s",
            }}>
              {f.label}
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 700,
                padding: "1px 6px", borderRadius: "999px",
                background: active ? "rgba(255,255,255,0.15)" : "#F0F2FF",
                color: active ? "#fff" : "#2655FF",
              }}>
                {f.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loadingCases ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "5rem 0", color: "#8492B4", fontSize: "14px" }}>
          <Loader2 size={18} style={{ animation: "spinSlow 1s linear infinite" }} />
          Loading dossiers from GenLayer…
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "4rem 2rem",
          background: "#fff", border: "1.5px dashed #C8D2F0", borderRadius: "18px",
        }}>
          <div style={{
            width: "52px", height: "52px", borderRadius: "14px",
            background: "#EEF1FF", display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1rem",
          }}>
            <FolderOpen size={24} style={{ color: "#2655FF" }} />
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, color: "#1E0B3B", marginBottom: "6px" }}>
            {filter === "mine" && !address ? "Connect your wallet to see your dossiers" : "No dossiers found"}
          </div>
          <p style={{ fontSize: "13px", color: "#8492B4", maxWidth: "340px", margin: "0 auto 1.5rem" }}>
            {filter === "all"
              ? "No transformation dossiers have been created yet. Open the first one to begin."
              : `No dossiers match this filter.`}
          </p>
          {filter === "all" && address && (
            <Link href="/cases/new" style={{
              display: "inline-flex", alignItems: "center", gap: "7px",
              padding: "10px 22px", borderRadius: "10px",
              background: "linear-gradient(135deg, #2655FF 0%, #5046E5 100%)",
              color: "#fff", fontSize: "13px", fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 4px 16px rgba(38,85,255,0.3)",
            }}>
              <Plus size={14} /> Open First Dossier
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
          {filtered.map(c => (
            <CaseCard key={c.case_id} caseData={c}
              owned={address ? c.owner.toLowerCase() === address.toLowerCase() : false} />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
