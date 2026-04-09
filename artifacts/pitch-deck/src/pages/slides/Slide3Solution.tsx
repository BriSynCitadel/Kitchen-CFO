export default function Slide3Solution() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#071a0e" }}>

      {/* Top gradient */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(30,107,66,0.2) 0%, transparent 60%)"
      }} />

      {/* Slide label */}
      <div className="absolute top-[5vh] left-[7vw]">
        <span className="font-body text-[1.2vw] tracking-[0.15em] uppercase" style={{ color: "#f97316" }}>
          The Solution
        </span>
      </div>

      {/* Headline */}
      <div className="absolute top-[14vh] left-[7vw] right-[7vw] text-center">
        <h2 className="font-display font-black text-[4vw] tracking-tight text-white">
          Now you can know exactly why you feel this way — and what to eat to change it.
        </h2>
      </div>

      {/* Three cards */}
      <div className="absolute left-[5vw] right-[5vw] flex gap-[2.5vw]" style={{ top: "30vh" }}>

        {/* Card 1 */}
        <div className="flex-1 rounded-2xl p-[3vh_2.5vw] flex flex-col" style={{ background: "#0f3320", border: "1px solid rgba(30,107,66,0.4)" }}>
          <div className="w-[4vw] h-[4vw] rounded-xl flex items-center justify-center mb-[2.5vh]" style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.3)" }}>
            <svg width="2vw" height="2vw" viewBox="0 0 48 48" fill="none">
              <rect x="4" y="12" width="40" height="30" rx="6" stroke="#f97316" strokeWidth="3"/>
              <circle cx="24" cy="27" r="9" stroke="#f97316" strokeWidth="3"/>
              <circle cx="24" cy="27" r="4" fill="#f97316"/>
              <rect x="16" y="6" width="10" height="8" rx="2" fill="#f97316"/>
              <circle cx="38" cy="16" r="3" fill="#f97316"/>
            </svg>
          </div>
          <h3 className="font-display font-bold text-[1.9vw] text-white mb-[1.5vh]">
            See What Your Meals Are Missing
          </h3>
          <p className="font-body text-[1.4vw] leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            Snap a photo of any meal and instantly uncover the 30+ micronutrients your body is — or isn't — getting.
          </p>
        </div>

        {/* Card 2 */}
        <div className="flex-1 rounded-2xl p-[3vh_2.5vw] flex flex-col" style={{ background: "#0f3320", border: "1px solid rgba(30,107,66,0.4)" }}>
          <div className="w-[4vw] h-[4vw] rounded-xl flex items-center justify-center mb-[2.5vh]" style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.3)" }}>
            <svg width="2vw" height="2vw" viewBox="0 0 48 48" fill="none">
              <path d="M24 4C16 4 10 10 10 18c0 7 4 13 10 17v6h8v-6c6-4 10-10 10-17C38 10 32 4 24 4z" stroke="#f97316" strokeWidth="3" strokeLinejoin="round"/>
              <path d="M18 18c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="24" y1="4" x2="24" y2="10" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="11" y1="9" x2="15" y2="13" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="37" y1="9" x2="33" y2="13" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h3 className="font-display font-bold text-[1.9vw] text-white mb-[1.5vh]">
            Turn Your Labs Into Answers
          </h3>
          <p className="font-body text-[1.4vw] leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            Upload your bloodwork once and stop wondering what those numbers mean — your results finally drive real action.
          </p>
        </div>

        {/* Card 3 */}
        <div className="flex-1 rounded-2xl p-[3vh_2.5vw] flex flex-col" style={{ background: "#0f3320", border: "1px solid rgba(30,107,66,0.4)" }}>
          <div className="w-[4vw] h-[4vw] rounded-xl flex items-center justify-center mb-[2.5vh]" style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.3)" }}>
            <svg width="2vw" height="2vw" viewBox="0 0 48 48" fill="none">
              <path d="M24 6 L28 18 L40 18 L31 26 L34 38 L24 31 L14 38 L17 26 L8 18 L20 18 Z" stroke="#f97316" strokeWidth="3" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="font-display font-bold text-[1.9vw] text-white mb-[1.5vh]">
            Wake Up With More Energy
          </h3>
          <p className="font-body text-[1.4vw] leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            Your Kitchen CFO tells you exactly what to eat next — so tomorrow you feel the difference, not just track it.
          </p>
        </div>

      </div>

      {/* Bottom tagline */}
      <div className="absolute bottom-[6vh] left-0 right-0 text-center">
        <p className="font-body text-[1.4vw]" style={{ color: "rgba(255,255,255,0.35)" }}>
          Photo scan · Lab results · Kitchen inventory · Personalized output
        </p>
      </div>

      {/* Slide number */}
      <div className="absolute bottom-[4vh] right-[5vw]">
        <span className="font-body text-[1.2vw]" style={{ color: "rgba(255,255,255,0.25)" }}>03 / 08</span>
      </div>

    </div>
  );
}
