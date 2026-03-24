import { Resvg } from "@resvg/resvg-js";
import { writeFileSync, mkdirSync } from "fs";
import { resolve } from "path";

mkdirSync(".canvas/assets", { recursive: true });

const GREEN = "#1a5c38";
const DARK_GREEN = "#0f3d24";
const ORANGE = "#f97316";
const BG_GREEN = "#f0f7f3";

const svgAWide = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
  <defs>
    <filter id="sha" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="16" flood-color="${GREEN}" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect width="800" height="400" fill="#f8faf8"/>
  <rect x="200" y="30" width="400" height="340" rx="28" fill="white" filter="url(#sha)"/>
  <circle cx="400" cy="166" r="88" fill="${GREEN}"/>
  <circle cx="400" cy="166" r="72" fill="white" fill-opacity="0.08"/>
  <circle cx="400" cy="166" r="58" fill="white" fill-opacity="0.1"/>
  <rect x="350" y="146" width="9" height="20" rx="3" fill="white" fill-opacity="0.85"/>
  <rect x="363" y="137" width="9" height="29" rx="3" fill="white" fill-opacity="0.85"/>
  <rect x="376" y="142" width="9" height="24" rx="3" fill="white" fill-opacity="0.85"/>
  <rect x="389" y="130" width="9" height="36" rx="3" fill="white" fill-opacity="0.85"/>
  <rect x="402" y="134" width="9" height="32" rx="3" fill="white" fill-opacity="0.85"/>
  <rect x="415" y="126" width="9" height="40" rx="3" fill="white" fill-opacity="0.85"/>
  <rect x="428" y="116" width="9" height="50" rx="3" fill="${ORANGE}"/>
  <line x1="340" y1="168" x2="450" y2="168" stroke="white" stroke-width="1.5" stroke-opacity="0.35"/>
  <circle cx="456" cy="122" r="12" fill="${ORANGE}" stroke="white" stroke-width="2.5"/>
  <polyline points="451,127 454,122 459,117" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <text x="400" y="290" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="800" fill="${GREEN}" letter-spacing="-0.5">Kitchen</text>
  <text x="389" y="330" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="800" fill="${GREEN}" letter-spacing="-0.5">CFO</text>
  <circle cx="412" cy="324" r="5" fill="${ORANGE}"/>
  <text x="400" y="358" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="600" fill="#6b9c7e" letter-spacing="3">NUTRITION INTELLIGENCE</text>
</svg>`;

const svgASquare = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#f8faf8" rx="80"/>
  <circle cx="256" cy="220" r="148" fill="${GREEN}"/>
  <circle cx="256" cy="220" r="122" fill="white" fill-opacity="0.08"/>
  <circle cx="256" cy="220" r="98" fill="white" fill-opacity="0.1"/>
  <rect x="195" y="196" width="15" height="34" rx="4" fill="white" fill-opacity="0.85"/>
  <rect x="216" y="181" width="15" height="49" rx="4" fill="white" fill-opacity="0.85"/>
  <rect x="237" y="189" width="15" height="41" rx="4" fill="white" fill-opacity="0.85"/>
  <rect x="258" y="168" width="15" height="62" rx="4" fill="white" fill-opacity="0.85"/>
  <rect x="279" y="175" width="15" height="55" rx="4" fill="white" fill-opacity="0.85"/>
  <rect x="300" y="161" width="15" height="69" rx="4" fill="white" fill-opacity="0.85"/>
  <rect x="321" y="144" width="15" height="86" rx="4" fill="${ORANGE}"/>
  <line x1="176" y1="232" x2="338" y2="232" stroke="white" stroke-width="2" stroke-opacity="0.35"/>
  <circle cx="344" cy="150" r="20" fill="${ORANGE}" stroke="white" stroke-width="3"/>
  <polyline points="336,158 340,150 349,143" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <text x="256" y="406" text-anchor="middle" font-family="Arial, sans-serif" font-size="52" font-weight="800" fill="${GREEN}" letter-spacing="-1">Kitchen</text>
  <text x="240" y="463" text-anchor="middle" font-family="Arial, sans-serif" font-size="52" font-weight="800" fill="${GREEN}" letter-spacing="-1">CFO</text>
  <circle cx="273" cy="455" r="7" fill="${ORANGE}"/>
</svg>`;

const svgBWide = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
  <defs>
    <filter id="shb" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="16" flood-color="${GREEN}" flood-opacity="0.10"/>
    </filter>
  </defs>
  <rect width="800" height="400" fill="${BG_GREEN}"/>
  <rect x="140" y="50" width="520" height="300" rx="28" fill="white" filter="url(#shb)"/>
  <rect x="228" y="118" width="16" height="48" rx="5" fill="${GREEN}"/>
  <rect x="252" y="100" width="16" height="66" rx="5" fill="${GREEN}"/>
  <rect x="276" y="108" width="16" height="58" rx="5" fill="${GREEN}"/>
  <rect x="300" y="84" width="16" height="82" rx="5" fill="${GREEN}"/>
  <rect x="324" y="74" width="16" height="92" rx="5" fill="${GREEN}"/>
  <rect x="324" y="74" width="16" height="28" rx="5" fill="${ORANGE}"/>
  <rect x="298" y="170" width="20" height="62" rx="10" fill="${GREEN}"/>
  <circle cx="352" cy="72" r="9" fill="${ORANGE}" fill-opacity="0.9"/>
  <polyline points="347,77 350,72 356,67" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <text x="410" y="172" font-family="Arial, sans-serif" font-size="44" font-weight="300" fill="${GREEN}" letter-spacing="-1">Kitchen</text>
  <text x="410" y="226" font-family="Arial, sans-serif" font-size="44" font-weight="800" fill="${GREEN}" letter-spacing="-1">CFO</text>
  <rect x="410" y="232" width="102" height="5" rx="2.5" fill="${ORANGE}"/>
  <text x="410" y="272" font-family="Arial, sans-serif" font-size="11" font-weight="600" fill="#6b9c7e" letter-spacing="2.5">AI FOOD INTELLIGENCE</text>
</svg>`;

const svgBSquare = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${BG_GREEN}" rx="80"/>
  <rect x="80" y="80" width="352" height="352" rx="28" fill="white"/>
  <rect x="150" y="154" width="22" height="72" rx="6" fill="${GREEN}"/>
  <rect x="182" y="128" width="22" height="98" rx="6" fill="${GREEN}"/>
  <rect x="214" y="140" width="22" height="86" rx="6" fill="${GREEN}"/>
  <rect x="246" y="110" width="22" height="116" rx="6" fill="${GREEN}"/>
  <rect x="278" y="98" width="22" height="128" rx="6" fill="${GREEN}"/>
  <rect x="278" y="98" width="22" height="40" rx="6" fill="${ORANGE}"/>
  <rect x="236" y="230" width="26" height="90" rx="13" fill="${GREEN}"/>
  <circle cx="312" cy="96" r="14" fill="${ORANGE}" fill-opacity="0.95"/>
  <polyline points="305,103 309,96 316,89" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <text x="256" y="368" text-anchor="middle" font-family="Arial, sans-serif" font-size="40" font-weight="300" fill="${GREEN}" letter-spacing="-1">Kitchen</text>
  <text x="256" y="416" text-anchor="middle" font-family="Arial, sans-serif" font-size="40" font-weight="800" fill="${GREEN}" letter-spacing="-1">CFO</text>
  <rect x="176" y="423" width="160" height="5" rx="2.5" fill="${ORANGE}"/>
</svg>`;

const svgCWide = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
  <defs>
    <clipPath id="plate-clip-cw">
      <circle cx="390" cy="178" r="90"/>
    </clipPath>
  </defs>
  <rect width="800" height="400" fill="${DARK_GREEN}"/>
  <rect x="160" y="30" width="480" height="340" rx="32" fill="${DARK_GREEN}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <rect x="160" y="30" width="480" height="340" rx="32" fill="${GREEN}" fill-opacity="0.06"/>
  <circle cx="390" cy="178" r="108" fill="${GREEN}" fill-opacity="0.18"/>
  <circle cx="390" cy="178" r="90" fill="#e8f5ee"/>
  <circle cx="390" cy="178" r="90" stroke="rgba(255,255,255,0.2)" stroke-width="1" fill="none"/>
  <circle cx="390" cy="178" r="72" fill="none" stroke="${GREEN}" stroke-width="1" stroke-opacity="0.3"/>
  <g clip-path="url(#plate-clip-cw)">
    <polyline points="310,180 330,180 344,155 358,205 372,168 386,195 400,180 470,180" stroke="${ORANGE}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>
  <rect x="444" y="246" width="64" height="26" rx="13" fill="${ORANGE}"/>
  <text x="476" y="263" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="white" letter-spacing="1">CFO</text>
  <text x="400" y="318" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="300" fill="#e8f5ee" letter-spacing="-0.3">Kitchen </text>
  <text x="480" y="318" font-family="Arial, sans-serif" font-size="20" font-weight="800" fill="${ORANGE}" letter-spacing="-0.3">CFO</text>
  <text x="400" y="346" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="500" fill="rgba(232,245,238,0.45)" letter-spacing="3">YOUR NUTRITION COMMAND CENTER</text>
</svg>`;

const svgCSquare = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <clipPath id="plate-clip-cs">
      <circle cx="256" cy="210" r="120"/>
    </clipPath>
  </defs>
  <rect width="512" height="512" fill="${DARK_GREEN}" rx="80"/>
  <rect x="40" y="40" width="432" height="432" rx="40" fill="${DARK_GREEN}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <circle cx="256" cy="210" r="142" fill="${GREEN}" fill-opacity="0.18"/>
  <circle cx="256" cy="210" r="120" fill="#e8f5ee"/>
  <circle cx="256" cy="210" r="120" stroke="rgba(255,255,255,0.2)" stroke-width="1" fill="none"/>
  <circle cx="256" cy="210" r="96" fill="none" stroke="${GREEN}" stroke-width="1.5" stroke-opacity="0.3"/>
  <g clip-path="url(#plate-clip-cs)">
    <polyline points="162,212 186,212 200,180 214,244 228,198 242,226 256,212 350,212" stroke="${ORANGE}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>
  <rect x="300" y="296" width="80" height="30" rx="15" fill="${ORANGE}"/>
  <text x="340" y="316" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="white" letter-spacing="1">CFO</text>
  <text x="256" y="394" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="300" fill="#e8f5ee" letter-spacing="-0.5">Kitchen</text>
  <text x="256" y="432" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="800" fill="${ORANGE}" letter-spacing="-0.5">CFO</text>
</svg>`;

const logos = [
  { name: "logo-a", svgWide: svgAWide, svgSquare: svgASquare, label: "Variant A — Lens & Ledger" },
  { name: "logo-b", svgWide: svgBWide, svgSquare: svgBSquare, label: "Variant B — Fork & Chart" },
  { name: "logo-c", svgWide: svgCWide, svgSquare: svgCSquare, label: "Variant C — Plate & Pulse" },
];

for (const { name, svgWide, svgSquare, label } of logos) {
  const resvgWide = new Resvg(svgWide, {
    fitTo: { mode: "width", value: 800 },
    font: { defaultFontFamily: "Arial", loadSystemFonts: true },
  });
  const pngWide = resvgWide.render().asPng();
  writeFileSync(resolve(`.canvas/assets/${name}.png`), pngWide);
  console.log(`✓ ${label} wide (800×400) → .canvas/assets/${name}.png (${pngWide.length} bytes)`);

  const resvgSquare = new Resvg(svgSquare, {
    fitTo: { mode: "width", value: 512 },
    font: { defaultFontFamily: "Arial", loadSystemFonts: true },
  });
  const pngSquare = resvgSquare.render().asPng();
  writeFileSync(resolve(`.canvas/assets/${name}-icon.png`), pngSquare);
  console.log(`✓ ${label} icon (512×512) → .canvas/assets/${name}-icon.png (${pngSquare.length} bytes)`);
}

console.log("\nAll 6 PNGs exported successfully!");
