import { motion } from 'framer-motion';
import { charContainerVariants, charVariants } from '@/lib/video/animations';
import { useState, useEffect } from 'react';

export function Scene1Intro() {
  const [showLine2, setShowLine2] = useState(false);
  const [showBio, setShowBio] = useState(false);
  const [showFounder, setShowFounder] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowLine2(true), 3200);
    const t2 = setTimeout(() => setShowBio(true), 5000);
    const t3 = setTimeout(() => setShowFounder(true), 7200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const words = ['Most', 'apps', 'track', 'what', 'you', 'ate.'];

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{ background: 'transparent' }}
      initial={{ clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)' }}
      animate={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
      exit={{ clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)' }}
      transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
    >
      <div className="absolute inset-0" style={{ backgroundColor: '#071a0e' }} />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Orange glow — top right */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '50vw', height: '50vw',
          background: 'radial-gradient(circle, rgba(249,115,22,0.2), transparent 70%)',
          top: '-15vh', right: '-10vw',
        }}
      />

      {/* Floating accent particle — bottom left */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '20vw', height: '20vw',
          background: 'radial-gradient(circle, rgba(249,115,22,0.12), transparent 70%)',
          bottom: '-5vh', left: '-5vw',
        }}
        animate={{ x: [0, 10, 0], y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
      />

      <div className="relative z-10 flex flex-col items-center px-[10vw] text-center">

        {/* Line 1 — muted, character stagger */}
        <motion.h1
          className="font-display font-black"
          style={{ fontSize: '6.5vw', color: 'rgba(250,247,242,0.38)', letterSpacing: '-0.03em', lineHeight: 1.05 }}
          variants={charContainerVariants}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
        >
          {words.map((word, wi) => (
            <span key={wi} className="inline-block" style={{ marginRight: '0.25em' }}>
              {word.split('').map((ch, ci) => (
                <motion.span key={ci} className="inline-block" variants={charVariants}>{ch}</motion.span>
              ))}
            </span>
          ))}
        </motion.h1>

        {/* Line 2 — bright, bold */}
        {showLine2 && (
          <motion.h2
            className="font-display font-black mt-[1.2vh]"
            style={{ fontSize: '6.5vw', color: '#faf7f2', letterSpacing: '-0.03em', lineHeight: 1.05 }}
            initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, ease: 'circOut' }}
          >
            Kitchen CFO tells you{' '}
            <span style={{ color: '#f97316', fontStyle: 'italic' }}>what to eat next.</span>
          </motion.h2>
        )}

        {/* Subline */}
        {showBio && (
          <motion.p
            className="font-body mt-[2.2vh]"
            style={{ fontSize: '1.7vw', color: 'rgba(249,115,22,0.75)', letterSpacing: '0.05em' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Based on your biology.
          </motion.p>
        )}

        {/* Founder story */}
        {showFounder && (
          <motion.p
            className="font-body mt-[3.5vh] text-center"
            style={{ fontSize: '1.25vw', color: 'rgba(250,247,242,0.42)', maxWidth: '54vw', lineHeight: 1.75 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'circOut' }}
          >
            Built by a single dad who knew the food he was putting on the table for his daughters wasn't good enough —
            but couldn't find an app that told him what to eat for his specific body.
            That question became Kitchen CFO.
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
