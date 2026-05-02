import { getAllServices, getArticleCategories, getSiteSettings } from "@/lib/data/public";
import Header from "./Header";

export default async function HeaderServer() {
  const [services, categories, settings] = await Promise.all([
    getAllServices(),
    getArticleCategories(),
    getSiteSettings(),
  ]);

  const navItems = [
    { href: "/", label: "Αρχική" },
    { href: "/doctor", label: "Ιατρός" },
    { href: "/clinic", label: "Ιατρείο" },
    {
      href: "/services",
      label: "Υπηρεσίες",
      children: services.map((s) => ({ href: `/services/${s.slug}`, label: s.title })),
    },
    {
      href: "/articles",
      label: "Άρθρα",
      children: categories.map((c) => ({ href: `/articles/${c.slug}`, label: c.title })),
    },
  ];

  return (
    <Header
      navItems={navItems}
      instagram={settings.instagram || null}
    />
  );
}
