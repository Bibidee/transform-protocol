import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--color-canvas)" }}>
      <div className="text-center">
        <div style={{ fontFamily: "var(--font-display)", fontSize: "4rem", fontWeight: 700, color: "var(--color-plum)", lineHeight: 1 }}>
          404
        </div>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--color-stone)", marginTop: "0.75rem", marginBottom: "1.5rem" }}>
          Page not found
        </p>
        <Link href="/" style={{ color: "var(--color-cobalt)", fontSize: "14px" }}>
          Return to Atlas →
        </Link>
      </div>
    </div>
  );
}
