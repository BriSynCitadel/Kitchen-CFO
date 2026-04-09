export default function Slide5Difference() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#071a0e" }}>

      {/* Accent gradient */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 50% 50% at 100% 0%, rgba(30,107,66,0.15) 0%, transparent 60%)"
      }} />

      {/* Slide label */}
      <div className="absolute top-[5vh] left-[7vw]">
        <span className="font-body text-[1.2vw] tracking-[0.15em] uppercase" style={{ color: "#f97316" }}>
          The Difference
        </span>
      </div>

      {/* Headline block */}
      <div className="absolute top-[13vh] left-[7vw]">
        <h2 className="font-display font-black text-[3.8vw] tracking-tight text-white leading-tight">
          Every app tracks what you ate.
        </h2>
        <p className="font-display font-bold text-[2.6vw] leading-tight" style={{ color: "#f97316" }}>
          Kitchen CFO tells you what to eat next.
        </p>
      </div>

      {/* Two-column comparison */}
      <div className="absolute left-[7vw] right-[7vw] flex gap-[3vw]" style={{ top: "36vh", bottom: "12vh" }}>

        {/* Other apps */}
        <div className="flex-1 rounded-2xl p-[3vh_2.5vw]" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="font-display font-bold text-[1.5vw] tracking-[0.1em] uppercase mb-[2.5vh]" style={{ color: "rgba(255,255,255,0.35)" }}>
            Other Apps
          </p>
          <div className="space-y-[2vh]">
            <div className="flex items-center gap-[1vw]">
              <svg width="1.2vw" height="1.2vw" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.5)" strokeWidth="1.5"/>
                <line x1="5" y1="5" x2="11" y2="11" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="11" y1="5" x2="5" y2="11" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="font-body text-[1.5vw]" style={{ color: "rgba(255,255,255,0.45)" }}>Counts calories and macros only</span>
            </div>
            <div className="flex items-center gap-[1vw]">
              <svg width="1.2vw" height="1.2vw" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.5)" strokeWidth="1.5"/>
                <line x1="5" y1="5" x2="11" y2="11" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="11" y1="5" x2="5" y2="11" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="font-body text-[1.5vw]" style={{ color: "rgba(255,255,255,0.45)" }}>Generic food database lookups</span>
            </div>
            <div className="flex items-center gap-[1vw]">
              <svg width="1.2vw" height="1.2vw" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.5)" strokeWidth="1.5"/>
                <line x1="5" y1="5" x2="11" y2="11" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="11" y1="5" x2="5" y2="11" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="font-body text-[1.5vw]" style={{ color: "rgba(255,255,255,0.45)" }}>No knowledge of your bloodwork</span>
            </div>
            <div className="flex items-center gap-[1vw]">
              <svg width="1.2vw" height="1.2vw" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.5)" strokeWidth="1.5"/>
                <line x1="5" y1="5" x2="11" y2="11" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="11" y1="5" x2="5" y2="11" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="font-body text-[1.5vw]" style={{ color: "rgba(255,255,255,0.45)" }}>One-size-fits-all meal plans</span>
            </div>
          </div>
        </div>

        {/* Kitchen CFO */}
        <div className="flex-1 rounded-2xl p-[3vh_2.5vw]" style={{ background: "rgba(30,107,66,0.15)", border: "1px solid rgba(30,107,66,0.5)" }}>
          <p className="font-display font-bold text-[1.5vw] tracking-[0.1em] uppercase mb-[2.5vh] text-white">
            Kitchen CFO
          </p>
          <div className="space-y-[2vh]">
            <div className="flex items-center gap-[1vw]">
              <svg width="1.2vw" height="1.2vw" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" fill="rgba(30,107,66,0.3)" stroke="rgba(74,222,128,0.6)" strokeWidth="1.5"/>
                <path d="M4.5 8l2.5 2.5 4.5-5" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-body text-[1.5vw] text-white">You see every micronutrient your body actually got</span>
            </div>
            <div className="flex items-center gap-[1vw]">
              <svg width="1.2vw" height="1.2vw" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" fill="rgba(30,107,66,0.3)" stroke="rgba(74,222,128,0.6)" strokeWidth="1.5"/>
                <path d="M4.5 8l2.5 2.5 4.5-5" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-body text-[1.5vw] text-white">Your labs finally explain why you've been feeling off</span>
            </div>
            <div className="flex items-center gap-[1vw]">
              <svg width="1.2vw" height="1.2vw" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" fill="rgba(30,107,66,0.3)" stroke="rgba(74,222,128,0.6)" strokeWidth="1.5"/>
                <path d="M4.5 8l2.5 2.5 4.5-5" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-body text-[1.5vw] text-white">Guidance built around what's actually in your kitchen</span>
            </div>
            <div className="flex items-center gap-[1vw]">
              <svg width="1.2vw" height="1.2vw" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" fill="rgba(30,107,66,0.3)" stroke="rgba(74,222,128,0.6)" strokeWidth="1.5"/>
                <path d="M4.5 8l2.5 2.5 4.5-5" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-body text-[1.5vw] text-white">You finally know what YOUR body needs</span>
            </div>
          </div>
        </div>

      </div>

      {/* Slide number */}
      <div className="absolute bottom-[4vh] right-[5vw]">
        <span className="font-body text-[1.2vw]" style={{ color: "rgba(255,255,255,0.25)" }}>05 / 08</span>
      </div>

    </div>
  );
}
