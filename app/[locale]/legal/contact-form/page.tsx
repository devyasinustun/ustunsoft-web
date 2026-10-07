import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { routing } from "@/i18n/routing";
import { pageMetadata, withSiteName } from "@/lib/seo";
import { CONTACT_EMAIL, PRIVACY_PATH } from "@/lib/site";

const SECTIONS = [
  "controller",
  "data",
  "purpose",
  "basis",
  "where",
  "retention",
  "rights",
] as const;

// Metin değiştiğinde güncellenir.
const LAST_UPDATED = new Date(Date.UTC(2026, 9, 7));

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/legal/contact-form">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "legal" });

  return pageMetadata({
    locale,
    path: "/legal/contact-form/",
    title: t("metaTitle"),
    socialTitle: withSiteName(t("metaTitle")),
    description: t("metaDescription"),
  });
}

export default async function ContactFormNoticePage({
  params,
}: PageProps<"/[locale]/legal/contact-form">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("legal");
  const updated = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(
    LAST_UPDATED,
  );

  return (
    <>
      <PageHeader title={t("title")} lead={t("updated", { date: updated })} />

      <Container className="py-14 lg:py-20">
        <div className="max-w-3xl">
          {SECTIONS.map((key) => (
            <section key={key} className="border-t border-line py-8 first:border-t-0 first:pt-0">
              <h2 className="text-2xl sm:text-3xl">{t(`sections.${key}.title`)}</h2>
              <p className="mt-3 text-lg text-ink-muted wrap-anywhere">
                {t(`sections.${key}.body`, { email: CONTACT_EMAIL })}
              </p>
            </section>
          ))}

          <p className="border-t-2 border-ink pt-8 text-lg">
            {t.rich("appsNote", {
              link: (chunks) => (
                <a
                  href={PRIVACY_PATH}
                  className="font-semibold underline decoration-2 underline-offset-4"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        </div>
      </Container>
    </>
  );
}
