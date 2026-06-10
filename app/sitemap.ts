import type { MetadataRoute } from "next";

const siteUrl = "https://example.com"; // [PLACEHOLDER] set your deployed URL

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
