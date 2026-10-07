import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import type { App } from "@/types/app";

// Google'ın resmi rozet görselleri (public/badges/); saydam kenar boşluğu kırpıldı.
const BADGES: Record<Locale, { src: string; width: number; height: number }> = {
  tr: { src: "/badges/google-play-tr.png", width: 646, height: 192 },
  en: { src: "/badges/google-play-en.png", width: 564, height: 168 },
};

type PlayBadgeProps = {
  app: App;
  className?: string;
};

// published: mağaza rozeti. coming-soon: tıklanamayan "Yakında" durumu.
export function PlayBadge({ app, className = "" }: PlayBadgeProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("common");

  if (app.status !== "published" || !app.playUrl) {
    return (
      <span
        className={`inline-flex h-12 items-center rounded-control border-2 border-dashed border-ink-muted bg-card px-4 text-sm font-semibold text-ink-muted ${className}`}
      >
        {t("comingSoonOnPlay")}
      </span>
    );
  }

  const badge = BADGES[locale];
  return (
    <a
      href={app.playUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("playBadgeLabel", { name: app.name[locale] })}
      className={`inline-block rounded-control transition-opacity hover:opacity-85 ${className}`}
    >
      <Image
        src={badge.src}
        alt={t("playBadgeAlt")}
        width={badge.width}
        height={badge.height}
        className="h-12 w-auto"
      />
    </a>
  );
}
