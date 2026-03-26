import { motion } from 'framer-motion';
import { sceneTransitions, charContainerVariants, charVariants } from '@/lib/video/animations';

export function Scene1Intro() {
  const text = "Your grandmother knew.";

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-primary overflow-hidden"
      {...sceneTransitions.fadeBlur}
    >
      {/* Background Image with Parallax and Dark Overlay */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        exit={{ scale: 1.05, opacity: 0, filter: 'blur(10px)' }}
        transition={{ duration: 7, ease: "easeOut" }}
      >
        <img
          src="/grandmother-kitchen.jpg"
          alt="Vintage Kitchen"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-primary/40" />
      </motion.div>

      {/* Floating accent particles */}
      <motion.div
        className="absolute w-[40vw] h-[40vw] rounded-full bg-accent/10 blur-[100px]"
        initial={{ x: '-20vw', y: '20vh' }}
        animate={{ x: '10vw', y: '-10vh' }}
        transition={{ duration: 10, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
      />

      {/* Foreground Typography */}
      <motion.h1
        className="relative z-10 text-[6vw] font-display font-medium text-text-inverse tracking-tight text-center max-w-[80vw]"
        variants={charContainerVariants}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
      >
        {text.split(' ').map((word, i) => (
          <span key={i} className="inline-block mr-[2vw]">
            {word.split('').map((char, j) => (
              <motion.span key={j} className="inline-block" variants={charVariants}>
                {char}
              </motion.span>
            ))}
          </span>
        ))}
      </motion.h1>
    </motion.div>
  );
}
