import { Resvg } from "@resvg/resvg-js";
import { writeFileSync, mkdirSync } from "fs";

mkdirSync(".canvas/assets", { recursive: true });

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="bg" cx="35%" cy="45%" r="75%">
      <stop offset="0%" stop-color="#1e6b42"/>
      <stop offset="100%" stop-color="#0d3320"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>

  <circle cx="150" cy="315" r="380" fill="#ffffff" fill-opacity="0.022"/>
  <circle cx="1100" cy="100" r="200" fill="#f97316" fill-opacity="0.055"/>
  <circle cx="1050" cy="560" r="120" fill="#ffffff" fill-opacity="0.025"/>

  <g transform="translate(124, 268)">
    <rect x="0" y="0" width="58" height="48" rx="10" fill="none" stroke="white" stroke-width="3.5" stroke-opacity="0.85"/>
    <circle cx="29" cy="24" r="12" fill="none" stroke="white" stroke-width="3" stroke-opacity="0.85"/>
    <circle cx="29" cy="24" r="5" fill="white" fill-opacity="0.85"/>
    <rect x="11" y="-8" width="14" height="10" rx="3" fill="white" fill-opacity="0.85"/>
    <circle cx="47" cy="9" r="4" fill="#f97316"/>
  </g>

  <g transform="translate(198, 265)">
    <path d="M28,2 C14,2 4,12 4,24 C4,34 10,42 20,46 L20,52 L36,52 L36,46 C46,42 52,34 52,24 C52,12 42,2 28,2 Z"
      fill="none" stroke="white" stroke-width="3" stroke-opacity="0.8" stroke-linejoin="round"/>
    <path d="M20,24 C20,18 23,15 28,15 C33,15 36,18 36,24"
      fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-opacity="0.8"/>
    <line x1="28" y1="2" x2="28" y2="10" stroke="#f97316" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="9" y1="8"  x2="15" y2="14" stroke="#f97316" stroke-width="2"   stroke-linecap="round"/>
    <line x1="47" y1="8" x2="41" y2="14" stroke="#f97316" stroke-width="2"   stroke-linecap="round"/>
  </g>

  <text
    x="600" y="340"
    text-anchor="middle"
    font-family="Arial Black, Arial, sans-serif"
    font-size="112"
    font-weight="900"
    fill="white"
    fill-opacity="0.97"
    letter-spacing="-2"
  >Kitchen CFO</text>

  <text
    x="600" y="396"
    text-anchor="middle"
    font-family="Arial, sans-serif"
    font-size="22"
    font-weight="400"
    fill="white"
    fill-opacity="0.42"
    letter-spacing="7"
  >AI NUTRITION INTELLIGENCE</text>

  <line x1="340" y1="416" x2="860" y2="416" stroke="#f97316" stroke-width="2" stroke-opacity="0.45"/>
</svg>`;

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
  font: { defaultFontFamily: "Arial", loadSystemFonts: true },
});
const png = resvg.render().asPng();
writeFileSync(".canvas/assets/kitchen-cfo-banner.png", png);
console.log(`Banner saved: ${png.length} bytes`);
