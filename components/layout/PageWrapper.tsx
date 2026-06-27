import { Navigation } from "./Navigation";
import { Footer } from "./Footer";

interface PageWrapperProps {
  children: React.ReactNode;
  noPad?: boolean;
  narrow?: boolean;
}

export function PageWrapper({ children, noPad = false, narrow = false }: PageWrapperProps) {
  const maxW = narrow ? "860px" : "1280px";
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navigation />
      <main
        style={{
          flex: 1,
          width: "100%",
          maxWidth: maxW,
          marginLeft: "auto",
          marginRight: "auto",
          padding: noPad ? 0 : "2rem 1.5rem",
        }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
