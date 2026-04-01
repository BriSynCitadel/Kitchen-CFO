import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene3Data() {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 8000);
    const t2 = setTimeout(() => setPhase(2), 15000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{ background: 'transparent' }}
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      animate={{ clipPath: 'inset(0 0% 0 0)' }}
      exit={{ clipPath: 'inset(0 0 0 100%)' }}
      transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="absolute inset-0" style={{ backgroundColor: '#071a0e' }} />

      {/* Moving dot grid */}
      <motion.div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
        animate={{ y: [0, -40, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
      />

      {/* Radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[50%] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(249,115,22,0.16), transparent 70%)' }}
      />

      {/* ── PHASE 0: What Should I Eat Next? ── */}
      {phase === 0 && (
        <motion.div
          className="relative z-10 w-full px-[8vw] flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.p
            className="font-body uppercase tracking-widest mb-[2.5vh]"
            style={{ fontSize: '1.1vw', color: 'rgba(249,115,22,0.65)' }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            For You
          </motion.p>

          <motion.h2
            className="font-display font-black text-center mb-[4vh]"
            style={{ fontSize: '3.8vw', color: '#faf7f2', letterSpacing: '-0.02em' }}
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            What Should I Eat Next?
          </motion.h2>

          {/* Suggestion card */}
          <motion.div
            style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(249,115,22,0.28)',
              borderRadius: '1.5vw',
              padding: '2vw 2.5vw',
              width: '54vw',
            }}
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-start justify-between mb-[1.4vw]">
              <div>
                <p className="font-display font-bold" style={{ fontSize: '2vw', color: '#faf7f2' }}>Salmon & Spinach Bowl</p>
                <p className="font-body" style={{ fontSize: '1.15vw', color: 'rgba(250,247,242,0.45)', marginTop: '0.25vw' }}>Lunch · ~480 kcal</p>
              </div>
              <motion.div
                className="rounded-full flex items-center justify-center flex-shrink-0"
                style={{ width: '3.5vw', height: '3.5vw', backgroundColor: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.35)' }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.5, type: 'spring', stiffness: 300 }}
              >
                <span style={{ fontSize: '1.6vw' }}>🍽</span>
              </motion.div>
            </div>

            {/* Lab badge */}
            <motion.div
              className="flex items-center gap-[0.8vw] mb-[1.4vw]"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.7, duration: 0.6 }}
            >
              <div
                className="flex items-center gap-[0.6vw] rounded-full"
                style={{ backgroundColor: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.45)', padding: '0.4vw 1vw' }}
              >
                <div className="rounded-full flex-shrink-0" style={{ width: '0.55vw', height: '0.55vw', backgroundColor: '#f97316' }} />
                <span className="font-mono font-bold" style={{ fontSize: '1vw', color: '#f97316' }}>
                  Targets Vitamin D · you're at 18 · target ≥50 ng/mL
                </span>
              </div>
            </motion.div>

            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.07)', marginBottom: '1.2vw' }} />

            <motion.p
              className="font-body"
              style={{ fontSize: '1.15vw', color: 'rgba(250,247,242,0.55)', lineHeight: 1.65 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.3 }}
            >
              Salmon is one of the richest dietary sources of Vitamin D — a critical deficiency in your current bloodwork. Paired with spinach for iron and folate support.
            </motion.p>
          </motion.div>
        </motion.div>
      )}

      {/* ── PHASE 1: For You tab ── */}
      {phase === 1 && (
        <motion.div
          className="relative z-10 w-full px-[8vw] flex flex-row items-center gap-[5vw]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex-1">
            <motion.p
              className="font-body uppercase tracking-widest mb-[1.5vw]"
              style={{ fontSize: '1.1vw', color: 'rgba(249,115,22,0.65)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Bioindividual Recommendations
            </motion.p>
            <motion.h2
              className="font-display font-black mb-[3vh]"
              style={{ fontSize: '3.2vw', color: '#faf7f2', letterSpacing: '-0.02em' }}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Built around<br />
              <span style={{ color: '#f97316' }}>your numbers.</span>
            </motion.h2>

            {[
              { icon: '🐟', food: 'Wild salmon', reason: 'Vitamin D 18 ng/mL → target ≥50' },
              { icon: '🥬', food: 'Dark leafy greens', reason: 'Ferritin 14 µg/L → low iron stores' },
              { icon: '🌰', food: 'Pumpkin seeds', reason: 'Magnesium optimization' },
            ].map((rec, i) => (
              <motion.div
                key={rec.food}
                className="flex items-center gap-[1.5vw] mb-[1.2vw]"
                style={{
                  padding: '1vw 1.5vw',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  borderRadius: '1vw',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.25 + 0.6, duration: 0.6 }}
              >
                <span style={{ fontSize: '2vw' }}>{rec.icon}</span>
                <div>
                  <p className="font-display font-bold" style={{ fontSize: '1.3vw', color: '#faf7f2' }}>{rec.food}</p>
                  <p className="font-body" style={{ fontSize: '1vw', color: 'rgba(249,115,22,0.7)' }}>{rec.reason}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Phone mockup */}
          <motion.div
            className="relative flex-shrink-0 rounded-[2.5vw] overflow-hidden"
            style={{
              width: '18vw', height: '38vw',
              backgroundColor: '#0f1a14',
              boxShadow: '0 2vw 5vw rgba(0,0,0,0.45)',
              border: '0.4vw solid rgba(255,255,255,0.12)',
            }}
            initial={{ opacity: 0, y: '15vh', rotate: 3 }}
            animate={{ opacity: 1, y: 0, rotate: -1 }}
            transition={{ duration: 1, type: 'spring', bounce: 0.2 }}
          >
            <div style={{ padding: '2.5vw 1.5vw', paddingTop: '3vw' }}>
              <p className="font-display font-bold" style={{ fontSize: '1.1vw', color: '#faf7f2', marginBottom: '1.5vw' }}>✨ For You</p>
              {['Salmon Bowl', 'Spinach Salad', 'Pumpkin Seeds'].map((item, i) => (
                <motion.div
                  key={item}
                  style={{ padding: '0.8vw 1vw', backgroundColor: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.18)', borderRadius: '0.7vw', marginBottom: '0.8vw' }}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 + 0.5 }}
                >
                  <p className="font-body" style={{ fontSize: '0.9vw', color: '#faf7f2' }}>{item}</p>
                  <p className="font-body" style={{ fontSize: '0.75vw', color: 'rgba(249,115,22,0.65)' }}>Targets Vitamin D</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ── PHASE 2: Kitchen + Diary ── */}
      {phase === 2 && (
        <motion.div
          className="relative z-10 w-full px-[6vw] flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h2
            className="font-display font-black text-center mb-[3vh]"
            style={{ fontSize: '3.2vw', color: '#faf7f2', letterSpacing: '-0.02em' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Your whole food life,{' '}
            <span style={{ color: '#f97316' }}>in one place.</span>
          </motion.h2>

          <div className="flex gap-[4vw] w-full">
            {/* Kitchen inventory */}
            <motion.div
              style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '1.5vw', padding: '2vw', border: '1px solid rgba(255,255,255,0.07)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className="font-body uppercase tracking-widest mb-[1.5vw]" style={{ fontSize: '0.9vw', color: 'rgba(249,115,22,0.55)' }}>
                🥘 Kitchen Inventory
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.7vw' }}>
                {['Salmon', 'Spinach', 'Eggs', 'Avocado', 'Lemon', 'Olive Oil'].map((item, i) => (
                  <motion.div
                    key={item}
                    style={{ padding: '0.6vw', backgroundColor: 'rgba(26,92,56,0.28)', borderRadius: '0.6vw', textAlign: 'center' }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 + 0.6, type: 'spring', stiffness: 280 }}
                  >
                    <p className="font-body" style={{ fontSize: '0.85vw', color: 'rgba(250,247,242,0.75)' }}>{item}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Diary */}
            <motion.div
              style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '1.5vw', padding: '2vw', border: '1px solid rgba(255,255,255,0.07)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <p className="font-body uppercase tracking-widest mb-[1.5vw]" style={{ fontSize: '0.9vw', color: 'rgba(249,115,22,0.55)' }}>
                📓 Weekly Diary
              </p>
              <div className="flex items-end justify-between" style={{ height: '8vw', gap: '0.5vw' }}>
                {[0.42, 0.68, 0.55, 0.84, 0.62, 0.92, 0.74].map((h, i) => (
                  <div key={i} className="flex flex-col items-center" style={{ flex: 1 }}>
                    <motion.div
                      style={{
                        width: '100%',
                        backgroundColor: i === 5 ? '#f97316' : 'rgba(26,92,56,0.65)',
                        borderRadius: '0.3vw 0.3vw 0 0',
                      }}
                      initial={{ height: 0 }}
                      animate={{ height: `${h * 100}%` }}
                      transition={{ delay: i * 0.1 + 0.8, duration: 0.7, ease: 'circOut' }}
                    />
                    <span style={{ fontSize: '0.7vw', color: 'rgba(250,247,242,0.35)', marginTop: '0.3vw' }}>
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                    </span>
                  </div>
                ))}
              </div>
              <motion.p
                className="font-body mt-[1.2vw] text-center"
                style={{ fontSize: '0.9vw', color: 'rgba(249,115,22,0.65)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.0 }}
              >
                Vitamin D trending up this week
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
