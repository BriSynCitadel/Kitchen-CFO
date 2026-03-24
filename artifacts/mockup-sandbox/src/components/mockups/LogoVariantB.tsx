export default function LogoVariantB() {
  const green = "#1a5c38";
  const orange = "#f97316";
  const bgGreen = "#f0f7f3";

  const tineHeights = [44, 60, 52, 76, 92];
  const tineWidth = 14;
  const tineGap = 8;
  const tineY = 30;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: bgGreen,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      <div
        id="logo-b"
        style={{
          background: "#ffffff",
          borderRadius: 28,
          padding: "52px 56px",
          boxShadow: "0 4px 40px rgba(26,92,56,0.10)",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 36,
        }}
      >
        <svg
          width="140"
          height="180"
          viewBox="0 0 140 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {tineHeights.map((h, i) => {
            const totalW = tineHeights.length * tineWidth + (tineHeights.length - 1) * tineGap;
            const startX = (140 - totalW) / 2;
            const x = startX + i * (tineWidth + tineGap);
            const isLast = i === tineHeights.length - 1;
            const orangeSegH = isLast ? 28 : 0;
            const greenH = h - orangeSegH;

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={tineY}
                  width={tineWidth}
                  height={greenH}
                  rx={4}
                  fill={green}
                />
                {isLast && (
                  <rect
                    x={x}
                    y={tineY}
                    width={tineWidth}
                    height={orangeSegH}
                    rx={4}
                    fill={orange}
                  />
                )}
              </g>
            );
          })}

          {(() => {
            const totalW = tineHeights.length * tineWidth + (tineHeights.length - 1) * tineGap;
            const startX = (140 - totalW) / 2;
            const handleX = startX + totalW / 2 - 9;
            const handleY = tineY + Math.max(...tineHeights) + 2;
            return (
              <g>
                <rect
                  x={handleX}
                  y={handleY}
                  width={18}
                  height={56}
                  rx={9}
                  fill={green}
                />
              </g>
            );
          })()}

          <circle cx="118" cy="28" r="7" fill={orange} opacity="0.9" />
          <path
            d="M115 30 L117 27 L121 27"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <div
            style={{
              fontSize: 40,
              fontWeight: 300,
              color: green,
              letterSpacing: "-1px",
              lineHeight: 1.1,
            }}
          >
            Kitchen
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
            <div
              style={{
                fontSize: 40,
                fontWeight: 800,
                color: green,
                letterSpacing: "-1px",
                lineHeight: 1.2,
                position: "relative",
              }}
            >
              CFO
              <div
                style={{
                  position: "absolute",
                  bottom: -4,
                  left: 0,
                  width: "100%",
                  height: 4,
                  background: orange,
                  borderRadius: 2,
                }}
              />
            </div>
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 10,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: "#6b9c7e",
              fontWeight: 600,
            }}
          >
            AI Food Intelligence
          </div>
        </div>
      </div>
    </div>
  );
}
