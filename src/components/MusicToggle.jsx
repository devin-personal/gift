import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

// Floating music button. Hides itself if the music file doesn't exist.
const MusicToggle = forwardRef(function MusicToggle({ src }, ref) {
  const audio = useRef(null);
  const [available, setAvailable] = useState(true);
  const [playing, setPlaying] = useState(false);

  const play = () => audio.current?.play().then(() => setPlaying(true)).catch(() => {});

  useImperativeHandle(ref, () => ({ play }), []);

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) play();
    else {
      a.pause();
      setPlaying(false);
    }
  };

  if (!src) return null;
  return (
    <>
      <audio ref={audio} src={src} loop preload="auto" onError={() => setAvailable(false)} />
      {available && (
        <button
          className={`music-btn ${playing ? 'is-playing' : ''}`}
          onClick={toggle}
          aria-label={playing ? 'Pause music' : 'Play music'}
        >
          <span className="eq"><i /><i /><i /></span>
          <span className="music-label">{playing ? 'music on' : 'music off'}</span>
        </button>
      )}
    </>
  );
});

export default MusicToggle;
