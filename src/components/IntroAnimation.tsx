import { useEffect, useRef, useState } from "react";

const T_STAR_END = 2700;
const T_EXPLODE_END = 3800;
const T_CONVERGE_END = 5100;
const T_BLACKHOLE_END = 7400;
const T_TUNNEL_END = 10300;
const T_FLASH_END = 11100;
const T_TOTAL = 11500;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const easeOutCubic = (n: number) => 1 - Math.pow(1 - clamp01(n), 3);
const easeInCubic = (n: number) => Math.pow(clamp01(n), 3);
const easeInOut = (n: number) => {
  const p = clamp01(n);
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
};

type Star = { x: number; y: number; r: number; a: number; tw: number };
type Asteroid = { radius: number; speed: number; phase: number; size: number; tilt: number };
type Shard = { ang: number; max: number; size: number; hue: number; drift: number };

export function IntroAnimation({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const [, force] = useState(0);
  const stateRef = useRef({ fadingOut: false });

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    resize();
    window.addEventListener("resize", resize);

    const stars: Star[] = Array.from({ length: 360 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.25 + 0.18,
      a: Math.random() * 0.65 + 0.15,
      tw: Math.random() * Math.PI * 2,
    }));

    const asteroids: Asteroid[] = Array.from({ length: 34 }, () => ({
      radius: 95 + Math.random() * 210,
      speed: 0.55 + Math.random() * 1.1,
      phase: Math.random() * Math.PI * 2,
      size: 1.1 + Math.random() * 3.1,
      tilt: Math.random() * 0.28 - 0.14,
    }));

    const shards: Shard[] = Array.from({ length: 150 }, () => ({
      ang: Math.random() * Math.PI * 2,
      max: 190 + Math.random() * 430,
      size: 1 + Math.random() * 3.2,
      hue: 186 + Math.random() * 64,
      drift: Math.random() * 0.75 + 0.35,
    }));

    const tunnelRays = Array.from({ length: 96 }, (_, i) => ({
      ang: (i / 96) * Math.PI * 2 + (Math.random() - 0.5) * 0.08,
      width: 0.55 + Math.random() * 1.7,
      speed: 0.85 + Math.random() * 1.5,
      hue: [195, 224, 264, 38][i % 4],
    }));

    const start = performance.now();
    let raf = 0;

    const clearSpace = (w: number, h: number, cx: number, cy: number, t: number) => {
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.78);
      bg.addColorStop(0, "#12103a");
      bg.addColorStop(0.45, "#080713");
      bg.addColorStop(1, "#010106");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      for (const s of stars) {
        const a = s.a * (0.62 + 0.38 * Math.sin(t / 520 + s.tw));
        ctx.fillStyle = `rgba(244,247,255,${a})`;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawNeutronStar = (w: number, h: number, cx: number, cy: number, t: number) => {
      const p = t / T_STAR_END;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t / 760);
      for (let i = 0; i < 18; i++) {
        ctx.rotate((Math.PI * 2) / 18);
        const beam = ctx.createLinearGradient(0, 0, Math.max(w, h) * 0.82, 0);
        beam.addColorStop(0, `rgba(204,245,255,${0.25 + p * 0.42})`);
        beam.addColorStop(0.33, `rgba(115,218,255,${0.12 + p * 0.18})`);
        beam.addColorStop(1, "rgba(115,218,255,0)");
        ctx.fillStyle = beam;
        ctx.beginPath();
        ctx.moveTo(0, -4.4 * dpr);
        ctx.lineTo(Math.max(w, h) * 0.85, 0);
        ctx.lineTo(0, 4.4 * dpr);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      for (const a of asteroids) {
        const ang = (t / 1000) * a.speed + a.phase;
        const x = cx + Math.cos(ang) * a.radius * dpr;
        const y = cy + Math.sin(ang) * a.radius * dpr * (0.52 + a.tilt);
        ctx.fillStyle = "rgba(224,226,241,0.84)";
        ctx.shadowColor = "rgba(145,220,255,0.45)";
        ctx.shadowBlur = 7 * dpr;
        ctx.beginPath();
        ctx.arc(x, y, a.size * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      const pulse = 1 + Math.sin(t / 78) * 0.08;
      const halo = (86 + p * 88) * dpr * pulse;
      const hg = ctx.createRadialGradient(cx, cy, 0, cx, cy, halo);
      hg.addColorStop(0, "#ffffff");
      hg.addColorStop(0.13, "#e7fbff");
      hg.addColorStop(0.48, "rgba(120,225,255,0.62)");
      hg.addColorStop(1, "rgba(120,225,255,0)");
      ctx.fillStyle = hg;
      ctx.beginPath();
      ctx.arc(cx, cy, halo, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(cx, cy, 14 * dpr * pulse, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawExplosion = (cx: number, cy: number, t: number) => {
      const p = (t - T_STAR_END) / (T_EXPLODE_END - T_STAR_END);
      const e = easeOutCubic(p);
      const ring = (38 + e * 650) * dpr;
      const shock = ctx.createRadialGradient(cx, cy, 0, cx, cy, ring);
      shock.addColorStop(0, `rgba(255,255,255,${1 - p * 0.55})`);
      shock.addColorStop(0.24, `rgba(185,235,255,${0.76 * (1 - p)})`);
      shock.addColorStop(0.56, `rgba(133,112,255,${0.34 * (1 - p)})`);
      shock.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = shock;
      ctx.beginPath();
      ctx.arc(cx, cy, ring, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = `rgba(255,255,255,${0.95 * (1 - p)})`;
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath();
      ctx.arc(cx, cy, ring * 0.86, 0, Math.PI * 2);
      ctx.stroke();

      for (const s of shards) {
        const dist = e * s.max;
        const x = cx + Math.cos(s.ang) * dist * dpr;
        const y = cy + Math.sin(s.ang) * dist * dpr;
        ctx.shadowColor = "#b8f4ff";
        ctx.shadowBlur = 10 * dpr;
        ctx.fillStyle = `hsla(${s.hue},95%,78%,${0.95 - p * 0.22})`;
        ctx.beginPath();
        ctx.arc(x, y, s.size * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    const drawBlackhole = (w: number, h: number, cx: number, cy: number, t: number) => {
      const p = (t - T_CONVERGE_END) / (T_BLACKHOLE_END - T_CONVERGE_END);
      const birth = easeOutCubic(Math.min(1, p * 1.6));
      const pull = easeInCubic(Math.max(0, (p - 0.44) / 0.56));
      const scale = 0.78 + birth * 0.9 + pull * 4.2;

      for (const s of shards) {
        const cp = easeInOut(clamp01((t - T_EXPLODE_END) / (T_CONVERGE_END - T_EXPLODE_END)));
        const d = s.max * (1 - cp) * dpr;
        const x = cx + Math.cos(s.ang + p * s.drift) * d;
        const y = cy + Math.sin(s.ang + p * s.drift) * d;
        ctx.strokeStyle = `hsla(${s.hue},94%,80%,${0.58 * (1 - cp)})`;
        ctx.lineWidth = s.size * dpr;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);
      ctx.rotate(Math.sin(t / 1250) * 0.08);

      const diskW = Math.min(w, h) * 0.34 * dpr;
      const diskH = diskW * 0.22;
      for (let i = 0; i < 9; i++) {
        const q = i / 8;
        ctx.strokeStyle = i % 3 === 0
          ? `rgba(255,198,84,${0.22 + (1 - q) * 0.44})`
          : i % 3 === 1
            ? `rgba(117,234,255,${0.16 + (1 - q) * 0.34})`
            : `rgba(184,147,255,${0.14 + (1 - q) * 0.26})`;
        ctx.lineWidth = (4.4 - q * 2.2) * dpr;
        ctx.beginPath();
        ctx.ellipse(0, 0, diskW * (1 + q * 0.58), diskH * (1 + q * 0.48), t / 1900 + q * 0.35, 0, Math.PI * 2);
        ctx.stroke();
      }

      const upper = ctx.createLinearGradient(-diskW * 1.55, -diskH * 1.7, diskW * 1.55, diskH * 1.7);
      upper.addColorStop(0, "rgba(255,174,66,0)");
      upper.addColorStop(0.28, "rgba(255,214,130,0.78)");
      upper.addColorStop(0.5, "rgba(255,255,255,0.9)");
      upper.addColorStop(0.72, "rgba(107,234,255,0.7)");
      upper.addColorStop(1, "rgba(107,234,255,0)");
      ctx.strokeStyle = upper;
      ctx.lineWidth = 8 * dpr;
      ctx.beginPath();
      ctx.ellipse(0, -diskH * 0.22, diskW * 1.28, diskH * 0.86, -0.04, Math.PI * 1.06, Math.PI * 1.94);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, diskH * 0.18, diskW * 1.28, diskH * 0.86, -0.04, 0.06, Math.PI * 0.94);
      ctx.stroke();

      const glow = ctx.createRadialGradient(0, 0, diskW * 0.1, 0, 0, diskW * 0.78);
      glow.addColorStop(0, "rgba(0,0,0,1)");
      glow.addColorStop(0.34, "rgba(0,0,0,1)");
      glow.addColorStop(0.54, "rgba(3,7,20,0.92)");
      glow.addColorStop(0.76, "rgba(88,218,255,0.18)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, diskW * 0.78, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(0, 0, diskW * 0.33, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (pull > 0) {
        const vignette = ctx.createRadialGradient(cx, cy, Math.min(w, h) * dpr * 0.12, cx, cy, Math.max(w, h) * dpr * 0.7);
        vignette.addColorStop(0, `rgba(0,0,0,${0.15 + pull * 0.42})`);
        vignette.addColorStop(1, `rgba(0,0,0,${pull * 0.95})`);
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, w, h);
      }
    };

    const drawTunnel = (w: number, h: number, cx: number, cy: number, t: number) => {
      const p = (t - T_BLACKHOLE_END) / (T_TUNNEL_END - T_BLACKHOLE_END);
      const maxR = Math.hypot(w, h) * 0.72;

      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      bg.addColorStop(0, "#06070f");
      bg.addColorStop(0.42, "#10114a");
      bg.addColorStop(1, "#020209");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t / 1550);
      for (let ring = 0; ring < 28; ring++) {
        const z = ((ring / 28 + (t / 1700)) % 1);
        const r = Math.pow(z, 1.65) * maxR + 18 * dpr;
        const alpha = (1 - z) * 0.04 + z * 0.5;
        ctx.strokeStyle = `rgba(${ring % 2 ? "116,231,255" : "255,213,137"},${alpha})`;
        ctx.lineWidth = (1.2 + z * 5) * dpr;
        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * (0.58 + Math.sin(t / 800 + ring) * 0.08), ring * 0.16, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (const ray of tunnelRays) {
        const twist = Math.sin(t / 720 + ray.ang * 3) * 0.34;
        const a = ray.ang + twist + t / (950 / ray.speed);
        const inner = 30 * dpr;
        const outer = maxR * (0.55 + 0.45 * ((t / 1200 + ray.speed) % 1));
        const x1 = Math.cos(a) * inner;
        const y1 = Math.sin(a) * inner;
        const x2 = Math.cos(a + twist * 0.5) * outer;
        const y2 = Math.sin(a + twist * 0.5) * outer;
        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, `hsla(${ray.hue},95%,78%,0)`);
        grad.addColorStop(0.45, `hsla(${ray.hue},95%,78%,${0.17 + 0.18 * Math.sin(t / 220 + ray.ang)})`);
        grad.addColorStop(1, `hsla(${ray.hue},95%,82%,0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = ray.width * dpr;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(Math.cos(a + 0.8) * outer * 0.34, Math.sin(a + 0.8) * outer * 0.34, x2, y2);
        ctx.stroke();
      }
      ctx.restore();

      const exit = easeInCubic(Math.max(0, (p - 0.66) / 0.34));
      const light = ctx.createRadialGradient(cx, cy, 0, cx, cy, (80 + exit * 720) * dpr);
      light.addColorStop(0, `rgba(255,255,255,${0.28 + exit * 0.72})`);
      light.addColorStop(0.24, `rgba(226,247,255,${0.18 + exit * 0.38})`);
      light.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = light;
      ctx.beginPath();
      ctx.arc(cx, cy, (80 + exit * 720) * dpr, 0, Math.PI * 2);
      ctx.fill();
    };

    function frame(now: number) {
      const t = now - start;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      if (t < T_BLACKHOLE_END) clearSpace(w, h, cx, cy, t);

      if (t < T_STAR_END) drawNeutronStar(w, h, cx, cy, t);
      else if (t < T_EXPLODE_END) drawExplosion(cx, cy, t);
      else if (t < T_BLACKHOLE_END) drawBlackhole(w, h, cx, cy, t);
      else if (t < T_TUNNEL_END) drawTunnel(w, h, cx, cy, t);

      const flashEl = flashRef.current;
      if (flashEl) {
        let flash = 0;
        if (t > T_TUNNEL_END - 360 && t < T_FLASH_END) {
          flash = Math.min(1, ((t - (T_TUNNEL_END - 360)) / (T_FLASH_END - (T_TUNNEL_END - 360))) * 1.35);
        } else if (t >= T_FLASH_END) {
          flash = 1;
        }
        flashEl.style.opacity = String(flash);
      }

      if (t >= T_FLASH_END && !stateRef.current.fadingOut) {
        stateRef.current.fadingOut = true;
        force((n) => n + 1);
      }

      if (t >= T_TOTAL) {
        onDone();
        return;
      }

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [onDone]);

  const fadingOut = stateRef.current.fadingOut;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden transition-opacity duration-700"
      style={{
        opacity: fadingOut ? 0 : 1,
        pointerEvents: fadingOut ? "none" : "auto",
        backgroundColor: "#020209",
      }}
      aria-hidden
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0"
        style={{ opacity: 0, backgroundColor: "#ffffff" }}
      />
    </div>
  );
}