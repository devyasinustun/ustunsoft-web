import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/i18n/routing";
import { formatCount, formatRating } from "@/lib/format";
import { getStudioStats } from "@/lib/stats";

// Rakamların hepsi lib/stats.ts üzerinden content/apps.json'dan hesaplanır.
export async function StatsStrip() {
  const t = await getTranslations("home.stats");
  const locale = (await getLocale()) as Locale;
  const stats = await getStudioStats();

  const items = [
    { value: formatCount(stats.totalDownloads, locale), label: t("downloads") },
    { value: String(stats.publishedCount), label: t("published") },
  ];
  if (stats.rating) {
    items.push({
      value: formatRating(stats.rating.value, locale),
      label: stats.rating.ratedApp
        ? t("ratingSingle", { name: stats.rating.ratedApp.name[locale] })
        : t("ratingAverage"),
    });
  }

  return (
    <section aria-labelledby="stats-title" className="on-ink bg-ink text-paper">
      <Container className="py-section">
        <h2 id="stats-title" className="sr-only">
          {t("title")}
        </h2>
        <dl className="grid gap-x-8 gap-y-12 sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.label} className="flex flex-col border-t-4 border-brand pt-5">
              <dt className="order-2 mt-3 max-w-56 text-ink-soft">{item.label}</dt>
              <dd className="font-display text-[clamp(3.25rem,7vw,5.5rem)] font-extrabold leading-none tracking-[-0.04em]">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
