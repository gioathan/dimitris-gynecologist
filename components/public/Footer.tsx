import Link from "next/link";
import Logo from "./Logo";
import { getSiteSettings } from "@/lib/data/public";

const navLinks = [
  { href: "/", label: "Αρχική" },
  { href: "/doctor", label: "Ιατρός" },
  { href: "/services", label: "Υπηρεσίες" },
  { href: "/articles", label: "Άρθρα" },
  { href: "/clinic", label: "Ιατρείο" },
  { href: "/contact", label: "Επικοινωνία" },
];

const hours = (settings: Record<string, string>) => [
  { label: "Δευ – Τρί", value: settings.hours_mon_tue },
  { label: "Τετ – Παρ", value: settings.hours_wed_thu_fri },
  { label: "Σάβ – Κυρ", value: settings.hours_sat_sun },
];

export default async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="bg-surface-container-high border-t border-outline-variant/20 mt-auto pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="flex flex-col gap-4">
          <Logo showText />
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
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Ωράριο</h3>
          <ul className="flex flex-col gap-2.5">
            {hours(settings).map(({ label, value }) =>
              value ? (
                <li key={label} className="flex justify-between gap-4 text-sm">
                  <span className="text-on-surface-variant">{label}</span>
                  <span className="text-on-surface font-medium text-right">{value}</span>
                </li>
              ) : null
            )}
          </ul>
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
            {settings.email && (
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary text-[18px] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
                <a href={`mailto:${settings.email}`} className="text-sm text-on-surface-variant hover:text-primary transition-colors break-all">
                  {settings.email}
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
          <span>© {new Date().getFullYear()} Ιατρείο Παπαδόπουλος. Όλα τα δικαιώματα διατηρούνται.</span>
          <span>Σχεδιασμός & Ανάπτυξη με φροντίδα</span>
        </div>
      </div>
    </footer>
  );
}
