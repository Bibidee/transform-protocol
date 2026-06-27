"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { useWallet } from "@/lib/context/WalletContext";
import { shortAddress } from "@/lib/genlayer/explorerUtils";
import { CONTRACT_ADDRESS } from "@/lib/constants/config";
import { Map, LayoutGrid, Compass, Settings, Menu, X } from "lucide-react";

const NAV = [
  { href: "/", label: "Command", icon: LayoutGrid },
  { href: "/cases", label: "Dossiers", icon: Map },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();
  const { address, connect, disconnect, isConnecting } = useWallet();
  const [mobileOpen, setMobileOpen] = useState(false);
  const contractDeployed = !!CONTRACT_ADDRESS;

  return (
    <header
      style={{
        background: "var(--color-aubergine)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
      className="sticky top-0 z-50"
    >
      <nav style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          {/* Cartography mark */}
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              background: "linear-gradient(135deg, var(--color-cobalt) 0%, var(--color-indigo) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" fill="none"/>
              <line x1="7" y1="1.5" x2="7" y2="12.5" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8"/>
              <line x1="1.5" y1="7" x2="12.5" y2="7" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8"/>
              <circle cx="7" cy="7" r="1.5" fill="var(--color-gold)"/>
            </svg>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span
              style={{
                fontFamily: "var(--font-display)",
                color: "white",
                fontWeight: 700,
                fontSize: "1rem",
                letterSpacing: "-0.02em",
              }}
            >
              Transform
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Protocol
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  padding: "7px 14px", borderRadius: "8px",
                  fontSize: "13px", fontWeight: active ? 600 : 500,
                  color: active ? "var(--color-gold)" : "rgba(255,255,255,0.6)",
                  background: active ? "rgba(212,144,10,0.12)" : "transparent",
                  transition: "all 0.15s",
                  textDecoration: "none",
                }}
              >
                <Icon size={13} />
                {label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {address ? (
            <div className="hidden md:flex items-center gap-2">
              <div
                style={{
                  background: "rgba(47,133,90,0.15)",
                  border: "1px solid rgba(47,133,90,0.3)",
                  color: "rgba(100,220,140,0.9)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#4ade80" }}
                />
                {shortAddress(address)}
              </div>
              <button
                onClick={disconnect}
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "11px",
                  background: "transparent",
                }}
                className="px-2.5 py-1 rounded hover:border-[rgba(183,92,61,0.5)] hover:text-[var(--color-rose)] transition-colors"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connect}
              disabled={isConnecting}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 18px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #2655FF 0%, #5046E5 100%)",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 600,
                fontFamily: "var(--font-body)",
                border: "none",
                whiteSpace: "nowrap",
                flexShrink: 0,
                cursor: "pointer",
                opacity: isConnecting ? 0.6 : 1,
                boxShadow: "0 2px 12px rgba(38,85,255,0.35)",
              }}
            >
              {isConnecting ? (
                <>
                  <span style={{ width: "12px", height: "12px", border: "1.5px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", display: "inline-block" }} className="animate-spin-slow" />
                  Connecting…
                </>
              ) : (
                "Connect Wallet"
              )}
            </button>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-1.5 rounded"
            onClick={() => setMobileOpen((p) => !p)}
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            background: "rgba(22,13,32,0.98)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
          className="md:hidden px-4 pb-4 pt-2 flex flex-col gap-1"
        >
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded text-sm font-medium"
                style={{ color: active ? "var(--color-gold)" : "rgba(255,255,255,0.6)" }}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
          <div className="mt-2 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {address ? (
              <button
                onClick={() => { disconnect(); setMobileOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm"
                style={{ color: "var(--color-rose)", fontFamily: "var(--font-mono)" }}
              >
                {shortAddress(address)} — Disconnect
              </button>
            ) : (
              <button
                onClick={() => { connect(); setMobileOpen(false); }}
                className="w-full px-3 py-2.5 rounded-md text-sm font-semibold text-white"
                style={{ background: "var(--color-cobalt)" }}
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
