import {
  getHomepageContent,
  getAllServices,
  getArticleCategories,
  getDoctorProfile,
  getSiteSettings,
} from "@/lib/data/public";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Αρχική",
  description:
    "Εξειδικευμένος Μαιευτήρας - Γυναικολόγος στην Καλαμάτα. Προγεννητικός έλεγχος, υπερηχογράφημα, κολποσκόπηση και πλήρης γυναικολογική φροντίδα.",
};

const SERVICE_ICONS: Record<string, string> = {
  baby: "child_care",
  stethoscope: "stethoscope",
  monitor: "monitor_heart",
  search: "search",
  shield: "shield",
  heart: "favorite",
};

const CATEGORY_BG: string[] = [
  "bg-secondary-container text-on-secondary-container",
  "bg-primary-fixed text-on-primary-fixed",
  "bg-tertiary-fixed text-on-tertiary-fixed",
  "bg-secondary-fixed text-on-secondary-fixed",
];

export default async function HomePage() {
  const [homepage, services, categories, doctor, settings] = await Promise.all([
    getHomepageContent(),
    getAllServices(),
    getArticleCategories(),
    getDoctorProfile(),
    getSiteSettings(),
  ]);

  const hoursItems = [
    { label: "Δευ – Παρ", value: settings.hours_mon_fri },
    { label: "Σάβ – Κυρ", value: settings.hours_sat_sun },
  ].filter((h) => h.value);

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="px-6 pt-8 pb-12 lg:pt-10 lg:pb-16 overflow-hidden bg-surface">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Text */}
          <div className="relative z-10">
            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">
              Καλώς ήρθατε στη φροντίδα σας
            </span>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-on-surface leading-tight tracking-tight mb-3">
              {homepage?.hero_title || "Εξειδικευμένη Μαιευτική & Γυναικολογία"}
            </h1>
            {homepage?.hero_subtitle && (
              <p className="text-primary font-semibold text-lg mb-3">{homepage.hero_subtitle}</p>
            )}
            {homepage?.intro_text && (
              <p className="text-on-surface-variant text-base lg:text-lg leading-relaxed mb-8 max-w-xl">
                {homepage.intro_text}
              </p>
            )}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-white py-4 px-8 rounded-full font-bold shadow-lg shadow-primary/20 active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  calendar_today
                </span>
                Κλείστε Ραντεβού
              </Link>
              <Link
                href="/clinic"
                className="inline-flex items-center gap-2 bg-surface-container-lowest text-secondary border border-outline-variant/30 py-4 px-8 rounded-full font-bold editorial-shadow active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  call
                </span>
                Επικοινωνία
              </Link>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative flex justify-center lg:justify-end">
            {homepage?.hero_image_url ? (
              <div className="hidden lg:block relative w-full max-w-md aspect-[4/5] rounded-[2rem] overflow-hidden">
                <Image src={homepage.hero_image_url} alt="Ιατρείο" fill className="object-cover" sizes="448px" priority />
              </div>
            ) : (
              <div className="hidden lg:flex w-full max-w-md aspect-[4/5] rounded-[2rem] bg-gradient-to-br from-primary-fixed to-secondary-container items-center justify-center">
                <span className="material-symbols-outlined text-primary opacity-40" style={{ fontSize: 96 }}>
                  local_florist
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Doctor preview ──────────────────────────────────── */}
      {doctor && (
        <section className="py-16 lg:py-20 px-6 bg-surface-container-low">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">
                Ο Ιατρός
              </span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-on-surface leading-tight tracking-tight mb-2">
                {doctor.name}
              </h2>
              <p className="text-secondary font-semibold mb-5">{doctor.title}</p>
              {doctor.bio && (
                <p className="text-on-surface-variant leading-relaxed text-base max-w-xl mb-7 line-clamp-4">
                  {doctor.bio}
                </p>
              )}
              <Link
                href="/doctor"
                className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider hover:gap-3 transition-all"
              >
                Γνωρίστε τον Ιατρό
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
            {doctor.photo_url && (
              <div className="flex justify-center lg:justify-end">
                <div className="relative w-56 lg:w-72 aspect-[4/5] rounded-[2rem] overflow-hidden rotate-1">
                  <Image
                    src={doctor.photo_url}
                    alt={doctor.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 224px, 288px"
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Clinic preview ──────────────────────────────────── */}
      {(hoursItems.length > 0 || settings.address) && (
        <section className="py-16 lg:py-20 px-6 bg-surface-container">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">
                Το Ιατρείο
              </span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-on-surface leading-tight tracking-tight mb-2">
                Σύγχρονο Ιατρείο στην Καλαμάτα
              </h2>
              <div className="w-12 h-1 bg-secondary rounded-full mb-7" />
              <Link
                href="/clinic"
                className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider hover:gap-3 transition-all"
              >
                Επισκεφθείτε το Ιατρείο
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              {hoursItems.map((h) => (
                <div key={h.label} className="bg-surface-container-lowest rounded-2xl px-6 py-4 flex justify-between items-center">
                  <span className="text-on-surface-variant text-sm font-medium">{h.label}</span>
                  <span className="text-on-surface font-bold text-sm">{h.value}</span>
                </div>
              ))}
              {settings.address && (
                <div className="bg-surface-container-lowest rounded-2xl px-6 py-4 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[18px] shrink-0">location_on</span>
                  <span className="text-on-surface text-sm font-medium">{settings.address}</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Services ────────────────────────────────────────── */}
      {services.length > 0 && (
        <section className="bg-surface-container-low py-16 lg:py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-on-surface mb-2">Οι Υπηρεσίες μας</h2>
                <div className="w-12 h-1 bg-secondary rounded-full" />
              </div>
              <Link href="/services" className="text-primary font-bold text-sm uppercase tracking-wider">
                Δείτε Όλες
              </Link>
            </div>

            <div className="lg:hidden flex gap-5 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
            <div className="hidden lg:grid grid-cols-3 gap-6">
              {services.slice(0, 6).map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Article categories ──────────────────────────────── */}
      {categories.length > 0 && (
        <section className="py-16 lg:py-24 px-6 bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-on-surface mb-2">Άρθρα & Νέα</h2>
                <div className="w-12 h-1 bg-secondary rounded-full" />
              </div>
              <Link href="/articles" className="text-primary font-bold text-sm uppercase tracking-wider">
                Δείτε Όλα
              </Link>
            </div>
            {/* Mobile: compact 2-col grid. Desktop: full cards */}
            <div className="grid grid-cols-2 lg:hidden gap-3">
              {categories.map((category, i) => (
                <Link
                  key={category.id}
                  href={`/articles/${category.slug}`}
                  className="bg-surface-container-lowest rounded-2xl p-4 editorial-shadow flex flex-col gap-2 active:scale-[0.98] transition-all"
                >
                  <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${CATEGORY_BG[i % 4]}`}>
                    <span className="material-symbols-outlined text-base">{(category as any).icon ?? "folder"}</span>
                  </div>
                  <span className="text-sm font-bold text-on-surface leading-snug">{category.title}</span>
                </Link>
              ))}
            </div>
            <div className="hidden lg:grid grid-cols-3 gap-5">
              {categories.map((category, i) => (
                <Link
                  key={category.id}
                  href={`/articles/${category.slug}`}
                  className="bg-surface-container-lowest rounded-[1.75rem] p-6 editorial-shadow flex items-center justify-between gap-4 group hover:shadow-md active:scale-[0.98] transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <div className={`inline-flex items-center justify-center w-11 h-11 rounded-2xl mb-3 ${CATEGORY_BG[i % 4]}`}>
                      <span className="material-symbols-outlined text-lg">{(category as any).icon ?? "folder"}</span>
                    </div>
                    <h3 className="text-base font-bold text-on-surface leading-snug mb-1">{category.title}</h3>
                    {category.subtitle && (
                      <p className="text-on-surface-variant text-xs leading-relaxed line-clamp-2">{category.subtitle}</p>
                    )}
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant text-xl shrink-0 group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function ServiceCard({ service }: { service: { id: string; slug: string; icon: string | null; title: string; excerpt: string | null } }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="flex-shrink-0 lg:flex-shrink w-60 lg:w-auto bg-surface-container-lowest rounded-[1.5rem] p-6 editorial-shadow block hover:shadow-md transition-shadow"
    >
      <div className="w-12 h-12 bg-secondary-container text-on-secondary-container rounded-2xl flex items-center justify-center mb-5">
        <span className="material-symbols-outlined text-2xl">
          {SERVICE_ICONS[service.icon ?? ""] ?? "medical_services"}
        </span>
      </div>
      <h3 className="text-lg font-bold text-on-surface mb-2 leading-snug">{service.title}</h3>
      {service.excerpt && (
        <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-3">{service.excerpt}</p>
      )}
    </Link>
  );
}
