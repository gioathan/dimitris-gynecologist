import { getPublishedArticles } from "@/lib/data/public";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Άρθρα & Νέα",
  description:
    "Επιστημονικά άρθρα και νέα για τη γυναικεία υγεία: HPV, εμμηνόπαυση, εγκυμοσύνη, προληπτικός έλεγχος και περισσότερα.",
  openGraph: {
    title: "Άρθρα & Νέα | Δρ. Παπαδόπουλος",
    description: "Ενημερωθείτε για θέματα γυναικείας υγείας από εξειδικευμένο ιατρό.",
  },
};

export default async function ArticlesPage() {
  const articles = await getPublishedArticles();
  const [featured, ...rest] = articles;

  return (
    <>
      {/* ── Header ──────────────────────────────────────────── */}
      <section className="px-6 pt-10 pb-12 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">
            Γνώση & Ενημέρωση
          </span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-on-surface leading-tight tracking-tight mb-3">
            Άρθρα & Νέα
          </h1>
          <div className="w-12 h-1 bg-secondary rounded-full" />
          <p className="text-on-surface-variant text-base leading-relaxed mt-5 max-w-xl">
            Επιστημονικά άρθρα και ενημερωτικό υλικό για τη γυναικεία υγεία, γραμμένα από τον ιατρό μας.
          </p>
        </div>
      </section>

      {/* ── Articles ─────────────────────────────────────────── */}
      <section className="px-6 py-12 pb-16">
        <div className="max-w-7xl mx-auto">
          {articles.length === 0 ? (
            <p className="text-center text-on-surface-variant py-16">
              Δεν υπάρχουν δημοσιευμένα άρθρα αυτή τη στιγμή.
            </p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Featured — full width on mobile, spans 2 cols on desktop */}
              {featured && (
                <Link
                  href={`/articles/${featured.slug}`}
                  className="relative rounded-[2rem] overflow-hidden aspect-[4/3] lg:col-span-2 lg:row-span-2 block group"
                >
                  {featured.image_url ? (
                    <Image
                      src={featured.image_url}
                      alt={featured.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed to-secondary-container" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <span className="bg-secondary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block">
                      {featured.published_at
                        ? new Date(featured.published_at).toLocaleDateString("el-GR", { day: "numeric", month: "long", year: "numeric" })
                        : "Άρθρο"}
                    </span>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white leading-tight">{featured.title}</h2>
                    {featured.excerpt && (
                      <p className="text-white/80 text-sm mt-2 line-clamp-2">{featured.excerpt}</p>
                    )}
                  </div>
                </Link>
              )}

              {/* Rest — stacked on right column on desktop */}
              {rest.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="bg-surface-container-highest rounded-[2rem] p-5 flex items-center gap-5 group hover:bg-surface-container-high transition-colors"
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
          )}
        </div>
      </section>
    </>
  );
}
