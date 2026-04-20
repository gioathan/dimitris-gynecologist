import { getAllServices } from "@/lib/data/public";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Υπηρεσίες",
  description:
    "Πλήρης κατάλογος γυναικολογικών και μαιευτικών υπηρεσιών: προγεννητικός έλεγχος, υπερηχογράφημα, κολποσκόπηση, αντισύλληψη, εμμηνόπαυση και περισσότερα.",
  openGraph: {
    title: "Υπηρεσίες | Δρ. Παπαδόπουλος",
    description: "Εξειδικευμένες γυναικολογικές και μαιευτικές υπηρεσίες στην Καλαμάτα.",
  },
};

const SERVICE_ICONS: Record<string, string> = {
  baby: "child_care",
  stethoscope: "stethoscope",
  monitor: "monitor_heart",
  search: "search",
  shield: "shield",
  heart: "favorite",
};

const ICON_BG: string[] = [
  "bg-secondary-container text-on-secondary-container",
  "bg-primary-fixed text-on-primary-fixed",
  "bg-tertiary-fixed text-on-tertiary-fixed",
  "bg-secondary-fixed text-on-secondary-fixed",
];

export default async function ServicesPage() {
  const services = await getAllServices();

  return (
    <>
      {/* ── Header ──────────────────────────────────────────── */}
      <section className="px-6 pt-10 pb-12 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">
            Τι προσφέρουμε
          </span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-on-surface leading-tight tracking-tight mb-3">
            Οι Υπηρεσίες μας
          </h1>
          <div className="w-12 h-1 bg-secondary rounded-full" />
          <p className="text-on-surface-variant text-base leading-relaxed mt-5 max-w-xl">
            Προσφέρουμε ολοκληρωμένη μαιευτική και γυναικολογική φροντίδα, εξατομικευμένη για κάθε
            στάδιο της γυναικείας υγείας.
          </p>
        </div>
      </section>

      {/* ── Services Grid ────────────────────────────────────── */}
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {services.length === 0 ? (
            <p className="text-center text-on-surface-variant py-16">
              Δεν υπάρχουν διαθέσιμες υπηρεσίες αυτή τη στιγμή.
            </p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {services.map((service, i) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="bg-surface-container-lowest rounded-[1.75rem] p-6 editorial-shadow flex gap-5 items-start group active:scale-[0.98] transition-transform hover:shadow-md"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${ICON_BG[i % 4]}`}>
                    <span className="material-symbols-outlined text-2xl">
                      {SERVICE_ICONS[service.icon ?? ""] ?? "medical_services"}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h2 className="text-lg font-bold text-on-surface leading-snug">{service.title}</h2>
                      <span className="material-symbols-outlined text-on-surface-variant text-lg shrink-0 group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </div>
                    {service.excerpt && (
                      <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-2">
                        {service.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-primary to-primary-container rounded-[2rem] p-8 lg:p-10 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Έχετε απορίες;</h3>
              <p className="text-white/80 text-sm leading-relaxed max-w-md">
                Επικοινωνήστε μαζί μας για να μάθετε ποια υπηρεσία είναι κατάλληλη για εσάς.
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 inline-flex items-center gap-2 bg-white text-primary rounded-full px-6 py-3 font-bold text-sm active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
              Επικοινωνήστε μαζί μας
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
