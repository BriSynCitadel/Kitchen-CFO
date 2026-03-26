import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene3Data() {
  const [showRings, setShowRings] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowRings(true), 600);
    return () => clearTimeout(t);
  }, []);

  const nutrients = [
    { label: 'Vitamin A', val: 85, color: '#ffffff' },
    { label: 'Vitamin C', val: 120, color: '#f97316' },
    { label: 'Iron', val: 65, color: '#ffffff' },
    { label: 'Omega-3', val: 78, color: '#f97316' },
    { label: 'Calcium', val: 42, color: '#ffffff' },
  ];

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{ background: 'transparent' }}
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      animate={{ clipPath: 'inset(0 0% 0 0)' }}
      exit={{ clipPath: 'inset(0 0 0 100%)' }}
      transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Dark green background for this scene rendered inside the clip */}
      <div className="absolute inset-0" style={{ backgroundColor: '#1a5c38' }} />

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

      {/* Radial glow from top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[50%] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(249,115,22,0.2), transparent 70%)' }}
      />

      <div className="relative z-10 w-full px-[8vw] flex flex-col items-center">
        <motion.h2
          className="font-display font-medium text-center mb-[5vh]"
          style={{ fontSize: '3.5vw', color: '#faf7f2', letterSpacing: '-0.02em' }}
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Micronutrients, decoded.
        </motion.h2>

        <div className="flex flex-row items-end justify-center gap-[4vw] w-full">
          {nutrients.map((n, i) => {
            const capped = Math.min(n.val, 100);
            const circumference = 283;
            const offset = circumference - (circumference * capped) / 100;
            return (
              <div key={n.label} className="flex flex-col items-center">
                <div
                  className="relative flex items-center justify-center mb-[1vw]"
                  style={{ width: '10vw', height: '10vw' }}
                >
                  <svg
                    className="absolute inset-0 w-full h-full"
                    style={{ transform: 'rotate(-90deg)' }}
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50" cy="50" r="45"
                      fill="none"
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="5"
                    />
                    {showRings && (
                      <motion.circle
                        cx="50" cy="50" r="45"
                        fill="none"
                        stroke={n.color}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.4, delay: i * 0.18 + 0.8, ease: 'circOut' }}
                      />
                    )}
                  </svg>

                  <motion.div
                    className="font-mono font-bold"
                    style={{ fontSize: '2vw', color: '#ffffff' }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.18 + 1.1, type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {n.val}%
                  </motion.div>
                </div>

                <motion.span
                  className="font-body uppercase tracking-widest"
                  style={{ fontSize: '1vw', color: 'rgba(250,247,242,0.7)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.18 + 1.4 }}
                >
                  {n.label}
                </motion.span>
              </div>
            );
          })}
        </div>

        <motion.p
          className="font-body mt-[5vh] text-center"
          style={{ fontSize: '1.4vw', color: 'rgba(249,115,22,0.85)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2 }}
        >
          Every meal. Every micronutrient. All in one place.
        </motion.p>
      </div>
    </motion.div>
  );
}
