export default function Slide8TheAsk() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#071a0e" }}
    >
      {/* Radial glow — matches cover */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 80% 50%, rgba(30,107,66,0.5) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 15% 85%, rgba(249,115,22,0.08) 0%, transparent 55%)",
        }}
      />

      {/* Ghost camera — top right */}
      <svg
        className="absolute top-[6vh] right-[4vw] opacity-[0.06]"
        width="20vw"
        height="20vw"
        viewBox="0 0 100 80"
        fill="none"
      >
        <rect
          x="4"
          y="18"
          width="92"
          height="58"
          rx="10"
          stroke="white"
          strokeWidth="4"
        />
        <circle cx="50" cy="47" r="18" stroke="white" strokeWidth="4" />
        <circle cx="50" cy="47" r="8" stroke="white" strokeWidth="3" />
        <rect x="30" y="8" width="20" height="14" rx="4" fill="white" />
        <circle cx="80" cy="28" r="5" fill="#f97316" />
      </svg>

      {/* Ghost bars — bottom left */}
      <svg className="absolute bottom-[3vh] left-[2vw] opacity-[0.05]" width="16vw" height="16vw" viewBox="0 0 100 100" fill="none">
        <rect x="10" y="60" width="15" height="35" rx="3" fill="white"/>
        <rect x="35" y="40" width="15" height="55" rx="3" fill="white"/>
        <rect x="60" y="20" width="15" height="75" rx="3" fill="white"/>
        <rect x="85" y="45" width="15" height="50" rx="3" fill="white"/>
        <line x1="5" y1="98" x2="105" y2="98" stroke="white" strokeWidth="3"/>
      </svg>

      {/* Main content — centered */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-[15vw]">
        <p
          className="font-body text-[1.3vw] tracking-[0.15em] uppercase mb-[3vh]"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          The Ask
        </p>

        <h2 className="font-display font-black text-[6vw] tracking-tight text-white mb-[4vh] leading-none">
          Where Kitchen CFO goes next.
        </h2>
        <p className="font-body text-[1.8vw] leading-relaxed mb-[3vh]" style={{ color: "rgba(255,255,255,0.85)" }}>
          We're looking for beta practitioners — functional medicine doctors, nutritionists, and health coaches — to pilot Kitchen CFO with their patients and validate the B2B2C model.
        </p>
        <p className="font-display font-black text-[2.5vw] leading-none mb-[3vh]" style={{ color: "#f97316" }}>
          If you prescribe it, your patients convert.<br />
          1 practitioner = 200+ users.
        </p>
        <p className="font-body text-[1.6vw] mb-[2vh]" style={{ color: "rgba(255,255,255,0.7)" }}>
          Try it now: kitchen-intelligence.replit.app
        </p>
        <p className="font-body text-[1.3vw] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>
          "I haven't seen my results change yet — but I'm doing this live and you can follow along."
          <span className="block mt-[0.5vh] not-italic text-[1.1vw]" style={{ color: "rgba(255,255,255,0.28)" }}>— The Founder</span>
        </p>
      </div>
    </div>
  );
}
