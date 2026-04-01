import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene4Outro() {
  const [showDivider, setShowDivider] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [showURL, setShowURL] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowDivider(true), 2600);
    const t2 = setTimeout(() => setShowTagline(true), 3400);
    const t3 = setTimeout(() => setShowURL(true), 5800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'transparent' }}
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ clipPath: 'circle(100% at 50% 50%)' }}
      exit={{ clipPath: 'circle(0% at 50% 50%)' }}
      transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="absolute inset-0" style={{ backgroundColor: '#071a0e' }} />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.5) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Centre radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(249,115,22,0.1), transparent 70%)' }}
      />

      {/* Subtle radiating rings */}
      {[1, 2, 3].map((n) => (
        <motion.div
          key={n}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${n * 22}vw`,
            height: `${n * 22 * 9 / 16}vw`,
            border: '1px solid rgba(249,115,22,0.08)',
          }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + n * 0.15, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center text-center px-[15vw]">

        {/* Stats row */}
        <motion.div
          className="flex items-center gap-[5vw] mb-[4vh]"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {[
            { val: '1 week', label: 'Built in' },
            { val: '11', label: 'Reviews' },
            { val: '4.6★', label: 'Stars' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.2, type: 'spring', stiffness: 280, damping: 18 }}
            >
              <span
                className="font-display font-black"
                style={{ fontSize: '3.8vw', color: '#f97316', letterSpacing: '-0.03em', lineHeight: 1 }}
              >
                {stat.val}
              </span>
              <span
                className="font-body uppercase tracking-widest mt-[0.4vw]"
                style={{ fontSize: '1vw', color: 'rgba(250,247,242,0.35)' }}
              >
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        {showDivider && (
          <motion.div
            style={{ height: '1px', backgroundColor: 'rgba(249,115,22,0.28)', marginBottom: '4vh' }}
            initial={{ width: 0 }}
            animate={{ width: '28vw' }}
            transition={{ duration: 1, ease: 'circOut' }}
          />
        )}

        {/* Tagline */}
        {showTagline && (
          <motion.h2
            className="font-display font-black mb-[3vh]"
            style={{ fontSize: '5vw', color: '#faf7f2', letterSpacing: '-0.03em', lineHeight: 1.1 }}
            initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, ease: 'circOut' }}
          >
            Your body is finally<br />
            <span style={{ color: '#f97316', fontStyle: 'italic' }}>being listened to.</span>
          </motion.h2>
        )}

        {/* URL */}
        {showURL && (
          <motion.p
            className="font-mono font-bold"
            style={{ fontSize: '1.6vw', color: 'rgba(250,247,242,0.38)', letterSpacing: '0.03em' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'circOut' }}
          >
            kitchen-intelligence.replit.app
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
