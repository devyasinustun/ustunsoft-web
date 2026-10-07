import { getApps } from "@/lib/apps";
import type { App } from "@/types/app";

export type StudioStats = {
  // Google Play'in basamağına aşağı yuvarlanmış toplam (10.500 → 10.000).
  totalDownloads: number;
  publishedCount: number;
  // Puanı olan uygulamaların ortalaması. Tek uygulama varsa `ratedApp` doludur
  // ve rakam "ortalama" diye değil o uygulamanın puanı olarak gösterilir.
  rating?: { value: number; ratedApp?: App };
};

// Google Play indirme basamakları: 1, 5, 10, 50, 100, 500, 1.000, 5.000, …
function floorToPlayBucket(value: number): number {
  let bucket = 0;
  for (let power = 1; power <= value; power *= 10) {
    bucket = power * 5 <= value ? power * 5 : power;
  }
  return bucket;
}

export async function getStudioStats(): Promise<StudioStats> {
  const published = (await getApps()).filter((app) => app.status === "published");
  const downloads = published.reduce((sum, app) => sum + (app.stats?.downloads ?? 0), 0);
  const rated = published.filter((app) => app.stats?.rating !== undefined);

  return {
    totalDownloads: floorToPlayBucket(downloads),
    publishedCount: published.length,
    rating:
      rated.length === 0
        ? undefined
        : {
            value: rated.reduce((sum, app) => sum + (app.stats?.rating ?? 0), 0) / rated.length,
            ratedApp: rated.length === 1 ? rated[0] : undefined,
          },
  };
}
