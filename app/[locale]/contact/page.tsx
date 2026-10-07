import { Mail, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/contact/ContactForm";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { routing } from "@/i18n/routing";
import { pageMetadata, withSiteName } from "@/lib/seo";
import { CONTACT_EMAIL } from "@/lib/site";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "contact" });

  return pageMetadata({
    locale,
    path: "/contact/",
    title: t("metaTitle"),
    socialTitle: withSiteName(t("metaTitle")),
    description: t("metaDescription"),
  });
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("contact");
  // Anahtar yoksa build kırılmaz; form yerine e-posta linki gösterilir.
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY?.trim();

  return (
    <>
      <PageHeader title={t("title")} lead={t("lead")} />

      <Container className="grid gap-x-12 gap-y-12 py-14 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-7">
          {accessKey ? (
            <ContactForm accessKey={accessKey} />
          ) : (
            <div className="rounded-card border-2 border-ink bg-card p-6 sm:p-8">
              <p className="text-lg">{t("noForm")}</p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-4 inline-block font-display text-2xl font-extrabold tracking-tight underline decoration-brand decoration-4 underline-offset-8 wrap-anywhere sm:text-3xl"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          )}
        </div>

        <aside className="lg:col-span-5">
          <dl className="border-t-2 border-ink">
            <div className="flex gap-4 border-b border-line py-6">
              <Mail aria-hidden="true" size={24} className="mt-1 shrink-0" />
              <div className="min-w-0">
                <dt className="text-sm font-semibold text-ink-muted">{t("emailTitle")}</dt>
                <dd className="mt-1 font-semibold sm:text-lg">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="underline underline-offset-4 wrap-anywhere"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex gap-4 border-b border-line py-6">
              <MapPin aria-hidden="true" size={24} className="mt-1 shrink-0" />
              <div>
                <dt className="text-sm font-semibold text-ink-muted">{t("locationTitle")}</dt>
                <dd className="mt-1 text-lg font-semibold">{t("location")}</dd>
              </div>
            </div>
          </dl>
        </aside>
      </Container>
    </>
  );
}
