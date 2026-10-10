import { useRef, useState } from 'react';
import { config } from './config';
import Sky from './components/Sky';
import SparkleCanvas from './components/SparkleCanvas';
import MusicToggle from './components/MusicToggle';
import Intro from './components/Intro';
import Puzzle from './components/Puzzle';
import Celebration from './components/Celebration';

export default function App() {
  const [stage, setStage] = useState('intro'); // intro → puzzle → celebrate
  const sparkles = useRef(null);
  const music = useRef(null);

  const go = (next) => {
    setStage(next);
    window.scrollTo({ top: 0 });
  };

  return (
    <>
      <Sky />
      <SparkleCanvas ref={sparkles} />
      <MusicToggle ref={music} src={config.music} />

      <main className={`stage stage-${stage}`} key={stage}>
        {stage === 'intro' && (
          <Intro
            name={config.name}
            sparkles={sparkles}
            onStart={() => music.current?.play()}
            onDone={() => go('puzzle')}
          />
        )}
        {stage === 'puzzle' && (
          <Puzzle
            image={config.puzzleImage}
            sparkles={sparkles}
            onContinue={() => go('celebrate')}
          />
        )}
        {stage === 'celebrate' && (
          <Celebration config={config} sparkles={sparkles} onReplay={() => go('intro')} />
        )}
      </main>
    </>
  );
}
