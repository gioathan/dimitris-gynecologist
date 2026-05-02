import { getAllServices, getServiceBySlug } from "@/lib/data/public";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const services = await getAllServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.seo_title ?? service.title,
    description: service.seo_description ?? service.excerpt ?? undefined,
    openGraph: {
      title: service.seo_title ?? service.title,
      description: service.seo_description ?? service.excerpt ?? undefined,
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) notFound();

  const sections: { id: string; title: string; subtitle: string | null; slug: string | null; content: string | null; display_order: number }[] =
    service.service_sections ?? [];

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="bg-surface-container-low px-6 pt-8 pb-12">
        <Link
          href="/services"
          className="inline-flex items-center gap-1 text-primary text-sm font-bold mb-6"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Υπηρεσίες
        </Link>
        <h1 className="text-3xl font-extrabold text-on-surface leading-tight tracking-tight mb-3">
          {service.title}
        </h1>
        <div className="w-12 h-1 bg-primary rounded-full mb-5" />
        {service.excerpt && (
          <p className="text-on-surface-variant text-base leading-relaxed max-w-lg">
            {service.excerpt}
          </p>
        )}
      </section>

      {/* ── Description ─────────────────────────────────────── */}
      {service.description && (
        <section className="px-6 py-10">
          <p className="text-on-surface leading-relaxed text-base">{service.description}</p>
        </section>
      )}

      {/* ── Sections ────────────────────────────────────────── */}
      {sections.length > 0 && (
        <section className="px-6 pb-10 space-y-4">
          {sections.map((section) =>
            section.slug ? (
              <Link
                key={section.id}
                href={`/services/${slug}/${section.slug}`}
                className="bg-surface-container-lowest rounded-[1.75rem] p-7 editorial-shadow flex items-center justify-between gap-4 group hover:shadow-md active:scale-[0.98] transition-all block"
              >
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-on-surface leading-snug mb-1 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary inline-block shrink-0" />
                    {section.title}
                  </h2>
                  {section.subtitle && (
                    <p className="text-on-surface-variant text-sm leading-relaxed pl-5">
                      {section.subtitle}
                    </p>
                  )}
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-lg shrink-0 group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
            ) : (
              <div
                key={section.id}
                className="bg-surface-container-lowest rounded-[1.75rem] p-7 editorial-shadow"
              >
                <h2 className="text-lg font-bold text-on-surface leading-snug mb-1 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary inline-block shrink-0" />
                  {section.title}
                </h2>
                {section.subtitle && (
                  <p className="text-on-surface-variant text-sm leading-relaxed pl-5">
                    {section.subtitle}
                  </p>
                )}
              </div>
            )
          )}
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
