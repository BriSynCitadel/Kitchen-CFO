import { Resvg } from "@resvg/resvg-js";
import { writeFileSync, mkdirSync } from "fs";
import { resolve } from "path";

mkdirSync(".canvas/assets", { recursive: true });

const GREEN = "#1a5c38";
const DARK_GREEN = "#0f3d24";
const LIGHT_GREEN = "#2d7a4e";
const ORANGE = "#f97316";
const BG_GREEN = "#f0f7f3";

const svgA = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480" viewBox="0 0 800 480">
  <defs>
    <filter id="shadow-a" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="16" flood-color="${GREEN}" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect width="800" height="480" fill="#f8faf8"/>
  <rect x="190" y="40" width="420" height="400" rx="28" fill="white" filter="url(#shadow-a)"/>

  <circle cx="400" cy="188" r="96" fill="${GREEN}"/>
  <circle cx="400" cy="188" r="80" fill="white" fill-opacity="0.08"/>
  <circle cx="400" cy="188" r="64" fill="white" fill-opacity="0.1"/>

  <rect x="348" y="165" width="10" height="23" rx="3" fill="white" fill-opacity="0.85"/>
  <rect x="362" y="155" width="10" height="33" rx="3" fill="white" fill-opacity="0.85"/>
  <rect x="376" y="161" width="10" height="27" rx="3" fill="white" fill-opacity="0.85"/>
  <rect x="390" y="148" width="10" height="40" rx="3" fill="white" fill-opacity="0.85"/>
  <rect x="404" y="153" width="10" height="35" rx="3" fill="white" fill-opacity="0.85"/>
  <rect x="418" y="143" width="10" height="45" rx="3" fill="white" fill-opacity="0.85"/>
  <rect x="432" y="132" width="10" height="56" rx="3" fill="${ORANGE}"/>

  <line x1="338" y1="190" x2="462" y2="190" stroke="white" stroke-width="1.5" stroke-opacity="0.35"/>

  <circle cx="466" cy="142" r="13" fill="${ORANGE}" stroke="white" stroke-width="2.5"/>
  <polyline points="461,147 464,143 469,138" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>

  <text x="400" y="328" text-anchor="middle" font-family="'Inter', 'Helvetica Neue', Arial, sans-serif" font-size="38" font-weight="800" fill="${GREEN}" letter-spacing="-0.5">Kitchen</text>
  <text x="385" y="374" text-anchor="middle" font-family="'Inter', 'Helvetica Neue', Arial, sans-serif" font-size="38" font-weight="800" fill="${GREEN}" letter-spacing="-0.5">CFO</text>
  <circle cx="412" cy="368" r="5" fill="${ORANGE}"/>
  <text x="400" y="408" text-anchor="middle" font-family="'Inter', 'Helvetica Neue', Arial, sans-serif" font-size="11" font-weight="600" fill="#6b9c7e" letter-spacing="3">NUTRITION INTELLIGENCE</text>
</svg>`;

const svgB = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480" viewBox="0 0 800 480">
  <defs>
    <filter id="shadow-b" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="16" flood-color="${GREEN}" flood-opacity="0.10"/>
    </filter>
  </defs>
  <rect width="800" height="480" fill="${BG_GREEN}"/>
  <rect x="140" y="80" width="520" height="320" rx="28" fill="white" filter="url(#shadow-b)"/>

  <rect x="230" y="150" width="16" height="44" rx="5" fill="${GREEN}"/>
  <rect x="254" y="132" width="16" height="62" rx="5" fill="${GREEN}"/>
  <rect x="278" y="140" width="16" height="54" rx="5" fill="${GREEN}"/>
  <rect x="302" y="118" width="16" height="76" rx="5" fill="${GREEN}"/>
  <rect x="326" y="108" width="16" height="86" rx="5" fill="${GREEN}"/>
  <rect x="326" y="108" width="16" height="26" rx="5" fill="${ORANGE}"/>

  <rect x="301" y="196" width="18" height="58" rx="9" fill="${GREEN}"/>

  <circle cx="350" cy="108" r="8" fill="${ORANGE}" fill-opacity="0.9"/>
  <polyline points="346,112 349,108 354,104" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>

  <text x="420" y="194" font-family="'Inter', 'Helvetica Neue', Arial, sans-serif" font-size="44" font-weight="300" fill="${GREEN}" letter-spacing="-1">Kitchen</text>
  <text x="420" y="248" font-family="'Inter', 'Helvetica Neue', Arial, sans-serif" font-size="44" font-weight="800" fill="${GREEN}" letter-spacing="-1">CFO</text>
  <rect x="420" y="256" width="102" height="5" rx="2.5" fill="${ORANGE}"/>
  <text x="420" y="296" font-family="'Inter', 'Helvetica Neue', Arial, sans-serif" font-size="11" font-weight="600" fill="#6b9c7e" letter-spacing="2.5">AI FOOD INTELLIGENCE</text>
</svg>`;

const svgC = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480" viewBox="0 0 800 480">
  <defs>
    <clipPath id="plate-clip">
      <circle cx="390" cy="200" r="96"/>
    </clipPath>
  </defs>
  <rect width="800" height="480" fill="${DARK_GREEN}"/>

  <rect x="170" y="40" width="460" height="400" rx="32" fill="${DARK_GREEN}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <rect x="170" y="40" width="460" height="400" rx="32" fill="${GREEN}" fill-opacity="0.08"/>

  <circle cx="390" cy="200" r="110" fill="${GREEN}" fill-opacity="0.18"/>
  <circle cx="390" cy="200" r="96" fill="#e8f5ee"/>
  <circle cx="390" cy="200" r="96" stroke="rgba(255,255,255,0.2)" stroke-width="1" fill="none"/>
  <circle cx="390" cy="200" r="76" fill="none" stroke="${GREEN}" stroke-width="1" stroke-opacity="0.3"/>

  <g clip-path="url(#plate-clip)">
    <polyline points="310,202 338,202 354,172 370,232 386,185 402,218 418,202 480,202" stroke="${ORANGE}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>

  <rect x="450" y="272" width="64" height="26" rx="13" fill="${ORANGE}"/>
  <text x="482" y="290" text-anchor="middle" font-family="'Inter', 'Helvetica Neue', Arial, sans-serif" font-size="12" font-weight="700" fill="white" letter-spacing="1">CFO</text>

  <circle cx="280" cy="205" r="6" fill="${GREEN}" fill-opacity="0.5"/>
  <circle cx="498" cy="148" r="5" fill="${ORANGE}" fill-opacity="0.6"/>

  <text x="400" y="352" text-anchor="middle" font-family="'Inter', 'Helvetica Neue', Arial, sans-serif" font-size="22" font-weight="300" fill="#e8f5ee" letter-spacing="-0.3">Kitchen <tspan font-weight="800" fill="${ORANGE}">CFO</tspan></text>
  <text x="400" y="384" text-anchor="middle" font-family="'Inter', 'Helvetica Neue', Arial, sans-serif" font-size="10" font-weight="500" fill="rgba(232,245,238,0.45)" letter-spacing="3">YOUR NUTRITION COMMAND CENTER</text>
</svg>`;

const logos = [
  { name: "logo-a", svg: svgA, label: "Variant A — Lens & Ledger" },
  { name: "logo-b", svg: svgB, label: "Variant B — Fork & Chart" },
  { name: "logo-c", svg: svgC, label: "Variant C — Plate & Pulse" },
];

for (const { name, svg, label } of logos) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 800 },
    font: {
      defaultFontFamily: "Arial",
      loadSystemFonts: true,
    },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  const outPath = resolve(`.canvas/assets/${name}.png`);
  writeFileSync(outPath, pngBuffer);
  console.log(`✓ ${label} → .canvas/assets/${name}.png (${pngBuffer.length} bytes)`);
}

console.log("\nAll 3 logos exported successfully!");
