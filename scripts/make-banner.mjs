import { Resvg } from "@resvg/resvg-js";
import { writeFileSync, mkdirSync } from "fs";

mkdirSync(".canvas/assets", { recursive: true });

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="bg" cx="30%" cy="40%" r="70%">
      <stop offset="0%" stop-color="#1e6b42"/>
      <stop offset="100%" stop-color="#0d3320"/>
    </radialGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="18" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>

  <circle cx="200" cy="315" r="320" fill="#ffffff" fill-opacity="0.025"/>
  <circle cx="1050" cy="120" r="180" fill="#f97316" fill-opacity="0.06"/>
  <circle cx="950" cy="500" r="140" fill="#ffffff" fill-opacity="0.03"/>

  <g transform="translate(280, 220)">
    <rect x="0" y="0" width="72" height="60" rx="12" fill="none" stroke="white" stroke-width="4" stroke-opacity="0.9"/>
    <circle cx="36" cy="30" r="15" fill="none" stroke="white" stroke-width="3.5" stroke-opacity="0.9"/>
    <circle cx="36" cy="30" r="6" fill="white" fill-opacity="0.9"/>
    <rect x="14" y="-10" width="18" height="12" rx="4" fill="white" fill-opacity="0.9"/>
    <circle cx="58" cy="12" r="4" fill="#f97316"/>
  </g>

  <g transform="translate(390, 218)">
    <path d="M36,4 C20,4 8,16 8,30 C8,42 16,52 28,56 L28,62 L44,62 L44,56 C56,52 64,42 64,30 C64,16 52,4 36,4 Z" fill="none" stroke="white" stroke-width="3.5" stroke-opacity="0.85" stroke-linejoin="round"/>
    <path d="M28,30 C28,24 31,20 36,20 C41,20 44,24 44,30" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-opacity="0.85"/>
    <line x1="36" y1="4" x2="36" y2="14" stroke="#f97316" stroke-width="3" stroke-linecap="round"/>
    <line x1="14" y1="11" x2="21" y2="18" stroke="#f97316" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="58" y1="11" x2="51" y2="18" stroke="#f97316" stroke-width="2.5" stroke-linecap="round"/>
  </g>

  <text
    x="520" y="348"
    font-family="Arial Black, Arial, sans-serif"
    font-size="130"
    font-weight="900"
    fill="white"
    fill-opacity="0.97"
    letter-spacing="-4"
  >Kitchen CFO</text>

  <text
    x="522" y="398"
    font-family="Arial, sans-serif"
    font-size="28"
    font-weight="400"
    fill="white"
    fill-opacity="0.45"
    letter-spacing="6"
  >AI NUTRITION INTELLIGENCE</text>

  <line x1="520" y1="412" x2="1090" y2="412" stroke="#f97316" stroke-width="2" stroke-opacity="0.5"/>
</svg>`;

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
  font: { defaultFontFamily: "Arial", loadSystemFonts: true },
});
const png = resvg.render().asPng();
writeFileSync(".canvas/assets/kitchen-cfo-banner.png", png);
console.log(`Banner saved: ${png.length} bytes`);
