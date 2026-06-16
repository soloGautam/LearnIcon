import { useEffect, useState } from "react";
import { Sparkles, Zap } from "lucide-react";

interface XpToastProps {
  amount: number;
  reason?: string;
  onDone: () => void;
}

export function XpToast({ amount, reason, onDone }: XpToastProps) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 80);
    const t2 = setTimeout(() => setPhase("out"), 1800);
    const t3 = setTimeout(onDone, 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const style: React.CSSProperties = {
    opacity: phase === "out" ? 0 : 1,
    transform:
      phase === "in"
        ? "translate(-50%, -50%) scale(0.6)"
        : phase === "hold"
        ? "translate(-50%, -50%) scale(1)"
        : "translate(-50%, -50%) scale(0.85) translateY(-24px)",
    transition:
      phase === "in"
        ? "opacity 0.15s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)"
        : "opacity 0.45s ease, transform 0.45s ease",
  };

  return (
    <div
      className="pointer-events-none fixed left-1/2 top-1/2 z-[100]"
      style={style}
    >
      {/* glow ring behind card */}
      <div className="absolute inset-0 -m-4 rounded-3xl bg-[oklch(0.7_0.15_290)] opacity-25 blur-2xl" />

      <div className="relative flex min-w-[200px] flex-col items-center gap-2 rounded-3xl bg-gradient-to-br from-[oklch(0.62_0.2_290)] via-[oklch(0.68_0.18_330)] to-[oklch(0.74_0.16_10)] px-10 py-7 shadow-2xl">

        {/* sparkle dots */}
        <span className="absolute -top-2 -right-2 text-lg">✦</span>
        <span className="absolute -bottom-1 -left-2 text-sm opacity-70">✦</span>

        <div className="flex items-center gap-2">
          <Zap className="size-5 fill-yellow-300 text-yellow-300 drop-shadow" />
          <span className="font-display text-5xl font-bold tracking-tight text-white drop-shadow-lg">
            +{amount}
          </span>
          <span className="mt-1 self-end pb-1 text-2xl font-semibold text-white/80">XP</span>
        </div>

        {reason && (
          <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1">
            <Sparkles className="size-3 text-white/70" />
            <span className="text-xs font-medium text-white/90">{reason}</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface XpToastState {
  amount: number;
  reason?: string;
  key: number;
}

export function useXpToast() {
  const [toast, setToast] = useState<XpToastState | null>(null);

  const show = (amount: number, reason?: string) => {
    setToast({ amount, reason, key: Date.now() });
  };

  const ToastRenderer = toast ? (
    <XpToast
      key={toast.key}
      amount={toast.amount}
      reason={toast.reason}
      onDone={() => setToast(null)}
    />
  ) : null;

  return { show, ToastRenderer };
}
