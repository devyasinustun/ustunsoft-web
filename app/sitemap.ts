import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getApps } from "@/lib/apps";
import { PRIVACY_PATH, SITE_URL, TERMS_PATH } from "@/lib/site";

export const dynamic = "force-static";

const STATIC_PATHS = ["/", "/apps/", "/about/", "/contact/", "/support/", "/legal/contact-form/"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appPaths = (await getApps()).map((app) => `/apps/${app.slug}/`);

  const pages = [...STATIC_PATHS, ...appPaths].flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`])),
      },
    })),
  );

  // Dil ön eki olmayan statik belgeler.
  const docs = [PRIVACY_PATH, TERMS_PATH].map((path) => ({ url: `${SITE_URL}${path}` }));

  return [...pages, ...docs];
}
