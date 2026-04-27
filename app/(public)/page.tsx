import { getHomepageContent, getAllServices, getLatestArticles } from "@/lib/data/public";
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

export default async function HomePage() {
  const [homepage, services, articles] = await Promise.all([
    getHomepageContent(),
    getAllServices(),
    getLatestArticles(),
  ]);

  const [featuredArticle, ...restArticles] = articles;

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="px-6 py-14 lg:py-24 overflow-hidden bg-surface">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="relative z-10">
            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">
              Καλώς ήρθατε στη φροντίδα σας
            </span>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-on-surface leading-tight tracking-tight mb-4">
              {homepage?.hero_title || "Εξειδικευμένη Μαιευτική & Γυναικολογία"}
            </h1>
            {homepage?.hero_subtitle && (
              <p className="text-primary font-semibold text-lg mb-4">{homepage.hero_subtitle}</p>
            )}
            {homepage?.intro_text && (
              <p className="text-on-surface-variant text-base lg:text-lg leading-relaxed mb-10 max-w-xl">
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

          {/* Hero image — mobile: floating rotated, desktop: clean rounded card */}
          <div className="relative flex justify-center lg:justify-end">
            {homepage?.hero_image_url ? (
              <>
                {/* Mobile floating */}
                <div className="hidden absolute -right-10 top-0 w-52 h-72 rounded-3xl overflow-hidden rotate-3 editorial-shadow">
                  <Image src={homepage.hero_image_url} alt="Ιατρείο" fill className="object-cover" sizes="208px" />
                </div>
                {/* Desktop clean */}
                <div className="hidden lg:block relative w-full max-w-md aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
                  <Image src={homepage.hero_image_url} alt="Ιατρείο" fill className="object-cover" sizes="448px" priority />
                </div>
              </>
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

            {/* Mobile: horizontal scroll / Desktop: grid */}
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

      {/* ── Articles ────────────────────────────────────────── */}
      {articles.length > 0 && (
        <section className="py-16 lg:py-24 px-6 bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-10">
              <h2 className="text-2xl lg:text-3xl font-bold text-on-surface">Άρθρα & Νέα</h2>
              <Link href="/articles" className="text-primary font-bold text-sm uppercase tracking-wider">
                Δείτε Όλα
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Featured */}
              {featuredArticle && (
                <Link
                  href={`/articles/${featuredArticle.slug}`}
                  className="relative rounded-[2rem] overflow-hidden aspect-[4/5] lg:aspect-auto lg:row-span-2 block group"
                >
                  {featuredArticle.image_url ? (
                    <Image
                      src={featuredArticle.image_url}
                      alt={featuredArticle.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed to-secondary-container" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <span className="bg-secondary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block">
                      Άρθρο
                    </span>
                    <h3 className="text-2xl font-bold text-white leading-tight">{featuredArticle.title}</h3>
                    {featuredArticle.excerpt && (
                      <p className="text-white/80 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                        {featuredArticle.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              )}

              {/* Small cards */}
              {restArticles.slice(0, 2).map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="bg-surface-container-high rounded-[2rem] p-5 flex items-center gap-5 group hover:bg-surface-container transition-colors"
                >
                  <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-surface-container">
                    {article.image_url ? (
                      <Image src={article.image_url} alt={article.title} width={80} height={80} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">article</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-on-surface text-base leading-snug mb-1 line-clamp-2">{article.title}</h3>
                    <span className="text-primary text-xs font-bold uppercase">
                      {article.published_at
                        ? new Date(article.published_at).toLocaleDateString("el-GR", { day: "numeric", month: "long", year: "numeric" })
                        : "Άρθρο"}
                    </span>
                  </div>
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
