import { Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { formatCount, formatRating } from "@/lib/format";
import type { App } from "@/types/app";

// Puan ve indirme sayısı; yalnızca apps.json'da varsa görünür.
export function AppStats({ app, className = "" }: { app: App; className?: string }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("common");
  if (!app.stats) return null;

  const { downloads, rating } = app.stats;
  return (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold ${className}`}>
      {rating !== undefined && (
        <span className="inline-flex items-center gap-1">
          <Star aria-hidden="true" size={15} fill="currentColor" strokeWidth={0} />
          <span aria-hidden="true">{formatRating(rating, locale)}</span>
          <span className="sr-only">
            {t("ratingLabel", { rating: formatRating(rating, locale) })}
          </span>
        </span>
      )}
      <span>{t("downloads", { count: formatCount(downloads, locale) })}</span>
    </p>
  );
}
