import { useEffect, useMemo, useRef, useState } from 'react';

// Small seeded RNG so every polaroid keeps the same tilt between renders.
function seeded(seed) {
  let s = (seed + 1) * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const TAPES = ['#ffd77a', '#ff9ec4', '#b9a4ff', '#7fe0d4'];

export default function Polaroids({ photos }) {
  const wrapRef = useRef(null);
  const [w, setW] = useState(() => Math.min(window.innerWidth, 1400));
  const [visible, setVisible] = useState(false);
  const [offsets, setOffsets] = useState({});
  const [z, setZ] = useState(() => photos.map((_, i) => i + 1));
  const zTop = useRef(photos.length + 1);
  const drag = useRef(null);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    const el = wrapRef.current;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const n = photos.length;
  const cols = w < 560 ? 2 : w < 900 ? 3 : 4;
  const cellW = w / cols;
  const cardW = Math.min(w > 1250 ? 300 : 240, cellW * 0.86); // larger cards on big monitors
  const cellH = cardW * 1.25 + 110; // portrait photo + room for a 2–3 line caption
  const rows = Math.ceil(n / cols);

  const layout = useMemo(
    () =>
      photos.map((_, i) => {
        const r = seeded(i + [...photos[i].src].reduce((a, c) => a + c.charCodeAt(0), 0));
        const row = Math.floor(i / cols);
        const inRow = row === rows - 1 ? n - row * cols : cols;
        const shift = ((cols - inRow) * cellW) / 2; // centre a short last row
        const col = i % cols;
        return {
          x: shift + cellW * (col + 0.5) + (r() - 0.5) * cellW * 0.22,
          y: cellH * (row + 0.5) + (r() - 0.5) * 26 + 10,
          rot: (r() - 0.5) * 18,
          fx: (r() - 0.5) * 900,
          fy: 260 + r() * 260,
          tape: TAPES[i % TAPES.length],
          tapeRot: (r() - 0.5) * 14,
        };
      }),
    [photos, cols, cellW, cellH, rows, n]
  );

  const onDown = (e, i) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const o = offsets[i] || { x: 0, y: 0 };
    drag.current = { i, sx: e.clientX, sy: e.clientY, ox: o.x, oy: o.y, moved: false };
    zTop.current += 1;
    const top = zTop.current;
    setZ((prev) => prev.map((v, j) => (j === i ? top : v)));
  };

  const onMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (!d.moved && Math.hypot(dx, dy) < 6) return;
    d.moved = true;
    setOffsets((prev) => ({ ...prev, [d.i]: { x: d.ox + dx, y: d.oy + dy } }));
  };

  const onUp = () => {
    const d = drag.current;
    drag.current = null;
    if (d && !d.moved) setOpen(d.i);
  };

  return (
    <>
      <div ref={wrapRef} className="polaroid-wall" style={{ height: rows * cellH + 40 }}>
        {visible &&
          photos.map((p, i) => {
            const l = layout[i];
            const o = offsets[i] || { x: 0, y: 0 };
            return (
              <div
                key={i}
                className="polaroid-pos"
                style={{
                  left: l.x,
                  top: l.y,
                  width: cardW,
                  zIndex: z[i],
                  transform: `translate(-50%, -50%) translate(${o.x}px, ${o.y}px)`,
                }}
                onPointerDown={(e) => onDown(e, i)}
                onPointerMove={onMove}
                onPointerUp={onUp}
                onPointerCancel={() => (drag.current = null)}
              >
                <div
                  className="polaroid-throw"
                  style={{ '--r': `${l.rot}deg`, '--fx': `${l.fx}px`, '--fy': `${l.fy}px`, animationDelay: `${i * 0.2}s` }}
                >
                  <figure className={`polaroid ${p.highlight ? 'is-highlight' : ''}`}>
                    <span className="tape" style={{ '--c': l.tape, transform: `translateX(-50%) rotate(${l.tapeRot}deg)` }} />
                    {typeof p.highlight === 'string' && <span className="sticker">{p.highlight}</span>}
                    <div className="polaroid-img">
                      <img src={p.src} alt={p.caption} draggable={false} loading="lazy" style={{ objectPosition: p.pos }} />
                    </div>
                    <figcaption>{p.caption}</figcaption>
                  </figure>
                </div>
              </div>
            );
          })}
      </div>

      {open !== null && (
        <Lightbox photos={photos} index={open} onClose={() => setOpen(null)} onNav={setOpen} />
      )}
    </>
  );
}

function Lightbox({ photos, index, onClose, onNav }) {
  const n = photos.length;
  const prev = () => onNav((index - 1 + n) % n);
  const next = () => onNav((index + 1) % n);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNav((index - 1 + n) % n);
      if (e.key === 'ArrowRight') onNav((index + 1) % n);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, n, onClose, onNav]);

  const p = photos[index];
  return (
    <div className="lightbox" onClick={onClose} role="dialog" aria-modal="true" aria-label={p.caption}>
      <button className="lb-nav lb-prev" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous photo">‹</button>
      <figure className="polaroid polaroid-big" key={index} onClick={(e) => e.stopPropagation()}>
        <div className="polaroid-img">
          <img src={p.src} alt={p.caption} style={{ objectPosition: p.pos }} />
        </div>
        <figcaption>{p.caption}</figcaption>
      </figure>
      <button className="lb-nav lb-next" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next photo">›</button>
      <button className="lb-close" onClick={onClose} aria-label="Close">×</button>
    </div>
  );
}
