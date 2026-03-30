export default function Slide2Problem() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#071a0e" }}>

      {/* Subtle gradient accent */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 55% 70% at 0% 50%, rgba(30,107,66,0.18) 0%, transparent 60%)"
      }} />

      {/* Slide label */}
      <div className="absolute top-[5vh] left-[7vw]">
        <span className="font-body text-[1.2vw] tracking-[0.15em] uppercase" style={{ color: "#f97316" }}>
          The Problem
        </span>
      </div>

      {/* Left — main content */}
      <div className="absolute left-[7vw] top-0 bottom-0 flex flex-col justify-center" style={{ width: "52vw" }}>

        <h2 className="font-display font-black text-[5vw] leading-[1.0] tracking-tight text-white mb-[2.5vh]">
          One-size-fits-all
          <br />
          nutrition
        </h2>

        <p className="font-display font-bold text-[3.2vw] leading-tight mb-[5vh]" style={{ color: "#f97316" }}>
          Doesn't fit any body.
        </p>

        <div className="space-y-[2.2vh]">
          <div className="flex items-start gap-[1.2vw]">
            <div className="mt-[0.3vh] w-[1.6vw] h-[1.6vw] rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)" }}>
              <svg width="0.9vw" height="0.9vw" viewBox="0 0 12 12" fill="none">
                <line x1="2" y1="2" x2="10" y2="10" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                <line x1="10" y1="2" x2="2" y2="10" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="font-body text-[1.7vw] leading-snug" style={{ color: "rgba(255,255,255,0.75)" }}>
              Calorie counters ignore your bloodwork entirely
            </p>
          </div>
          <div className="flex items-start gap-[1.2vw]">
            <div className="mt-[0.3vh] w-[1.6vw] h-[1.6vw] rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)" }}>
              <svg width="0.9vw" height="0.9vw" viewBox="0 0 12 12" fill="none">
                <line x1="2" y1="2" x2="10" y2="10" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                <line x1="10" y1="2" x2="2" y2="10" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="font-body text-[1.7vw] leading-snug" style={{ color: "rgba(255,255,255,0.75)" }}>
              No knowledge of your specific nutrient deficiencies
            </p>
          </div>
          <div className="flex items-start gap-[1.2vw]">
            <div className="mt-[0.3vh] w-[1.6vw] h-[1.6vw] rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)" }}>
              <svg width="0.9vw" height="0.9vw" viewBox="0 0 12 12" fill="none">
                <line x1="2" y1="2" x2="10" y2="10" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                <line x1="10" y1="2" x2="2" y2="10" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="font-body text-[1.7vw] leading-snug" style={{ color: "rgba(255,255,255,0.75)" }}>
              Generic advice ignores your unique biology
            </p>
          </div>
        </div>

      </div>

      {/* Right — abstract Venn illustration */}
      <div className="absolute right-[5vw] top-0 bottom-0 flex items-center justify-center" style={{ width: "32vw" }}>
        <svg viewBox="0 0 300 280" fill="none" style={{ width: "28vw", height: "28vw" }}>
          <circle cx="130" cy="110" r="80" fill="rgba(30,107,66,0.18)" stroke="rgba(30,107,66,0.5)" strokeWidth="2"/>
          <circle cx="180" cy="160" r="80" fill="rgba(249,115,22,0.1)" stroke="rgba(249,115,22,0.35)" strokeWidth="2"/>
          <circle cx="100" cy="170" r="80" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.25)" strokeWidth="2"/>
          <text x="122" y="90" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="13" fontFamily="DM Sans, sans-serif">Genetics</text>
          <text x="210" y="150" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="13" fontFamily="DM Sans, sans-serif">Lab Values</text>
          <text x="72" y="210" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="13" fontFamily="DM Sans, sans-serif">Lifestyle</text>
          <text x="145" y="148" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Outfit, sans-serif">YOU</text>
        </svg>
      </div>

      {/* Slide number */}
      <div className="absolute bottom-[4vh] right-[5vw]">
        <span className="font-body text-[1.2vw]" style={{ color: "rgba(255,255,255,0.25)" }}>02 / 08</span>
      </div>

    </div>
  );
}
