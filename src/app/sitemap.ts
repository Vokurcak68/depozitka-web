import type { MetadataRoute } from "next";

const siteUrl = "https://depozitka.eu";

const routes = [
  "",
  "/jak-to-funguje",
  "/pro-provozovatele",
  "/cenik",
  "/bezpecnost",
  "/faq",
  "/kontakt",
  "/obchodni-podminky",
  "/ochrana-udaju",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
