import { useLocale, useTranslations } from "next-intl";
import { Tag } from "@/components/ui/Tag";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { App } from "@/types/app";
import { AppIcon } from "./AppIcon";
import { AppStats } from "./AppStats";
import { PlayBadge } from "./PlayBadge";

export function AppCard({ app }: { app: App }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("common");

  return (
    <article
      className="relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-card transition-colors hover:border-ink"
      style={{ "--accent": app.accentColor } as React.CSSProperties}
    >
      <div aria-hidden="true" className="h-2 bg-(--accent)" />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start gap-4">
          <AppIcon app={app} size={72} />
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2">
              <Tag>{t(`category.${app.category}`)}</Tag>
              {app.status === "coming-soon" && <Tag variant="ink">{t("comingSoon")}</Tag>}
            </div>
            <h3 className="mt-2 text-2xl leading-tight">
              {/* Kartın tamamı tıklanır; rozet linki z-index ile üstte kalır. */}
              <Link
                href={`/apps/${app.slug}/`}
                className="after:absolute after:inset-0 after:rounded-card"
              >
                {app.name[locale]}
              </Link>
            </h3>
          </div>
        </div>

        <p className="mt-4 text-ink-muted">{app.shortDescription[locale]}</p>
        <AppStats app={app} className="mt-4" />

        <div className="mt-auto pt-6">
          <PlayBadge app={app} className="relative z-10" />
        </div>
      </div>
    </article>
  );
}
