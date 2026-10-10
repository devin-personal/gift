import { useEffect, useRef, useState } from 'react';

// A cake whose candles go out when tapped — or when she actually blows into the mic.
export default function Cake({ candles = 3, onBlown, sparkles }) {
  const [lit, setLit] = useState(() => Array(candles).fill(true));
  const [mic, setMic] = useState('idle'); // idle | listening | denied
  const micRef = useRef(null);
  const done = useRef(false);
  const flameRefs = useRef([]);

  const litRef = useRef(lit);

  const blowOut = (i) => {
    if (!litRef.current[i]) return;
    litRef.current = litRef.current.map((v, j) => (j === i ? false : v));
    const el = flameRefs.current[i];
    if (el) {
      const r = el.getBoundingClientRect();
      sparkles.current?.burst(r.left + r.width / 2, r.top + r.height / 2, 12, 0.4);
    }
    setLit(litRef.current);
  };

  const stopMic = () => {
    const m = micRef.current;
    if (!m) return;
    cancelAnimationFrame(m.raf);
    m.stream.getTracks().forEach((t) => t.stop());
    m.ctx.close().catch(() => {});
    micRef.current = null;
  };

  useEffect(() => stopMic, []);

  useEffect(() => {
    if (!done.current && lit.every((v) => !v)) {
      done.current = true;
      stopMic();
      setMic('idle');
      setTimeout(onBlown, 900);
    }
  }, [lit, onBlown]);

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const data = new Uint8Array(analyser.fftSize);
      let loud = 0;
      const m = { stream, ctx, raf: 0 };
      micRef.current = m;
      setMic('listening');

      const listen = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const x = (data[i] - 128) / 128;
          sum += x * x;
        }
        const rms = Math.sqrt(sum / data.length);
        loud = rms > 0.16 ? loud + 1 : Math.max(0, loud - 1);
        if (loud > 5) {
          loud = 0;
          const i = litRef.current.indexOf(true);
          if (i !== -1) blowOut(i);
        }
        m.raf = requestAnimationFrame(listen);
      };
      listen();
    } catch {
      setMic('denied');
    }
  };

  const allOut = lit.every((v) => !v);

  return (
    <div className="cake-wrap">
      <div className={`cake ${allOut ? 'is-out' : ''}`}>
        <div className="candles">
          {lit.map((on, i) => (
            <button
              key={i}
              className={`candle ${on ? '' : 'is-out'}`}
              onClick={() => blowOut(i)}
              aria-label={on ? `Blow out candle ${i + 1}` : `Candle ${i + 1} is out`}
              style={{ '--i': i }}
            >
              <span className="flame" ref={(el) => (flameRefs.current[i] = el)} />
              <span className="smoke" />
            </button>
          ))}
        </div>
        <div className="tier tier-top" />
        <div className="tier tier-bottom" />
        <div className="plate" />
      </div>

      {!allOut && (
        <div className="cake-actions">
          <p className="cake-hint">close your eyes, make a wish, then tap the flames…</p>
          {mic === 'idle' && 'mediaDevices' in navigator && (
            <button className="ghost-btn" onClick={startMic}>
              🎤 or actually blow (use mic)
            </button>
          )}
          {mic === 'listening' && <p className="cake-hint pulse">listening… blow!</p>}
          {mic === 'denied' && <p className="cake-hint">no mic? no problem — just tap them 💨</p>}
        </div>
      )}
      {allOut && <p className="cake-hint wish-made">wish sealed. it's definitely coming true.</p>}
    </div>
  );
}
