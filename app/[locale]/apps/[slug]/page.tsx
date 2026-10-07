import { ArrowLeft, Check, Mail } from "lucide-react";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { AppIcon } from "@/components/apps/AppIcon";
import { PlayBadge } from "@/components/apps/PlayBadge";
import { ScreenshotGallery } from "@/components/apps/ScreenshotGallery";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getAppBySlug, getApps } from "@/lib/apps";
import { formatCount, formatMonth, formatRating } from "@/lib/format";
import { mobileApplicationJsonLd, pageMetadata, withSiteName } from "@/lib/seo";
import { CONTACT_EMAIL, PRIVACY_PATH, TERMS_PATH } from "@/lib/site";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getApps()).map((app) => ({ slug: app.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/apps/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const app = await getAppBySlug(slug);
  if (!app || !hasLocale(routing.locales, locale)) return {};

  return pageMetadata({
    locale,
    path: `/apps/${app.slug}/`,
    title: app.name[locale],
    socialTitle: withSiteName(app.name[locale]),
    description: app.shortDescription[locale],
  });
}

export default async function AppDetailPage({ params }: PageProps<"/[locale]/apps/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const app = await getAppBySlug(slug);
  if (!app) notFound();

  const t = await getTranslations();
  const name = app.name[locale];
  const published = app.status === "published";

  const info: { label: string; value: string }[] = [
    { label: t("appDetail.category"), value: t(`common.category.${app.category}`) },
  ];
  if (app.stats) {
    info.push({
      label: t("appDetail.downloads"),
      value: formatCount(app.stats.downloads, locale),
    });
    if (app.stats.rating !== undefined) {
      info.push({
        label: t("appDetail.rating"),
        value: formatRating(app.stats.rating, locale),
      });
    }
  }
  if (app.ageRating) info.push({ label: t("appDetail.ageRating"), value: app.ageRating });
  if (app.updatedAt) {
    info.push({ label: t("appDetail.updated"), value: formatMonth(app.updatedAt, locale) });
  }

  return (
    <article style={{ "--accent": app.accentColor } as React.CSSProperties}>
      <JsonLd data={mobileApplicationJsonLd(app, locale)} />
      {/* accentColor beyaz metinle AA kontrastını geçecek şekilde seçilir. */}
      <header className="on-ink bg-(--accent) text-white">
        <Container className="py-10 lg:py-16">
          <Link
            href="/apps/"
            className="inline-flex items-center gap-1.5 font-semibold underline-offset-4 hover:underline"
          >
            <ArrowLeft aria-hidden="true" size={18} />
            {t("appDetail.back")}
          </Link>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
            <AppIcon app={app} size={128} className="border-4 border-white" />
            <div className="min-w-0">
              {!published && (
                <p className="mb-3 inline-block rounded-full bg-ink px-3 py-1 text-sm font-semibold">
                  {t("common.comingSoon")}
                </p>
              )}
              <h1 className="text-[clamp(2.5rem,7vw,5rem)] tracking-[-0.03em]">{name}</h1>
              <p className="mt-3 max-w-2xl text-xl font-medium">{app.shortDescription[locale]}</p>
            </div>
          </div>

          <div className="mt-8">
            <PlayBadge app={app} />
            {!published && (
              <p className="mt-3 max-w-md font-medium">{t("appDetail.comingSoonNote")}</p>
            )}
          </div>
        </Container>
      </header>

      {app.screenshots.length > 0 && (
        <section aria-labelledby="screenshots-title" className="border-b border-line py-12">
          <Container>
            <h2 id="screenshots-title" className="text-3xl sm:text-4xl">
              {t("appDetail.screenshots")}
            </h2>
            <div className="mt-6">
              <ScreenshotGallery name={name} screenshots={app.screenshots} />
            </div>
          </Container>
        </section>
      )}

      <Container className="grid gap-x-12 gap-y-14 py-14 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-7">
          <section aria-labelledby="features-title">
            <h2 id="features-title" className="text-3xl sm:text-4xl">
              {t("appDetail.features")}
            </h2>
            <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
              {app.features[locale].map((feature) => (
                <li key={feature} className="flex gap-3 border-t border-line py-4 text-lg">
                  <Check
                    aria-hidden="true"
                    size={22}
                    strokeWidth={3}
                    className="mt-1 shrink-0 text-(--accent)"
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="about-title" className="mt-14">
            <h2 id="about-title" className="text-3xl sm:text-4xl">
              {t("appDetail.about")}
            </h2>
            <div className="mt-6 max-w-2xl space-y-4 text-lg text-ink-muted">
              {app.description[locale].split(/\n{2,}/).map((paragraph) => (
                <p key={paragraph} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-5 lg:col-span-5">
          <section
            aria-labelledby="info-title"
            className="rounded-card border border-line bg-card p-6 sm:p-8"
          >
            <h2 id="info-title" className="text-2xl">
              {t("appDetail.info")}
            </h2>
            <dl className="mt-4">
              {info.map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between gap-4 border-t border-line py-3"
                >
                  <dt className="text-ink-muted">{item.label}</dt>
                  <dd className="text-right font-semibold">{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section
            aria-labelledby="support-title"
            className="rounded-card border border-line bg-card p-6 sm:p-8"
          >
            <h2 id="support-title" className="text-2xl">
              {t("appDetail.support")}
            </h2>
            <p className="mt-3 text-ink-muted">{t("appDetail.supportBody")}</p>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(name)}`}
              className="mt-4 inline-flex items-center gap-2 font-semibold underline decoration-2 underline-offset-4 wrap-anywhere"
            >
              <Mail aria-hidden="true" size={18} className="shrink-0" />
              {CONTACT_EMAIL}
            </a>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-5 font-semibold">
              <li>
                <a href={PRIVACY_PATH} className="underline underline-offset-4">
                  {t("appDetail.privacy")}
                </a>
              </li>
              <li>
                <a href={TERMS_PATH} className="underline underline-offset-4">
                  {t("appDetail.terms")}
                </a>
              </li>
            </ul>
          </section>
        </aside>
      </Container>
    </article>
  );
}
