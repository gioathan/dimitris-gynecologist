"use client";

import { useState } from "react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      reason: (form.elements.namedItem("reason") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-xs font-bold text-on-surface-variant ml-1">Ονοματεπώνυμο</label>
          <input name="name" required placeholder="Μαρία Παπαδοπούλου" className={inputClass} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-on-surface-variant ml-1">Email</label>
          <input name="email" type="email" required placeholder="maria@example.com" className={inputClass} />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-on-surface-variant ml-1">Λόγος Επικοινωνίας</label>
        <select name="reason" className={inputClass}>
          <option value="">Γενική Ερώτηση</option>
          <option value="Κλείσιμο Ραντεβού">Κλείσιμο Ραντεβού</option>
          <option value="Αποτελέσματα Εξετάσεων">Αποτελέσματα Εξετάσεων</option>
          <option value="Πληροφορίες Υπηρεσιών">Πληροφορίες Υπηρεσιών</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-on-surface-variant ml-1">Μήνυμα</label>
        <textarea
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
  );
}
