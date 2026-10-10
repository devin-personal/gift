import { useEffect, useRef, useState } from 'react';

const FLAG_COLORS = ['#ff8fb1', '#f7c96b', '#b9a4ff', '#7fe0d4', '#ffb86b'];

function useMedia(query) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setMatch(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, [query]);
  return match;
}

// A string of pennant flags that drop in one by one and swing gently.
function Garland({ word, delay = 0 }) {
  const ref = useRef(null);
  const [w, setW] = useState(() => Math.min(window.innerWidth, 1100));

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const chars = [...word];
  const n = chars.length;
  const sag = Math.min(46, w * 0.06);
  const flagW = Math.min(78, (w * 0.9) / n - 8);
  const height = sag + flagW * 1.35 + 16;

  return (
    <div ref={ref} className="garland" style={{ height }}>
      <svg className="garland-string" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
        <path d={`M0,4 Q50,${4 + sag * 2} 100,4`} />
      </svg>
      {chars.map((ch, i) => {
        const f = 0.05 + (0.9 * (i + 0.5)) / n;
        const y = 4 + 4 * sag * f * (1 - f);
        const slope = Math.atan2(4 * sag * (1 - 2 * f), w) * (180 / Math.PI);
        return (
          <div
            key={i}
            className="flag-pos"
            style={{ left: `${f * 100}%`, top: y, width: flagW, transform: `translateX(-50%) rotate(${slope}deg)` }}
          >
            <div className="flag-drop" style={{ animationDelay: `${delay + i * 0.07}s` }}>
              <div
                className={`flag ${ch === ' ' ? 'is-blank' : ''}`}
                style={{ '--c': FLAG_COLORS[i % FLAG_COLORS.length], animationDelay: `${(i % 4) * -0.7}s` }}
              >
                <span>{ch}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Bunting({ text }) {
  const wide = useMedia('(min-width: 820px)');
  const lines = wide ? [text] : text.split(' ');
  return (
    <div className="bunting" aria-label={text} role="img">
      {lines.map((line, i) => (
        <Garland key={`${wide}-${i}`} word={line} delay={0.3 + i * 0.45} />
      ))}
    </div>
  );
}
