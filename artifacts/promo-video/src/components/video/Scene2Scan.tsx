import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene2Scan() {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 7000);
    const t2 = setTimeout(() => setPhase(2), 16000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Scan phase state
  const [showScanner, setShowScanner] = useState(false);
  const [showResult, setShowResult] = useState(false);
  useEffect(() => {
    if (phase !== 1) return;
    const t1 = setTimeout(() => setShowScanner(true), 1600);
    const t2 = setTimeout(() => setShowResult(true), 5200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [phase]);

  // Lab phase state
  const [showLabFields, setShowLabFields] = useState(false);
  useEffect(() => {
    if (phase !== 2) return;
    const t1 = setTimeout(() => setShowLabFields(true), 2600);
    return () => clearTimeout(t1);
  }, [phase]);

  const labMarkers = [
    { label: 'Vitamin D', value: '18', unit: 'ng/mL', low: true },
    { label: 'Ferritin', value: '14', unit: 'µg/L', low: true },
    { label: 'Magnesium', value: '0.72', unit: 'mmol/L', low: false },
    { label: 'TSH', value: '2.1', unit: 'mIU/L', low: false },
  ];

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{ background: 'transparent' }}
      initial={{ clipPath: 'circle(0% at 0% 50%)' }}
      animate={{ clipPath: 'circle(150% at 0% 50%)' }}
      exit={{ clipPath: 'circle(0% at 100% 50%)' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
    >
      <div className="absolute inset-0" style={{ backgroundColor: '#faf7f2' }} />
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundColor: '#1a5c38' }} />

      {/* Decorative rotating ring */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '55vw', height: '55vw',
          border: '1px solid rgba(26,92,56,0.07)',
          top: '50%', left: '50%', x: '-50%', y: '-50%',
        }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
      />

      {/* ── PHASE 0: Landing page hero ── */}
      {phase === 0 && (
        <motion.div
          className="relative z-10 flex flex-col items-center text-center px-[12vw]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="flex items-center gap-[0.8vw] rounded-full mb-[2vw]"
            style={{ backgroundColor: 'rgba(26,92,56,0.08)', padding: '0.5vw 1.4vw' }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="rounded-full" style={{ width: '0.7vw', height: '0.7vw', backgroundColor: '#1a5c38' }} />
            <span className="font-body" style={{ fontSize: '1.1vw', color: '#1a5c38', letterSpacing: '0.08em' }}>Bioindividual Nutrition</span>
          </motion.div>

          <motion.h2
            className="font-display font-black"
            style={{ fontSize: '5.8vw', color: '#1a5c38', letterSpacing: '-0.03em', lineHeight: 1.1 }}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            Your body is finally<br />
            <span style={{ color: '#f97316', fontStyle: 'italic' }}>being listened to.</span>
          </motion.h2>

          <motion.p
            className="font-body mt-[2vw]"
            style={{ fontSize: '1.5vw', color: '#4a6b57', maxWidth: '38vw', lineHeight: 1.65 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            The first food intelligence platform that connects your bloodwork to personalized nutrition.
          </motion.p>

          <motion.div
            className="mt-[3vw] flex gap-[3vw]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4 }}
          >
            {['Food Intelligence', 'Lab Integration', 'Bioindividual'].map((f, i) => (
              <div key={f} className="flex items-center gap-[0.5vw]">
                <div className="rounded-full" style={{ width: '0.5vw', height: '0.5vw', backgroundColor: i === 1 ? '#f97316' : '#1a5c38' }} />
                <span className="font-body" style={{ fontSize: '1.1vw', color: '#4a6b57' }}>{f}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* ── PHASE 1: Photo scan ── */}
      {phase === 1 && (
        <motion.div
          className="relative z-10 flex flex-row items-center w-full px-[8vw] gap-[6vw]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex-1 flex flex-col items-start justify-center">
            <motion.div
              style={{ width: '3vw', height: '3px', backgroundColor: '#f97316', borderRadius: '9999px', marginBottom: '1.5vw' }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
            <motion.h2
              className="font-display font-medium"
              style={{ fontSize: '4vw', color: '#1a5c38', lineHeight: 1.15, letterSpacing: '-0.02em' }}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              Snap a photo.<br />
              <span style={{ color: '#f97316', fontStyle: 'italic', fontWeight: 300 }}>Know every nutrient.</span>
            </motion.h2>
            <motion.p
              className="font-body mt-[2vw]"
              style={{ fontSize: '1.35vw', color: '#4a6b57', maxWidth: '22vw', lineHeight: 1.65 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Food Intelligence analysis. Snap once — unlock the full micronutrient breakdown tied to your biology.
            </motion.p>

            {showResult && (
              <motion.div
                className="mt-[2.5vw] flex gap-[1.5vw]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {['8 ingredients', '540 kcal', '24g protein'].map((badge, i) => (
                  <motion.span
                    key={badge}
                    className="font-mono font-bold"
                    style={{
                      fontSize: '1.1vw',
                      backgroundColor: i === 1 ? '#f97316' : '#1a5c38',
                      color: '#faf7f2',
                      padding: '0.4vw 0.9vw',
                      borderRadius: '0.4vw',
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20, delay: i * 0.12 }}
                  >
                    {badge}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </div>

          {/* Phone mockup */}
          <motion.div
            className="relative flex-shrink-0 rounded-[3vw] overflow-hidden"
            style={{
              width: '22vw', height: '47vw',
              backgroundColor: '#fff',
              boxShadow: '0 2vw 5vw rgba(26,92,56,0.18)',
              border: '0.5vw solid #1a5c38',
            }}
            initial={{ opacity: 0, y: '20vh', rotate: 6 }}
            animate={{ opacity: 1, y: 0, rotate: -1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 1.1, type: 'spring', bounce: 0.22 }}
          >
            <motion.img
              src={`${import.meta.env.BASE_URL}healthy-meal.jpg`}
              alt="Healthy Meal"
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ scale: 1.25 }}
              animate={{ scale: 1 }}
              transition={{ duration: 8, ease: 'easeOut' }}
            />
            <div
              className="absolute top-0 left-0 right-0 flex justify-between items-center px-[2vw] pt-[1.5vw] z-40"
              style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)' }}
            >
              <span className="font-mono text-white" style={{ fontSize: '0.8vw' }}>9:41</span>
            </div>

            {showScanner && (
              <motion.div className="absolute inset-0 z-20 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                <div className="absolute inset-0" style={{ backgroundColor: 'rgba(26,92,56,0.25)', backdropFilter: 'blur(2px)' }} />
                <motion.div
                  className="absolute left-0 right-0"
                  style={{ height: '2px', backgroundColor: '#f97316', boxShadow: '0 0 15px rgba(249,115,22,0.9)' }}
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 2.2, ease: 'linear', repeat: 1, repeatType: 'reverse' }}
                />
                <motion.div
                  className="absolute"
                  style={{ top: '28%', left: '18%', width: '42%', height: '32%', border: '2px solid rgba(249,115,22,0.85)', borderRadius: '0.5vw' }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, type: 'spring' }}
                >
                  <span className="absolute font-mono font-bold" style={{ top: '-1.8vw', left: 0, fontSize: '0.75vw', backgroundColor: '#f97316', color: '#fff', padding: '0.2vw 0.5vw', borderRadius: '0.3vw' }}>
                    Quinoa Bowl
                  </span>
                </motion.div>
                <motion.div
                  className="absolute"
                  style={{ top: '64%', left: '50%', width: '30%', height: '22%', border: '2px solid rgba(249,115,22,0.85)', borderRadius: '0.5vw' }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5, type: 'spring' }}
                >
                  <span className="absolute font-mono font-bold" style={{ top: '-1.8vw', left: 0, fontSize: '0.75vw', backgroundColor: '#f97316', color: '#fff', padding: '0.2vw 0.5vw', borderRadius: '0.3vw' }}>
                    Avocado
                  </span>
                </motion.div>
              </motion.div>
            )}

            {showResult && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 z-30"
                style={{ backgroundColor: '#fff', borderRadius: '2vw 2vw 0 0', padding: '1.5vw', boxShadow: '0 -1vw 3vw rgba(0,0,0,0.12)' }}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', damping: 22, stiffness: 220 }}
              >
                <div className="flex items-center justify-between mb-[0.8vw]">
                  <span className="font-display font-bold" style={{ fontSize: '1.1vw', color: '#1a5c38' }}>8 ingredients found</span>
                  <span className="font-mono font-bold" style={{ fontSize: '1.1vw', color: '#f97316' }}>540 kcal</span>
                </div>
                {[['Protein', 0.6], ['Carbs', 0.72], ['Vitamin D', 0.22]].map(([label, pct], i) => (
                  <div key={label as string} style={{ marginBottom: '0.45vw' }}>
                    <span className="font-body" style={{ fontSize: '0.85vw', color: '#4a6b57', display: 'block', marginBottom: '0.15vw' }}>{label}</span>
                    <div style={{ height: '0.4vw', backgroundColor: '#f0ede8', borderRadius: '9999px', overflow: 'hidden' }}>
                      <motion.div
                        style={{ height: '100%', backgroundColor: label === 'Vitamin D' ? '#f97316' : '#1a5c38', borderRadius: '9999px' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(pct as number) * 100}%` }}
                        transition={{ delay: i * 0.15 + 0.4, duration: 0.9, ease: 'circOut' }}
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* ── PHASE 2: Lab import ── */}
      {phase === 2 && (
        <motion.div
          className="relative z-10 flex flex-row items-center w-full px-[8vw] gap-[6vw]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex-1 flex flex-col items-start justify-center">
            <motion.div
              style={{ width: '3vw', height: '3px', backgroundColor: '#f97316', borderRadius: '9999px', marginBottom: '1.5vw' }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
            <motion.h2
              className="font-display font-medium"
              style={{ fontSize: '3.8vw', color: '#1a5c38', lineHeight: 1.15, letterSpacing: '-0.02em' }}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              Upload your labs.<br />
              <span style={{ color: '#f97316', fontStyle: 'italic', fontWeight: 300 }}>Watch them auto-fill.</span>
            </motion.h2>
            <motion.p
              className="font-body mt-[2vw]"
              style={{ fontSize: '1.35vw', color: '#4a6b57', maxWidth: '22vw', lineHeight: 1.65 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              PDF or photo. Vision extracts all 17 biomarkers instantly and maps every deficiency to your diet.
            </motion.p>
          </div>

          {/* Lab import card mockup */}
          <motion.div
            style={{
              width: '30vw',
              backgroundColor: '#fff',
              boxShadow: '0 2vw 5vw rgba(26,92,56,0.12)',
              border: '1px solid rgba(26,92,56,0.12)',
              borderRadius: '1.5vw',
              padding: '2vw',
            }}
            initial={{ opacity: 0, y: '10vh', rotate: 2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1, type: 'spring', bounce: 0.15 }}
          >
            <div className="flex items-center gap-[1vw] mb-[1.5vw]">
              <div
                className="flex items-center justify-center rounded-lg flex-shrink-0"
                style={{ width: '2.5vw', height: '2.5vw', backgroundColor: 'rgba(139,92,246,0.1)' }}
              >
                <div style={{ width: '1.2vw', height: '1.5vw', backgroundColor: 'rgba(139,92,246,0.55)', borderRadius: '0.2vw' }} />
              </div>
              <div>
                <p className="font-display font-bold" style={{ fontSize: '1.2vw', color: '#1a1a1a' }}>Import Lab Results</p>
                <p className="font-body" style={{ fontSize: '0.9vw', color: '#999' }}>lab-results-2025.pdf · 147 KB</p>
              </div>
            </div>

            {!showLabFields && (
              <motion.div
                className="flex items-center gap-[1vw]"
                style={{ padding: '1vw', backgroundColor: 'rgba(26,92,56,0.05)', borderRadius: '0.8vw' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  className="rounded-full flex-shrink-0"
                  style={{ width: '0.9vw', height: '0.9vw', backgroundColor: '#1a5c38' }}
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut' }}
                />
                <span className="font-body" style={{ fontSize: '1.1vw', color: '#1a5c38' }}>Reading your lab report…</span>
              </motion.div>
            )}

            {showLabFields && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8vw' }}>
                {labMarkers.map((m, i) => (
                  <motion.div
                    key={m.label}
                    style={{
                      padding: '0.7vw 0.9vw',
                      borderRadius: '0.7vw',
                      backgroundColor: m.low ? 'rgba(249,115,22,0.07)' : 'rgba(26,92,56,0.06)',
                      border: `1px solid ${m.low ? 'rgba(249,115,22,0.3)' : 'rgba(26,92,56,0.14)'}`,
                    }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.18, duration: 0.5 }}
                  >
                    <p className="font-body" style={{ fontSize: '0.85vw', color: '#999', marginBottom: '0.2vw' }}>{m.label}</p>
                    <div className="flex items-baseline gap-[0.3vw]">
                      <span className="font-mono font-bold" style={{ fontSize: '1.5vw', color: m.low ? '#f97316' : '#1a5c38' }}>{m.value}</span>
                      <span className="font-body" style={{ fontSize: '0.75vw', color: '#bbb' }}>{m.unit}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
