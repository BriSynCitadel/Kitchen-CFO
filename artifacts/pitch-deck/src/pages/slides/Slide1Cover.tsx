export default function Slide1Cover() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#071a0e" }}>

      {/* Radial glow — center-right */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 70% 60% at 80% 50%, rgba(30,107,66,0.55) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 20% 80%, rgba(249,115,22,0.08) 0%, transparent 60%)"
      }} />

      {/* Ghost camera SVG — top right */}
      <svg className="absolute top-[6vh] right-[5vw] opacity-[0.07]" width="22vw" height="22vw" viewBox="0 0 100 80" fill="none">
        <rect x="4" y="18" width="92" height="58" rx="10" stroke="white" strokeWidth="4"/>
        <circle cx="50" cy="47" r="18" stroke="white" strokeWidth="4"/>
        <circle cx="50" cy="47" r="8" stroke="white" strokeWidth="3"/>
        <rect x="30" y="8" width="20" height="14" rx="4" fill="white"/>
        <circle cx="80" cy="28" r="5" fill="#f97316"/>
      </svg>

      {/* Ghost chart SVG — bottom left */}
      <svg className="absolute bottom-[4vh] left-[3vw] opacity-[0.06]" width="18vw" height="18vw" viewBox="0 0 100 100" fill="none">
        <rect x="10" y="60" width="15" height="35" rx="3" fill="white"/>
        <rect x="35" y="40" width="15" height="55" rx="3" fill="white"/>
        <rect x="60" y="20" width="15" height="75" rx="3" fill="white"/>
        <rect x="85" y="45" width="15" height="50" rx="3" fill="white"/>
        <line x1="5" y1="98" x2="105" y2="98" stroke="white" strokeWidth="3"/>
      </svg>

      {/* Orange accent line */}
      <div className="absolute left-[7vw] top-[50%] translate-y-[-50%] w-1 h-[28vh] rounded-full" style={{ background: "#f97316" }} />

      {/* Main content */}
      <div className="relative z-10 flex flex-col justify-center h-full pl-[10vw] pr-[30vw]">

        <div className="mb-[2vh]">
          <span className="font-body text-[1.4vw] tracking-[0.18em] uppercase" style={{ color: "rgba(255,255,255,0.45)" }}>
            Investor Presentation · 2026
          </span>
        </div>

        <h1 className="font-display font-black text-[7.5vw] leading-[0.9] tracking-tight text-white mb-[3vh]">
          Kitchen
          <span style={{ color: "#f97316" }}> CFO</span>
        </h1>

        <p className="font-display font-semibold text-[2.4vw] text-white leading-snug mb-[2vh]">
          Food Intelligence for Your Biology
        </p>

        <p className="font-body text-[1.7vw] leading-relaxed" style={{ color: "#f97316" }}>
          "Your body is finally being listened to."
        </p>

      </div>

      {/* Bottom strip */}
      <div className="absolute bottom-[5vh] left-[10vw] right-[7vw] flex items-center justify-between">
        <div className="flex items-center gap-[0.8vw]">
          <svg width="1.4vw" height="1.4vw" viewBox="0 0 20 20" fill="none">
            <path d="M10 2C6.5 2 3 5.5 3 9.5c0 5.25 7 10.5 7 10.5s7-5.25 7-10.5C17 5.5 13.5 2 10 2z" fill="#f97316"/>
            <circle cx="10" cy="9" r="2.5" fill="white"/>
          </svg>
          <span className="font-body text-[1.3vw]" style={{ color: "rgba(255,255,255,0.45)" }}>
            kitchen-intelligence.replit.app
          </span>
        </div>
        <span className="font-body text-[1.3vw]" style={{ color: "rgba(255,255,255,0.3)" }}>
          Confidential
        </span>
      </div>

    </div>
  );
}
