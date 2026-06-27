"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { TransformationSpine } from "@/components/atlas/TransformationSpine";
import { ReadinessDomainOrbit } from "@/components/atlas/ReadinessDomainOrbit";
import { FrictionMap } from "@/components/atlas/FrictionMap";
import { ImplementationCorridor } from "@/components/atlas/ImplementationCorridor";
import { ConsensusTheatre } from "@/components/atlas/ConsensusTheatre";
import { CaseStatusBadge } from "@/components/cases/CaseStatus";
import { useTransform } from "@/lib/context/TransformContext";
import { useWallet } from "@/lib/context/WalletContext";
import { getCase } from "@/lib/genlayer/contractService";
import type { TransformationCase } from "@/types";
import {
  ArrowLeft, Building2, GitBranch, Calendar, Plus, RefreshCw,
  FileText, Users, Folder, Layers, Loader2, Map,
} from "lucide-react";
import { format } from "date-fns";
import { shortAddress } from "@/lib/genlayer/explorerUtils";

export default function CaseDetailPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const { address } = useWallet();
  const { getCachedCase } = useTransform();
  const [caseData, setCaseData] = useState<TransformationCase | null>(getCachedCase(caseId) ?? null);
  const [loading, setLoading] = useState(!caseData);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const fresh = await getCase(caseId);
    setCaseData(fresh);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { load(); }, [caseId]);

  const refresh = async () => { setRefreshing(true); await load(); };

  const isOwner = address && caseData && caseData.owner.toLowerCase() === address.toLowerCase();

  if (loading) {
    return (
      <PageWrapper>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "6rem 0",
            gap: "10px",
            color: "var(--color-stone)",
            fontSize: "14px",
          }}
        >
          <Loader2 size={20} className="animate-spin-slow" /> Loading transformation dossier…
        </div>
      </PageWrapper>
    );
  }

  if (!caseData) {
    return (
      <PageWrapper>
        <div style={{ textAlign: "center", padding: "6rem 0" }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "var(--color-aubergine)",
              marginBottom: "8px",
            }}
          >
            Dossier Not Found
          </div>
          <p style={{ color: "var(--color-stone)", fontSize: "13px", marginBottom: "1.5rem" }}>
            This dossier ID does not exist on-chain or the contract is not yet deployed.
          </p>
          <Link
            href="/cases"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 20px",
              borderRadius: "9px",
              background: "var(--color-aubergine)",
              color: "white",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={14} /> Back to Dossiers
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const createdDate = (() => {
    try { return format(new Date(caseData.created_at), "d MMM yyyy"); }
    catch { return caseData.created_at; }
  })();

  return (
    <PageWrapper noPad>
      <div style={{ padding: "1.5rem 1.25rem" }}>

        {/* ── Dossier Header ── */}
        <div
          style={{
            background: "var(--color-aubergine)",
            borderRadius: "14px",
            padding: "1.5rem",
            marginBottom: "1.25rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background cartography circles */}
          <div style={{ position: "absolute", right: "-60px", top: "-60px", width: "220px", height: "220px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.04)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: "-30px", top: "-30px", width: "140px", height: "140px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.03)", pointerEvents: "none" }} />

          {/* Back + actions row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <Link
              href="/cases"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "12px",
                color: "rgba(255,255,255,0.4)",
                textDecoration: "none",
              }}
            >
              <ArrowLeft size={12} /> All Dossiers
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                onClick={refresh}
                disabled={refreshing}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "6px 10px",
                  borderRadius: "7px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "transparent",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "11px",
                  cursor: "pointer",
                }}
              >
                <RefreshCw size={12} className={refreshing ? "animate-spin-slow" : ""} />
              </button>
              {isOwner && (
                <Link
                  href={`/cases/${caseId}/plan`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "6px 14px",
                    borderRadius: "7px",
                    background: "rgba(39,76,255,0.25)",
                    border: "1px solid rgba(39,76,255,0.35)",
                    color: "#8BA5FF",
                    fontSize: "12px",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  <Plus size={13} /> Add Data
                </Link>
              )}
            </div>
          </div>

          {/* Title + status */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "0.75rem" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                <CaseStatusBadge status={caseData.status} />
                {isOwner && (
                  <span
                    style={{
                      fontSize: "9px",
                      fontFamily: "var(--font-mono)",
                      color: "var(--color-gold)",
                      background: "rgba(201,154,62,0.15)",
                      border: "1px solid rgba(201,154,62,0.25)",
                      padding: "2px 7px",
                      borderRadius: "4px",
                      letterSpacing: "0.05em",
                    }}
                  >
                    YOURS
                  </span>
                )}
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.3rem, 4vw, 1.85rem)",
                  fontWeight: 700,
                  color: "white",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                {caseData.title}
              </h1>
            </div>
          </div>

          {/* Meta row */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
              <Building2 size={11} /> {caseData.organisation}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
              <GitBranch size={11} /> {caseData.transformation_type}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
              <Calendar size={11} /> {createdDate}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
              {shortAddress(caseData.owner)}
            </span>
          </div>

          {/* Transformation question */}
          <div
            style={{
              marginTop: "1rem",
              padding: "12px 14px",
              borderRadius: "9px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                color: "var(--color-gold)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "5px",
              }}
            >
              Movement Objective
            </div>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.82)", lineHeight: 1.6, fontWeight: 500 }}>
              {caseData.business_objective}
            </p>
          </div>
        </div>

        {/* ── Owner quick-nav ── */}
        {isOwner && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "1.25rem" }}>
            {[
              { href: `/cases/${caseId}/plan`, icon: FileText, label: "Implementation Plan", done: !!caseData.implementation_plan },
              { href: `/cases/${caseId}/signals`, icon: Users, label: `Signals (${caseData.signals.length})`, done: caseData.signals.length > 0 },
              { href: `/cases/${caseId}/evidence`, icon: Folder, label: `Evidence (${caseData.evidence.length})`, done: caseData.evidence.length > 0 },
              { href: `/cases/${caseId}/domains`, icon: Layers, label: `Domains (${caseData.domains.length}/11)`, done: caseData.domains.length > 0 },
            ].map(({ href, icon: Icon, label, done }) => (
              <Link
                key={href}
                href={href}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 14px",
                  borderRadius: "8px",
                  background: done ? "var(--color-green-light)" : "var(--color-surface)",
                  border: `1px solid ${done ? "rgba(47,133,90,0.2)" : "var(--color-border)"}`,
                  color: done ? "var(--color-green)" : "var(--color-stone)",
                  fontSize: "12px",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                <Icon size={12} /> {label}
              </Link>
            ))}
          </div>
        )}

        {/* ── Five Cartography Zones ── */}

        {/* Row 1: Movement Meridian + Readiness Terrain + Friction Field */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr 260px",
            gap: "12px",
            marginBottom: "12px",
            alignItems: "start",
          }}
        >
          <TransformationSpine caseData={caseData} />
          <ReadinessDomainOrbit domains={caseData.domains} />
          <FrictionMap caseData={caseData} />
        </div>

        {/* Row 2: Implementation Corridor */}
        {caseData.implementation_plan ? (
          <div style={{ marginBottom: "12px" }}>
            <ImplementationCorridor plan={caseData.implementation_plan} />
          </div>
        ) : (
          <div
            style={{
              marginBottom: "12px",
              padding: "1.25rem",
              borderRadius: "12px",
              textAlign: "center",
              background: "var(--color-surface)",
              border: "1px dashed var(--color-border)",
            }}
          >
            <Map size={20} style={{ color: "var(--color-border)", margin: "0 auto 8px" }} />
            <p style={{ fontSize: "13px", color: "var(--color-stone)", marginBottom: "8px" }}>
              No implementation plan registered yet.
            </p>
            {isOwner && (
              <Link
                href={`/cases/${caseId}/plan`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--color-cobalt)",
                  textDecoration: "none",
                }}
              >
                <Plus size={12} /> Register Implementation Plan
              </Link>
            )}
          </div>
        )}

        {/* Row 3: Verdict Chamber */}
        <div style={{ marginBottom: "1.5rem" }}>
          <ConsensusTheatre caseData={caseData} onVerdictIssued={refresh} />
        </div>

        {/* ── Dossier metadata ── */}
        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "12px",
            padding: "1.25rem",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              color: "var(--color-stone)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "1rem",
            }}
          >
            Transformation Dossier — Full Record
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
            {[
              { label: "Industry", value: caseData.industry },
              { label: "Transformation Type", value: caseData.transformation_type },
              { label: "Implementation Timeline", value: caseData.implementation_timeline },
              { label: "Decision Deadline", value: caseData.decision_deadline },
              { label: "Known Constraints", value: caseData.known_constraints || "None noted" },
              { label: "Risk Hypothesis", value: caseData.risk_hypothesis },
            ].map(({ label, value }) => (
              <div key={label}>
                <div
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "var(--color-stone)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "3px",
                  }}
                >
                  {label}
                </div>
                <div style={{ fontSize: "13px", color: "var(--color-ink)", lineHeight: 1.5 }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
