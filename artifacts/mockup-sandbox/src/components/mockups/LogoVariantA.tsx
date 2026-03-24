import { useRef } from "react";
import { toPng } from "html-to-image";

export default function LogoVariantA() {
  const green = "#1a5c38";
  const orange = "#f97316";
  const bars = [38, 52, 44, 68, 80, 60, 90];
  const logoRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!logoRef.current) return;
    const dataUrl = await toPng(logoRef.current, { cacheBust: true });
    const a = document.createElement("a");
    a.download = "kitchen-cfo-logo-a.png";
    a.href = dataUrl;
    a.click();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8faf8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        gap: 20,
      }}
    >
      <div
        ref={logoRef}
        id="logo-a"
        style={{
          width: 520,
          background: "#ffffff",
          borderRadius: 28,
          padding: "56px 48px",
          boxShadow: "0 4px 40px rgba(26,92,56,0.10)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
        }}
      >
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="100" cy="100" r="96" fill={green} />
          <circle cx="100" cy="100" r="78" fill="#ffffff" fillOpacity="0.08" />
          <circle cx="100" cy="100" r="62" fill="#ffffff" fillOpacity="0.12" />
          <circle cx="100" cy="100" r="6" fill="#ffffff" fillOpacity="0.3" />

          {bars.map((h, i) => {
            const total = bars.length;
            const barW = 10;
            const gap = 6;
            const totalW = total * barW + (total - 1) * gap;
            const startX = 100 - totalW / 2;
            const x = startX + i * (barW + gap);
            const maxH = 52;
            const barH = (h / 100) * maxH;
            const y = 100 + 20 - barH;
            const isLast = i === total - 1;
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={barH}
                  rx={3}
                  fill={isLast ? orange : "#ffffff"}
                  fillOpacity={isLast ? 1 : 0.85}
                />
              </g>
            );
          })}

          <line x1="68" y1="120" x2="132" y2="120" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.4" />

          <circle cx="160" cy="40" r="12" fill={orange} stroke="#ffffff" strokeWidth="2" />
          <polyline points="155,44 158,40 163,36" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>

        <div style={{ marginTop: 32, textAlign: "center" }}>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.5px", color: green, lineHeight: 1 }}>
            Kitchen
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4 }}>
            <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.5px", color: green, lineHeight: 1 }}>
              CFO
            </div>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: orange, marginBottom: 2 }} />
          </div>
          <div style={{ marginTop: 10, fontSize: 11, letterSpacing: "3px", textTransform: "uppercase", color: "#6b9c7e", fontWeight: 600 }}>
            Nutrition Intelligence
          </div>
        </div>
      </div>

      <button
        onClick={handleExport}
        style={{
          padding: "10px 24px",
          background: green,
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "inherit",
        }}
      >
        ↓ Export PNG
      </button>
    </div>
  );
}
