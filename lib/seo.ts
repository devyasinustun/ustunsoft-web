import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";
import type { App } from "@/types/app";

const OG_LOCALE: Record<Locale, string> = { tr: "tr_TR", en: "en_US" };
const OG_IMAGE = { url: "/og.png", width: 1200, height: 630, alt: SITE_NAME };

export const SITE_ICONS: Metadata["icons"] = {
  icon: [
    { url: "/favicon.ico", sizes: "48x48" },
    { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
  ],
  apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
};

// path: dil ön eki olmadan, baştaki ve sondaki eğik çizgiyle ("/", "/apps/").
export function localizedAlternates(locale: Locale, path: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `/${l}${path}`;
  languages["x-default"] = `/${routing.defaultLocale}${path}`;

  return { canonical: `/${locale}${path}`, languages };
}

type PageMetadataInput = {
  locale: Locale;
  path: string;
  // Sekme başlığı; layout'taki şablon sonuna site adını ekler. Verilmezse layout'un varsayılanı kullanılır.
  title?: string;
  // Paylaşım kartlarında görünen tam başlık.
  socialTitle: string;
  description: string;
};

// Her sayfanın title, description, canonical, hreflang, Open Graph ve Twitter etiketleri.
export function pageMetadata({
  locale,
  path,
  title,
  socialTitle,
  description,
}: PageMetadataInput): Metadata {
  return {
    ...(title ? { title } : {}),
    description,
    alternates: localizedAlternates(locale, path),
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      url: `/${locale}${path}`,
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

export const withSiteName = (title: string) => `${title} · ${SITE_NAME}`;

export function organizationJsonLd(locale: Locale, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: `${SITE_URL}/${locale}/`,
    logo: `${SITE_URL}/icon-512.png`,
    description,
    email: CONTACT_EMAIL,
    founder: { "@type": "Person", name: "Yasin Üstün" },
    address: { "@type": "PostalAddress", addressLocality: "İstanbul", addressCountry: "TR" },
  };
}

export function mobileApplicationJsonLd(app: App, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: app.name[locale],
    description: app.shortDescription[locale],
    url: `${SITE_URL}/${locale}/apps/${app.slug}/`,
    operatingSystem: "ANDROID",
    applicationCategory: app.category === "game" ? "GameApplication" : "UtilitiesApplication",
    inLanguage: locale,
    ...(app.icon ? { image: `${SITE_URL}${app.icon}` } : {}),
    ...(app.playUrl ? { installUrl: app.playUrl, downloadUrl: app.playUrl } : {}),
    ...(app.screenshots.length > 0
      ? { screenshot: app.screenshots.map((shot) => `${SITE_URL}${shot.src}`) }
      : {}),
    ...(app.stats?.rating !== undefined
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: app.stats.rating,
            bestRating: 5,
            worstRating: 1,
            ...(app.stats.ratingCount ? { ratingCount: app.stats.ratingCount } : {}),
          },
        }
      : {}),
    offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}
