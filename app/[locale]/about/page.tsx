import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AppIcon } from "@/components/apps/AppIcon";
import { buttonClassName } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tag } from "@/components/ui/Tag";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getApps } from "@/lib/apps";
import { pageMetadata, withSiteName } from "@/lib/seo";
import { FOUNDER } from "@/lib/site";

const VALUES = ["focus", "privacy", "feedback"] as const;
const TECH = ["flutter", "unity", "dotnet"] as const;
const FACTS = ["experience", "focus", "education"] as const;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "about" });

  return pageMetadata({
    locale,
    path: "/about/",
    title: t("metaTitle"),
    socialTitle: withSiteName(t("metaTitle")),
    description: t("metaDescription"),
  });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations();
  const apps = await getApps();

  return (
    <>
      <PageHeader title={t("about.title")} lead={t("about.lead")} />

      <Container className="grid gap-x-12 gap-y-10 py-section lg:grid-cols-12">
        <h2 className="text-4xl sm:text-5xl lg:col-span-4">{t("about.story.title")}</h2>
        <div className="lg:col-span-8">
          <div className="max-w-2xl space-y-5 text-lg sm:text-xl">
            <p>{t("about.story.p1")}</p>
            <p>{t("about.story.p2")}</p>
          </div>
          <ul className="mt-10 border-t-2 border-ink">
            {apps.map((app) => (
              <li
                key={app.slug}
                className="relative flex items-center gap-4 border-b border-line py-4 hover:bg-card"
              >
                <AppIcon app={app} size={48} />
                <Link
                  href={`/apps/${app.slug}/`}
                  className="min-w-0 flex-1 font-display text-xl font-extrabold tracking-tight after:absolute after:inset-0"
                >
                  {app.name[locale]}
                </Link>
                <Tag variant={app.status === "published" ? "neutral" : "ink"}>
                  {app.status === "published"
                    ? t("about.story.published")
                    : t("about.story.upcoming")}
                </Tag>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <section className="on-ink bg-ink text-paper">
        <Container className="py-section">
          <h2 className="font-sans text-base font-semibold tracking-normal text-ink-soft">
            {t("about.mission.title")}
          </h2>
          <p className="mt-4 max-w-5xl font-display text-[clamp(2rem,5.5vw,4.25rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
            {t("about.mission.body")}
          </p>
        </Container>
      </section>

      <Container className="grid gap-x-12 gap-y-10 py-section lg:grid-cols-12">
        <h2 className="text-4xl sm:text-5xl lg:col-span-4">{t("about.values.title")}</h2>
        <ol className="lg:col-span-8">
          {VALUES.map((key, i) => (
            <li
              key={key}
              className="grid gap-x-8 gap-y-2 border-t-2 border-ink py-8 last:border-b-2 sm:grid-cols-[5rem_1fr]"
            >
              <span
                aria-hidden="true"
                className="font-display text-5xl font-extrabold leading-none tracking-tight"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-2xl sm:text-3xl">{t(`about.values.items.${key}.title`)}</h3>
                <p className="mt-3 max-w-xl text-lg text-ink-muted">
                  {t(`about.values.items.${key}.body`)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>

      <section className="border-y border-line bg-card">
        <Container className="grid gap-x-12 gap-y-10 py-section lg:grid-cols-12">
          <h2 className="text-4xl sm:text-5xl lg:col-span-4">{t("about.tech.title")}</h2>
          <dl className="grid gap-5 sm:grid-cols-3 lg:col-span-8">
            {TECH.map((key) => (
              <div key={key} className="rounded-card border-2 border-ink p-6">
                <dt className="font-display text-3xl font-extrabold tracking-tight">
                  {t(`about.tech.items.${key}.name`)}
                </dt>
                <dd className="mt-2 text-ink-muted">{t(`about.tech.items.${key}.body`)}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <Container className="grid gap-x-12 gap-y-10 py-section lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 className="text-4xl sm:text-5xl">{t("about.founder.title")}</h2>
          <Image
            src={FOUNDER.photo}
            alt={t("about.founder.photoAlt")}
            width={480}
            height={480}
            className="mt-8 aspect-square w-40 rounded-card border-2 border-ink object-cover sm:w-56 lg:w-full lg:max-w-xs"
          />
        </div>
        <div className="lg:col-span-8">
          <h3 className="text-3xl sm:text-4xl">{FOUNDER.name}</h3>
          <p className="mt-2 text-lg text-ink-muted">{t("about.founder.role")}</p>
          <div className="mt-6 max-w-2xl space-y-5 text-lg sm:text-xl">
            <p>{t("about.founder.p1")}</p>
            <p>{t("about.founder.p2")}</p>
          </div>
          <dl className="mt-10 grid border-t-2 border-ink sm:grid-cols-3">
            {FACTS.map((key) => (
              <div key={key} className="border-b border-line py-5 sm:pr-6">
                <dt className="text-sm font-semibold text-ink-muted">
                  {t(`about.founder.facts.${key}.label`)}
                </dt>
                <dd className="mt-2">
                  <span className="block font-display text-2xl font-extrabold leading-tight tracking-tight">
                    {t(`about.founder.facts.${key}.value`)}
                  </span>
                  <span className="mt-1 block text-ink-muted">
                    {t(`about.founder.facts.${key}.detail`)}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
          <ul className="mt-8 flex flex-wrap gap-3">
            {(
              [
                { key: "site", href: FOUNDER.site[locale] },
                { key: "linkedin", href: FOUNDER.linkedin },
              ] as const
            ).map(({ key, href }) => (
              <li key={key}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClassName("outline")}
                >
                  {t(`about.founder.links.${key}`)}
                  <ArrowUpRight aria-hidden="true" size={18} />
                  <span className="sr-only">{t("about.founder.links.newTab")}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </>
  );
}
