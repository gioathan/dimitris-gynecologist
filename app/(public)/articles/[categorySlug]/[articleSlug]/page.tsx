import { getPublishedArticles, getArticleCategoryBySlug, getArticleBySlug } from "@/lib/data/public";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 3600;

type Props = { params: Promise<{ categorySlug: string; articleSlug: string }> };

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles
    .filter((a) => (a as any).article_categories?.slug)
    .map((a) => ({
      categorySlug: (a as any).article_categories.slug,
      articleSlug: a.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { articleSlug } = await params;
  const article = await getArticleBySlug(articleSlug);
  if (!article) return {};
  return {
    title: article.seo_title ?? article.title,
    description: article.seo_description ?? article.excerpt ?? undefined,
    openGraph: {
      title: article.seo_title ?? article.title,
      description: article.seo_description ?? article.excerpt ?? undefined,
      type: "article",
      publishedTime: article.published_at ?? undefined,
      ...(article.image_url ? { images: [{ url: article.image_url }] } : {}),
    },
  };
}

function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key} className="list-disc pl-6 space-y-2 text-on-surface-variant text-base leading-relaxed">
          {listItems.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) { flushList(`list-${i}`); return; }
    if (trimmed.startsWith("## ")) {
      flushList(`list-${i}`);
      elements.push(<h2 key={i} className="text-2xl font-bold text-on-surface mt-8 mb-4">{trimmed.slice(3)}</h2>);
    } else if (trimmed.startsWith("### ")) {
      flushList(`list-${i}`);
      elements.push(<h3 key={i} className="text-xl font-bold text-on-surface mt-6 mb-3">{trimmed.slice(4)}</h3>);
    } else if (trimmed.startsWith("- ")) {
      listItems.push(trimmed.slice(2));
    } else {
      flushList(`list-${i}`);
      const withBold = trimmed.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      elements.push(
        <p key={i} className="text-on-surface-variant text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: withBold }} />
      );
    }
  });
  flushList("list-end");
  return elements;
}

export default async function ArticleDetailPage({ params }: Props) {
  const { categorySlug, articleSlug } = await params;
  const [article, category] = await Promise.all([
    getArticleBySlug(articleSlug),
    getArticleCategoryBySlug(categorySlug),
  ]);

  if (!article) notFound();

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────── */}
      {article.image_url && (
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 to-transparent" />
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────── */}
      <section className="px-6 pt-8 pb-6">
        <Link
          href={`/articles/${categorySlug}`}
          className="inline-flex items-center gap-1 text-primary text-sm font-bold mb-6"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          {category?.title ?? "Άρθρα"}
        </Link>

        {article.published_at && (
          <p className="text-secondary text-xs font-bold uppercase tracking-widest mb-3">
            {new Date(article.published_at).toLocaleDateString("el-GR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}

        <h1 className="text-3xl font-extrabold text-on-surface leading-tight tracking-tight mb-4">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-on-surface-variant text-base leading-relaxed font-medium border-l-4 border-primary pl-4">
            {article.excerpt}
          </p>
        )}
      </section>

      {/* ── Content ─────────────────────────────────────────── */}
      {article.content && (
        <section className="px-6 pb-10 space-y-4">{renderContent(article.content)}</section>
      )}

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="px-6 pb-8">
        <div className="bg-surface-container-low rounded-[2rem] p-7">
          <h3 className="text-lg font-bold text-on-surface mb-2">Έχετε ερωτήσεις;</h3>
          <p className="text-on-surface-variant text-sm mb-5 leading-relaxed">
            Αν θέλετε να συζητήσετε οτιδήποτε διαβάσατε ή να κλείσετε ένα ραντεβού, επικοινωνήστε μαζί μας.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-white rounded-full px-6 py-3 font-bold text-sm active:scale-95 transition-transform shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
            Επικοινωνήστε μαζί μας
          </Link>
        </div>
      </section>
    </>
  );
}
