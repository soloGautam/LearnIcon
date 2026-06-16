import { useEffect, useState } from "react";
import { IntroAnimation } from "./IntroAnimation";

export function IntroGate() {
  const [show, setShow] = useState(false);
  const introKey = "learnico:intro:v3";

  useEffect(() => {
    try {
      if (!sessionStorage.getItem(introKey)) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  if (!show) return null;
  return (
    <IntroAnimation
      onDone={() => {
        try { sessionStorage.setItem(introKey, "1"); } catch {}
        setShow(false);
      }}
    />
  );
}