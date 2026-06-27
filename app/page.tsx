"use client";

import Link from "next/link";
import { useWallet } from "@/lib/context/WalletContext";
import { useTransform } from "@/lib/context/TransformContext";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { CaseCard } from "@/components/cases/CaseCard";
import { CONTRACT_ADDRESS } from "@/lib/constants/config";
import { ArrowRight, Loader2, AlertTriangle, ChevronRight } from "lucide-react";

function HeroSection() {
  const { address, connect, isConnecting } = useWallet();

  return (
    <section
      style={{
        background: "linear-gradient(145deg, var(--color-aubergine) 0%, #2D1260 55%, #1A1050 100%)",
        borderRadius: "20px",
        padding: "clamp(3rem, 7vw, 5rem) clamp(2rem, 5vw, 4rem)",
        position: "relative",
        overflow: "hidden",
        marginBottom: "1.5rem",
      }}
    >
      {/* Decorative cartography lines */}
      <svg
        style={{ position: "absolute", right: 0, top: 0, opacity: 0.07, pointerEvents: "none" }}
        width="500" height="420" viewBox="0 0 500 420" fill="none"
      >
        <circle cx="380" cy="190" r="260" stroke="white" strokeWidth="1"/>
        <circle cx="380" cy="190" r="180" stroke="white" strokeWidth="0.8"/>
        <circle cx="380" cy="190" r="100" stroke="white" strokeWidth="0.6"/>
        <line x1="0" y1="190" x2="500" y2="190" stroke="white" strokeWidth="0.6"/>
        <line x1="380" y1="0" x2="380" y2="420" stroke="white" strokeWidth="0.6"/>
        <circle cx="380" cy="190" r="7" fill="rgba(212,144,10,0.7)"/>
      </svg>
      <div
        style={{
          position: "absolute",
          bottom: "-80px",
          left: "-80px",
          width: "380px",
          height: "380px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(38,85,255,0.18) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: "660px" }}>
        {/* Eyebrow badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(212,144,10,0.14)", border: "1px solid rgba(212,144,10,0.3)", borderRadius: "100px", padding: "5px 14px 5px 10px", marginBottom: "2rem" }}>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--color-gold)" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--color-gold)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Movement Cartography · GenLayer · StudioNet
          </span>
        </div>

        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.6rem, 6vw, 4.4rem)", fontWeight: 700, color: "white", lineHeight: 1.05, letterSpacing: "-0.028em", marginBottom: "1.25rem" }}>
          Map whether your<br />
          <span style={{ background: "linear-gradient(90deg, #5B8FFF 0%, #A78BFF 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            organisation can move.
          </span>
        </h1>

        <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.58)", lineHeight: 1.75, maxWidth: "560px", marginBottom: "2.25rem" }}>
          Submit transformation context, stakeholder signals, and public evidence.
          GenLayer validators produce a canonical, on-chain Readiness Verdict.
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {address ? (
            <Link href="/cases/new" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 26px", borderRadius: "11px", background: "linear-gradient(135deg, var(--color-cobalt) 0%, var(--color-indigo) 100%)", color: "white", fontWeight: 700, fontSize: "14px", textDecoration: "none", boxShadow: "0 6px 24px rgba(38,85,255,0.4)" }}>
              Open Transformation Dossier <ArrowRight size={15} />
            </Link>
          ) : (
            <button onClick={connect} disabled={isConnecting} style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 26px", borderRadius: "11px", background: "linear-gradient(135deg, var(--color-cobalt) 0%, var(--color-indigo) 100%)", color: "white", fontWeight: 700, fontSize: "14px", border: "none", cursor: isConnecting ? "not-allowed" : "pointer", boxShadow: "0 6px 24px rgba(38,85,255,0.4)", opacity: isConnecting ? 0.7 : 1 }}>
              {isConnecting ? <><Loader2 size={15} className="animate-spin-slow" />Connecting…</> : <>Connect Wallet <ArrowRight size={15} /></>}
            </button>
          )}
          <Link href="/explore" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 22px", borderRadius: "11px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.75)", fontWeight: 600, fontSize: "14px", textDecoration: "none" }}>
            Explore Dossiers
          </Link>
        </div>
      </div>

      {/* Stat row */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        {[
          { label: "Consensus", value: "Decentralised AI" },
          { label: "Evidence", value: "Public URLs only" },
          { label: "Storage", value: "On-chain only" },
          { label: "Network", value: "StudioNet" },
        ].map(s => (
          <div key={s.label}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "4px" }}>{s.label}</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.72)" }}>{s.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SplitSection() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
      <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "16px", padding: "2rem" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--color-clay)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>The Problem</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, color: "var(--color-aubergine)", lineHeight: 1.2, marginBottom: "12px" }}>
          Readiness is not a checklist.
        </h2>
        <p style={{ fontSize: "13px", color: "var(--color-stone)", lineHeight: 1.75, marginBottom: "1.25rem" }}>
          Most transformation programmes reduce readiness to survey scores and consultant opinions.
          Real readiness is ambiguous, disputed, and depends on subjective human and organisational factors.
        </p>
        {["Survey scores ≠ actual readiness", "Stakeholder resistance is often hidden", "Consultant opinions lack auditability"].map(s => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "7px", fontSize: "12px", color: "var(--color-stone)" }}>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--color-clay)", flexShrink: 0 }} />
            {s}
          </div>
        ))}
      </div>

      <div style={{ background: "linear-gradient(145deg, var(--color-aubergine) 0%, #2A1555 100%)", borderRadius: "16px", padding: "2rem" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--color-gold)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>The Transform Primitive</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, color: "white", lineHeight: 1.2, marginBottom: "12px" }}>
          Consensus-backed transformation judgment.
        </h2>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, marginBottom: "1.25rem" }}>
          GenLayer validators evaluate the same Transformation Dossier through decentralised consensus
          and produce a structured Readiness Verdict — defensible, on-chain, verifiable.
        </p>
        {["Subjective judgment via GenLayer consensus", "Evidence-backed confidence scoring", "On-chain verdict with full audit trail"].map(s => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "7px", fontSize: "12px", color: "rgba(255,255,255,0.58)" }}>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--color-gold)", flexShrink: 0 }} />
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

const ZONES = [
  { label: "Movement Meridian", color: "#2655FF", bg: "#EFF3FF", border: "#C7D4FF", desc: "Vertical route tracking the transformation journey — phase risk and evidence strength at each node." },
  { label: "Readiness Terrain", color: "#1A7A4A", bg: "#EDFAF3", border: "#B6E8CF", desc: "Domain map assessing Leadership, Culture, Technology, and 8 other readiness regions." },
  { label: "Friction Field", color: "#C24B2A", bg: "#FFF0EC", border: "#F5C4B8", desc: "Resistance hotspots, incentive conflicts, evidence gaps, and culture blockers." },
  { label: "Implementation Corridor", color: "#D4900A", bg: "#FFF8E6", border: "#F5DDA0", desc: "Horizontal route timeline — phases, milestones, readiness gates, high-risk transition points." },
  { label: "Verdict Chamber", color: "#5046E5", bg: "#F0EEFF", border: "#C8C2FF", desc: "The consensus payoff — Readiness Verdict, confidence score, blockers, and recommended next action." },
];

function ZoneStrip() {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--color-stone)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
          Movement Cartography Interface
        </div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "var(--color-aubergine)" }}>
          Five zones. One readiness map.
        </h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" }}>
        {ZONES.map(z => (
          <div key={z.label} style={{ background: z.bg, border: `1px solid ${z.border}`, borderRadius: "12px", padding: "1.1rem", borderTop: `3px solid ${z.color}` }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, color: z.color, marginBottom: "7px", lineHeight: 1.3 }}>{z.label}</div>
            <p style={{ fontSize: "11px", color: "#64748B", lineHeight: 1.6 }}>{z.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkflowSection() {
  const steps = [
    { n: "01", label: "Open Dossier", desc: "Create a Transformation Dossier with current state, target state, and objective" },
    { n: "02", label: "Register Plan", desc: "Submit the Implementation Plan with phases, milestones, and risk assumptions" },
    { n: "03", label: "Log Signals", desc: "Add Stakeholder Signals — resistance, incentive gaps, adoption pressure" },
    { n: "04", label: "Attach Evidence", desc: "Link public evidence URLs — frameworks, memos, studies, readiness assessments" },
    { n: "05", label: "Request Consensus", desc: "GenLayer validators evaluate all inputs and produce a canonical Readiness Verdict" },
    { n: "06", label: "Read Verdict", desc: "View the on-chain verdict with confidence score, blockers, and recommended action" },
  ];

  return (
    <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "16px", overflow: "hidden", marginBottom: "1.5rem" }}>
      <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid var(--color-border)", background: "var(--color-aubergine)" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>How Transform Works</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: "white" }}>Six steps from dossier to verdict</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
        {steps.map((step, i) => (
          <div key={step.n} style={{ padding: "1.5rem 1.75rem", borderRight: i % 3 !== 2 ? "1px solid var(--color-border)" : "none", borderBottom: i < 3 ? "1px solid var(--color-border)" : "none" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-cobalt)", fontWeight: 700, marginBottom: "6px", letterSpacing: "0.04em" }}>{step.n}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, color: "var(--color-aubergine)", marginBottom: "6px" }}>{step.label}</div>
            <p style={{ fontSize: "12px", color: "var(--color-stone)", lineHeight: 1.65 }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { address } = useWallet();
  const { cases, loadingCases } = useTransform();
  const recentCases = cases.slice(0, 6);
  const contractDeployed = !!CONTRACT_ADDRESS;

  return (
    <PageWrapper>
      <HeroSection />
      <SplitSection />
      <ZoneStrip />
      <WorkflowSection />

      {!contractDeployed && (
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "14px 18px", borderRadius: "12px", background: "rgba(212,144,10,0.07)", border: "1px solid rgba(212,144,10,0.2)", marginBottom: "1.5rem" }}>
          <AlertTriangle size={15} style={{ color: "var(--color-gold)", flexShrink: 0, marginTop: "2px" }} />
          <div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-aubergine)", marginBottom: "2px" }}>Contract Not Deployed</div>
            <p style={{ fontSize: "12px", color: "var(--color-stone)" }}>
              Deploy <code style={{ fontFamily: "var(--font-mono)", fontSize: "11px", background: "rgba(0,0,0,0.05)", padding: "1px 5px", borderRadius: "4px" }}>contract/TransformProtocol.py</code> to GenLayer StudioNet, then add the contract address to <code style={{ fontFamily: "var(--font-mono)", fontSize: "11px", background: "rgba(0,0,0,0.05)", padding: "1px 5px", borderRadius: "4px" }}>.env.local</code>.
            </p>
          </div>
        </div>
      )}

      {/* Recent dossiers */}
      <section>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--color-stone)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}>Case Registry</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: 700, color: "var(--color-aubergine)" }}>Recent Transformation Dossiers</h2>
          </div>
          <Link href="/cases" style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 600, color: "var(--color-cobalt)", textDecoration: "none" }}>
            View all <ChevronRight size={13} />
          </Link>
        </div>

        {loadingCases ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "5rem 0", gap: "10px", color: "var(--color-stone)", fontSize: "13px" }}>
            <Loader2 size={18} className="animate-spin-slow" /> Loading dossiers…
          </div>
        ) : recentCases.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", borderRadius: "16px", background: "var(--color-surface)", border: "1px dashed var(--color-border)" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: "var(--color-aubergine)", marginBottom: "6px" }}>No transformation dossiers yet</div>
            <p style={{ fontSize: "13px", color: "var(--color-stone)", marginBottom: "1.5rem" }}>
              {contractDeployed ? "Be the first to open a Transformation Dossier." : "Deploy the contract to start mapping transformation readiness."}
            </p>
            {address && contractDeployed && (
              <Link href="/cases/new" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 20px", borderRadius: "9px", background: "var(--color-aubergine)", color: "white", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>
                Open First Dossier <ArrowRight size={14} />
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
            {recentCases.map(c => (
              <CaseCard key={c.case_id} caseData={c} owned={address ? c.owner.toLowerCase() === address.toLowerCase() : false} />
            ))}
          </div>
        )}
      </section>
    </PageWrapper>
  );
}
