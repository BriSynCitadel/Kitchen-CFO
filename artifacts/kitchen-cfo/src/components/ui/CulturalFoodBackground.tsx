import { motion } from "framer-motion";

interface Props {
  culture: string;
}

interface EmojiConfig {
  emoji: string;
  top: string;
  left: string;
  duration: number;
  delay: number;
  size: string;
  opacity: number;
}

const CULTURE_EMOJIS: Record<string, string[]> = {
  "West African": ["🌾", "🥜", "🍲", "🫙"],
  "Caribbean": ["🌴", "🥭", "🍚", "🌶️"],
  "South Asian": ["🍛", "🧄", "🌿", "🫚"],
  "East Asian": ["🍜", "🥢", "🥬", "🫚"],
  "Southeast Asian": ["🌿", "🥥", "🍜", "🌶️"],
  "Latin American": ["🌽", "🫘", "🥑", "🌶️"],
  "Middle Eastern": ["🧆", "🫒", "🌿", "🫓"],
  "Mediterranean": ["🫒", "🍅", "🐟", "🌿"],
  "Eastern European": ["🥔", "🌾", "🥬", "🫙"],
  "West European": ["🧀", "🥖", "🍷", "🌿"],
  "North American": ["🫐", "🥦", "🌽", "🍁"],
};

const POSITIONS: Pick<EmojiConfig, "top" | "left" | "duration" | "delay" | "size" | "opacity">[] = [
  { top: "12%", left: "8%", duration: 9, delay: 0, size: "text-xl", opacity: 0.28 },
  { top: "10%", left: "78%", duration: 11, delay: 1.5, size: "text-2xl", opacity: 0.32 },
  { top: "68%", left: "6%", duration: 8.5, delay: 0.8, size: "text-xl", opacity: 0.25 },
  { top: "72%", left: "80%", duration: 10, delay: 2.2, size: "text-xl", opacity: 0.30 },
];

export default function CulturalFoodBackground({ culture }: Props) {
  if (!culture || culture === "No preference") return null;
  const emojis = CULTURE_EMOJIS[culture];
  if (!emojis) return null;

  const configs: EmojiConfig[] = emojis.map((emoji, i) => ({
    emoji,
    ...POSITIONS[i],
  }));

  return (
    <>
      {configs.map((cfg, i) => (
        <motion.span
          key={i}
          className={`absolute pointer-events-none select-none ${cfg.size}`}
          style={{ top: cfg.top, left: cfg.left, opacity: cfg.opacity }}
          animate={{ y: [-5, 6, -5] }}
          transition={{
            duration: cfg.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: cfg.delay,
          }}
        >
          {cfg.emoji}
        </motion.span>
      ))}
    </>
  );
}
