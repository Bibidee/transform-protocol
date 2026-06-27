"use client";

import { useWallet } from "@/lib/context/WalletContext";
import { Wallet, AlertCircle } from "lucide-react";

interface WalletConnectProps {
  message?: string;
}

export function WalletConnect({ message = "Connect your wallet to continue" }: WalletConnectProps) {
  const { connect, isConnecting, error } = useWallet();

  return (
    <div className="flex flex-col items-center gap-6 py-16 px-6 text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: "var(--color-plum-light)", border: "1px solid var(--color-sand)" }}
      >
        <Wallet size={28} style={{ color: "var(--color-plum)" }} />
      </div>

      <div>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-plum)",
            fontSize: "1.25rem",
            fontWeight: 600,
          }}
        >
          Wallet Required
        </h3>
        <p style={{ color: "var(--color-stone)", marginTop: "0.4rem", fontSize: "0.9rem" }}>
          {message}
        </p>
      </div>

      {error && (
        <div
          className="flex items-center gap-2 px-4 py-2 rounded"
          style={{
            background: "var(--color-clay-light)",
            border: "1px solid rgba(182,90,60,0.2)",
            color: "var(--color-clay)",
            fontSize: "13px",
          }}
        >
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      <button
        onClick={connect}
        disabled={isConnecting}
        style={{
          background: "var(--color-plum)",
          color: "white",
          fontFamily: "var(--font-body)",
          fontWeight: 500,
          fontSize: "14px",
        }}
        className="flex items-center gap-2 px-6 py-2.5 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isConnecting ? (
          <>
            <span className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin-slow" />
            Connecting…
          </>
        ) : (
          <>
            <Wallet size={16} />
            Connect Wallet
          </>
        )}
      </button>

      <p style={{ fontSize: "11px", color: "var(--color-stone)" }}>
        Supports MetaMask, Rainbow, Zerion, and WalletConnect-compatible wallets.
        <br />
        Requires GenLayer Studionet.
      </p>
    </div>
  );
}
