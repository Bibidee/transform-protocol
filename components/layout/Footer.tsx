import { CONTRACT_ADDRESS } from "@/lib/constants/config";
import { contractExplorerUrl } from "@/lib/genlayer/explorerUtils";

export function Footer() {
  const contractUrl = CONTRACT_ADDRESS ? contractExplorerUrl(CONTRACT_ADDRESS) : null;

  return (
    <footer
      style={{
        background: "var(--color-aubergine)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
      className="mt-auto"
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 py-7"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "6px",
              background: "linear-gradient(135deg, var(--color-cobalt) 0%, var(--color-indigo) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="rgba(255,255,255,0.85)" strokeWidth="1.1" fill="none"/>
              <circle cx="6" cy="6" r="1.3" fill="var(--color-gold)"/>
            </svg>
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                color: "white",
                fontWeight: 700,
                fontSize: "13px",
              }}
            >
              Transform Protocol
            </div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px" }}>
              Movement Cartography · GenLayer Consensus
            </p>
          </div>
        </div>

        {/* Right info */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
          {contractUrl ? (
            <a
              href={contractUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--color-gold)",
                textDecoration: "none",
              }}
            >
              Contract: {CONTRACT_ADDRESS.slice(0, 10)}…{CONTRACT_ADDRESS.slice(-6)}
            </a>
          ) : (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>
              Contract not yet deployed
            </span>
          )}
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
            Powered by{" "}
            <a
              href="https://genlayer.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
            >
              GenLayer
            </a>
            {" "}· StudioNet
          </span>
        </div>
      </div>
    </footer>
  );
}
