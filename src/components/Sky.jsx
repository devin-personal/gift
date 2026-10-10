import { useMemo } from 'react';

// Fixed night-sky backdrop: drifting aurora blobs, twinkling stars, the odd shooting star.
export default function Sky() {
  const stars = useMemo(
    () =>
      Array.from({ length: 110 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: Math.random() * 2 + 0.6,
        d: Math.random() * 5,
        t: 2 + Math.random() * 4,
      })),
    []
  );

  return (
    <div className="sky" aria-hidden="true">
      <div className="aurora aurora-a" />
      <div className="aurora aurora-b" />
      <div className="aurora aurora-c" />
      {stars.map((s, i) => (
        <span
          key={i}
          className="star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.s,
            height: s.s,
            animationDelay: `${s.d}s`,
            animationDuration: `${s.t}s`,
          }}
        />
      ))}
      <span className="shooting-star" />
      <span className="shooting-star shooting-star-2" />
    </div>
  );
}
