import type { MetadataRoute } from "next";
import {
  getAllServices,
  getServiceBySlug,
  getArticleCategories,
  getPublishedArticles,
} from "@/lib/data/public";

const BASE_URL = (process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000").replace(/\/$/, "");

export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }, { id: 2 }];
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  if (id === 1) return servicesSitemap();
  if (id === 2) return articlesSitemap();
  return mainSitemap();
}

function mainSitemap(): MetadataRoute.Sitemap {
  const staticPaths: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/doctor", priority: 0.8 },
    { path: "/clinic", priority: 0.8 },
    { path: "/services", priority: 0.8 },
    { path: "/articles", priority: 0.7 },
    { path: "/contact", priority: 0.7 },
  ];

  return staticPaths.map(({ path, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority,
  }));
}

async function servicesSitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await getAllServices();
  const detailed = await Promise.all(services.map((s: { slug: string }) => getServiceBySlug(s.slug)));

  const entries: MetadataRoute.Sitemap = [];
  for (const service of detailed) {
    if (!service) continue;
    entries.push({
      url: `${BASE_URL}/services/${service.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
    for (const section of service.service_sections ?? []) {
      if (!section.slug) continue;
      entries.push({
        url: `${BASE_URL}/services/${service.slug}/${section.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }
  return entries;
}

async function articlesSitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, articles] = await Promise.all([getArticleCategories(), getPublishedArticles()]);

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category: { slug: string }) => ({
    url: `${BASE_URL}/articles/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const articleEntries: MetadataRoute.Sitemap = (articles as any[])
    .filter((article) => article.article_categories?.slug)
    .map((article) => ({
      url: `${BASE_URL}/articles/${article.article_categories.slug}/${article.slug}`,
      lastModified: article.published_at ? new Date(article.published_at) : new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    }));

  return [...categoryEntries, ...articleEntries];
}
