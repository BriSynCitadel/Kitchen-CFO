import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video/animations';
import { useState, useEffect } from 'react';

export function Scene3Data() {
  const [showRings, setShowRings] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowRings(true), 800);
    return () => clearTimeout(t);
  }, []);

  const nutrients = [
    { label: 'Vitamin A', val: 85, color: '#1a5c38' }, // primary
    { label: 'Vitamin C', val: 120, color: '#f97316' }, // accent
    { label: 'Iron', val: 65, color: '#2f6d4d' }, // secondary
    { label: 'Calcium', val: 40, color: '#4a6b57' },
  ];

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-primary overflow-hidden"
      {...sceneTransitions.wipe}
    >
      {/* Background Mesh */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
        initial={{ y: 0 }}
        animate={{ y: "-40px" }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
      />
      
      <div className="relative z-10 w-full px-[10vw] flex flex-col items-center">
        <motion.h2
          className="text-[4vw] font-display font-medium text-text-inverse text-center mb-[8vh]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Micronutrients, decoded.
        </motion.h2>

        <div className="flex flex-row items-end justify-center gap-[6vw] w-full">
          {nutrients.map((n, i) => (
            <div key={n.label} className="flex flex-col items-center">
              <div className="relative w-[12vw] h-[12vw] flex items-center justify-center mb-[1vw]">
                {/* Background Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="4"
                  />
                  {showRings && (
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={n.color === '#f97316' ? n.color : '#ffffff'}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray="283"
                      initial={{ strokeDashoffset: 283 }}
                      animate={{ strokeDashoffset: 283 - (283 * (n.val > 100 ? 100 : n.val)) / 100 }}
                      transition={{ duration: 1.5, delay: i * 0.2 + 1, ease: "circOut" }}
                    />
                  )}
                </svg>
                
                <motion.div
                  className="font-mono text-[2.5vw] font-bold text-white"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.2 + 1.2, type: "spring" }}
                >
                  {n.val}%
                </motion.div>
              </div>
              <motion.span
                className="text-text-inverse/80 font-body text-[1.2vw] tracking-wider uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.2 + 1.5 }}
              >
                {n.label}
              </motion.span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
