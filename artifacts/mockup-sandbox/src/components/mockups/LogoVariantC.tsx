export default function LogoVariantC() {
  const green = "#1a5c38";
  const darkGreen = "#0f3d24";
  const orange = "#f97316";
  const plateColor = "#e8f5ee";
  const pulse = [
    "M42,80 L58,80 L66,55 L74,105 L82,65 L90,95 L98,80 L158,80",
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f3d24",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      <div
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
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="100" cy="100" r="86" fill={green} fillOpacity="0.18" />
          <circle cx="100" cy="100" r="72" fill={plateColor} />
          <circle cx="100" cy="100" r="72" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />

          <circle cx="100" cy="100" r="58" fill="none" stroke={green} strokeWidth="1" strokeOpacity="0.3" />

          <clipPath id="plate-clip-c">
            <circle cx="100" cy="100" r="71" />
          </clipPath>
          <g clipPath="url(#plate-clip-c)">
            <path
              d={pulse[0]}
              stroke={orange}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>

          <rect
            x="130"
            y="138"
            width="52"
            height="22"
            rx="11"
            fill={orange}
          />
          <text
            x="156"
            y="153"
            textAnchor="middle"
            fill="white"
            fontSize="11"
            fontWeight="700"
            fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
            letterSpacing="1"
          >
            CFO
          </text>

          <circle cx="38" cy="102" r="5" fill={green} fillOpacity="0.5" />
          <circle cx="162" cy="58" r="4" fill={orange} fillOpacity="0.6" />
        </svg>

        <div style={{ marginTop: 28, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 38,
                fontWeight: 300,
                color: "#e8f5ee",
                letterSpacing: "-0.5px",
                lineHeight: 1,
              }}
            >
              Kitchen
            </span>
            <span
              style={{
                fontSize: 38,
                fontWeight: 800,
                color: orange,
                letterSpacing: "-0.5px",
                lineHeight: 1,
              }}
            >
              CFO
            </span>
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 10,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "rgba(232,245,238,0.45)",
              fontWeight: 500,
            }}
          >
            Your Nutrition Command Center
          </div>
        </div>
      </div>
    </div>
  );
}
