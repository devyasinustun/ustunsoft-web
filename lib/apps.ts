import appsData from "@/content/apps.json";
import { appsSchema, type App } from "@/types/app";

// Uygulama verisine tek erişim noktası. İleride bu fonksiyonların içi
// ASP.NET Core Web API'ye fetch'e dönecek; imzalar aynı kalmalı.

let cache: App[] | undefined;

// Önce indirmesi çok olan; eşitse Google Play'e daha önce çıkan. Yayın tarihi
// olmayan (coming-soon) kendi basamağının sonuna düşer.
function compareApps(a: App, b: App): number {
  const byDownloads = (b.stats?.downloads ?? 0) - (a.stats?.downloads ?? 0);
  if (byDownloads !== 0) return byDownloads;
  return (a.releasedAt ?? "9999").localeCompare(b.releasedAt ?? "9999");
}

function load(): App[] {
  if (!cache) {
    const apps = appsSchema.parse(appsData);
    const slugs = new Set(apps.map((app) => app.slug));
    if (slugs.size !== apps.length) throw new Error("content/apps.json: tekrar eden slug var");
    cache = apps.sort(compareApps);
  }
  return cache;
}

export async function getApps(): Promise<App[]> {
  return load();
}

export async function getAppBySlug(slug: string): Promise<App | undefined> {
  return load().find((app) => app.slug === slug);
}

export async function getFeaturedApps(): Promise<App[]> {
  return load().filter((app) => app.featured);
}
