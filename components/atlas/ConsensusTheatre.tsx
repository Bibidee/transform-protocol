"use client";

import { useState } from "react";
import type { TransformationCase, TxState } from "@/types";
import { ReadinessVerdictCard } from "@/components/verdict/ReadinessVerdictCard";
import { TransactionCommandBar } from "@/components/transaction/TransactionCommandBar";
import { canRequestConsensus, latestVerdict } from "@/lib/mappers/contractMapper";
import { useWallet } from "@/lib/context/WalletContext";
import { requestConsensus, buildTxState, idleTxState } from "@/lib/genlayer/contractService";
import { VERDICT_LABEL_META } from "@/lib/constants/verdictLabels";
import Link from "next/link";
import { Zap, Clock, ChevronDown, ChevronUp, AlertCircle, Layers, ArrowRight } from "lucide-react";
import { CONTRACT_ADDRESS } from "@/lib/constants/config";

interface ConsensusTheatreProps {
  caseData: TransformationCase;
  onVerdictIssued?: () => void;
}

export function ConsensusTheatre({ caseData, onVerdictIssued }: ConsensusTheatreProps) {
  const { address } = useWallet();
  const [tx, setTx] = useState<TxState>(idleTxState());
  const [historyOpen, setHistoryOpen] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const canRequest = canRequestConsensus(caseData, address);
  const latestV = latestVerdict(caseData);
  const contractDeployed = !!CONTRACT_ADDRESS;

  const handleRequestConsensus = async () => {
    setRequesting(true);
    setTx(buildTxState("signing"));
    try {
      const result = await requestConsensus(caseData.case_id, (status) => {
        setTx(buildTxState(status));
      });
      setTx(buildTxState("finalized", result.txHash));
      onVerdictIssued?.();
    } catch (e) {
      setTx(buildTxState("error", null, e instanceof Error ? e.message : "Failed to request consensus"));
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div
      style={{
        background: "var(--color-aubergine)",
        borderRadius: "14px",
        overflow: "hidden",
      }}
    >
      {/* Zone header */}
      <div
        style={{
          padding: "1.1rem 1.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "rgba(201,154,62,0.15)",
              border: "1px solid rgba(201,154,62,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Zap size={14} style={{ color: "var(--color-gold)" }} />
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                color: "rgba(255,255,255,0.3)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "2px",
              }}
            >
              Zone 05
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "14px",
                fontWeight: 700,
                color: "white",
                letterSpacing: "-0.01em",
              }}
            >
              Verdict Chamber
            </div>
          </div>
        </div>
        {caseData.verdicts.length > 0 && (
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "var(--color-gold)",
              background: "rgba(201,154,62,0.12)",
              border: "1px solid rgba(201,154,62,0.2)",
              padding: "3px 10px",
              borderRadius: "100px",
            }}
          >
            {caseData.verdicts.length} verdict{caseData.verdicts.length > 1 ? "s" : ""}
          </div>
        )}
      </div>

      <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Contract not deployed */}
        {!contractDeployed && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              padding: "12px 14px",
              borderRadius: "10px",
              background: "rgba(183,92,61,0.12)",
              border: "1px solid rgba(183,92,61,0.2)",
            }}
          >
            <AlertCircle size={13} style={{ color: "var(--color-clay)", flexShrink: 0, marginTop: "1px" }} />
            <p style={{ fontSize: "12px", color: "rgba(183,92,61,0.9)" }}>
              Contract not yet deployed. Deploy TransformProtocol.py to GenLayer StudioNet first.
            </p>
          </div>
        )}

        {/* Latest verdict */}
        {latestV && (
          <div className="animate-verdict">
            <ReadinessVerdictCard verdict={latestV} round={latestV.round} />
          </div>
        )}

        {/* Request consensus panel */}
        {contractDeployed && (
          <div
            style={{
              padding: "1.25rem",
              borderRadius: "12px",
              background: canRequest
                ? "rgba(39,76,255,0.1)"
                : "rgba(255,255,255,0.04)",
              border: `1px solid ${canRequest ? "rgba(39,76,255,0.2)" : "rgba(255,255,255,0.07)"}`,
            }}
          >
            {!address ? (
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", textAlign: "center" }}>
                Connect your wallet to request a Consensus Review.
              </p>
            ) : !canRequest ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {caseData.status === "UNDER_REVIEW" ? (
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", textAlign: "center" }}>Consensus review is currently in progress.</p>
                ) : caseData.owner.toLowerCase() !== address.toLowerCase() ? (
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>Only the dossier owner can request consensus.</p>
                ) : (
                  <>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>Complete these steps to unlock the consensus request:</p>
                    {[
                      { done: !!caseData.implementation_plan, label: "Implementation Plan registered", href: `/cases/${caseData.case_id}/plan`, action: "Add Plan" },
                      { done: caseData.signals.length > 0, label: "At least one Stakeholder Signal", href: `/cases/${caseData.case_id}/signals`, action: "Add Signal" },
                      { done: caseData.evidence.length > 0, label: "At least one Evidence item", href: `/cases/${caseData.case_id}/evidence`, action: "Add Evidence" },
                    ].map(({ done, label, href, action }) => (
                      <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", padding: "10px 14px", borderRadius: "9px", background: done ? "rgba(26,122,74,0.12)" : "rgba(255,255,255,0.05)", border: `1px solid ${done ? "rgba(26,122,74,0.25)" : "rgba(255,255,255,0.08)"}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                          <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: done ? "#1A7A4A" : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {done
                              ? <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              : <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
                            }
                          </div>
                          <span style={{ fontSize: "12px", color: done ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.45)", fontWeight: done ? 500 : 400, textDecoration: done ? "line-through" : "none" }}>{label}</span>
                        </div>
                        {!done && (
                          <Link href={href} style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "5px 12px", borderRadius: "7px", background: "linear-gradient(135deg, #2655FF 0%, #5046E5 100%)", color: "#fff", fontSize: "11px", fontWeight: 700, textDecoration: "none", flexShrink: 0 }}>
                            {action} <ArrowRight size={10} />
                          </Link>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", textAlign: "center" }}>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "white",
                      marginBottom: "6px",
                    }}
                  >
                    Request Readiness Verdict
                  </div>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                    GenLayer validators will evaluate all dossier inputs and produce a canonical, on-chain Readiness Verdict.
                    <br />
                    This may take several minutes.
                  </p>
                </div>
                <button
                  onClick={handleRequestConsensus}
                  disabled={requesting}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "11px 24px",
                    borderRadius: "9px",
                    background: requesting
                      ? "rgba(255,255,255,0.08)"
                      : "linear-gradient(135deg, var(--color-cobalt) 0%, var(--color-indigo) 100%)",
                    color: requesting ? "rgba(255,255,255,0.4)" : "white",
                    fontWeight: 700,
                    fontSize: "13px",
                    cursor: requesting ? "not-allowed" : "pointer",
                    border: "none",
                    boxShadow: requesting ? "none" : "0 4px 16px rgba(39,76,255,0.35)",
                  }}
                >
                  {requesting ? (
                    <>
                      <Clock size={14} className="animate-spin-slow" />
                      Awaiting GenLayer consensus…
                    </>
                  ) : (
                    <>
                      <Zap size={14} />
                      Request Consensus Review
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TX trail */}
        <TransactionCommandBar tx={tx} />

        {/* Verdict history */}
        {caseData.verdicts.length > 1 && (
          <div>
            <button
              onClick={() => setHistoryOpen((p) => !p)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.45)",
                fontSize: "11px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <Layers size={12} />
              {historyOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              Verdict History ({caseData.verdicts.length - 1} earlier{" "}
              {caseData.verdicts.length - 1 === 1 ? "verdict" : "verdicts"})
            </button>
            {historyOpen && (
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {[...caseData.verdicts].reverse().slice(1).map((v, i) => (
                  <ReadinessVerdictCard key={i} verdict={v} round={v.round} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
