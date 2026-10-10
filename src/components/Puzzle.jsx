import { useEffect, useMemo, useRef, useState } from 'react';

// Shuffle until only a few tiles happen to be in place (and never pre-solved).
function shuffled(n) {
  const total = n * n;
  const a = [...Array(total).keys()];
  do {
    for (let i = total - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
  } while (a.filter((t, i) => t === i).length > Math.floor(total / 4));
  return a;
}

const size = 3; // 3×3 grid

export default function Puzzle({ image, sparkles, onContinue }) {
  const [order, setOrder] = useState(() => shuffled(size)); // order[slot] = tile id
  const [selected, setSelected] = useState(null); // slot index
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [peek, setPeek] = useState(false);
  const [ratio, setRatio] = useState(1);
  const [drag, setDrag] = useState(null); // { tile, dx, dy }
  const dragRef = useRef(null);
  const boardRef = useRef(null);
  const timers = useRef([]);
  const noteRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setRatio(img.naturalWidth / img.naturalHeight || 1);
    img.src = image;
  }, [image]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // If the grid size changes while the page is open (e.g. during editing), reshuffle for the new size.
  useEffect(() => {
    if (order.length !== size * size) setOrder(shuffled(size));
  }, [order.length]);

  const slotOf = useMemo(() => {
    const s = [];
    order.forEach((tile, slot) => (s[tile] = slot));
    return s;
  }, [order]);

  const slotCenter = (slot) => {
    const r = boardRef.current.getBoundingClientRect();
    const c = slot % size;
    const row = Math.floor(slot / size);
    return [r.left + ((c + 0.5) * r.width) / size, r.top + ((row + 0.5) * r.height) / size];
  };

  const win = () => {
    setSolved(true);
    setSelected(null);
    const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
    later(() => {
      const r = boardRef.current.getBoundingClientRect();
      sparkles.current?.twinkle(r, 70, 80);
      sparkles.current?.burst(r.left + r.width / 2, r.top + r.height / 2, 120, 1.6);
    }, 650);
    later(() => {
      const r = boardRef.current.getBoundingClientRect();
      [[r.left, r.top], [r.right, r.top], [r.left, r.bottom], [r.right, r.bottom]].forEach(([x, y]) =>
        sparkles.current?.burst(x, y, 40, 1)
      );
    }, 1300);
    later(() => setRevealed(true), 2300);
    later(() => noteRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 2400);
  };

  const swap = (a, b) => {
    if (a === b || solved) return;
    const next = [...order];
    [next[a], next[b]] = [next[b], next[a]];
    setOrder(next);
    setMoves((m) => m + 1);
    [a, b].forEach((slot) => {
      if (next[slot] === slot) {
        const [x, y] = slotCenter(slot);
        sparkles.current?.burst(x, y, 16, 0.6);
      }
    });
    if (next.every((t, i) => t === i)) win();
  };

  const onDown = (e, slot) => {
    if (solved) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { slot, tile: order[slot], x: e.clientX, y: e.clientY, moved: false };
  };

  const onMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) < 6) return;
    d.moved = true;
    setDrag({ tile: d.tile, dx, dy });
  };

  const onUp = (e) => {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d) return;
    setDrag(null);
    if (d.moved) {
      const r = boardRef.current.getBoundingClientRect();
      const c = Math.floor(((e.clientX - r.left) / r.width) * size);
      const row = Math.floor(((e.clientY - r.top) / r.height) * size);
      if (c >= 0 && c < size && row >= 0 && row < size) swap(d.slot, row * size + c);
      setSelected(null);
    } else if (selected === null) {
      setSelected(d.slot);
    } else if (selected === d.slot) {
      setSelected(null);
    } else {
      swap(selected, d.slot);
      setSelected(null);
    }
  };

  const onCancel = () => {
    dragRef.current = null;
    setDrag(null);
  };

  const placed = order.filter((t, i) => t === i).length;

  return (
    <section className={`puzzle ${solved ? 'is-solved' : ''}`}>
      <header className="puzzle-head">
        <p className="eyebrow">chapter one</p>
        <h1 className="puzzle-title">
          Find the <em>birthday girl</em>
        </h1>
        <p className="puzzle-help">Drag a piece onto another to swap them — or tap two pieces.</p>
      </header>

      <div
        ref={boardRef}
        className="board"
        style={{ aspectRatio: ratio, '--ratio': ratio, '--n': size }}
      >
        {order.map((_, tile) => {
          const slot = slotOf[tile];
          const col = slot % size;
          const row = Math.floor(slot / size);
          const homeCol = tile % size;
          const homeRow = Math.floor(tile / size);
          const isDragging = drag?.tile === tile;
          const offset = isDragging ? ` translate(${drag.dx}px, ${drag.dy}px) scale(1.06)` : '';
          return (
            <div
              key={tile}
              className={[
                'tile',
                slot === tile && 'is-home',
                selected === slot && 'is-selected',
                isDragging && 'is-dragging',
              ].filter(Boolean).join(' ')}
              style={{
                width: `${100 / size}%`,
                height: `${100 / size}%`,
                transform: `translate(${col * 100}%, ${row * 100}%)${offset}`,
              }}
              onPointerDown={(e) => onDown(e, slot)}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onCancel}
            >
              <div
                className="tile-img"
                style={{
                  backgroundImage: `url("${image}")`,
                  backgroundSize: `${size * 100}% ${size * 100}%`,
                  backgroundPosition: `${(homeCol / (size - 1)) * 100}% ${(homeRow / (size - 1)) * 100}%`,
                }}
              />
            </div>
          );
        })}
        <img className={`peek ${peek ? 'is-on' : ''}`} src={image} alt="" draggable={false} />
        <span className="board-shine" />
      </div>

      {!solved && (
        <div className="puzzle-bar">
          <span className="chip">
            <b>{moves}</b> moves
          </span>
          <span className="chip">
            <b>{placed}</b>/{size * size} in place
          </span>
          <button
            className="chip chip-btn"
            onPointerDown={() => setPeek(true)}
            onPointerUp={() => setPeek(false)}
            onPointerLeave={() => setPeek(false)}
            onContextMenu={(e) => e.preventDefault()}
          >
            hold to peek 👀
          </button>
        </div>
      )}

      <div ref={noteRef} className={`solved-note ${revealed ? 'is-on' : ''}`} aria-live="polite">
        {revealed && (
          <>
            <p className="solved-title">
              you did it <span aria-hidden="true">✨</span>
            </p>
            <p className="solved-sub">
              {moves} moves — every piece of you, right where it belongs.
            </p>
            <button className="cta" onClick={onContinue}>
              open your surprise <span aria-hidden="true">→</span>
            </button>
          </>
        )}
      </div>
    </section>
  );
}
