import { useEffect, useRef, useState } from "react";

const DURATION_MS = 4500;
const FADE_OUT_MS = 600;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
  type: "code" | "spark" | "orb";
}

export function CinematicIntro({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fading, setFading] = useState(false);
  const doneRef = useRef(false);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setFading(true);
    setTimeout(() => onDone(), FADE_OUT_MS);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const codeChars = [
      "const",
      "async",
      "await",
      "function",
      "class",
      "=>",
      "let",
      "var",
      "import",
      "export",
      "return",
      "null",
      "true",
      "false",
    ];

    const colors = [
      "#00d4ff", // cyan
      "#0099ff", // blue
      "#00ff88", // green
      "#ff00ff", // magenta
      "#ffaa00", // gold
      "#ff0055", // pink
      "#00ffff", // aqua
    ];

    const createParticle = (
      x: number,
      y: number,
      vx: number,
      vy: number,
      type: "code" | "spark" | "orb" = "spark"
    ) => {
      particles.push({
        x,
        y,
        vx,
        vy,
        life: 1,
        size: type === "code" ? Math.random() * 2 + 1 : Math.random() * 4 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        type,
      });
    };

    particlesRef.current = particles;

    let animationId: number;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      timeRef.current = elapsed;

      // Create dark background with motion blur
      ctx.fillStyle = "rgba(0, 10, 20, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add scan lines effect
      ctx.strokeStyle = "rgba(0, 212, 255, 0.03)";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.height; i += 4) {
        ctx.beginPath();
        ctx.moveTo(0, i + (elapsed / 20) % 4);
        ctx.lineTo(canvas.width, i + (elapsed / 20) % 4);
        ctx.stroke();
      }

      const progress = Math.min(elapsed / DURATION_MS, 1);
      const ease = (t: number) => 1 - Math.pow(1 - t, 3);

      // PHASE 1: Code Rain (0-1.3s)
      if (progress < 0.289) {
        const phaseProgress = progress / 0.289;

        // Generate falling code
        if (Math.random() > 0.75) {
          const x = Math.random() * canvas.width;
          const column = Math.floor((x / canvas.width) * 10);
          const speed = 2 + (column % 3) * 1.5;
          createParticle(x, -30, (Math.random() - 0.5) * 1, speed, "code");
        }

        // Draw code characters
        ctx.fillStyle = `rgba(0, 255, 136, ${0.7 * (1 - phaseProgress)})`;
        ctx.font = "bold 14px 'Courier New', monospace";
        ctx.shadowColor = "rgba(0, 255, 136, 0.5)";
        ctx.shadowBlur = 10;

        for (let i = 0; i < 20; i++) {
          const x = (Math.random() * canvas.width * 0.9) % canvas.width;
          const y = ((elapsed / 15 + i * 60 - phaseProgress * 200) % (canvas.height + 200)) - 100;
          ctx.fillText(codeChars[i % codeChars.length], x, y);
        }
      }

      // PHASE 2: Convergence Spiral (1.3s-2.9s)
      if (progress >= 0.289 && progress < 0.644) {
        const phaseProgress = (progress - 0.289) / 0.355;
        const eased = ease(phaseProgress);

        // Create swirling convergence
        if (Math.random() > 0.82) {
          const angle = Math.random() * Math.PI * 2;
          const startRadius = Math.random() * 400 + 250;
          const vx =
            Math.cos(angle) * (8 * eased) -
            Math.sin(angle) * (5 * eased);
          const vy =
            Math.sin(angle) * (8 * eased) +
            Math.cos(angle) * (5 * eased);

          createParticle(
            canvas.width / 2 + Math.cos(angle) * startRadius,
            canvas.height / 2 + Math.sin(angle) * startRadius,
            vx,
            vy,
            "spark"
          );
        }

        // Draw spiral guide
        ctx.strokeStyle = `rgba(0, 212, 255, ${0.15 * (1 - eased)})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        const spiralTurns = 3 + eased * 2;
        for (let i = 0; i < spiralTurns * Math.PI * 2; i += 0.1) {
          const radius = (i / (spiralTurns * Math.PI * 2)) * 300;
          const x = canvas.width / 2 + Math.cos(i - elapsed / 500) * radius;
          const y = canvas.height / 2 + Math.sin(i - elapsed / 500) * radius;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // PHASE 3: Logo Build-up (2.9s-3.8s)
      if (progress >= 0.644 && progress < 0.844) {
        const phaseProgress = (progress - 0.644) / 0.2;
        const eased = ease(phaseProgress);

        // Center glow expands
        const gradient = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          0,
          canvas.width / 2,
          canvas.height / 2,
          200 * (1 + eased * 0.8)
        );
        gradient.addColorStop(0, `rgba(0, 212, 255, ${0.4 * eased})`);
        gradient.addColorStop(0.5, `rgba(0, 153, 255, ${0.2 * eased})`);
        gradient.addColorStop(1, `rgba(255, 0, 255, ${0.05 * eased})`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(
          canvas.width / 2,
          canvas.height / 2,
          200 * (1 + eased * 0.8),
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Particle burst
        if (Math.random() > 0.8) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 5 + eased * 8;
          createParticle(
            canvas.width / 2,
            canvas.height / 2,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            "orb"
          );
        }
      }

      // PHASE 4: Logo Reveal + Tagline (3.8s-4.5s)
      if (progress >= 0.844) {
        const phaseProgress = (progress - 0.844) / 0.156;

        // Final glow
        const gradient = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          0,
          canvas.width / 2,
          canvas.height / 2,
          250
        );
        gradient.addColorStop(0, "rgba(0, 212, 255, 0.5)");
        gradient.addColorStop(0.7, "rgba(255, 0, 255, 0.2)");
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 250, 0, Math.PI * 2);
        ctx.fill();

        // Main logo
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2 - 40);
        ctx.scale(0.9 + phaseProgress * 0.1, 0.9 + phaseProgress * 0.1);

        ctx.fillStyle = `rgba(255, 255, 255, ${0.9 + phaseProgress * 0.1})`;
        ctx.font = "bold 84px 'Arial', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(0, 212, 255, 0.9)";
        ctx.shadowBlur = 20 + phaseProgress * 40;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillText("LearnIcon", 0, 0);
        ctx.restore();

        // Tagline
        ctx.fillStyle = `rgba(0, 212, 255, ${phaseProgress * 0.95})`;
        ctx.font = "600 16px 'Arial', sans-serif";
        ctx.textAlign = "center";
        ctx.shadowColor = "rgba(0, 212, 255, 0.6)";
        ctx.shadowBlur = 15;
        ctx.fillText("Build • Learn • Ship", canvas.width / 2, canvas.height / 2 + 100);

        // Optional: Accent line
        ctx.strokeStyle = `rgba(0, 212, 255, ${phaseProgress * 0.6})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 - 150 * phaseProgress, canvas.height / 2 + 60);
        ctx.lineTo(canvas.width / 2 + 150 * phaseProgress, canvas.height / 2 + 60);
        ctx.stroke();
      }

      // Update and render all particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life *= 0.97;
        p.vy += 0.08; // gravity

        // Pull particles toward center during convergence phase
        if (progress >= 0.289 && progress < 0.644) {
          const dx = canvas.width / 2 - p.x;
          const dy = canvas.height / 2 - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 1) {
            const pull = 0.015;
            p.vx += (dx / dist) * pull;
            p.vy += (dy / dist) * pull;
          }
        }

        if (p.life > 0) {
          ctx.globalAlpha = p.life * 0.9;
          ctx.fillStyle = p.color;

          if (p.type === "code") {
            // Square particles for code
            ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
          } else {
            // Circular glow for sparks and orbs
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
            g.addColorStop(0, p.color);
            g.addColorStop(1, "transparent");
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          particles.splice(i, 1);
        }
      }
      ctx.globalAlpha = 1;
      ctx.shadowColor = "transparent";

      if (elapsed < DURATION_MS) {
        animationId = requestAnimationFrame(animate);
      } else {
        finish();
      }
    };

    animationId = requestAnimationFrame(animate);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] overflow-hidden"
      style={{
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? "none" : "auto",
        transition: `opacity ${FADE_OUT_MS}ms cubic-bezier(0.4, 0, 1, 1)`,
        backgroundColor: "#000a14",
      }}
      aria-hidden
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{
          filter: "brightness(1.15) contrast(1.1)",
        }}
      />

      {/* Ambient glow overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, 
              rgba(0, 212, 255, 0.12) 0%,
              rgba(255, 0, 255, 0.05) 40%,
              transparent 70%)
          `,
        }}
      />

      {/* Corner accents */}
      <div
        className="absolute top-0 left-0 w-96 h-96 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0, 212, 255, 0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 0, 255, 0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Skip button */}
      <button
        type="button"
        onClick={finish}
        className="absolute bottom-6 right-6 rounded-full border border-[rgba(0,212,255,0.5)] bg-[rgba(0,10,20,0.7)] px-4 py-2 text-xs uppercase tracking-widest text-[rgba(0,212,255,0.9)] backdrop-blur-sm hover:bg-[rgba(0,212,255,0.15)] hover:border-[rgba(0,212,255,0.8)] transition-all duration-300 font-medium"
      >
        Skip
      </button>
    </div>
  );
}
