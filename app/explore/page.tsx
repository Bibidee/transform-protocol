"use client";

import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { CaseCard } from "@/components/cases/CaseCard";
import { useTransform } from "@/lib/context/TransformContext";
import { useWallet } from "@/lib/context/WalletContext";
import { Globe, Search, RefreshCw, Loader2, LayoutGrid } from "lucide-react";

const STAT_COLORS = ["#2655FF", "#D4900A", "#1A7A4A", "#C24B2A"];

export default function ExplorePage() {
  const { cases, loadingCases, refreshCases, stats } = useTransform();
  const { address } = useWallet();
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const filtered = cases.filter(c => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.organisation.toLowerCase().includes(q) ||
      c.transformation_type.toLowerCase().includes(q) ||
      c.industry.toLowerCase().includes(q)
    );
  });

  const handleRefresh = async () => { setRefreshing(true); await refreshCases(); setRefreshing(false); };

  const STATS = [
    { label: "Total Cases",     value: stats.total_cases },
    { label: "Verdicts Issued", value: stats.total_verdicts },
    { label: "Stakeholder Signals", value: stats.total_signals },
    { label: "Evidence Items",  value: stats.total_evidence },
  ];

  return (
    <PageWrapper>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#2655FF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
          Public Registry
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "linear-gradient(135deg, #2655FF 0%, #5046E5 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Globe size={17} style={{ color: "#fff" }} />
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, color: "#1E0B3B", letterSpacing: "-0.02em" }}>
            Case Explorer
          </h1>
        </div>
        <p style={{ color: "#8492B4", fontSize: "13px" }}>
          All publicly registered transformation readiness dossiers on GenLayer StudioNet.
        </p>
      </div>

      {/* Stats strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "1.5rem" }}>
        {STATS.map(({ label, value }, i) => (
          <div key={label} style={{
            background: "#fff", border: "1px solid #C8D2F0", borderRadius: "14px",
            padding: "18px 16px", textAlign: "center",
            borderTop: `3px solid ${STAT_COLORS[i]}`,
            boxShadow: "0 1px 6px rgba(30,11,59,0.05)",
          }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 700, color: "#1E0B3B", lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: "11px", color: "#8492B4", marginTop: "6px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Search bar */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "1.5rem" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "#8492B4", pointerEvents: "none" }} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by title, organisation, industry, or type…"
            style={{
              width: "100%", padding: "10px 14px 10px 36px",
              borderRadius: "10px", border: "1.5px solid #C8D2F0",
              background: "#fff", fontFamily: "var(--font-body)",
              fontSize: "13px", color: "#0F172A", outline: "none",
            }}
          />
        </div>
        <button onClick={handleRefresh} disabled={refreshing || loadingCases} style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: "42px", height: "42px", borderRadius: "10px",
          border: "1.5px solid #C8D2F0", background: "#fff",
          color: "#4B5675", cursor: "pointer", flexShrink: 0,
        }}>
          <RefreshCw size={14} style={{ animation: (refreshing || loadingCases) ? "spinSlow 1s linear infinite" : "none" }} />
        </button>
      </div>

      {/* Results */}
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
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#EEF1FF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
            <LayoutGrid size={22} style={{ color: "#2655FF" }} />
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 700, color: "#1E0B3B", marginBottom: "6px" }}>
            {query ? `No results for "${query}"` : "No dossiers registered yet"}
          </div>
          <p style={{ fontSize: "13px", color: "#8492B4" }}>
            {query ? "Try a different search term." : "Transformation dossiers will appear here once submitted to GenLayer."}
          </p>
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
