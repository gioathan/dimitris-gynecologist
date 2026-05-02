import { getArticleCategories } from "@/lib/data/public";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Άρθρα & Νέα",
  description:
    "Επιστημονικά άρθρα και νέα για τη γυναικεία υγεία: HPV, εμμηνόπαυση, εγκυμοσύνη, προληπτικός έλεγχος και περισσότερα.",
  openGraph: {
    title: "Άρθρα & Νέα | Δημήτριος Ελ. Χριστακόπουλος MD, MSc",
    description: "Ενημερωθείτε για θέματα γυναικείας υγείας από εξειδικευμένο ιατρό.",
  },
};

const CATEGORY_BG: string[] = [
  "bg-secondary-container text-on-secondary-container",
  "bg-primary-fixed text-on-primary-fixed",
  "bg-tertiary-fixed text-on-tertiary-fixed",
  "bg-secondary-fixed text-on-secondary-fixed",
];

export default async function ArticlesPage() {
  const categories = await getArticleCategories();

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

      {/* ── Categories ───────────────────────────────────────── */}
      <section className="px-6 py-12 pb-16">
        <div className="max-w-7xl mx-auto">
          {categories.length === 0 ? (
            <p className="text-center text-on-surface-variant py-16">
              Δεν υπάρχουν διαθέσιμες κατηγορίες αυτή τη στιγμή.
            </p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {categories.map((category, i) => (
                <Link
                  key={category.id}
                  href={`/articles/${category.slug}`}
                  className="bg-surface-container-lowest rounded-[1.75rem] p-7 editorial-shadow flex items-center justify-between gap-5 group hover:shadow-md active:scale-[0.98] transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 ${CATEGORY_BG[i % 4]}`}>
                      <span className="material-symbols-outlined text-xl">{(category as any).icon ?? "folder"}</span>
                    </div>
                    <h2 className="text-xl font-bold text-on-surface leading-snug mb-2">
                      {category.title}
                    </h2>
                    {category.subtitle && (
                      <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-2">
                        {category.subtitle}
                      </p>
                    )}
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant text-xl shrink-0 group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
