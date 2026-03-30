export default function Slide8TheAsk() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#071a0e" }}>

      {/* Radial glow — matches cover */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 70% 60% at 80% 50%, rgba(30,107,66,0.5) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 15% 85%, rgba(249,115,22,0.08) 0%, transparent 55%)"
      }} />

      {/* Ghost camera — top right */}
      <svg className="absolute top-[6vh] right-[4vw] opacity-[0.06]" width="20vw" height="20vw" viewBox="0 0 100 80" fill="none">
        <rect x="4" y="18" width="92" height="58" rx="10" stroke="white" strokeWidth="4"/>
        <circle cx="50" cy="47" r="18" stroke="white" strokeWidth="4"/>
        <circle cx="50" cy="47" r="8" stroke="white" strokeWidth="3"/>
        <rect x="30" y="8" width="20" height="14" rx="4" fill="white"/>
        <circle cx="80" cy="28" r="5" fill="#f97316"/>
      </svg>

      {/* Ghost bars — bottom left */}
      <svg className="absolute bottom-[3vh] left-[2vw] opacity-[0.05]" width="16vw" height="16vw" viewBox="0 0 100 100" fill="none">
        <rect x="10" y="60" width="15" height="35" rx="3" fill="white"/>
        <rect x="35" y="40" width="15" height="55" rx="3" fill="white"/>
        <rect x="60" y="20" width="15" height="75" rx="3" fill="white"/>
        <rect x="85" y="45" width="15" height="50" rx="3" fill="white"/>
        <line x1="5" y1="98" x2="105" y2="98" stroke="white" strokeWidth="3"/>
      </svg>

      {/* Orange accent line — left side */}
      <div className="absolute left-[7vw] top-[50%] translate-y-[-50%] w-1 h-[20vh] rounded-full" style={{ background: "#f97316" }} />

      {/* Main content — centered */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-[15vw]">

        <p className="font-body text-[1.3vw] tracking-[0.15em] uppercase mb-[3vh]" style={{ color: "rgba(255,255,255,0.4)" }}>
          The Ask
        </p>

        <h2 className="font-display font-black text-[6vw] tracking-tight text-white mb-[4vh] leading-none">
          Try it today.
        </h2>

        <p className="font-display font-black text-[3vw] leading-none mb-[4vh]" style={{ color: "#f97316" }}>
          kitchen-intelligence.replit.app
        </p>

        <p className="font-body text-[1.7vw] leading-relaxed mb-[6vh]" style={{ color: "rgba(255,255,255,0.6)" }}>
          "Your body is finally being listened to."
        </p>

        {/* Divider */}
        <div className="w-[20vw] h-px mb-[4vh]" style={{ background: "rgba(249,115,22,0.4)" }} />

        <p className="font-body text-[1.4vw]" style={{ color: "rgba(255,255,255,0.35)" }}>
          Kitchen CFO — Food Intelligence for Your Biology
        </p>

      </div>

    </div>
  );
}
