import type { MetadataRoute } from "next";
import { projects, siteUrl } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projects.map((p) => ({
      url: `${siteUrl}/case/${p.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
