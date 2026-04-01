import { AnimatePresence, motion } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene1Intro } from './Scene1Intro';
import { Scene2Scan } from './Scene2Scan';
import { Scene3Data } from './Scene3Data';
import { Scene4Outro } from './Scene4Outro';

const SCENE_DURATIONS = {
  intro: 12000,
  features: 24000,
  intelligence: 22000,
  outro: 12000,
};

const SCENE_BG_COLORS = ['#071a0e', '#faf7f2', '#071a0e', '#071a0e'];

export default function VideoTemplate() {
  const { currentScene } = useVideoPlayer({
    durations: SCENE_DURATIONS,
  });

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center overflow-hidden">
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: '16 / 9',
          width: 'min(100vw, calc(100vh * 16 / 9))',
          height: 'min(100vh, calc(100vw * 9 / 16))',
        }}
      >
        {/* ── Persistent layer: animated background color ── */}
        <motion.div
          className="absolute inset-0 z-0"
          animate={{ backgroundColor: SCENE_BG_COLORS[currentScene] }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* ── Persistent layer: floating accent orb ── */}
        <motion.div
          className="absolute z-0 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.3), transparent 70%)' }}
          animate={{
            width: currentScene === 0 ? '55vw' : currentScene === 2 ? '50vw' : '32vw',
            height: currentScene === 0 ? '55vw' : currentScene === 2 ? '50vw' : '32vw',
            x: currentScene === 0 ? '-8vw' : currentScene === 1 ? '58vw' : currentScene === 2 ? '42vw' : '0vw',
            y: currentScene === 0 ? '-8vh' : currentScene === 1 ? '-5vh' : currentScene === 2 ? '28vh' : '8vh',
            opacity: currentScene === 1 ? 0.12 : 0.25,
          }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* ── Persistent layer: corner brand mark ── */}
        <motion.div
          className="absolute bottom-[3%] right-[3%] z-50 flex items-center gap-[0.6vw]"
          animate={{ opacity: currentScene >= 1 ? 0.5 : 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="rounded-full flex-shrink-0"
            style={{
              width: '1.2vw',
              height: '1.2vw',
              backgroundColor: currentScene === 1 ? '#1a5c38' : '#f97316',
            }}
          />
          <span
            className="font-display font-bold tracking-tight"
            style={{
              fontSize: '1vw',
              color: currentScene === 1 ? '#1a5c38' : '#faf7f2',
            }}
          >
            Kitchen CFO
          </span>
        </motion.div>

        {/* ── Scenes ── */}
        <AnimatePresence mode="sync">
          {currentScene === 0 && <Scene1Intro key="intro" />}
          {currentScene === 1 && <Scene2Scan key="features" />}
          {currentScene === 2 && <Scene3Data key="intelligence" />}
          {currentScene === 3 && <Scene4Outro key="outro" />}
        </AnimatePresence>
      </div>
    </div>
  );
}
