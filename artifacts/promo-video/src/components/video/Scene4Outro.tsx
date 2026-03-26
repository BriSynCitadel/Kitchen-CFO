import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene4Outro() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center bg-bg-light overflow-hidden"
      {...sceneTransitions.zoomThrough}
    >
      {/* Decorative lines */}
      <motion.div
        className="absolute top-[20%] w-[1px] h-[60%] bg-primary/20"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
      <motion.div
        className="absolute left-[20%] w-[60%] h-[1px] bg-primary/20"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <div className="flex items-center gap-[1vw] mb-[1.5vw]">
          <motion.div
            className="w-[3vw] h-[3vw] rounded-full bg-accent flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5, delay: 1 }}
          >
            <div className="w-[1vw] h-[1vw] bg-white rounded-full" />
          </motion.div>
          <h1 className="text-[5vw] font-display font-bold text-primary tracking-tight">
            Kitchen CFO
          </h1>
        </div>

        <motion.p
          className="text-[1.8vw] font-body text-text-secondary mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          Food Intelligence for your body.
        </motion.p>
      </motion.div>
      
      {/* Subtle bottom accent */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[1vw] bg-accent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 2, ease: "circOut" }}
      />
    </motion.div>
  );
}
