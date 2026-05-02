import Link from "next/link";
import Logo from "./Logo";
import { getSiteSettings } from "@/lib/data/public";

const navLinks = [
  { href: "/", label: "Αρχική" },
  { href: "/doctor", label: "Ιατρός" },
  { href: "/clinic", label: "Ιατρείο" },
  { href: "/services", label: "Υπηρεσίες" },
  { href: "/articles", label: "Άρθρα" },
  { href: "/contact", label: "Επικοινωνία" },
];

const hours = (settings: Record<string, string>) => [
  { label: "Δευ – Παρ", value: settings.hours_mon_fri },
  { label: "Σάβ – Κυρ", value: settings.hours_sat_sun },
];

export default async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="bg-surface-container border-t border-outline-variant/20 mt-auto pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="flex flex-col gap-4">
          <Logo showText textDark />
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Εξειδικευμένες γυναικολογικές υπηρεσίες με σεβασμό, ιδιωτικότητα και σύγχρονες μεθόδους.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 self-start bg-gradient-to-r from-primary to-primary-container text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-sm shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
            Κλείστε Ραντεβού
          </Link>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Σελίδες</h3>
          <nav className="flex flex-col gap-2.5">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-on-surface-variant hover:text-primary transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Hours */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Ωράριο Γραμματείας</h3>
          <ul className="flex flex-col gap-2.5 mb-4">
            {hours(settings).map(({ label, value }) =>
              value ? (
                <li key={label} className="flex items-center gap-6 text-sm">
                  <span className="text-on-surface-variant">{label}</span>
                  <span className="text-on-surface font-medium">{value}</span>
                </li>
              ) : null
            )}
          </ul>
          <p className="text-xs text-on-surface-variant leading-relaxed italic border-l-2 border-primary/30 pl-3">
            Ο ιατρός δέχεται αποκλειστικά κατόπιν ραντεβού.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Επικοινωνία</h3>
          <ul className="flex flex-col gap-3">
            {settings.phone && (
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary text-[18px] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>phone</span>
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="text-sm text-on-surface-variant hover:text-primary transition-colors">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.phone_mobile && (
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary text-[18px] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>smartphone</span>
                <a href={`tel:${settings.phone_mobile.replace(/\s/g, "")}`} className="text-sm text-on-surface-variant hover:text-primary transition-colors">
                  {settings.phone_mobile}
                </a>
              </li>
            )}
            {settings.email && (
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary text-[18px] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
                <a href={`mailto:${settings.email}`} className="text-sm text-on-surface-variant hover:text-primary transition-colors break-all">
                  {settings.email}
                </a>
              </li>
            )}
            {settings.instagram && (
              <li className="flex items-start gap-2.5">
                <a
                  href={settings.instagram.startsWith("http") ? settings.instagram : `https://instagram.com/${settings.instagram.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-primary shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  {settings.instagram.startsWith("http") ? settings.instagram : `@${settings.instagram.replace(/^@/, "")}`}
                </a>
              </li>
            )}
            {settings.address && (
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary text-[18px] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                <span className="text-sm text-on-surface-variant">{settings.address}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-on-surface-variant">
          <span>© {new Date().getFullYear()} Ιατρείο Χριστακόπουλος Δ. Όλα τα δικαιώματα διατηρούνται.</span>
          <span>Σχεδιασμός & Ανάπτυξη με φροντίδα</span>
        </div>
      </div>
    </footer>
  );
}
