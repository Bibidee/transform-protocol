"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--color-canvas)" }}>
      <div className="text-center max-w-md">
        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, color: "var(--color-clay)", marginBottom: "0.5rem" }}>
          Something went wrong
        </div>
        <p style={{ fontSize: "13px", color: "var(--color-stone)", marginBottom: "1.5rem" }}>
          {error.message || "An unexpected error occurred."}
        </p>
        <button onClick={reset}
          style={{ background: "var(--color-plum)", color: "white", padding: "0.5rem 1.5rem", borderRadius: "8px", fontSize: "13px", fontWeight: 500 }}>
          Try again
        </button>
      </div>
    </div>
  );
}
