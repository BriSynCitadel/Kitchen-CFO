export default function Slide4HowItWorks() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#071a0e" }}>

      {/* Subtle bg gradient */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 60% at 100% 100%, rgba(249,115,22,0.05) 0%, transparent 55%)"
      }} />

      {/* Slide label */}
      <div className="absolute top-[5vh] left-[7vw]">
        <span className="font-body text-[1.2vw] tracking-[0.15em] uppercase" style={{ color: "#f97316" }}>
          How It Works
        </span>
      </div>

      {/* Headline */}
      <div className="absolute top-[14vh] left-[7vw] right-[7vw] text-center">
        <h2 className="font-display font-black text-[4vw] tracking-tight text-white">
          Three steps. Total clarity.
        </h2>
      </div>

      {/* Steps row */}
      <div className="absolute left-[5vw] right-[5vw] flex items-stretch gap-[0px]" style={{ top: "32vh", bottom: "16vh" }}>

        {/* Step 01 */}
        <div className="flex-1 flex flex-col px-[2.5vw] py-[3vh]" style={{ borderRight: "1px solid rgba(255,255,255,0.08)" }}>
          <span className="font-display font-black text-[5vw] leading-none mb-[2vh]" style={{ color: "rgba(249,115,22,0.3)", letterSpacing: "-0.02em" }}>01</span>
          <div className="w-[3.5vw] h-[3.5vw] rounded-xl flex items-center justify-center mb-[2vh]" style={{ background: "rgba(30,107,66,0.3)", border: "1px solid rgba(30,107,66,0.5)" }}>
            <svg width="1.8vw" height="1.8vw" viewBox="0 0 40 40" fill="none">
              <rect x="3" y="10" width="34" height="24" rx="5" stroke="white" strokeWidth="2.5"/>
              <circle cx="20" cy="22" r="7" stroke="white" strokeWidth="2.5"/>
              <circle cx="20" cy="22" r="3" fill="white"/>
              <rect x="13" y="5" width="8" height="7" rx="2" fill="white"/>
              <circle cx="31" cy="14" r="2.5" fill="#f97316"/>
            </svg>
          </div>
          <h3 className="font-display font-bold text-[1.9vw] text-white mb-[1.5vh]">
            Photo Scan
          </h3>
          <p className="font-body text-[1.4vw] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
            Photograph any meal, receipt, or pantry item. Vision technology identifies every nutrient instantly.
          </p>
        </div>

        {/* Arrow */}
        <div className="flex items-center justify-center w-[3vw] flex-shrink-0">
          <svg width="2vw" height="2vw" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Step 02 */}
        <div className="flex-1 flex flex-col px-[2.5vw] py-[3vh]" style={{ borderRight: "1px solid rgba(255,255,255,0.08)" }}>
          <span className="font-display font-black text-[5vw] leading-none mb-[2vh]" style={{ color: "rgba(249,115,22,0.3)", letterSpacing: "-0.02em" }}>02</span>
          <div className="w-[3.5vw] h-[3.5vw] rounded-xl flex items-center justify-center mb-[2vh]" style={{ background: "rgba(30,107,66,0.3)", border: "1px solid rgba(30,107,66,0.5)" }}>
            <svg width="1.8vw" height="1.8vw" viewBox="0 0 40 40" fill="none">
              <path d="M20 4C13 4 8 9 8 16c0 5.5 3 10 8 13v5h8v-5c5-3 8-7.5 8-13C32 9 27 4 20 4z" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
              <path d="M15 16c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="20" y1="4" x2="20" y2="9" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h3 className="font-display font-bold text-[1.9vw] text-white mb-[1.5vh]">
            Lab Upload
          </h3>
          <p className="font-body text-[1.4vw] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
            Enter your bloodwork once. Vitamin D, B12, ferritin, iron, magnesium, zinc — all stored securely.
          </p>
        </div>

        {/* Arrow */}
        <div className="flex items-center justify-center w-[3vw] flex-shrink-0">
          <svg width="2vw" height="2vw" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Step 03 */}
        <div className="flex-1 flex flex-col px-[2.5vw] py-[3vh]">
          <span className="font-display font-black text-[5vw] leading-none mb-[2vh]" style={{ color: "rgba(249,115,22,0.3)", letterSpacing: "-0.02em" }}>03</span>
          <div className="w-[3.5vw] h-[3.5vw] rounded-xl flex items-center justify-center mb-[2vh]" style={{ background: "rgba(30,107,66,0.3)", border: "1px solid rgba(30,107,66,0.5)" }}>
            <svg width="1.8vw" height="1.8vw" viewBox="0 0 40 40" fill="none">
              <path d="M20 4 L23.5 14.5 L34 14.5 L25.5 21.5 L28.5 32 L20 26 L11.5 32 L14.5 21.5 L6 14.5 L16.5 14.5 Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="font-display font-bold text-[1.9vw] text-white mb-[1.5vh]">
            Personalized Guidance
          </h3>
          <p className="font-body text-[1.4vw] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
            Your Kitchen CFO cross-references labs, kitchen inventory, and recent meals to recommend exactly what to eat next.
          </p>
        </div>

      </div>

      {/* Slide number */}
      <div className="absolute bottom-[4vh] right-[5vw]">
        <span className="font-body text-[1.2vw]" style={{ color: "rgba(255,255,255,0.25)" }}>04 / 08</span>
      </div>

    </div>
  );
}
