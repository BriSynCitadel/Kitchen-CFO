import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene2Scan() {
  const [showScanner, setShowScanner] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showTagline, setShowTagline] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowScanner(true), 1800);
    const t2 = setTimeout(() => setShowResult(true), 5200);
    const t3 = setTimeout(() => setShowTagline(true), 1000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{ background: 'transparent' }}
      initial={{ clipPath: 'circle(0% at 0% 50%)' }}
      animate={{ clipPath: 'circle(150% at 0% 50%)' }}
      exit={{ clipPath: 'circle(0% at 100% 50%)', transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Cream background */}
      <div className="absolute inset-0" style={{ backgroundColor: '#faf7f2' }} />

      {/* Subtle green tint */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundColor: '#1a5c38' }} />

      {/* Decorative rotating ring — midground */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '55vw', height: '55vw',
          border: '1px solid rgba(26,92,56,0.08)',
          top: '50%', left: '50%',
          x: '-50%', y: '-50%',
        }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
      />

      <div className="relative z-10 flex flex-row items-center w-full px-[8vw] gap-[6vw]">

        {/* Left: Typography */}
        <div className="flex-1 flex flex-col items-start justify-center">
          <motion.div
            className="mb-[1.5vw]"
            style={{ width: '3vw', height: '3px', backgroundColor: '#f97316', borderRadius: '9999px' }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          />

          <motion.h2
            className="font-display font-medium"
            style={{ fontSize: '4vw', color: '#1a5c38', lineHeight: 1.15, letterSpacing: '-0.02em' }}
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            Snap a photo.<br />
            <span style={{ color: '#f97316', fontStyle: 'italic', fontWeight: 300 }}>Know your food.</span>
          </motion.h2>

          {showTagline && (
            <motion.p
              className="font-body mt-[2vw]"
              style={{ fontSize: '1.35vw', color: '#4a6b57', maxWidth: '22vw', lineHeight: 1.6 }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'circOut' }}
            >
              AI-powered nutrition analysis. Snap once — unlock every micronutrient.
            </motion.p>
          )}

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

        {/* Right: Phone mockup */}
        <motion.div
          className="relative flex-shrink-0 rounded-[3vw] overflow-hidden"
          style={{
            width: '22vw',
            height: '47vw',
            backgroundColor: '#fff',
            boxShadow: '0 2vw 5vw rgba(26,92,56,0.18)',
            border: '0.5vw solid #1a5c38',
          }}
          initial={{ opacity: 0, y: '20vh', rotate: 6 }}
          animate={{ opacity: 1, y: 0, rotate: -1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 1.1, type: 'spring', bounce: 0.22 }}
        >
          {/* Meal photo */}
          <motion.img
            src="/healthy-meal.jpg"
            alt="Healthy Meal"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.25 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: 'easeOut' }}
          />

          {/* Status bar */}
          <div
            className="absolute top-0 left-0 right-0 flex justify-between items-center px-[2vw] pt-[1.5vw] z-40"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)' }}
          >
            <span className="font-mono text-white" style={{ fontSize: '0.8vw' }}>9:41</span>
            <div className="flex gap-[0.5vw] items-center">
              <div className="bg-white rounded-full" style={{ width: '0.7vw', height: '0.7vw' }} />
              <div className="bg-white rounded-full" style={{ width: '0.7vw', height: '0.7vw' }} />
              <div className="bg-white rounded-full" style={{ width: '0.7vw', height: '0.7vw' }} />
            </div>
          </div>

          {/* Scanner overlay */}
          {showScanner && (
            <motion.div
              className="absolute inset-0 z-20 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="absolute inset-0" style={{ backgroundColor: 'rgba(26,92,56,0.25)', backdropFilter: 'blur(2px)' }} />

              {/* Scan line */}
              <motion.div
                className="absolute left-0 right-0"
                style={{ height: '2px', backgroundColor: '#f97316', boxShadow: '0 0 15px rgba(249,115,22,0.9)' }}
                initial={{ top: '0%' }}
                animate={{ top: '100%' }}
                transition={{ duration: 2.2, ease: 'linear', repeat: 1, repeatType: 'reverse' }}
              />

              {/* Bounding box 1 */}
              <motion.div
                className="absolute"
                style={{
                  top: '28%', left: '18%', width: '42%', height: '32%',
                  border: '2px solid rgba(249,115,22,0.85)',
                  borderRadius: '0.5vw',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: 'spring' }}
              >
                <span
                  className="absolute font-mono font-bold"
                  style={{
                    top: '-1.8vw', left: 0,
                    fontSize: '0.75vw',
                    backgroundColor: '#f97316',
                    color: '#fff',
                    padding: '0.2vw 0.5vw',
                    borderRadius: '0.3vw',
                  }}
                >
                  Quinoa Bowl
                </span>
              </motion.div>

              {/* Bounding box 2 */}
              <motion.div
                className="absolute"
                style={{
                  top: '64%', left: '50%', width: '30%', height: '22%',
                  border: '2px solid rgba(249,115,22,0.85)',
                  borderRadius: '0.5vw',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, type: 'spring' }}
              >
                <span
                  className="absolute font-mono font-bold"
                  style={{
                    top: '-1.8vw', left: 0,
                    fontSize: '0.75vw',
                    backgroundColor: '#f97316',
                    color: '#fff',
                    padding: '0.2vw 0.5vw',
                    borderRadius: '0.3vw',
                  }}
                >
                  Avocado
                </span>
              </motion.div>
            </motion.div>
          )}

          {/* Result card */}
          {showResult && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 z-30"
              style={{ backgroundColor: '#fff', borderRadius: '2vw 2vw 0 0', padding: '1.5vw', boxShadow: '0 -1vw 3vw rgba(0,0,0,0.12)' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 220 }}
            >
              <div className="flex items-center justify-between mb-[1vw]">
                <span className="font-display font-bold" style={{ fontSize: '1.2vw', color: '#1a5c38' }}>8 ingredients found</span>
                <span className="font-mono font-bold" style={{ fontSize: '1.2vw', color: '#f97316' }}>540 kcal</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5vw' }}>
                {[['Protein', 0.6], ['Carbs', 0.75], ['Fat', 0.45]].map(([label, pct], i) => (
                  <div key={label as string}>
                    <div className="flex justify-between" style={{ marginBottom: '0.2vw' }}>
                      <span className="font-body" style={{ fontSize: '0.9vw', color: '#4a6b57' }}>{label}</span>
                    </div>
                    <div style={{ height: '0.5vw', backgroundColor: '#f0ede8', borderRadius: '9999px', overflow: 'hidden' }}>
                      <motion.div
                        style={{ height: '100%', backgroundColor: '#1a5c38', borderRadius: '9999px' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(pct as number) * 100}%` }}
                        transition={{ delay: i * 0.15 + 0.4, duration: 0.9, ease: 'circOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
