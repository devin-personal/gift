import { useEffect, useState } from 'react';

// Envelope that opens into a handwritten letter which types itself out.
export default function Letter({ to, from, paragraphs, signoff = 'cheers to many more,' }) {
  const [stage, setStage] = useState('sealed'); // sealed → opening → reading
  const [count, setCount] = useState(0);
  const total = paragraphs.reduce((n, p) => n + p.length, 0);
  const finished = count >= total;

  useEffect(() => {
    if (stage !== 'reading' || finished) return;
    const id = setInterval(() => setCount((c) => Math.min(total, c + 2)), 32);
    return () => clearInterval(id);
  }, [stage, finished, total]);

  const open = () => {
    if (stage !== 'sealed') return;
    setStage('opening');
    setTimeout(() => setStage('reading'), 1100);
  };

  let remaining = count;

  return (
    <div className="letter-area">
      {stage !== 'reading' ? (
        <button className={`envelope ${stage === 'opening' ? 'is-open' : ''}`} onClick={open} aria-label="Open the letter">
          <span className="env-back" />
          <span className="env-paper" />
          <span className="env-front" />
          <span className="env-flap" />
          <span className="env-seal">♥</span>
          <span className="env-to">for {to}</span>
        </button>
      ) : (
        <article className="letter-paper">
          <p className="letter-greet">Dear {to},</p>
          {paragraphs.map((p, i) => {
            const shown = Math.max(0, Math.min(p.length, remaining));
            const typing = remaining > 0 && remaining < p.length;
            remaining -= p.length;
            return (
              <p key={i}>
                {p.slice(0, shown)}
                {typing && <span className="caret" />}
                <span className="ghost">{p.slice(shown)}</span>
              </p>
            );
          })}
          <p className={`letter-sign ${finished ? 'is-on' : ''}`}>
            {signoff}
            <br />
            <span>{from}</span>
          </p>
          {!finished && (
            <button className="skip" onClick={() => setCount(total)}>
              skip ›
            </button>
          )}
        </article>
      )}
      {stage === 'sealed' && <p className="cake-hint">tap the envelope</p>}
    </div>
  );
}
