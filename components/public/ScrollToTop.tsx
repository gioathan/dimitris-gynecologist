"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Επιστροφή στην κορυφή"
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-primary/70 backdrop-blur-sm text-white shadow-lg shadow-black/10 border border-white/20 flex items-center justify-center hover:bg-primary/70 active:scale-95 transition-all duration-200"
    >
      <span className="material-symbols-outlined">arrow_upward</span>
    </button>
  );
}
