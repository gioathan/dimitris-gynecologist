import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { createAdminClient } from "@/lib/supabase/admin";

const TTL = 3600;

export const getHomepageContent = unstable_cache(
  async () => {
    const { data } = await createPublicClient()
      .from("homepage_content")
      .select("*")
      .limit(1)
      .single();
    return data;
  },
  ["homepage-content"],
  { revalidate: TTL, tags: ["homepage"] }
);

export const getDoctorProfile = unstable_cache(
  async () => {
    const { data } = await createPublicClient()
      .from("doctor")
      .select("*")
      .limit(1)
      .single();
    return data;
  },
  ["doctor-profile"],
  { revalidate: TTL, tags: ["doctor"] }
);

export const getAllServices = unstable_cache(
  async () => {
    const { data } = await createPublicClient()
      .from("services")
      .select("*")
      .eq("is_published", true)
      .order("display_order");
    return data ?? [];
  },
  ["all-services"],
  { revalidate: TTL, tags: ["services"] }
);

export const getServiceBySlug = unstable_cache(
  async (slug: string) => {
    const { data } = await createPublicClient()
      .from("services")
      .select("*, service_sections(*)")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();
    if (data?.service_sections) {
      data.service_sections.sort(
        (a: { display_order: number }, b: { display_order: number }) =>
          a.display_order - b.display_order
      );
    }
    return data;
  },
  ["service-by-slug"],
  { revalidate: TTL, tags: ["services"] }
);

export const getServiceSectionBySlug = unstable_cache(
  async (serviceSlug: string, sectionSlug: string) => {
    const { data: service } = await createPublicClient()
      .from("services")
      .select("id, title, slug")
      .eq("slug", serviceSlug)
      .eq("is_published", true)
      .single();
    if (!service) return null;

    const { data: section } = await createAdminClient()
      .from("service_sections")
      .select("*")
      .eq("service_id", service.id)
      .eq("slug", sectionSlug)
      .single();

    return section ? { ...section, service } : null;
  },
  ["service-section-by-slug"],
  { revalidate: TTL, tags: ["services"] }
);

export const getArticleCategories = unstable_cache(
  async () => {
    const { data } = await createAdminClient()
      .from("article_categories")
      .select("*")
      .order("title");
    return data ?? [];
  },
  ["article-categories"],
  { revalidate: TTL, tags: ["articles"] }
);

export const getArticleCategoryBySlug = unstable_cache(
  async (slug: string) => {
    const { data } = await createAdminClient()
      .from("article_categories")
      .select("*")
      .eq("slug", slug)
      .single();
    return data;
  },
  ["article-category-by-slug"],
  { revalidate: TTL, tags: ["articles"] }
);

export const getArticlesByCategory = unstable_cache(
  async (categorySlug: string) => {
    const { data: category } = await createAdminClient()
      .from("article_categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();
    if (!category) return [];

    const { data } = await createPublicClient()
      .from("articles")
      .select("id, title, slug, excerpt, image_url, published_at, article_categories(id, title, slug)")
      .eq("is_published", true)
      .eq("category_id", category.id)
      .order("published_at", { ascending: false });
    return data ?? [];
  },
  ["articles-by-category"],
  { revalidate: TTL, tags: ["articles"] }
);

export const getPublishedArticles = unstable_cache(
  async () => {
    const { data } = await createPublicClient()
      .from("articles")
      .select("id, title, slug, excerpt, image_url, published_at, article_categories(id, title, slug)")
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    return data ?? [];
  },
  ["published-articles"],
  { revalidate: TTL, tags: ["articles"] }
);

export const getLatestArticles = unstable_cache(
  async () => {
    const { data } = await createPublicClient()
      .from("articles")
      .select("id, title, slug, excerpt, image_url, published_at, article_categories(id, title, slug)")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(4);
    return data ?? [];
  },
  ["latest-articles"],
  { revalidate: TTL, tags: ["articles"] }
);

export const getArticleBySlug = unstable_cache(
  async (slug: string) => {
    const { data } = await createPublicClient()
      .from("articles")
      .select("*, article_categories(id, title, slug)")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();
    return data;
  },
  ["article-by-slug"],
  { revalidate: TTL, tags: ["articles"] }
);

export const getSiteSettings = unstable_cache(
  async () => {
    const { data } = await createPublicClient().from("site_settings").select("*");
    const settings: Record<string, string> = {};
    data?.forEach((row) => {
      settings[row.key] = row.value ?? "";
    });
    return settings;
  },
  ["site-settings"],
  { revalidate: TTL, tags: ["site_settings"] }
);

export const getFacilities = unstable_cache(
  async () => {
    const { data } = await createPublicClient()
      .from("facilities")
      .select("*")
      .order("display_order");
    return data ?? [];
  },
  ["facilities"],
  { revalidate: TTL, tags: ["facilities"] }
);

export const getClinicImages = unstable_cache(
  async () => {
    const { data } = await createPublicClient()
      .from("clinic_images")
      .select("*")
      .order("display_order");
    return data ?? [];
  },
  ["clinic-images"],
  { revalidate: TTL, tags: ["clinic_images"] }
);
