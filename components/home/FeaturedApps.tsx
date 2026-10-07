import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { AppIcon } from "@/components/apps/AppIcon";
import { AppStats } from "@/components/apps/AppStats";
import { PlayBadge } from "@/components/apps/PlayBadge";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getApps, getFeaturedApps } from "@/lib/apps";
import type { App } from "@/types/app";

// Geniş kart 3, dar kart 2 ekran görüntüsü kesiti gösterir.
const LAYOUT = [
  { span: "lg:col-span-7", shots: 3 },
  { span: "lg:col-span-5", shots: 2 },
];

async function FeaturedCard({ app, shots }: { app: App; shots: number }) {
  const t = await getTranslations();
  const locale = (await getLocale()) as Locale;
  const portrait = app.screenshots.filter((shot) => shot.height > shot.width).slice(0, shots);

  return (
    <article
      className="relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-card"
      style={{ "--accent": app.accentColor } as React.CSSProperties}
    >
      <div
        aria-hidden="true"
        className="flex h-56 justify-center gap-4 overflow-hidden bg-(--accent) px-6 pt-8 sm:h-72"
      >
        {portrait.map((shot) => (
          <Image
            key={shot.src}
            src={shot.src}
            alt=""
            width={shot.width}
            height={shot.height}
            sizes="11rem"
            className="h-fit w-32 rounded-t-card border-4 border-b-0 border-ink sm:w-44"
          />
        ))}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <AppIcon app={app} size={64} />
          <div className="min-w-0">
            <Tag>{t(`common.category.${app.category}`)}</Tag>
            <h3 className="mt-1.5 text-3xl">
              <Link href={`/apps/${app.slug}/`} className="after:absolute after:inset-0">
                {app.name[locale]}
              </Link>
            </h3>
          </div>
        </div>
        <p className="mt-4 text-lg text-ink-muted">{app.shortDescription[locale]}</p>
        <AppStats app={app} className="mt-3" />
        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6">
          <PlayBadge app={app} className="relative z-10" />
          <span aria-hidden="true" className="inline-flex items-center gap-1 font-semibold">
            {t("home.featured.details")}
            <ArrowRight size={18} />
          </span>
        </div>
      </div>
    </article>
  );
}

export async function FeaturedApps() {
  const t = await getTranslations();
  const locale = (await getLocale()) as Locale;
  const featured = (await getFeaturedApps()).slice(0, LAYOUT.length);
  const upcoming = (await getApps()).filter((app) => app.status === "coming-soon");

  return (
    <section className="py-section">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-5xl sm:text-6xl">{t("home.featured.title")}</h2>
          <Link
            href="/apps/"
            className="inline-flex items-center gap-1 font-semibold underline decoration-brand decoration-2 underline-offset-8"
          >
            {t("home.featured.all")}
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>

        <ul className="mt-10 grid gap-5 lg:grid-cols-12">
          {featured.map((app, i) => (
            <li key={app.slug} className={LAYOUT[i].span}>
              <Reveal className="h-full" delay={i * 0.08}>
                <FeaturedCard app={app} shots={LAYOUT[i].shots} />
              </Reveal>
            </li>
          ))}
        </ul>

        {upcoming.length > 0 && (
          <ul className="mt-5 grid gap-5">
            {upcoming.map((app) => (
              <li
                key={app.slug}
                className="relative flex flex-wrap items-center gap-x-5 gap-y-3 rounded-card border border-line bg-card p-5 transition-colors hover:border-ink"
              >
                <AppIcon app={app} size={48} />
                <div className="min-w-0 flex-1 basis-56">
                  <p className="text-sm font-semibold text-ink-muted">
                    {t("home.featured.upcoming")}
                  </p>
                  <h3 className="text-xl leading-tight">
                    <Link
                      href={`/apps/${app.slug}/`}
                      className="after:absolute after:inset-0 after:rounded-card"
                    >
                      {app.name[locale]}
                    </Link>
                  </h3>
                </div>
                <Tag variant="ink">{t("common.comingSoon")}</Tag>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
