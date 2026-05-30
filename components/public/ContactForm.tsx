"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const reasons = [
  "Γενική Ερώτηση",
  "Κλείσιμο Ραντεβού",
  "Αποτελέσματα Εξετάσεων",
  "Πληροφορίες Υπηρεσιών",
];

function ReasonSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        id="reason-select"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="reason-listbox"
        className="w-full bg-surface-container-highest rounded-xl p-4 text-sm text-left flex items-center justify-between gap-2 focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
      >
        <span className={value ? "text-on-surface" : "text-on-surface-variant/50"}>{value || "Επιλέξτε λόγο επικοινωνίας"}</span>
        <span
          className="material-symbols-outlined text-on-surface-variant text-[20px] transition-transform duration-200 shrink-0"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          aria-hidden="true"
        >
          expand_more
        </span>
      </button>

      {open && (
        <ul
          id="reason-listbox"
          role="listbox"
          aria-label="Λόγος επικοινωνίας"
          className="absolute z-50 mt-1.5 w-full bg-surface-container-highest rounded-xl shadow-lg shadow-black/10 overflow-hidden border border-outline-variant/20"
        >
          {reasons.map((r) => (
            <li key={r} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={value === r}
                onClick={() => { onChange(r); setOpen(false); }}
                className={`w-full text-left px-4 py-3.5 text-sm transition-colors ${
                  value === r
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-on-surface hover:bg-surface-container"
                }`}
              >
                {r}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState(reasons[0]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = e.currentTarget;

    let recaptchaToken = "";
    try {
      recaptchaToken = await new Promise<string>((resolve, reject) => {
        window.grecaptcha.ready(() => {
          window.grecaptcha.execute(SITE_KEY, { action: "contact" }).then(resolve).catch(reject);
        });
      });
    } catch {
      setError("Αποτυχία επαλήθευσης reCAPTCHA. Δοκιμάστε ξανά.");
      setLoading(false);
      return;
    }

    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      reason,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      recaptchaToken,
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Αποτυχία αποστολής. Δοκιμάστε ξανά.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full bg-surface-container-highest border-none rounded-xl p-4 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary transition-all text-sm";

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
        <span
          className="material-symbols-outlined text-secondary text-5xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          check_circle
        </span>
        <h3 className="text-xl font-bold text-on-surface">Το μήνυμά σας στάλθηκε!</h3>
        <p className="text-on-surface-variant text-sm">
          Θα επικοινωνήσουμε μαζί σας το συντομότερο δυνατό.
        </p>
      </div>
    );
  }

  return (
    <>
    <Script
      src={`https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`}
      strategy="lazyOnload"
    />
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label htmlFor="contact-name" className="text-xs font-bold text-on-surface-variant ml-1">Ονοματεπώνυμο</label>
          <input id="contact-name" name="name" required placeholder="Μαρία Παπαδοπούλου" className={inputClass} />
        </div>
        <div className="space-y-2">
          <label htmlFor="contact-email" className="text-xs font-bold text-on-surface-variant ml-1">Email</label>
          <input id="contact-email" name="email" type="email" required placeholder="maria@example.com" className={inputClass} />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="reason-select" className="text-xs font-bold text-on-surface-variant ml-1">Λόγος Επικοινωνίας</label>
        <ReasonSelect value={reason} onChange={setReason} />
      </div>
      <div className="space-y-2">
        <label htmlFor="contact-message" className="text-xs font-bold text-on-surface-variant ml-1">Μήνυμα</label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={4}
          placeholder="Πώς μπορούμε να σας βοηθήσουμε;"
          className={inputClass}
        />
      </div>
      {error && <p className="text-error text-sm font-medium">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-gradient-to-r from-primary to-primary-container text-white py-5 font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform disabled:opacity-60"
      >
        {loading ? "Αποστολή…" : "Αποστολή Μηνύματος"}
      </button>
    </form>
    </>
  );
}
