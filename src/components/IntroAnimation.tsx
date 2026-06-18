import { useEffect, useRef, useState } from "react";
import introSpaceAsset from "@/assets/intro-space.mp4.asset.json";

const FADE_OUT_MS = 500;

export function IntroAnimation({ onDone }: { onDone: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fading, setFading] = useState(false);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setFading(true);
    setTimeout(() => onDone(), FADE_OUT_MS);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
    video.addEventListener("ended", finish);
    return () => video.removeEventListener("ended", finish);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden transition-opacity duration-500"
      style={{
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? "none" : "auto",
        backgroundColor: "#000",
      }}
      aria-hidden
    >
      <video
        ref={videoRef}
        src={introSpaceAsset.url}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <button
        type="button"
        onClick={finish}
        className="absolute bottom-6 right-6 rounded-full border border-white/30 bg-black/40 px-4 py-2 text-xs uppercase tracking-widest text-white/80 backdrop-blur-sm hover:bg-black/60"
      >
        Skip
      </button>
    </div>
  );
}
