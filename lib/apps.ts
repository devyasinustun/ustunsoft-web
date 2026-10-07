import appsData from "@/content/apps.json";
import { appsSchema, type App } from "@/types/app";

// Uygulama verisine tek erişim noktası. İleride bu fonksiyonların içi
// ASP.NET Core Web API'ye fetch'e dönecek; imzalar aynı kalmalı.

let cache: App[] | undefined;

function load(): App[] {
  if (!cache) {
    const apps = appsSchema.parse(appsData);
    const slugs = new Set(apps.map((app) => app.slug));
    if (slugs.size !== apps.length) throw new Error("content/apps.json: tekrar eden slug var");
    cache = apps.sort((a, b) => a.order - b.order);
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
