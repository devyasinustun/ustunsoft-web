import { ArrowLeft, Mail } from "lucide-react";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { AppIcon } from "@/components/apps/AppIcon";
import { buttonClassName } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Tag } from "@/components/ui/Tag";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getAppBySlug, getApps } from "@/lib/apps";
import { DATA_DELETION_SEGMENT, dataDeletionPaths } from "@/lib/paths";
import { pageMetadata, withSiteName } from "@/lib/seo";
import { CONTACT_EMAIL, PRIVACY_PATH, SITE_NAME } from "@/lib/site";

// Google Play'in "Hesap silme" alanına girilen adres: /tr/apps/<slug>/veri-silme/,
// /en/apps/<slug>/data-deletion/. Yalnız dataDeletion'ı olan uygulamalar için üretilir.
export const dynamicParams = false;

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  if (!hasLocale(routing.locales, params.locale)) return [];
  const segment = DATA_DELETION_SEGMENT[params.locale];
  return (await getApps())
    .filter((app) => app.dataDeletion)
    .map((app) => ({ slug: app.slug, deletion: segment }));
}

async function load(locale: string, slug: string, deletion: string) {
  if (!hasLocale(routing.locales, locale)) return undefined;
  if (deletion !== DATA_DELETION_SEGMENT[locale]) return undefined;
  const app = await getAppBySlug(slug);
  if (!app?.dataDeletion) return undefined;
  return { locale, app, content: app.dataDeletion };
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/apps/[slug]/[deletion]">): Promise<Metadata> {
  const { locale, slug, deletion } = await params;
  const page = await load(locale, slug, deletion);
  if (!page) return {};
  const title = `${page.app.name[page.locale]} — ${page.content.title[page.locale]}`;

  return pageMetadata({
    locale: page.locale,
    path: dataDeletionPaths(page.app.slug),
    title,
    socialTitle: withSiteName(title),
    description: page.content.metaDescription[page.locale],
  });
}

export default async function DataDeletionPage({
  params,
}: PageProps<"/[locale]/apps/[slug]/[deletion]">) {
  const { locale: rawLocale, slug, deletion } = await params;
  const page = await load(rawLocale, slug, deletion);
  if (!page) notFound();
  const { locale, app, content } = page;
  setRequestLocale(locale);

  const t = await getTranslations("dataDeletion");
  const name = app.name[locale];
  const subject = content.emailSubject[locale];
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;

  const facts = [
    { label: t("app"), value: name, note: `Google Play · ${app.packageName}` },
    { label: t("developer"), value: SITE_NAME },
  ];

  return (
    <article style={{ "--accent": app.accentColor } as React.CSSProperties}>
      {/* accentColor beyaz metinle AA kontrastını geçecek şekilde seçilir. */}
      <header className="on-ink bg-(--accent) text-white">
        <Container className="py-10 lg:py-14">
          <Link
            href={`/apps/${app.slug}/`}
            className="inline-flex items-center gap-1.5 font-semibold underline-offset-4 hover:underline"
          >
            <ArrowLeft aria-hidden="true" size={18} />
            {name}
          </Link>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
            <AppIcon app={app} size={96} className="border-4 border-white" />
            <div className="min-w-0">
              <p className="text-lg font-semibold">{t("eyebrow")}</p>
              <h1 className="mt-1 text-[clamp(2.25rem,6vw,4.5rem)] tracking-[-0.03em]">
                {content.title[locale]}
              </h1>
            </div>
          </div>

          <p className="mt-6 max-w-3xl text-lg font-medium sm:text-xl">{content.intro[locale]}</p>

          <dl className="mt-8 grid max-w-3xl gap-x-10 gap-y-4 border-t border-white/40 pt-6 sm:grid-cols-2">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-sm font-semibold">{fact.label}</dt>
                <dd className="mt-1 text-lg font-semibold">
                  {fact.value}
                  {fact.note && <span className="block text-base font-medium">{fact.note}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </header>

      <Container className="grid gap-x-12 gap-y-14 py-14 lg:grid-cols-12 lg:py-20">
        <div className="space-y-14 lg:col-span-7">
          <section aria-labelledby="in-app-title">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <h2 id="in-app-title" className="text-3xl sm:text-4xl">
                {t("inAppTitle", { category: app.category })}
              </h2>
              <Tag variant="ink">{t("easiest")}</Tag>
            </div>
            <ol className="mt-6">
              {content.inAppSteps[locale].map((step, index) => (
                <li key={step} className="flex gap-5 border-t border-line py-4 text-lg">
                  <span
                    aria-hidden="true"
                    className="w-7 shrink-0 font-display text-3xl leading-none font-extrabold text-(--accent)"
                  >
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <p className="mt-4 max-w-2xl border-t border-line pt-4 text-lg text-ink-muted">
              {content.inAppNote[locale]}
            </p>
          </section>

          <section aria-labelledby="email-title">
            <h2 id="email-title" className="text-3xl sm:text-4xl">
              {t("emailTitle")}
            </h2>
            <div className="mt-6 max-w-2xl space-y-4 text-lg">
              <p>
                {t.rich("emailBody", {
                  subject,
                  email: CONTACT_EMAIL,
                  mail: (chunks) => (
                    <a
                      href={mailto}
                      className="font-semibold underline decoration-2 underline-offset-4 wrap-anywhere"
                    >
                      {chunks}
                    </a>
                  ),
                })}
              </p>
              <p className="text-ink-muted">{content.emailDetails[locale]}</p>
              <p>
                {t.rich("emailDeadline", {
                  days: content.emailDeadlineDays,
                  b: (chunks) => <strong className="font-semibold">{chunks}</strong>,
                })}
              </p>
            </div>
            <a href={mailto} className={buttonClassName("ink", "mt-6")}>
              <Mail aria-hidden="true" size={18} />
              {t("emailCta")}
            </a>
          </section>
        </div>

        <aside className="space-y-5 lg:col-span-5">
          <section
            aria-labelledby="deleted-title"
            className="rounded-card border border-line bg-card p-6 sm:p-8"
          >
            <h2 id="deleted-title" className="text-2xl">
              {t("deletedTitle")}
            </h2>
            <ul className="mt-4">
              {content.deleted[locale].map((item) => (
                <li key={item} className="border-t border-line py-3">
                  {item}
                </li>
              ))}
            </ul>
            <p className="border-t border-line pt-3 font-semibold">{content.deletedNote[locale]}</p>
          </section>

          <section
            aria-labelledby="kept-title"
            className="rounded-card border border-line bg-card p-6 sm:p-8"
          >
            <h2 id="kept-title" className="text-2xl">
              {t("keptTitle")}
            </h2>
            <ul className="mt-4">
              {content.kept[locale].map((item) => (
                <li key={item} className="border-t border-line py-3">
                  {item}
                </li>
              ))}
            </ul>
            <p className="border-t border-line pt-3 font-semibold">{content.keptNote[locale]}</p>
          </section>

          <p className="px-1 text-ink-muted">
            {t.rich("privacyNote", {
              link: (chunks) => (
                <a
                  href={PRIVACY_PATH}
                  className="font-semibold text-ink underline underline-offset-4"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        </aside>
      </Container>
    </article>
  );
}
