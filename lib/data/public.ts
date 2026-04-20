import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";

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

export const getPublishedArticles = unstable_cache(
  async () => {
    const { data } = await createPublicClient()
      .from("articles")
      .select("id, title, slug, excerpt, image_url, published_at")
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
      .select("id, title, slug, excerpt, image_url, published_at")
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
      .select("*")
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
