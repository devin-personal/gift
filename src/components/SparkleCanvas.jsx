import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

const SPARK = ['#ffd77a', '#fff4d6', '#ff9ec4', '#c7b5ff', '#ffffff'];
const CONFETTI = ['#ffd77a', '#ff8fb1', '#b9a4ff', '#7fe0d4', '#ffffff', '#ff6f91', '#ffb86b'];
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function drawStar(ctx, r, alpha) {
  ctx.globalAlpha = alpha * 0.35;
  ctx.beginPath();
  ctx.arc(0, 0, r * 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const rad = i % 2 === 0 ? r : r * 0.28;
    const a = (i * Math.PI) / 4;
    ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
  }
  ctx.closePath();
  ctx.fill();
}

function makeConfetti(x, y, vx, vy) {
  return {
    kind: 'confetti', x, y, vx, vy,
    w: 6 + Math.random() * 6, h: 9 + Math.random() * 9,
    rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
    flip: 0.05 + Math.random() * 0.15, wobble: 0.05 + Math.random() * 0.1,
    color: pick(CONFETTI), life: 0, max: 260 + Math.random() * 120,
    gravity: 0.12, drag: 0.985,
  };
}

// One full-screen canvas shared by the whole app for sparkles + confetti.
const SparkleCanvas = forwardRef(function SparkleCanvas(_, ref) {
  const canvasRef = useRef(null);
  const parts = useRef([]);

  useImperativeHandle(ref, () => ({
    // Radial burst of twinkly stars from a point
    burst(x, y, count = 60, power = 1) {
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = (1.5 + Math.random() * 6) * power;
        parts.current.push({
          kind: 'star', x, y,
          vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
          size: 2.5 + Math.random() * 5.5,
          rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.2,
          color: pick(SPARK), life: 0, max: 45 + Math.random() * 55,
          gravity: 0.04, drag: 0.94,
        });
      }
    },
    // Stars that pop in and twinkle at random spots inside a rect
    twinkle(rect, count = 40, spread = 60) {
      for (let i = 0; i < count; i++) {
        parts.current.push({
          kind: 'star',
          x: rect.left + Math.random() * rect.width,
          y: rect.top + Math.random() * rect.height,
          vx: (Math.random() - 0.5) * 0.4, vy: -Math.random() * 0.5,
          size: 3 + Math.random() * 7,
          rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.08,
          color: pick(SPARK), life: -Math.random() * spread, max: 50 + Math.random() * 40,
          gravity: 0, drag: 0.99,
        });
      }
    },
    // Confetti raining from the top of the screen
    confetti(count = 160) {
      const w = window.innerWidth;
      for (let i = 0; i < count; i++) {
        parts.current.push(
          makeConfetti(Math.random() * w, -20 - Math.random() * 200, (Math.random() - 0.5) * 3, 2 + Math.random() * 3)
        );
      }
    },
    // Confetti cannon shooting from a point at an angle (radians, 0 = right)
    cannon(x, y, angle, count = 80) {
      for (let i = 0; i < count; i++) {
        const a = angle + (Math.random() - 0.5) * 0.7;
        const sp = 9 + Math.random() * 11;
        parts.current.push(makeConfetti(x, y, Math.cos(a) * sp, Math.sin(a) * sp));
      }
    },
  }), []);

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf;

    const resize = () => {
      c.width = window.innerWidth * dpr;
      c.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const tick = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      ctx.clearRect(0, 0, W, H);
      const arr = parts.current;
      for (let i = arr.length - 1; i >= 0; i--) {
        const p = arr[i];
        p.life++;
        if (p.life < 0) continue;
        if (p.life > p.max || p.y > H + 60) {
          arr.splice(i, 1);
          continue;
        }
        p.vx *= p.drag;
        p.vy = p.vy * p.drag + p.gravity;
        p.x += p.vx + (p.wobble ? Math.sin(p.life * p.wobble) * 0.8 : 0);
        p.y += p.vy;
        p.rot += p.vr;

        const fadeIn = Math.min(1, p.life / 6);
        const fadeOut = Math.min(1, (p.max - p.life) / 20);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.kind === 'star') {
          const tw = 0.65 + 0.35 * Math.sin(p.life * 0.35);
          drawStar(ctx, p.size * (0.6 + 0.4 * fadeIn), fadeIn * fadeOut * tw);
        } else {
          ctx.globalAlpha = fadeOut;
          ctx.scale(1, Math.cos(p.life * p.flip));
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fx-canvas" aria-hidden="true" />;
});

export default SparkleCanvas;
