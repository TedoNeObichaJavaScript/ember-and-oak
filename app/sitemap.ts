import type { MetadataRoute } from "next";
import { SITE as base } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/#menu`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/#story`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/#reserve`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];
}
