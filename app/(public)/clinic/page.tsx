import { getSiteSettings, getClinicImages, getFacilities } from "@/lib/data/public";
import Link from "next/link";
import type { Metadata } from "next";
import ClinicGallery from "@/components/public/ClinicGallery";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Το Ιατρείο",
  description:
    "Επισκεφθείτε το σύγχρονο ιατρείο μας στην Καλαμάτα. Ωράριο λειτουργίας, τοποθεσία και φωτογραφίες των χώρων.",
  openGraph: {
    title: "Το Ιατρείο | Δημήτριος Ελ. Χριστακόπουλος MD, MSc",
    description: "Σύγχρονοι χώροι, άνεση και επαγγελματική φροντίδα στο ιατρείο μας στην Καλαμάτα.",
  },
};

const COLOR_MAP: Record<string, string> = {
  secondary: "bg-secondary-container text-on-secondary-container",
  primary: "bg-primary-fixed text-on-primary-fixed",
  tertiary: "bg-tertiary-fixed text-on-tertiary-fixed",
  "secondary-alt": "bg-secondary-fixed text-on-secondary-fixed",
};

export default async function ClinicPage() {
  const [settings, images, facilities] = await Promise.all([
    getSiteSettings(),
    getClinicImages(),
    getFacilities(),
  ]);

  const hoursItems = [
    { label: "Δευτέρα – Παρασκευή", value: settings.hours_mon_fri },
    { label: "Σάββατο – Κυριακή", value: settings.hours_sat_sun },
  ].filter((h) => h.value);

  return (
    <>
      {/* ── Header + Gallery ────────────────────────────────── */}
      <section className="px-6 pt-10 mb-12">
        <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">
          Καλώς ήρθατε
        </span>
        <h1 className="text-2xl lg:text-4xl font-extrabold text-on-surface leading-tight tracking-tight mb-6">
          Σύγχρονο Ιατρείο στην Καλαμάτα
        </h1>

        <ClinicGallery images={images} />
      </section>

      {/* ── Philosophy ──────────────────────────────────────── */}
      <section className="bg-surface-container-low py-8 lg:py-10 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span
            className="material-symbols-outlined text-secondary text-4xl mb-5 block"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            spa
          </span>
          <p className="text-lg lg:text-xl text-on-surface-variant leading-relaxed font-light italic">
            "Το ιατρείο είναι χώρος, όπου σε κάθε γυναίκα προσφέρεται ασφάλεια,
            εμπιστοσύνη και σεβασμός με επιστημονική κατάρτιση και εξειδίκευση"
          </p>
          <p className="text-primary font-bold text-sm uppercase tracking-widest mt-5">
            Δημήτριος Ελ. Χριστακόπουλος MD, MSc
          </p>
        </div>
      </section>

      {/* ── Facilities + Hours ──────────────────────────────── */}
      <section className="px-6 pt-8 mb-12 grid grid-cols-1 gap-6">
        {/* Facilities */}
        <div className="bg-surface-container-low rounded-[2rem] p-7">
          <h2 className="text-2xl font-bold mb-7 text-on-surface">Εγκαταστάσεις</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {facilities.map((f) => (
              <div
                key={f.id}
                className="flex items-start gap-4 p-5 bg-surface-container-lowest rounded-2xl"
              >
                <div className={`p-3 rounded-xl shrink-0 ${COLOR_MAP[f.color] ?? COLOR_MAP.secondary}`}>
                  <span className="material-symbols-outlined">{f.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-on-surface mb-1">{f.title}</h3>
                  <p className="text-on-surface-variant text-xs leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hours */}
        {hoursItems.length > 0 && (
          <div className="bg-primary text-on-primary rounded-[2rem] p-8 flex flex-col gap-6">
            <h2 className="text-2xl font-bold">Ωράριο Γραμματείας</h2>
            <ul className="space-y-5">
              {hoursItems.map((h) => (
                <li
                  key={h.label}
                  className="flex justify-between items-center border-b border-on-primary/10 pb-4 last:border-0 last:pb-0"
                >
                  <span className="font-medium text-sm">{h.label}</span>
                  <span
                    className={`font-bold text-sm ${
                      h.value?.toLowerCase().includes("κλειστ")
                        ? "text-on-primary italic"
                        : ""
                    }`}
                  >
                    {h.value}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-on-primary/80 italic border-l-2 border-white/30 pl-3">
              Ο ιατρός δέχεται αποκλειστικά κατόπιν ραντεβού.
            </p>
            {settings.phone && (
              <a
                href={`tel:${settings.phone.replace(/\s/g, "")}`}
                className="mt-2 w-full bg-white text-primary rounded-full py-4 font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform text-sm"
              >
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  phone_in_talk
                </span>
                {settings.phone}
              </a>
            )}
          </div>
        )}
      </section>


      {/* ── Location ─────────────────────────────────────────── */}
      {(settings.address || settings.google_maps_embed) && (
        <section className="px-6 mb-8">
          {settings.google_maps_embed ? (
            <div className="w-full h-72 rounded-[2rem] overflow-hidden relative">
              <iframe
                src={settings.google_maps_embed}
                title="Χάρτης τοποθεσίας ιατρείου"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
              {settings.address && (
                <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary mt-0.5">location_on</span>
                    <div>
                      <p className="font-bold text-on-surface text-sm">{settings.address}</p>
                      <Link
                        href="/contact"
                        className="text-secondary font-bold text-xs flex items-center gap-1 mt-1"
                      >
                        Επικοινωνία
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : settings.address ? (
            <div className="bg-surface-container-low rounded-[2rem] p-6 flex items-start gap-4">
              <span className="material-symbols-outlined text-on-secondary-container mt-1" aria-hidden="true">location_on</span>
              <div>
                <p className="font-bold text-sm uppercase tracking-wider text-on-secondary-container mb-1">
                  Διεύθυνση
                </p>
                <p className="text-on-surface font-semibold">{settings.address}</p>
              </div>
            </div>
          ) : null}
        </section>
      )}
    </>
  );
}
