export default function Slide9TheMarket() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#071a0e" }}>

      {/* Gradient */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(30,107,66,0.2) 0%, transparent 65%)"
      }} />

      {/* Slide label */}
      <div className="absolute top-[5vh] left-[7vw]">
        <span className="font-body text-[1.2vw] tracking-[0.15em] uppercase" style={{ color: "#f97316" }}>
          The Market
        </span>
      </div>

      {/* Headline */}
      <div className="absolute top-[13vh] left-0 right-0 text-center">
        <h2 className="font-display font-black text-[3.8vw] tracking-tight text-white leading-tight">
          The problem is massive.<br />The solution doesn't exist yet.
        </h2>
      </div>

      {/* Three stat blocks */}
      <div className="absolute left-[5vw] right-[5vw] flex items-stretch gap-[3vw]" style={{ top: "36vh", height: "36vh" }}>

        {/* $946B */}
        <div className="flex-1 rounded-2xl flex flex-col items-center justify-center text-center p-[2.5vh_2vw]" style={{ background: "#0f3320", border: "1px solid rgba(30,107,66,0.5)" }}>
          <p className="font-display font-black text-[5.5vw] leading-none" style={{ color: "#f97316" }}>$946B</p>
          <p className="font-display font-bold text-[1.4vw] text-white mt-[1.5vh] mb-[0.8vh]">
            Global digital health market by 2030
          </p>
          <p className="font-body text-[1.1vw]" style={{ color: "rgba(255,255,255,0.4)" }}>
            Grand View Research
          </p>
        </div>

        {/* $31B */}
        <div className="flex-1 rounded-2xl flex flex-col items-center justify-center text-center p-[2.5vh_2vw]" style={{ background: "#0f3320", border: "1px solid rgba(30,107,66,0.5)" }}>
          <p className="font-display font-black text-[5.5vw] leading-none" style={{ color: "#f97316" }}>$31B</p>
          <p className="font-display font-bold text-[1.4vw] text-white mt-[1.5vh] mb-[0.8vh]">
            Personalized nutrition market by 2030
          </p>
          <p className="font-body text-[1.1vw]" style={{ color: "rgba(255,255,255,0.4)" }}>
            MarketsandMarkets
          </p>
        </div>

        {/* 0 */}
        <div className="flex-1 rounded-2xl flex flex-col items-center justify-center text-center p-[2.5vh_2vw]" style={{ background: "#0f3320", border: "1px solid rgba(30,107,66,0.5)" }}>
          <p className="font-display font-black text-[5.5vw] leading-none" style={{ color: "#f97316" }}>0</p>
          <p className="font-display font-bold text-[1.4vw] text-white mt-[1.5vh] mb-[0.8vh]">
            Apps connecting bloodwork directly to daily meal decisions
          </p>
          <p className="font-body text-[1.1vw]" style={{ color: "rgba(255,255,255,0.4)" }}>
            The gap Kitchen CFO fills
          </p>
        </div>

      </div>

      {/* Closing line */}
      <div className="absolute bottom-[12vh] left-0 right-0 text-center px-[10vw]">
        <p className="font-display font-bold text-[1.7vw] leading-relaxed" style={{ color: "#f97316" }}>
          "Kitchen CFO sits at the intersection of precision health and everyday eating —<br />
          a category with no dominant player."
        </p>
      </div>

      {/* Slide number */}
      <div className="absolute bottom-[4vh] right-[5vw]">
        <span className="font-body text-[1.2vw]" style={{ color: "rgba(255,255,255,0.25)" }}>09 / 10</span>
      </div>

    </div>
  );
}
