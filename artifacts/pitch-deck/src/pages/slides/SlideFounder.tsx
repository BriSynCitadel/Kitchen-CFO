export default function SlideFounder() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#071a0e" }}>

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 55% 65% at 15% 50%, rgba(30,107,66,0.22) 0%, transparent 65%), radial-gradient(ellipse 40% 40% at 90% 80%, rgba(249,115,22,0.07) 0%, transparent 55%)"
      }} />

      {/* Founder headshot — right side */}
      <div className="absolute right-[5vw] top-[50%] translate-y-[-50%] flex flex-col items-center gap-[2vh]">
        <div
          className="rounded-full overflow-hidden flex items-center justify-center"
          style={{
            width: "20vw",
            height: "20vw",
            border: "2px solid rgba(249,115,22,0.4)",
            background: "#0f3320",
          }}
        >
          <img
            src="/pitch-deck/founder-headshot.jpg"
            alt="Founder"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              (e.target as HTMLImageElement).parentElement!.innerHTML = `<svg width="50%" height="50%" viewBox="0 0 100 100" fill="none" style="opacity:0.2"><circle cx="50" cy="28" r="20" stroke="white" stroke-width="3"/><path d="M10 95c0-22 18-40 40-40s40 18 40 40" stroke="white" stroke-width="3" stroke-linecap="round"/></svg>`;
            }}
          />
        </div>
      </div>

      {/* Orange accent line */}
      <div className="absolute left-[7vw] top-[50%] translate-y-[-50%] w-1 h-[22vh] rounded-full" style={{ background: "#f97316" }} />

      {/* Slide label */}
      <div className="absolute top-[5vh] left-[7vw]">
        <span className="font-body text-[1.2vw] tracking-[0.15em] uppercase" style={{ color: "#f97316" }}>
          The Founder
        </span>
      </div>

      {/* Main content */}
      <div className="absolute left-[10vw] right-[20vw] top-0 bottom-0 flex flex-col justify-center">

        <h2 className="font-display font-black text-[4.5vw] tracking-tight text-white leading-tight mb-[3vh]">
          Built from the<br />inside out.
        </h2>

        {/* Body copy */}
        <div className="mb-[4vh] space-y-[1.2vh]" style={{ maxWidth: "52vw" }}>
          <p className="font-body text-[1.35vw] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
            I built my first version as a Telegram bot — a personal chef for a single dad who knew his family's food wasn't good enough but couldn't figure out how to fix it.
          </p>
          <p className="font-body text-[1.35vw] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
            The bot solved the logistics. But it couldn't answer the real question: what should I eat for my specific body?
          </p>
          <p className="font-body text-[1.35vw] leading-relaxed font-semibold" style={{ color: "rgba(255,255,255,0.75)" }}>
            That question led to Kitchen CFO.
          </p>
        </div>

        {/* Credentials block */}
        <div className="flex flex-col gap-[3vh]">

          <div className="flex items-start gap-[2vw]">
            <div className="w-[0.25vw] self-stretch rounded-full flex-shrink-0" style={{ background: "rgba(249,115,22,0.5)" }} />
            <div>
              <p className="font-body text-[1.1vw] tracking-[0.12em] uppercase mb-[0.5vh]" style={{ color: "rgba(255,255,255,0.3)" }}>Company</p>
              <p className="font-display font-semibold text-[1.9vw] text-white">BriSyn Citadel LLC</p>
            </div>
          </div>

          <div className="flex items-start gap-[2vw]">
            <div className="w-[0.25vw] self-stretch rounded-full flex-shrink-0" style={{ background: "rgba(249,115,22,0.5)" }} />
            <div>
              <p className="font-body text-[1.1vw] tracking-[0.12em] uppercase mb-[0.5vh]" style={{ color: "rgba(255,255,255,0.3)" }}>Project</p>
              <p className="font-display font-semibold text-[1.9vw]" style={{ color: "#f97316" }}>Kitchen CFO · Replit Agent 4 Buildathon 2026</p>
            </div>
          </div>

        </div>

      </div>

      {/* Slide number */}
      <div className="absolute bottom-[4vh] right-[5vw]">
        <span className="font-body text-[1.2vw]" style={{ color: "rgba(255,255,255,0.25)" }}>07 / 09</span>
      </div>

    </div>
  );
}
