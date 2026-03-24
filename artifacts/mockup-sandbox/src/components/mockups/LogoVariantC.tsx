import { useRef } from "react";
import { toPng } from "html-to-image";

export default function LogoVariantC() {
  const green = "#1a5c38";
  const darkGreen = "#0f3d24";
  const orange = "#f97316";
  const logoRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!logoRef.current) return;
    const dataUrl = await toPng(logoRef.current, { cacheBust: true });
    const a = document.createElement("a");
    a.download = "kitchen-cfo-logo-c.png";
    a.href = dataUrl;
    a.click();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f3d24",
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
        id="logo-c"
        style={{
          background: darkGreen,
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 32,
          padding: "52px 56px",
          boxShadow: "0 20px 80px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          minWidth: 360,
        }}
      >
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="86" fill={green} fillOpacity="0.18" />
          <circle cx="100" cy="100" r="72" fill="#e8f5ee" />
          <circle cx="100" cy="100" r="72" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
          <circle cx="100" cy="100" r="58" fill="none" stroke={green} strokeWidth="1" strokeOpacity="0.3" />
          <clipPath id="plate-clip-c">
            <circle cx="100" cy="100" r="71" />
          </clipPath>
          <g clipPath="url(#plate-clip-c)">
            <polyline
              points="42,100 58,100 66,75 74,125 82,88 90,112 98,100 158,100"
              stroke={orange}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>
          <rect x="130" y="138" width="52" height="22" rx="11" fill={orange} />
          <text x="156" y="153" textAnchor="middle" fill="white" fontSize="11" fontWeight="700"
            style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif", letterSpacing: "1px" }}>
            CFO
          </text>
          <circle cx="38" cy="102" r="5" fill={green} fillOpacity="0.5" />
          <circle cx="162" cy="58" r="4" fill={orange} fillOpacity="0.6" />
        </svg>

        <div style={{ marginTop: 28, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 8 }}>
            <span style={{ fontSize: 38, fontWeight: 300, color: "#e8f5ee", letterSpacing: "-0.5px", lineHeight: 1 }}>
              Kitchen
            </span>
            <span style={{ fontSize: 38, fontWeight: 800, color: orange, letterSpacing: "-0.5px", lineHeight: 1 }}>
              CFO
            </span>
          </div>
          <div style={{ marginTop: 10, fontSize: 10, letterSpacing: "3px", textTransform: "uppercase", color: "rgba(232,245,238,0.45)", fontWeight: 500 }}>
            Your Nutrition Command Center
          </div>
        </div>
      </div>

      <button
        onClick={handleExport}
        style={{
          padding: "10px 24px",
          background: orange,
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
