export default function Slide7Vision() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#071a0e" }}>

      {/* Gradient */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(30,107,66,0.2) 0%, transparent 65%)"
      }} />

      {/* Slide label */}
      <div className="absolute top-[5vh] left-[7vw]">
        <span className="font-body text-[1.2vw] tracking-[0.15em] uppercase" style={{ color: "#f97316" }}>
          The Vision
        </span>
      </div>

      {/* Headline */}
      <div className="absolute top-[13vh] left-0 right-0 text-center">
        <h2 className="font-display font-black text-[4vw] tracking-tight text-white">
          One platform. Two markets.
        </h2>
        <p className="font-body text-[1.6vw] mt-[1vh]" style={{ color: "rgba(255,255,255,0.5)" }}>
          B2B2C model — practitioners acquire, patients convert.
        </p>
      </div>

      {/* Funnel diagram */}
      <div className="absolute left-[5vw] right-[5vw] flex items-center justify-between" style={{ top: "32vh", height: "44vh" }}>

        {/* Left — Practitioners */}
        <div className="flex flex-col items-center justify-center" style={{ width: "26vw" }}>
          <div className="rounded-2xl p-[2.5vh_2vw] text-center w-full" style={{ background: "#0f3320", border: "1px solid rgba(30,107,66,0.5)" }}>
            <div className="w-[4vw] h-[4vw] rounded-xl flex items-center justify-center mx-auto mb-[1.5vh]" style={{ background: "rgba(30,107,66,0.4)" }}>
              <svg width="2vw" height="2vw" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="12" r="7" stroke="white" strokeWidth="2.5"/>
                <path d="M6 36c0-7.7 6.3-14 14-14s14 6.3 14 14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M30 18l2 4m0 0l2-4m-2 4v4" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="font-display font-bold text-[1.8vw] text-white mb-[1vh]">Practitioners</h3>
            <p className="font-body text-[1.3vw] leading-snug" style={{ color: "rgba(255,255,255,0.55)" }}>
              Doctors, nutritionists, and functional health coaches
            </p>
          </div>
          <div className="mt-[2vh] text-center">
            <p className="font-body text-[1.3vw]" style={{ color: "rgba(255,255,255,0.4)" }}>Prescribe Kitchen CFO</p>
            <p className="font-body text-[1.3vw]" style={{ color: "rgba(255,255,255,0.4)" }}>to their patients</p>
          </div>
        </div>

        {/* Center arrows + logo */}
        <div className="flex flex-col items-center justify-center" style={{ width: "16vw" }}>
          <div className="flex items-center gap-[1vw] mb-[3vh]">
            <svg width="3vw" height="1.5vw" viewBox="0 0 60 20" fill="none">
              <path d="M4 10h44M38 4l10 6-10 6" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="rounded-2xl flex flex-col items-center justify-center p-[2vh_1.5vw]" style={{ background: "rgba(249,115,22,0.1)", border: "2px solid rgba(249,115,22,0.4)", width: "14vw" }}>
            <svg width="2.5vw" height="2.5vw" viewBox="0 0 40 32" fill="none">
              <rect x="2" y="6" width="36" height="22" rx="5" stroke="#f97316" strokeWidth="2.5"/>
              <circle cx="20" cy="17" r="6" stroke="#f97316" strokeWidth="2.5"/>
              <circle cx="20" cy="17" r="2.5" fill="#f97316"/>
              <rect x="13" y="2" width="6" height="6" rx="2" fill="#f97316"/>
              <circle cx="32" cy="9" r="2" fill="white"/>
            </svg>
            <p className="font-display font-black text-[1.5vw] text-white mt-[1vh]">Kitchen CFO</p>
          </div>
          <div className="flex items-center gap-[1vw] mt-[3vh]">
            <svg width="3vw" height="1.5vw" viewBox="0 0 60 20" fill="none">
              <path d="M4 10h44M38 4l10 6-10 6" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Right — Consumers */}
        <div className="flex flex-col items-center justify-center" style={{ width: "26vw" }}>
          <div className="rounded-2xl p-[2.5vh_2vw] text-center w-full" style={{ background: "#0f3320", border: "1px solid rgba(30,107,66,0.5)" }}>
            <div className="w-[4vw] h-[4vw] rounded-xl flex items-center justify-center mx-auto mb-[1.5vh]" style={{ background: "rgba(30,107,66,0.4)" }}>
              <svg width="2vw" height="2vw" viewBox="0 0 40 40" fill="none">
                <circle cx="14" cy="12" r="6" stroke="white" strokeWidth="2.5"/>
                <circle cx="26" cy="12" r="6" stroke="white" strokeWidth="2.5"/>
                <path d="M4 36c0-5.5 4.5-10 10-10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M36 36c0-5.5-4.5-10-10-10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M20 30c-3 0-6 2.7-6 6" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
                <path d="M20 30c3 0 6 2.7 6 6" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="font-display font-bold text-[1.8vw] text-white mb-[1vh]">Direct Consumers</h3>
            <p className="font-body text-[1.3vw] leading-snug" style={{ color: "rgba(255,255,255,0.55)" }}>
              Individuals tracking their bioindividual nutrition independently
            </p>
          </div>
          <div className="mt-[2vh] text-center">
            <p className="font-body text-[1.3vw]" style={{ color: "rgba(255,255,255,0.4)" }}>Self-serve via landing page</p>
            <p className="font-body text-[1.3vw]" style={{ color: "rgba(255,255,255,0.4)" }}>or app store</p>
          </div>
        </div>

      </div>

      {/* Bottom callout */}
      <div className="absolute bottom-[8vh] left-0 right-0 text-center">
        <p className="font-display font-bold text-[1.7vw]" style={{ color: "#f97316" }}>
          1 doctor = 200+ users
        </p>
        <p className="font-body text-[1.3vw] mt-[0.5vh]" style={{ color: "rgba(255,255,255,0.35)" }}>
          Practitioners acquire, patients convert.
        </p>
      </div>

      {/* Slide number */}
      <div className="absolute bottom-[4vh] right-[5vw]">
        <span className="font-body text-[1.2vw]" style={{ color: "rgba(255,255,255,0.25)" }}>07 / 08</span>
      </div>

    </div>
  );
}
