import type { Metadata } from "next";
import Image from "next/image";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { routing } from "@/i18n/routing";
import { getApps } from "@/lib/apps";
import { localizedAlternates } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  return { alternates: localizedAlternates(locale, "/") };
}

// Geçici ana sayfa: asıl bölümler Aşama 4'te gelecek.
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations();
  const apps = await getApps();

  return (
    <Container className="py-section">
      <h1 className="max-w-4xl text-5xl sm:text-7xl">{t("home.placeholderTitle")}</h1>
      <p className="mt-6 max-w-xl text-lg text-ink-muted">{t("home.placeholderBody")}</p>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {apps.map((app) => (
          <li
            key={app.slug}
            className="flex items-center gap-4 rounded-card border border-line bg-card p-4"
          >
            {app.icon ? (
              <Image
                src={app.icon}
                alt=""
                width={64}
                height={64}
                className="size-16 shrink-0 rounded-card"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex size-16 shrink-0 items-center justify-center rounded-card font-display text-2xl font-extrabold text-white"
                style={{ backgroundColor: app.accentColor }}
              >
                {app.name[locale].charAt(0)}
              </span>
            )}
            <div className="min-w-0">
              <h2 className="text-xl">{app.name[locale]}</h2>
              <p className="mt-1 text-sm text-ink-muted">
                {app.status === "coming-soon"
                  ? t("common.comingSoon")
                  : app.shortDescription[locale]}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  );
}
