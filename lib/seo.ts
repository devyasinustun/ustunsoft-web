import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";

// path: dil ön eki olmadan, baştaki ve sondaki eğik çizgiyle ("/", "/apps/").
export function localizedAlternates(locale: Locale, path: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `/${l}${path}`;
  languages["x-default"] = `/${routing.defaultLocale}${path}`;

  return { canonical: `/${locale}${path}`, languages };
}
