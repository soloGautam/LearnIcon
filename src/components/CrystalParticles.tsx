import { useEffect, useRef } from "react";

export function CrystalParticles({ color = "#ff7ab8", count = 28 }: { color?: string; count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const canvas: HTMLCanvasElement = c;
    const ctx = canvas.getContext("2d")!;
    const parent = canvas.parentElement!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type P = { x: number; y: number; vx: number; vy: number; r: number; rot: number; vr: number; life: number; max: number };
    const particles: P[] = [];

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      canvas.width = Math.max(1, rect.width * dpr);
      canvas.height = Math.max(1, rect.height * dpr);
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    function spawn() {
      const W = canvas.width;
      const H = canvas.height;
      const edge = Math.floor(Math.random() * 4);
      let x = 0, y = 0, vx = 0, vy = 0;
      const speed = (0.4 + Math.random() * 0.8) * dpr;
      if (edge === 0) { x = Math.random() * W; y = 0; vy = -speed; vx = (Math.random() - 0.5) * speed; }
      else if (edge === 1) { x = W; y = Math.random() * H; vx = speed; vy = (Math.random() - 0.5) * speed; }
      else if (edge === 2) { x = Math.random() * W; y = H; vy = speed; vx = (Math.random() - 0.5) * speed; }
      else { x = 0; y = Math.random() * H; vx = -speed; vy = (Math.random() - 0.5) * speed; }
      const max = 90 + Math.random() * 60;
      particles.push({ x, y, vx, vy, r: (2 + Math.random() * 4) * dpr, rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.1, life: 0, max });
    }

    for (let i = 0; i < count; i++) spawn();

    let raf = 0;
    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life += 1;
        const a = Math.sin((p.life / p.max) * Math.PI);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = color;
        ctx.globalAlpha = Math.max(0, a * 0.9);
        ctx.shadowColor = color;
        ctx.shadowBlur = 12 * dpr;
        ctx.beginPath();
        ctx.moveTo(0, -p.r);
        ctx.lineTo(p.r * 0.6, 0);
        ctx.lineTo(0, p.r);
        ctx.lineTo(-p.r * 0.6, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        if (p.life >= p.max) { particles.splice(i, 1); spawn(); }
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [color, count]);

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" />;
}