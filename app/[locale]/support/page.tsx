import { Plus } from "lucide-react";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { AppIcon } from "@/components/apps/AppIcon";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tag } from "@/components/ui/Tag";
import { routing } from "@/i18n/routing";
import { getApps } from "@/lib/apps";
import { getFaq } from "@/lib/faq";
import { pageMetadata, withSiteName } from "@/lib/seo";
import { CONTACT_EMAIL } from "@/lib/site";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/support">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "support" });

  return pageMetadata({
    locale,
    path: "/support/",
    title: t("metaTitle"),
    socialTitle: withSiteName(t("metaTitle")),
    description: t("metaDescription"),
  });
}

export default async function SupportPage({ params }: PageProps<"/[locale]/support">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations();
  const faq = await getFaq();
  const apps = await getApps();
  // Sıra apps.json'daki sırayı izler; SSS'i olmayan uygulama listelenmez.
  const groups = apps.flatMap((app) => {
    const group = faq.find((entry) => entry.slug === app.slug);
    return group ? [{ app, items: group.items }] : [];
  });

  return (
    <>
      <PageHeader title={t("support.title")} lead={t("support.lead")} />

      <Container className="py-14 lg:py-20">
        {groups.map(({ app, items }) => (
          <section
            key={app.slug}
            aria-labelledby={`faq-${app.slug}`}
            className="grid gap-x-12 gap-y-6 border-t-2 border-ink py-10 lg:grid-cols-12"
          >
            <div className="flex items-start gap-4 lg:col-span-4">
              <AppIcon app={app} size={56} />
              <div className="min-w-0">
                <h2 id={`faq-${app.slug}`} className="text-2xl leading-tight sm:text-3xl">
                  {app.name[locale]}
                </h2>
                {app.status === "coming-soon" && (
                  <p className="mt-2">
                    <Tag variant="ink">{t("common.comingSoon")}</Tag>
                  </p>
                )}
              </div>
            </div>

            {/* Yerel <details>: klavyeyle açılır, JS gerektirmez. */}
            <div className="lg:col-span-8">
              {items.map((item) => (
                <details key={item.q[locale]} className="group border-b border-line">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-5 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                    {item.q[locale]}
                    <Plus
                      aria-hidden="true"
                      size={22}
                      className="mt-0.5 shrink-0 transition-transform group-open:rotate-45"
                    />
                  </summary>
                  <p className="max-w-2xl pb-6 text-lg text-ink-muted">{item.a[locale]}</p>
                </details>
              ))}
            </div>
          </section>
        ))}

        <section
          aria-labelledby="support-contact"
          className="mt-6 rounded-card bg-ink p-8 text-paper on-ink sm:p-12"
        >
          <h2 id="support-contact" className="text-4xl sm:text-5xl">
            {t("support.contactTitle")}
          </h2>
          <p className="mt-4 max-w-xl text-lg text-ink-soft">{t("support.contactBody")}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <ButtonLink href="/contact/">{t("support.contactCta")}</ButtonLink>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-semibold underline decoration-2 underline-offset-4 wrap-anywhere"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </section>
      </Container>
    </>
  );
}
