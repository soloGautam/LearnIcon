import { useEffect, useState } from "react";
import { CinematicIntro } from "./CinematicIntro";

export function IntroGate() {
  const [show, setShow] = useState(false);
  const introKey = "learnico:intro:cinematic";

  useEffect(() => {
    try {
      // Show intro only on first visit; after that, skip it
      if (!sessionStorage.getItem(introKey)) {
        setShow(true);
      }
    } catch {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <CinematicIntro
      onDone={() => {
        try {
          sessionStorage.setItem(introKey, "1");
        } catch {}
        setShow(false);
      }}
    />
  );
}
