import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { AppExplorer } from "@/components/apps/AppExplorer";
import { Container } from "@/components/ui/Container";
import { routing } from "@/i18n/routing";
import { getApps } from "@/lib/apps";
import { pageMetadata, withSiteName } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/apps">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "apps" });

  return pageMetadata({
    locale,
    path: "/apps/",
    title: t("metaTitle"),
    socialTitle: withSiteName(t("metaTitle")),
    description: t("metaDescription"),
  });
}

export default async function AppsPage({ params }: PageProps<"/[locale]/apps">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("apps");
  const apps = await getApps();

  return (
    <Container className="py-14 lg:py-20">
      <h1 className="text-[clamp(3rem,9vw,6rem)] tracking-[-0.035em]">{t("title")}</h1>
      <p className="mt-4 max-w-xl text-lg text-ink-muted sm:text-xl">{t("intro")}</p>
      <div className="mt-10">
        <AppExplorer apps={apps} />
      </div>
    </Container>
  );
}
