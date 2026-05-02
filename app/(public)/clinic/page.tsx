import { getSiteSettings, getClinicImages, getFacilities } from "@/lib/data/public";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

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
        <h1 className="text-4xl lg:text-5xl font-extrabold text-on-surface leading-tight tracking-tight mb-6">
          Σύγχρονο Ιατρείο στην Καλαμάτα
        </h1>

        {images.length > 0 ? (
          <>
            {/* Desktop gallery — first image 2×2, rest fill uniformly */}
            <div className="hidden lg:grid lg:grid-cols-4 gap-3" style={{ gridAutoRows: '160px' }}>
              {images.map((img, i) => (
                <div
                  key={img.id}
                  className={`relative rounded-2xl overflow-hidden ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt ?? "Ιατρείο"}
                    fill
                    className="object-cover"
                    sizes={i === 0 ? '50vw' : '25vw'}
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>

            {/* Mobile gallery */}
            <div className="lg:hidden grid grid-cols-2 gap-3">
              <div className="col-span-2 relative aspect-video rounded-2xl overflow-hidden">
                <Image
                  src={images[0].url}
                  alt={images[0].alt ?? "Ιατρείο"}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              </div>
              {images.slice(1).map((img) => (
                <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden">
                  <Image
                    src={img.url}
                    alt={img.alt ?? "Ιατρείο"}
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="w-full h-48 bg-surface-container rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-5xl opacity-40">local_hospital</span>
          </div>
        )}
      </section>

      {/* ── Facilities + Hours ──────────────────────────────── */}
      <section className="px-6 mb-12 grid grid-cols-1 gap-6">
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
            <h2 className="text-2xl font-bold">Ωράριο Λειτουργίας</h2>
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
                        ? "text-primary-container"
                        : ""
                    }`}
                  >
                    {h.value}
                  </span>
                </li>
              ))}
            </ul>
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
              <span className="material-symbols-outlined text-secondary mt-1">location_on</span>
              <div>
                <p className="font-bold text-on-surface text-sm uppercase tracking-wider text-secondary mb-1">
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
