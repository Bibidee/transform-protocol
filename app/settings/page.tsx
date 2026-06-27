"use client";

import { PageWrapper } from "@/components/layout/PageWrapper";
import { useWallet } from "@/lib/context/WalletContext";
import { CONTRACT_ADDRESS, EXPLORER_BASE_URL, GENLAYER_CHAIN_ID, GENLAYER_RPC_URL } from "@/lib/constants/config";
import { contractExplorerUrl, shortAddress } from "@/lib/genlayer/explorerUtils";
import { Settings, ExternalLink, Copy, Check, AlertCircle, Wifi, FileCode } from "lucide-react";
import { useState } from "react";

function CopyRow({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: "12px", padding: "12px 0",
      borderBottom: "1px solid #E8EDFF",
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: "10px", color: "#8492B4", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700, marginBottom: "3px" }}>{label}</div>
        <div style={{ fontFamily: mono ? "var(--font-mono)" : "var(--font-body)", fontSize: "13px", color: "#0F172A", wordBreak: "break-all" }}>{value || "—"}</div>
      </div>
      {value && (
        <button onClick={copy} style={{ color: copied ? "#1A7A4A" : "#8492B4", flexShrink: 0, background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      )}
    </div>
  );
}

function SectionCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #C8D2F0", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 8px rgba(30,11,59,0.05)" }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #E8EDFF", display: "flex", alignItems: "center", gap: "10px", background: "#F5F7FF" }}>
        <div style={{ color: "#1E0B3B" }}>{icon}</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "#1E0B3B" }}>{title}</h2>
      </div>
      <div style={{ padding: "0 24px 4px" }}>{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { address, connect, disconnect, switchNetwork, isConnecting } = useWallet();
  const contractUrl = CONTRACT_ADDRESS ? contractExplorerUrl(CONTRACT_ADDRESS) : null;

  return (
    <PageWrapper narrow>
      {/* Page header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#2655FF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
          Configuration
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Settings size={22} style={{ color: "#1E0B3B" }} />
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.9rem", fontWeight: 700, color: "#1E0B3B", letterSpacing: "-0.02em" }}>
            Settings
          </h1>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* Wallet */}
        <SectionCard icon={<Settings size={16} />} title="Wallet">
          {address ? (
            <div style={{ paddingTop: "4px" }}>
              <CopyRow label="Connected Address" value={address} />
              <div style={{ display: "flex", gap: "8px", padding: "16px 0 12px" }}>
                <button onClick={switchNetwork} style={{
                  padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
                  border: "1px solid #C8D2F0", color: "#4B5675", background: "#fff", cursor: "pointer",
                }}>
                  Switch to StudioNet
                </button>
                <button onClick={disconnect} style={{
                  padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
                  border: "1px solid rgba(194,75,42,0.3)", color: "#C24B2A", background: "rgba(194,75,42,0.04)", cursor: "pointer",
                }}>
                  Disconnect
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: "20px 0 16px" }}>
              <p style={{ fontSize: "13px", color: "#4B5675", marginBottom: "14px" }}>
                Connect your injected wallet (MetaMask or compatible) to submit transformation dossiers and request consensus verdicts.
              </p>
              <button onClick={connect} disabled={isConnecting} style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "10px 22px", borderRadius: "9px",
                background: "linear-gradient(135deg, #2655FF 0%, #5046E5 100%)",
                color: "#fff", fontSize: "13px", fontWeight: 700,
                border: "none", cursor: isConnecting ? "not-allowed" : "pointer",
                opacity: isConnecting ? 0.6 : 1,
                boxShadow: "0 3px 14px rgba(38,85,255,0.3)",
              }}>
                {isConnecting ? "Connecting…" : "Connect Wallet"}
              </button>
            </div>
          )}
        </SectionCard>

        {/* Network */}
        <SectionCard icon={<Wifi size={16} />} title="GenLayer Network">
          <CopyRow label="Network" value="GenLayer StudioNet" mono={false} />
          <CopyRow label="Chain ID" value={String(GENLAYER_CHAIN_ID)} />
          <CopyRow label="RPC URL" value={GENLAYER_RPC_URL} />
          <CopyRow label="Explorer" value={EXPLORER_BASE_URL} />
          <div style={{ height: "8px" }} />
        </SectionCard>

        {/* Contract */}
        <SectionCard icon={<FileCode size={16} />} title="TransformProtocol Contract">
          {CONTRACT_ADDRESS ? (
            <div style={{ paddingTop: "4px" }}>
              <CopyRow label="Contract Address" value={CONTRACT_ADDRESS} />
              {contractUrl && (
                <a href={contractUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "14px 0 12px", fontSize: "13px", color: "#2655FF", textDecoration: "none", fontWeight: 600 }}>
                  View on GenLayer Explorer <ExternalLink size={12} />
                </a>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "16px 0 14px" }}>
              <AlertCircle size={16} style={{ color: "#C24B2A", flexShrink: 0, marginTop: "1px" }} />
              <div>
                <p style={{ fontSize: "13px", color: "#C24B2A", fontWeight: 600, marginBottom: "6px" }}>Contract not deployed</p>
                <p style={{ fontSize: "12px", color: "#4B5675", lineHeight: 1.65 }}>
                  Deploy <code style={{ fontFamily: "var(--font-mono)", background: "#F0F2FF", padding: "1px 5px", borderRadius: "4px", fontSize: "11px" }}>contract/TransformProtocol.py</code> to GenLayer StudioNet and add the contract address to{" "}
                  <code style={{ fontFamily: "var(--font-mono)", background: "#F0F2FF", padding: "1px 5px", borderRadius: "4px", fontSize: "11px" }}>NEXT_PUBLIC_CONTRACT_ADDRESS</code> in{" "}
                  <code style={{ fontFamily: "var(--font-mono)", background: "#F0F2FF", padding: "1px 5px", borderRadius: "4px", fontSize: "11px" }}>.env.local</code>.
                </p>
              </div>
            </div>
          )}
        </SectionCard>


      </div>
    </PageWrapper>
  );
}
