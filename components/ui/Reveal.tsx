"use client";

import { inView } from "motion";
import { animate } from "motion/mini";
import { useEffect, useRef } from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

// Ekrana girince bir kez, hafifçe yukarı kayarak görünür. İçerik HTML'de görünür gelir;
// yalnızca sayfa açıldığında ekranın altında kalan öğeler gizlenip kaydırınca açılır.
// Böylece JS kapalıyken ya da hareket azaltma açıkken hiçbir şey gizli kalmaz.
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (element.getBoundingClientRect().top <= window.innerHeight) return;

    element.style.opacity = "0";
    return inView(
      element,
      () => {
        animate(
          element,
          { opacity: [0, 1], transform: ["translateY(20px)", "translateY(0)"] },
          { duration: 0.5, ease: "easeOut", delay },
        );
      },
      { margin: "0px 0px -10% 0px" },
    );
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
