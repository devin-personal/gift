import { useMemo } from 'react';

const COLORS = ['#ff8fb1', '#f7c96b', '#b9a4ff', '#7fe0d4', '#ff6f91', '#ffb86b'];

// Balloons drifting up behind the celebration.
export default function Balloons({ count = 10 }) {
  const balloons = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: 4 + ((i * 97) % 92),
        size: 42 + Math.random() * 34,
        delay: Math.random() * 10,
        dur: 14 + Math.random() * 10,
        color: COLORS[i % COLORS.length],
      })),
    [count]
  );

  return (
    <div className="balloons" aria-hidden="true">
      {balloons.map((b, i) => (
        <span
          key={i}
          className="balloon"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size * 1.2,
            '--c': b.color,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.dur}s`,
          }}
        />
      ))}
    </div>
  );
}
