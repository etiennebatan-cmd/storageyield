import type { MetadataRoute } from "next";
import { marketingPaths, siteConfig } from "@/lib/marketing/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...marketingPaths.map((path) => ({
      url: `${siteConfig.url}${path}`,
      lastModified: now,
      changeFrequency: path === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : 0.8
    })),
    {
      url: `${siteConfig.url}/demo`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4
    }
  ];
}
