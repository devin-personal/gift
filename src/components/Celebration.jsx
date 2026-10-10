import { useCallback, useEffect, useRef, useState } from 'react';
import Bunting from './Bunting';
import Balloons from './Balloons';
import FairyLights from './FairyLights';
import Polaroids from './Polaroids';
import Cake from './Cake';
import Letter from './Letter';

export default function Celebration({ config, sparkles, onReplay }) {
  const [wished, setWished] = useState(false);
  const letterRef = useRef(null);

  useEffect(() => {
    const s = sparkles.current;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const timers = [
      setTimeout(() => s?.confetti(200), 200),
      setTimeout(() => {
        s?.cannon(0, H * 0.85, -Math.PI / 3, 90);
        s?.cannon(W, H * 0.85, (-2 * Math.PI) / 3, 90);
      }, 900),
      setTimeout(() => s?.twinkle({ left: W * 0.15, top: H * 0.3, width: W * 0.7, height: H * 0.3 }, 40, 60), 1500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [sparkles]);

  const onBlown = useCallback(() => {
    const s = sparkles.current;
    s?.confetti(220);
    s?.cannon(0, window.innerHeight, -Math.PI / 3, 70);
    s?.cannon(window.innerWidth, window.innerHeight, (-2 * Math.PI) / 3, 70);
    setWished(true);
    setTimeout(() => letterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 400);
  }, [sparkles]);

  return (
    <div className="celebrate">
      <Balloons />

      <header className="hero">
        <Bunting text="HAPPY BIRTHDAY" />
        <h1 className="hero-name">
          <span>{config.name}</span>
        </h1>
        <p className="hero-sub">{config.subtitle}</p>
        <a className="scroll-cue" href="#memories">
          scroll for memories
          <span aria-hidden="true">↓</span>
        </a>
      </header>

      <section className="memories" id="memories">
        <FairyLights />
        <p className="eyebrow">chapter two</p>
        <h2 className="section-title">
          us, through the <em>years</em>
        </h2>
        {config.years.map((y, i) => (
          <div className="year" key={y.label}>
            <div className="year-head">
              <span className="year-num">{y.num ?? String(i + 1).padStart(2, '0')}</span>
              <div>
                <p className="year-label">{y.label}</p>
                <h3 className="year-title">{y.title}</h3>
              </div>
            </div>
            <Polaroids photos={y.photos} />
          </div>
        ))}
        <p className="wall-hint">drag them around · tap one to look closer</p>
        {config.wallOutro && <p className="wall-outro">{config.wallOutro}</p>}
      </section>

      <section className="wish">
        <p className="eyebrow">chapter three</p>
        <h2 className="section-title">
          make a <em>wish</em>
        </h2>
        <Cake candles={config.candles} onBlown={onBlown} sparkles={sparkles} />
      </section>

      {wished && (
        <section className="letter-section" ref={letterRef}>
          <p className="eyebrow">the last chapter</p>
          <h2 className="section-title">
            one more <em>thing</em>
          </h2>
          <Letter to={config.name} from={config.fromName} paragraphs={config.letter} signoff={config.letterSignoff} />
          <button className="ghost-btn replay" onClick={onReplay}>
            ↺ replay the surprise
          </button>
        </section>
      )}

      <footer className="foot">made with way too much love · {new Date().getFullYear()}</footer>
    </div>
  );
}
