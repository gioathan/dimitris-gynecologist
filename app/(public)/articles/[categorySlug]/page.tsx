import { getArticleCategories, getArticleCategoryBySlug, getArticlesByCategory } from "@/lib/data/public";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 3600;

type Props = { params: Promise<{ categorySlug: string }> };

export async function generateStaticParams() {
  const categories = await getArticleCategories();
  return categories.map((c) => ({ categorySlug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = await getArticleCategoryBySlug(categorySlug);
  if (!category) return {};
  return {
    title: category.title,
    description: category.subtitle ?? undefined,
    openGraph: { title: category.title, description: category.subtitle ?? undefined },
  };
}

export default async function CategoryArticlesPage({ params }: Props) {
  const { categorySlug } = await params;
  const category = await getArticleCategoryBySlug(categorySlug);
  if (!category) notFound();

  const articles = await getArticlesByCategory(categorySlug);
  const [featured, ...rest] = articles;

  return (
    <>
      {/* ── Header ──────────────────────────────────────────── */}
      <section className="px-6 pt-10 pb-12 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/articles"
            className="inline-flex items-center gap-1 text-primary text-sm font-bold mb-6"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Άρθρα & Νέα
          </Link>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-on-surface leading-tight tracking-tight mb-3">
            {category.title}
          </h1>
          <div className="w-12 h-1 bg-secondary rounded-full" />
          {category.subtitle && (
            <p className="text-on-surface-variant text-base leading-relaxed mt-5 max-w-xl">
              {category.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* ── Articles ─────────────────────────────────────────── */}
      <section className="px-6 py-12 pb-16">
        <div className="max-w-7xl mx-auto">
          {articles.length === 0 ? (
            <p className="text-center text-on-surface-variant py-16">
              Δεν υπάρχουν άρθρα σε αυτή την κατηγορία.
            </p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {featured && (
                <Link
                  href={`/articles/${categorySlug}/${featured.slug}`}
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

              {rest.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${categorySlug}/${article.slug}`}
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
