"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

type ClinicImage = { id: string; url: string; alt?: string | null };

export default function ClinicGallery({ images }: { images: ClinicImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (openIndex === null) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, prev, next]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      if (delta > 0) prev();
      else next();
    }
    touchStartX.current = null;
  }

  if (images.length === 0) {
    return (
      <div className="w-full h-48 bg-surface-container rounded-2xl flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-5xl opacity-40">local_hospital</span>
      </div>
    );
  }

  const visible = images.slice(0, 4);
  const active = openIndex !== null ? images[openIndex] : null;

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {visible.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label={`Άνοιγμα φωτογραφίας ${i + 1}`}
            className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
          >
            <Image
              src={img.url}
              alt={img.alt ?? "Ιατρείο"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 1024px) 50vw, 25vw"
              priority={i === 0}
            />
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setOpenIndex(0)}
        className="mt-4 inline-flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/30 text-on-surface font-bold text-sm px-5 py-2.5 rounded-full editorial-shadow active:scale-95 transition-transform cursor-pointer"
      >
        <span className="material-symbols-outlined text-[18px]">photo_library</span>
        Όλες οι φωτογραφίες ({images.length})
      </button>

      {active && openIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Προβολή φωτογραφιών"
          onClick={close}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Κλείσιμο"
            className="absolute top-4 right-4 lg:top-6 lg:right-6 w-11 h-11 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition-colors z-10 cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Προηγούμενη φωτογραφία"
              className="absolute left-2 lg:left-6 w-11 h-11 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition-colors z-10 cursor-pointer"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
          )}

          <div
            className="relative max-w-[90vw] max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.url}
              alt={active.alt ?? "Ιατρείο"}
              className="max-w-[90vw] max-h-[80vh] w-auto h-auto object-contain rounded-xl"
            />
          </div>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Επόμενη φωτογραφία"
              className="absolute right-2 lg:right-6 w-11 h-11 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition-colors z-10 cursor-pointer"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium">
              {openIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
