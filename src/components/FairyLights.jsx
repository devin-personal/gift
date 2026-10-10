// A drooping wire of twinkling bulbs, used as a section divider.
export default function FairyLights({ count = 18 }) {
  const bulbs = Array.from({ length: count }, (_, i) => {
    const f = (i + 0.5) / count;
    return { x: f * 100, y: 6 + 4 * 22 * f * (1 - f) };
  });
  return (
    <div className="fairy" aria-hidden="true">
      <svg viewBox="0 0 100 40" preserveAspectRatio="none">
        <path d="M0,6 Q50,50 100,6" />
      </svg>
      {bulbs.map((b, i) => (
        <span
          key={i}
          className="bulb"
          style={{ left: `${b.x}%`, top: `${b.y * 2.5}%`, animationDelay: `${(i * 0.37) % 2.4}s` }}
        />
      ))}
    </div>
  );
}
