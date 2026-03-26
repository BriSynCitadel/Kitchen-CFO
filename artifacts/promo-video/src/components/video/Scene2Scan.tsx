import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video/animations';
import { useState, useEffect } from 'react';

export function Scene2Scan() {
  const [showScanner, setShowScanner] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowScanner(true), 1500);
    const t2 = setTimeout(() => setShowResult(true), 4500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-bg-light overflow-hidden"
      {...sceneTransitions.clipPolygon}
    >
      <div className="absolute inset-0 bg-primary/5" />

      {/* Persistent Background Element */}
      <motion.div
        className="absolute left-[10%] top-[20%] w-[30vw] h-[30vw] rounded-full border border-primary/10"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: 90 }}
        transition={{ duration: 8, ease: "linear" }}
      />

      <div className="relative z-10 flex flex-row items-center w-full max-w-[80vw] mx-auto gap-[8vw]">
        
        {/* Left Side: Typography */}
        <div className="flex-1 flex flex-col items-start justify-center">
          <motion.h2
            className="text-[4.5vw] font-display font-medium text-text-primary leading-[1.1]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            Snap a photo.<br/>
            <span className="text-accent italic font-light">Know your food.</span>
          </motion.h2>
          
          <motion.p
            className="mt-[1.5vw] text-[1.5vw] text-text-secondary font-body max-w-[24vw]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            The world's most advanced nutrition AI analyzes your meals instantly. No more guessing.
          </motion.p>
        </div>

        {/* Right Side: Phone Mockup */}
        <motion.div
          className="relative w-[24vw] h-[52vw] max-h-[80vh] bg-white rounded-[3vw] shadow-[0_2vw_5vw_rgba(26,92,56,0.15)] border-[0.5vw] border-primary overflow-hidden flex-shrink-0"
          initial={{ opacity: 0, y: 100, rotate: 5 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1, type: "spring", bounce: 0.2 }}
        >
          {/* Photo */}
          <motion.img
            src="/healthy-meal.jpg"
            alt="Healthy Meal"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: "easeOut" }}
          />

          {/* Scanner Overlay */}
          {showScanner && (
            <motion.div
              className="absolute inset-0 z-20 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]" />
              <motion.div
                className="absolute left-0 right-0 h-[2px] bg-accent shadow-[0_0_15px_rgba(249,115,22,0.8)]"
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                transition={{ duration: 2, ease: "linear", repeat: 1, repeatType: "reverse" }}
              />
              
              {/* Bounding boxes appearing */}
              <motion.div
                className="absolute top-[30%] left-[20%] w-[40%] h-[30%] border-[0.2vw] border-accent/80 rounded-[0.5vw]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
              >
                <div className="absolute -top-[1.5vw] left-0 bg-accent text-white text-[0.7vw] px-[0.5vw] py-[0.25vw] rounded font-mono font-bold">
                  Quinoa Bowl
                </div>
              </motion.div>

              <motion.div
                className="absolute top-[65%] left-[50%] w-[30%] h-[20%] border-[0.2vw] border-accent/80 rounded-[0.5vw]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, type: "spring" }}
              >
                <div className="absolute -top-[1.5vw] left-0 bg-accent text-white text-[0.7vw] px-[0.5vw] py-[0.25vw] rounded font-mono font-bold">
                  Avocado
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Result card slide up */}
          {showResult && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-white p-[1.5vw] rounded-t-[2vw] shadow-[0_-1vw_3vw_rgba(0,0,0,0.1)] z-30"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
            >
              <div className="flex items-center justify-between mb-[1vw]">
                <span className="font-display font-bold text-[1.2vw] text-primary">Found 8 ingredients</span>
                <span className="text-accent font-bold text-[1.2vw]">540 kcal</span>
              </div>
              <div className="space-y-[0.5vw]">
                {['Protein 24g', 'Carbs 45g', 'Fat 18g'].map((item, i) => (
                  <motion.div
                    key={i}
                    className="h-[0.5vw] bg-bg-muted rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                  >
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.random() * 40 + 40}%` }}
                      transition={{ delay: i * 0.2 + 0.5, duration: 1, ease: "easeOut" }}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </motion.div>
      </div>
    </motion.div>
  );
}
