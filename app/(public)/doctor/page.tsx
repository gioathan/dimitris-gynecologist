import { getDoctorProfile } from "@/lib/data/public";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const doctor = await getDoctorProfile();
  return {
    title: doctor?.name ? `Δρ. ${doctor.name}` : "Ο Ιατρός",
    description: doctor?.bio?.slice(0, 160) ?? "Γνωρίστε τον ειδικό γυναικολόγο μαιευτήρα.",
    openGraph: {
      title: doctor?.name ? `Δρ. ${doctor.name} | ${doctor.title}` : "Ο Ιατρός",
      description: doctor?.bio?.slice(0, 160) ?? "",
      ...(doctor?.photo_url ? { images: [{ url: doctor.photo_url }] } : {}),
    },
  };
}

function parseCredentials(raw: string | null): string[] {
  if (!raw) return [];
  return raw.split("\n").map((l) => l.trim()).filter(Boolean);
}

export default async function DoctorPage() {
  const doctor = await getDoctorProfile();

  if (!doctor) {
    return (
      <div className="max-w-7xl mx-auto px-6 pt-16 text-center text-on-surface-variant">
        Τα στοιχεία του ιατρού δεν είναι διαθέσιμα αυτή τη στιγμή.
      </div>
    );
  }

  const credentials = parseCredentials(doctor.credentials);
  const lastName = doctor.name.split(" ").slice(-1)[0];
  const firstName = doctor.name.split(" ").slice(0, -1).join(" ");

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="px-6 py-14 lg:py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <div className="order-2 lg:order-1">
            <p className="text-primary font-bold tracking-widest uppercase text-xs mb-4">
              Ιδρυτής & Επικεφαλής Ιατρός
            </p>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-on-surface leading-tight tracking-tight mb-3">
              Δρ. {firstName}
              <br />
              <span className="text-primary">{lastName}</span>
            </h1>
            <p className="text-on-surface-variant font-medium text-lg mb-8">{doctor.title}</p>
            {doctor.bio && (
              <p className="text-on-surface-variant leading-relaxed text-base lg:text-lg max-w-xl">
                {doctor.bio}
              </p>
            )}
            <div className="grid grid-cols-2 gap-4 mt-10 max-w-sm">
              <div className="bg-surface-container p-6 rounded-2xl">
                <span className="material-symbols-outlined text-3xl text-primary block mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Εξατομικευμένη Φροντίδα</span>
              </div>
              <div className="bg-primary-fixed/40 p-6 rounded-2xl">
                <span className="material-symbols-outlined text-3xl text-secondary block mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Σύγχρονες Μέθοδοι</span>
              </div>
            </div>
          </div>

          {/* Photo */}
          {doctor.photo_url && (
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative w-64 lg:w-full max-w-sm aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl rotate-2">
                <Image
                  src={doctor.photo_url}
                  alt={doctor.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 256px, 384px"
                  priority
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Philosophy ──────────────────────────────────────── */}
      <section className="bg-surface-container-low py-16 lg:py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span
            className="material-symbols-outlined text-secondary text-4xl mb-5 block"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            spa
          </span>
          <h2 className="text-2xl lg:text-3xl font-bold text-on-surface mb-6">Η Φιλοσοφία μου</h2>
          <p className="text-lg lg:text-xl text-on-surface-variant leading-relaxed font-light italic">
            "Πιστεύω ότι το ιατρείο πρέπει να είναι ένας χώρος όπου κάθε γυναίκα αισθάνεται ακουσμένη,
            ασφαλής και ενδυναμωμένη να αναλάβει ενεργό ρόλο στη φροντίδα της υγείας της."
          </p>
        </div>
      </section>

      {/* ── Credentials ─────────────────────────────────────── */}
      {credentials.length > 0 && (
        <section className="px-6 py-16 lg:py-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-surface-container-low p-8 rounded-[2rem]">
              <h2 className="text-xl font-bold text-on-surface mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined">school</span>
                Σπουδές & Εκπαίδευση
              </h2>
              <div className="space-y-6">
                {credentials.map((line, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                      <span className="material-symbols-outlined text-primary text-sm">
                        {i === 0 ? "workspace_premium" : i === 1 ? "history_edu" : "diversity_1"}
                      </span>
                    </div>
                    <p className="text-on-surface-variant text-sm leading-relaxed pt-2">{line}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface-container-high p-8 rounded-[2rem]">
              <h2 className="text-xl font-bold text-on-surface mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined">stethoscope</span>
                Εξειδίκευση
              </h2>
              <div className="flex flex-wrap gap-3">
                {["Μαιευτική", "Γυναικολογία", "Προγεννητικός Έλεγχος", "Υπερηχογράφημα", "Κολποσκόπηση", "Εμμηνόπαυση", "Αντισύλληψη"].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-secondary-container text-on-secondary-container rounded-full text-sm font-bold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/60 backdrop-blur-3xl border border-outline-variant/20 rounded-[2.5rem] p-8 lg:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-on-surface mb-2">
                Κλείστε ένα Προσωπικό Ραντεβού
              </h3>
              <p className="text-on-surface-variant">
                Δεχόμαστε νέους ασθενείς για εξατομικευμένη φροντίδα υγείας.
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-full px-8 py-4 active:scale-95 transition-transform shadow-lg shadow-primary/20"
            >
              Κλείστε Ραντεβού
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
