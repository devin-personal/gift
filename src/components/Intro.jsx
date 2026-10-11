import { useRef, useState } from 'react';

export default function Intro({ name, sparkles, onStart, onDone }) {
  const [opening, setOpening] = useState(false);
  const giftRef = useRef(null);

  const open = () => {
    if (opening) return;
    setOpening(true);
    onStart?.(); // start music inside the tap so browsers allow it
    const r = giftRef.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height * 0.3;
    sparkles.current?.burst(cx, cy, 90, 1.4);
    setTimeout(() => sparkles.current?.burst(cx, cy, 60, 0.8), 250);
    setTimeout(onDone, 1500);
  };

  return (
    <section className={`intro ${opening ? 'is-opening' : ''}`}>
      <p className="eyebrow">oye Mommy 😂, it’s your day…</p>
      <h1 className="intro-title">
        small <em>surprise</em>
      </h1>

      <button ref={giftRef} className={`gift ${opening ? 'is-open' : ''}`} onClick={open} aria-label="Open your gift">
        <span className="gift-rays" />
        <span className="gift-lid">
          <span className="bow bow-l" />
          <span className="bow bow-r" />
          <span className="bow-knot" />
        </span>
        <span className="gift-box" />
      </button>

      <p className="hint">tap the gift to open</p>
    </section>
  );
}
