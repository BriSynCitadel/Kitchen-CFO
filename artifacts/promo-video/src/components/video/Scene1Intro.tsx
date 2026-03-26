import { motion } from 'framer-motion';
import { charContainerVariants, charVariants } from '@/lib/video/animations';
import { useState, useEffect } from 'react';

export function Scene1Intro() {
  const [showSubline, setShowSubline] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowSubline(true), 3200);
    return () => clearTimeout(t);
  }, []);

  const words = ['Your', 'grandmother', 'knew.'];

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{ background: 'transparent' }}
      initial={{ clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)' }}
      animate={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
      exit={{ clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)' }}
      transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
    >
      {/* Dark green background for this scene */}
      <div className="absolute inset-0" style={{ backgroundColor: '#1a5c38' }} />

      {/* Background image with Ken Burns parallax */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.35 }}
        exit={{ scale: 1.05, opacity: 0 }}
        transition={{ duration: 8, ease: 'easeOut' }}
      >
        <img
          src={`${import.meta.env.BASE_URL}grandmother-kitchen.jpg`}
          alt="Vintage Kitchen"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, #1a5c38 0%, rgba(26,92,56,0.5) 60%, rgba(26,92,56,0.2) 100%)' }}
        />
      </motion.div>

      {/* Warm noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />

      {/* Floating accent particle — bottom left */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '25vw', height: '25vw',
          background: 'radial-gradient(circle, rgba(249,115,22,0.18), transparent 70%)',
          bottom: '-5vh', left: '-5vw',
        }}
        animate={{ x: [0, 10, 0], y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
      />

      {/* Headline — character-level stagger */}
      <div className="relative z-10 flex flex-col items-center px-[10vw]">
        <motion.h1
          className="font-display font-medium text-center"
          style={{ fontSize: '7vw', color: '#faf7f2', letterSpacing: '-0.03em', lineHeight: 1.1 }}
          variants={charContainerVariants}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
        >
          {words.map((word, wi) => (
            <span key={wi} className="inline-block" style={{ marginRight: '0.25em' }}>
              {word.split('').map((ch, ci) => (
                <motion.span key={ci} className="inline-block" variants={charVariants}>
                  {ch}
                </motion.span>
              ))}
            </span>
          ))}
        </motion.h1>

        {showSubline && (
          <motion.p
            className="font-body mt-[2.5vh] text-center"
            style={{ fontSize: '1.6vw', color: 'rgba(250,247,242,0.6)', letterSpacing: '0.08em' }}
            initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, ease: 'circOut' }}
          >
            The kitchen held wisdom your doctor never told you.
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
