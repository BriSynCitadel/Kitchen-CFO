import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene4Outro() {
  const [showTagline, setShowTagline] = useState(false);
  const [showAccent, setShowAccent] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowTagline(true), 1800);
    const t2 = setTimeout(() => setShowAccent(true), 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const brand = 'Kitchen CFO';

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'transparent' }}
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ clipPath: 'circle(100% at 50% 50%)' }}
      exit={{ clipPath: 'circle(0% at 50% 50%)' }}
      transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Cream background for this scene */}
      <div className="absolute inset-0" style={{ backgroundColor: '#faf7f2' }} />

      {/* Subtle radiating rings */}
      {[1, 2, 3].map((n) => (
        <motion.div
          key={n}
          className="absolute rounded-full border border-primary/10 pointer-events-none"
          style={{ width: `${n * 20}vw`, height: `${n * 20 * 9 / 16}vw` }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + n * 0.15, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}

      {/* Decorative cross lines */}
      <motion.div
        className="absolute"
        style={{ top: '20%', left: '50%', width: '1px', height: '60%', transform: 'translateX(-50%)', backgroundColor: 'rgba(26,92,56,0.15)' }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: 'circOut' }}
      />
      <motion.div
        className="absolute"
        style={{ top: '50%', left: '20%', width: '60%', height: '1px', transform: 'translateY(-50%)', backgroundColor: 'rgba(26,92,56,0.15)' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: 'circOut' }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo mark + brand name */}
        <div className="flex items-center gap-[1.2vw] mb-[1.5vw]">
          <motion.div
            className="rounded-full flex items-center justify-center flex-shrink-0"
            style={{ width: '4vw', height: '4vw', backgroundColor: '#f97316' }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.8 }}
          >
            <div className="rounded-full bg-white" style={{ width: '1.2vw', height: '1.2vw' }} />
          </motion.div>

          <motion.h1
            className="font-display font-bold tracking-tight"
            style={{ fontSize: '5.5vw', color: '#1a5c38', letterSpacing: '-0.03em' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {brand}
          </motion.h1>
        </div>

        {/* Full lockup tagline as one phrase */}
        {showTagline && (
          <motion.p
            className="font-body text-center"
            style={{ fontSize: '2vw', color: '#4a6b57', letterSpacing: '0.01em' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'circOut' }}
          >
            Food Intelligence for your body.
          </motion.p>
        )}

        {/* Orange accent rule below tagline */}
        {showAccent && (
          <motion.div
            className="mt-[2.5vw]"
            style={{ height: '0.25vw', backgroundColor: '#f97316', borderRadius: '9999px' }}
            initial={{ width: 0 }}
            animate={{ width: '20vw' }}
            exit={{ width: 0 }}
            transition={{ duration: 1, ease: 'circOut' }}
          />
        )}
      </div>
    </motion.div>
  );
}
