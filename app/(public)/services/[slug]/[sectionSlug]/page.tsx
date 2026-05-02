import { getAllServices, getServiceBySlug, getServiceSectionBySlug } from "@/lib/data/public";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string; sectionSlug: string }> };

export async function generateStaticParams() {
  const services = await getAllServices();
  const params: { slug: string; sectionSlug: string }[] = [];
  await Promise.all(
    services.map(async (s) => {
      const service = await getServiceBySlug(s.slug);
      for (const section of service?.service_sections ?? []) {
        if (section.slug) params.push({ slug: s.slug, sectionSlug: section.slug });
      }
    })
  );
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, sectionSlug } = await params;
  const section = await getServiceSectionBySlug(slug, sectionSlug);
  if (!section) return {};
  return {
    title: section.title,
    description: section.subtitle ?? undefined,
    openGraph: { title: section.title, description: section.subtitle ?? undefined },
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

export default async function SectionDetailPage({ params }: Props) {
  const { slug, sectionSlug } = await params;
  const section = await getServiceSectionBySlug(slug, sectionSlug);

  if (!section) notFound();

  return (
    <>
      {/* ── Header ──────────────────────────────────────────── */}
      <section className="bg-surface-container-low px-6 pt-8 pb-10">
        <Link
          href={`/services/${slug}`}
          className="inline-flex items-center gap-1 text-primary text-sm font-bold mb-6"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          {section.service.title}
        </Link>
        <h1 className="text-3xl font-extrabold text-on-surface leading-tight tracking-tight mb-3">
          {section.title}
        </h1>
        <div className="w-12 h-1 bg-primary rounded-full mb-5" />
        {section.subtitle && (
          <p className="text-on-surface-variant text-base leading-relaxed font-medium border-l-4 border-primary pl-4 max-w-lg">
            {section.subtitle}
          </p>
        )}
      </section>

      {/* ── Content ─────────────────────────────────────────── */}
      {section.content && (
        <section className="px-6 py-10 space-y-4 max-w-3xl">
          {renderContent(section.content)}
        </section>
      )}

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="px-6 pb-8">
        <div className="bg-gradient-to-br from-primary to-primary-container rounded-[2rem] p-8 text-white">
          <h3 className="text-xl font-bold mb-2">Θέλετε να μάθετε περισσότερα;</h3>
          <p className="text-white/80 text-sm mb-6 leading-relaxed">
            Κλείστε ένα ραντεβού και συζητήστε με τον ιατρό για την κατάλληλη προσέγγιση για εσάς.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-primary rounded-full px-6 py-3 font-bold text-sm active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            Κλείστε Ραντεβού
          </Link>
        </div>
      </section>
    </>
  );
}
