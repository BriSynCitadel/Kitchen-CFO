import { AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene1Intro } from './Scene1Intro';
import { Scene2Scan } from './Scene2Scan';
import { Scene3Data } from './Scene3Data';
import { Scene4Outro } from './Scene4Outro';

const SCENE_DURATIONS = {
  intro: 7000,
  scan: 8000,
  data: 6000,
  outro: 6000,
};

export default function VideoTemplate() {
  const { currentScene } = useVideoPlayer({
    durations: SCENE_DURATIONS,
  });

  return (
    <div
      className="w-full h-screen overflow-hidden relative"
      style={{ backgroundColor: 'var(--color-bg-light)' }}
    >
      <AnimatePresence mode="wait">
        {currentScene === 0 && <Scene1Intro key="intro" />}
        {currentScene === 1 && <Scene2Scan key="scan" />}
        {currentScene === 2 && <Scene3Data key="data" />}
        {currentScene === 3 && <Scene4Outro key="outro" />}
      </AnimatePresence>
    </div>
  );
}
